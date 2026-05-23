const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');
require('dotenv').config();

const callAI = async (prompt) => {
  const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FEATHERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.3-70B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
};

router.post('/standup', auth, async (req, res) => {
  const { project_id } = req.body;
  try {
    const tasks = await pool.query(
      `SELECT t.title, t.status, t.priority, u.name as assignee
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.project_id = $1`,
      [project_id]
    );
    const taskList = tasks.rows.map(t =>
      `${t.title} (${t.status}, ${t.priority}, assigned to ${t.assignee || 'unassigned'})`
    ).join('\n');
    const prompt = `Generate a professional daily standup report based on these tasks:\n${taskList}\n\nFormat it with sections: Done, In Progress, Blockers. Keep it concise and professional.`;
    const report = await callAI(prompt);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

router.post('/summarize', auth, async (req, res) => {
  const { project_id } = req.body;
  try {
    const tasks = await pool.query(
      `SELECT title, status, priority FROM tasks WHERE project_id = $1`,
      [project_id]
    );
    const taskList = tasks.rows.map(t => `${t.title}: ${t.status} (${t.priority})`).join('\n');
    const prompt = `Summarize the progress of this project based on these tasks:\n${taskList}\n\nProvide a brief summary of overall progress, what is going well, and what needs attention.`;
    const summary = await callAI(prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

router.post('/blockers', auth, async (req, res) => {
  const { project_id } = req.body;
  try {
    const tasks = await pool.query(
      `SELECT title, status, updated_at FROM tasks
       WHERE project_id = $1 AND status = 'in_progress'
       ORDER BY updated_at ASC`,
      [project_id]
    );
    const taskList = tasks.rows.map(t =>
      `${t.title} (in progress since ${new Date(t.updated_at).toLocaleDateString()})`
    ).join('\n');
    const prompt = `Identify potential blockers from these in-progress tasks:\n${taskList || 'No tasks in progress'}\n\nHighlight which tasks might be stuck and suggest actions.`;
    const blockers = await callAI(prompt);
    res.json({ blockers });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

router.post('/breakdown', auth, async (req, res) => {
  const { feature, project_id } = req.body;
  try {
    const prompt = `Break down this feature into specific development tasks: "${feature}"\n\nReturn ONLY a JSON array of task objects with fields: title (string), priority (P0/P1/P2), status (always "todo"). Return only valid JSON, no markdown, no explanation.`;
    const text = await callAI(prompt);
    const clean = text.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`\n?/g, '').trim();
    const tasks = JSON.parse(clean);
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

router.post('/review-code', auth, async (req, res) => {
  const { code, language } = req.body;
  try {
    const prompt = `Review this ${language} code and provide feedback:\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn ONLY a JSON object with: score (1-10), verdict (string), bugs (array of strings), performance (array of strings), good_practices (array of strings). Return only valid JSON, no markdown, no explanation.`;
    const text = await callAI(prompt);
    const clean = text.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`\n?/g, '').trim();
    const review = JSON.parse(clean);
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

module.exports = router;
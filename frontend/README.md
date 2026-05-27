# Kōdo — Real-Time Collaborative Workspace for Developer Teams

> The developer's way.

**Live Demo:** https://kodo-devcollab.vercel.app

**GitHub:** https://github.com/kamaleswari-s/kodo


## What is Kōdo?

Kōdo is a GitHub-meets-Notion-meets-Slack platform built for student developer teams. Manage projects, track tasks, write documentation, review code, and get AI assistance — all in one place, in real time.

Built for DevFusion Hackathon 2.0 — Problem Statement 6: DevCollab.

### Workspace and Projects
- Create or join a workspace with a unique invite code
- Multiple projects per workspace
- Role system — Owner, Admin, Member, Viewer
- Invite teammates via link or WhatsApp share

### Task Management
- Kanban board with drag and drop — To Do, In Progress, In Review, Done
- List view — sortable table with inline status changes
- Calendar view — tasks on a date grid, click any date to add a task
- Task comments with @mentions — mentioned user gets a real-time notification
- File attachments per task
- Priority levels — Critical, Important, Low
- Assignee, due date, and labels per task

### Real-Time Collaboration
- Live board updates via Socket.IO — no refresh needed
- Presence indicators — see who is online right now
- Live typing indicators — see when a teammate is typing a comment
- Real-time notifications for mentions and task assignments

### Code Snippet Manager
- Save reusable code with full syntax highlighting
- Supports JavaScript, Python, Java, C++, Go, TypeScript, SQL, Bash
- Search by title, tag, or language
- Copy to clipboard with one click

### Documentation Wiki
- Markdown-based wiki pages per project
- Image uploads
- Page linking with [[Page Name]] syntax
- Version history — restore any previous version

### Aura AI Assistant
- Powered by Mistral 7B via Featherless AI
- Daily standup report generator
- Project blocker identifier
- Project progress summariser
- Feature breakdown — describe a feature, get subtasks automatically
- AI code reviewer — quality score out of 10, bugs, performance, security
- GitHub PR review guidance
- Real-time chat with your AI dev mentor

### Activity Feed
- Real-time feed of all workspace actions
- Filter by project or by member

### User System
- Profile with bio, skills, GitHub link, and profile picture
- Notification centre with unread badge count
- Three themes — Warm Parchment, Midnight Navy, Carbon Ink

### Novelties
- Live typing indicators in task comments
- Team velocity chart — tasks completed per day over 7 days
- Focus mode — distraction-free full screen with one click
- WhatsApp invite sharing

### Payments
- Free plan — 1 workspace, 3 projects, 5 members
- Pro plan — unlimited everything, sandbox checkout

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Socket.IO client |
| Backend | Node.js, Express.js, Socket.IO |
| Database | PostgreSQL |
| AI | Mistral 7B via Featherless AI |
| Auth | JWT + bcryptjs |
| File uploads | Multer |
| Real-time | Socket.IO WebSockets |
| Deployment | Vercel (frontend) + Railway (backend) |


## Database Schema

- users
- workspaces
- workspace_members
- projects
- tasks
- task_comments
- task_attachments
- snippets
- wiki_pages
- wiki_history
- activity_log
- notifications

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL 14+

### Backend
```bash
cd backend
npm install
node setup.js
node addNotifications.js
node addAttachments.js
node addWikiHistory.js
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kodo_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
PORT=5000
FEATHERLESS_API_KEY=your_key

## Default Login
- Email: admin@kodo.dev
- Password: password

## Open Source Libraries
- express, socket.io, pg, bcryptjs, jsonwebtoken, multer, cors, dotenv
- react, react-router-dom, axios, socket.io-client, react-hot-toast
- react-syntax-highlighter

## Project Write-up

Kōdo is a real-time collaborative workspace built for student developer teams competing in hackathons and working on college projects. Instead of juggling between Trello, Notion, GitHub, and ChatGPT, Kōdo brings everything into one platform — a live Kanban board, code snippet library, documentation wiki with page linking and version history, and an AI assistant called Aura powered by Mistral 7B. Aura generates standups, reviews code with a quality score out of 10, identifies blockers, and breaks down features into subtasks. Built with React, Node.js, PostgreSQL, and Socket.IO, every change appears instantly for all teammates. Novelties include live typing indicators, a team velocity chart, focus mode, and WhatsApp invite sharing. Kōdo is the workspace developer teams never want to close.

## Team
- Code Queens — Full stack development, UI/UX design, AI integration
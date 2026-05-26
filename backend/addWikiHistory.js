const pool = require('./db');

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wiki_history (
        id SERIAL PRIMARY KEY,
        page_id INTEGER REFERENCES wiki_pages(id) ON DELETE CASCADE,
        title VARCHAR(255),
        content TEXT,
        updated_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Wiki history table created');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

run();
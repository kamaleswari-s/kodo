# Kōdo — Real-Time Collaborative Workspace for Developer Teams

> The developer's way.

**Live Demo:** https://kodo-devcollab.vercel.app

**GitHub:** https://github.com/kamaleswari-s/kodo


## What is Kōdo?

Kōdo is a GitHub-meets-Notion-meets-Slack platform built for student developer teams. Manage projects, track tasks, write documentation, review code, and get AI assistance — all in one place, in real time.

Built for DevFusion Hackathon 2.0 — Problem Statement 6: DevCollab.

## Features

### Workspace and Projects
- Create or join a workspace with a unique invite code
- Multiple projects per workspace
- Role system — Owner, Admin, Member, Viewer
- Invite teammates via link or WhatsApp share

### Task Management
- Kanban board with drag and drop
- List view and Calendar view
- Task comments with @mentions
- File attachments per task
- Priority, assignee, due date, and labels

### Real-Time Collaboration
- Live board updates via Socket.IO
- Presence indicators
- Live typing indicators in comments
- Real-time notifications

### Code Snippet Manager
- Syntax highlighted code display
- Supports JS, Python, Java, C++, Go, TypeScript, SQL, Bash
- Search by title, tag, or language
- Copy to clipboard

### Documentation Wiki
- Markdown support
- Image uploads
- Page linking with [[Page Name]] syntax
- Version history with restore

### Aura AI Assistant
- Powered by Mistral 7B via Featherless AI
- Standup report generator
- Blocker identifier
- Project summariser
- Feature breakdown into subtasks
- Code reviewer with score out of 10
- GitHub PR review

### Activity Feed
- Real-time workspace activity
- Filter by project or member

### User System
- Profile with bio, skills, GitHub link, avatar
- Notification centre
- Three themes — Warm Parchment, Midnight Navy, Carbon Ink

### Novelties
- Live typing indicators in task comments
- Team velocity chart — tasks completed per day over 7 days
- Focus mode — distraction-free full screen with one click
- WhatsApp invite sharing

### Payments
- Free and Pro plans with sandbox checkout

## Tech Stack

- **Frontend** — React.js, React Router, Socket.IO client
- **Backend** — Node.js, Express.js, Socket.IO
- **Database** — PostgreSQL
- **AI** — Mistral 7B via Featherless AI
- **Auth** — JWT + bcryptjs
- **File uploads** — Multer
- **Deployment** — Vercel + Railway

## Database Tables

users, workspaces, workspace_members, projects, tasks, task_comments, task_attachments, snippets, wiki_pages, wiki_history, activity_log, notifications

## Local Setup

**Backend**

cd backend
npm install
node setup.js
node addNotifications.js
node addAttachments.js
node addWikiHistory.js
node index.js

**Frontend**

cd frontend
npm install
npm start

**Environment Variables**

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
- react, react-router-dom, axios, socket.io-client, react-hot-toast, react-syntax-highlighter

## Project Write-up

Kōdo is a real-time collaborative workspace built for student developer teams. Instead of juggling between Trello, Notion, GitHub, and ChatGPT, Kōdo brings everything into one platform — a live Kanban board, code snippet library, documentation wiki with page linking and version history, and an AI assistant called Aura powered by Mistral 7B. Aura generates standups, reviews code with a quality score out of 10, identifies blockers, and breaks down features into subtasks. Built with React, Node.js, PostgreSQL, and Socket.IO. Novelties include live typing indicators, team velocity chart, focus mode, and WhatsApp invite sharing.


## Team

Code Queens — Full stack development, UI/UX design, AI integration

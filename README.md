# FRANKLY

An anonymous feedback platform where users can receive honest, anonymous messages through a personal shareable link — built with Next.js and MongoDB.

## Features

- User authentication (sign up / login)
- Unique public profile link for each user (`/u/username`)
- Anyone can send anonymous messages without logging in
- Dashboard to view, manage, and delete received messages
- Toggle to accept/stop accepting new messages
- AI-powered message suggestions for senders

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** MongoDB with Mongoose
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **AI:** OpenAI API for message suggestions

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd true-feedback
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

```
src/
├── app/            # App router pages and API routes
├── components/     # Reusable UI components
├── models/         # Mongoose schemas
├── lib/            # Database connection, helpers
├── schemas/        # Zod validation schemas
└── types/          # TypeScript types
```


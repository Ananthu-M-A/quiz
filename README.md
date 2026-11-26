# Quiz Master — Real-Time Multiplayer Quiz

A live quiz app for events and classrooms. The host uploads questions, players join from their phones with a short code, and everyone answers the same question at the same time, with scores and winners updated live.

**Tech:** Next.js 16 · React 19 · TypeScript · Socket.IO · Tailwind CSS

## Features

- **Host dashboard** (`/admin`): create a quiz from a JSON file, see who joined, move through questions, show correct answers
- **Join with a code** (`/join`): players enter a name and the quiz code from any device
- **Timed questions** (`/quiz/[code]`): 30-second countdown, four options, auto-submit when time runs out
- **Live results** (`/results/[code]`): scores and winner ranking pushed to everyone in real time
- **Socket.IO rooms**: each quiz runs in its own room on a custom Next.js server (`server.ts`)

## Getting started

```bash
npm install
cp .env.example .env.local   # set ALLOWED_ORIGIN for production
npm run dev                  # http://localhost:3000
```

Open `/admin` on the host screen, upload [`SAMPLE_QUIZ.json`](SAMPLE_QUIZ.json), and join from another device at `/join`.

### Question format

```json
[
  {
    "id": "q1",
    "question": "Which planet is known as the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
    "correctAnswer": 1
  }
]
```

`correctAnswer` is the zero-based index of the right option.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the custom server with Socket.IO in development |
| `npm run build` | Build the Next.js app |
| `npm start` | Run the production server |

## Notes

- Quiz state is kept in memory (`lib/quizStore.ts`), so restarting the server clears active quizzes. Run a single instance.
- More detail: [QUIZ_GUIDE.md](QUIZ_GUIDE.md) · [DEPLOYMENT.md](DEPLOYMENT.md) · [QUICK_DEMO.md](QUICK_DEMO.md)

## Author

**Ananthu M A** · [ananthuma.com](https://ananthuma.com) · me@ananthuma.com

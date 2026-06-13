# 🎯 Quiz Master - Real-Time Quiz Application

A modern, real-time quiz application built with **Next.js**, **React**, **Socket.io**, and **Tailwind CSS**. Perfect for graduation ceremonies, office events, and educational settings where multiple participants can join a live quiz and compete for top positions.

## ✨ Features

### 🎤 Host/Admin Features
- **Create Quiz Sessions**: Upload questions in JSON format
- **Live Question Display**: Show questions on the main screen with timer
- **Real-Time Participant Tracking**: See who has joined the quiz
- **Question Navigation**: Move to the next question at your pace
- **Automatic Score Calculation**: Scores are calculated based on correct answers and speed
- **Live Results**: Display top 3 winners on the big screen after quiz completion

### 👥 Participant Features
- **Easy Join**: Enter name and quiz code to join a session
- **Live Question Display**: See questions from your personal device
- **Answer Selection**: Choose from 4 options with intuitive interface
- **Timer Countdown**: Visual timer shows remaining time for each question (30 seconds)
- **Real-Time Feedback**: Know when you've submitted your answer
- **Result Leaderboard**: View final rankings and scores

## 🚀 Getting Started

### Prerequisites
- Node.js (v24.16.0 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📖 How to Use

### Step 1: Create a Quiz (Host)

1. Go to **Admin Panel** (`http://localhost:3000/admin`)
2. Prepare your questions in JSON format (see [Sample Quiz Format](#sample-quiz-format) below)
3. Paste the JSON into the text area
4. Click **"Create Quiz"**
5. Share the generated **Quiz Code** with participants

### Step 2: Participants Join

1. Go to **Join Quiz** (`http://localhost:3000/join`)
2. Enter your name
3. Enter the quiz code (provided by the host)
4. Click **"Join Quiz"**
5. Wait for the host to start the quiz

### Step 3: Start the Quiz (Host)

1. Once all participants have joined, click **"Start Quiz"**
2. The first question will appear on the main screen with a 30-second timer
3. Participants will see the question on their devices

### Step 4: Answer Questions (Participants)

1. Each question has 4 options (A, B, C, D)
2. Select your answer by clicking on an option
3. Click **"Submit Answer"** to confirm
4. After submitting, you'll see the next question timer count down

### Step 5: Move to Next Question (Host)

1. After participants have answered, click **"Next Question"**
2. The next question appears for all participants
3. The answer key is visible on the host screen only
4. Repeat until all questions are answered

### Step 6: View Results

1. After the last question, click **"Finish Quiz"**
2. The system automatically calculates scores based on:
   - **Correct Answers**: +1 point per correct answer
   - **Speed**: Faster answers are prioritized for ranking
3. Top 3 winners are displayed on the screen with medals 🥇🥈🥉
4. The **Results Page** shows all winners with their scores and times

## 📋 Sample Quiz Format

Questions must be provided in JSON format with the following structure:

```json
[
  {
    "id": "q1",
    "question": "What is the capital of India?",
    "options": ["Mumbai", "Delhi", "Bangalore", "Chennai"],
    "correctAnswer": 1
  },
  {
    "id": "q2",
    "question": "Which planet is known as the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
    "correctAnswer": 1
  }
]
```

### Field Descriptions:
- **id**: Unique identifier for the question (string)
- **question**: The question text (string)
- **options**: Array of 4 answer options (array of strings)
- **correctAnswer**: Index of the correct answer (0-3)
  - 0 = First option (A)
  - 1 = Second option (B)
  - 2 = Third option (C)
  - 3 = Fourth option (D)

### Example:
A sample quiz with 8 questions is provided in `SAMPLE_QUIZ.json`. You can use this as a template!

## 🎨 UI/UX Highlights

### Color Scheme
- **Admin Panel**: Purple/Pink gradient
- **Join Page**: Purple/Pink gradient
- **Quiz Page**: Blue/Indigo gradient
- **Results Page**: Yellow/Orange gradient (for celebration!)

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Optimized for large screens (projectors) and personal devices
- Touch-friendly buttons for mobile participants

### Real-Time Updates
- Socket.io ensures instant communication between host and participants
- Live participant list updates
- Automatic timer synchronization
- Instant score calculations

## 🏗️ Architecture

```
Quiz Master App
│
├── Server (server.ts)
│   ├── Socket.io Connection Handler
│   ├── Quiz Session Manager
│   ├── Answer Submission Handler
│   ├── Score Calculator
│   └── Winner Ranking System
│
├── Pages
│   ├── / (Home) - Navigation
│   ├── /admin - Host Dashboard
│   ├── /join - Participant Join
│   ├── /quiz/[code] - Quiz Taker
│   └── /results/[code] - Results Display
│
├── Libraries
│   ├── lib/quizStore.ts - Quiz data storage
│   ├── lib/types.ts - TypeScript interfaces
│   └── lib/socket.ts - Socket.io client configuration
│
└── Styling
    └── Tailwind CSS + custom animations
```

## 🔌 Socket.io Events

### Client → Server
- `create-session`: Create a new quiz
- `join-session`: Join a quiz with code and name
- `start-quiz`: Start the quiz
- `submit-answer`: Submit an answer
- `next-question`: Move to the next question
- `get-participants`: Get list of participants

### Server → Client
- `session-created`: Quiz created with code
- `joined-session`: Confirmation of joining
- `participants-updated`: List of participants updated
- `quiz-started`: Quiz has started
- `question-updated`: New question displayed
- `quiz-completed`: Quiz finished, show results
- `error-message`: Error occurred

## 🎯 Scoring System

1. **Correct Answer**: +1 point
2. **Speed Factor**: If two participants have the same score, the one with lower total time wins
3. **Automatic Ranking**: Top 3 are automatically identified and displayed with medals

## 📱 Access Points

- **Home Page**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`
- **Join Quiz**: `http://localhost:3000/join`
- **Quiz Page**: `http://localhost:3000/quiz/[CODE]` (auto-redirected after join)
- **Results Page**: `http://localhost:3000/results/[CODE]` (auto-displayed after quiz ends)

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4 with Next.js 16.2.9
- **Backend**: Node.js with Socket.io 4.8.3
- **Styling**: Tailwind CSS 4
- **Real-time Communication**: Socket.io
- **Unique IDs**: nanoid 5.1.11
- **Type Safety**: TypeScript 5

## 📝 License

This project is part of a graduation ceremony quiz system. Feel free to modify and use as needed!

## 🎓 Use Cases

- 🎓 **Graduation Ceremonies**: Interactive quiz with real-time results
- 📚 **Educational Events**: Class-wide competitions
- 🏢 **Corporate Events**: Team-building quizzes
- 🎯 **Training Sessions**: Knowledge assessment
- 🎉 **Party Games**: Fun trivia with friends

## 🐛 Troubleshooting

### Server won't start
- Ensure Node.js is installed: `node --version`
- Check if port 3000 is available
- Run `npm install` to install dependencies

### Can't connect to quiz
- Verify the quiz code is correct
- Check that host machine and participant devices are on the same network
- Ensure the dev server is running

### Timer issues
- Timer is synchronized server-side - it's normal to see slight variations on slow networks
- Each participant's answer submission time is recorded accurately

### Scores not updating
- Refresh the admin page to see latest scores
- Scores update automatically when next question is shown

## 🚀 Future Enhancements

- Question categories and difficulty levels
- Multiple quiz types (multiple choice, true/false, short answer)
- Question images/media support
- Leaderboard history
- Question bank management
- Answer analysis and reporting
- Mobile app version
- Cloud deployment

---

**Enjoy your Quiz Master experience! 🎉**

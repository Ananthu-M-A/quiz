"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Question, Participant } from "@/lib/types";

export default function AdminPage() {
    const [jsonText, setJsonText] = useState("");
    const [quizCode, setQuizCode] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [winners, setWinners] = useState<Participant[]>([]);

    useEffect(() => {
        socket.connect();

        socket.on("session-created", (code: string) => {
            setQuizCode(code);
            socket.emit("get-participants", code);
        });

        socket.on("participants-updated", (data: Participant[]) => {
            setParticipants(data);
        });

        socket.on(
            "quiz-started",
            (data: { question: Question; questionIndex: number }) => {
                setCurrentQuestion(data.question);
                setCurrentQuestionIndex(data.questionIndex);
                setQuizStarted(true);
                setQuizCompleted(false);
            }
        );

        socket.on(
            "question-updated",
            (data: { question: Question; questionIndex: number }) => {
                setCurrentQuestion(data.question);
                setCurrentQuestionIndex(data.questionIndex);
            }
        );

        socket.on("quiz-completed", (data: { winners: Participant[] }) => {
            setQuizStarted(false);
            setQuizCompleted(true);
            setWinners(data.winners);
        });

        return () => {
            socket.off("session-created");
            socket.off("participants-updated");
            socket.off("quiz-started");
            socket.off("question-updated");
            socket.off("quiz-completed");
        };
    }, []);

    const createQuiz = () => {
        try {
            const questions: Question[] = JSON.parse(jsonText);
            if (!Array.isArray(questions) || questions.length === 0) {
                alert("Please provide a valid array of questions");
                return;
            }
            
            // Validate each question
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length === 0) {
                    alert(`Question ${i + 1} is missing required fields (id, question, options)`);
                    return;
                }
                if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
                    alert(`Question ${i + 1} has invalid correctAnswer index`);
                    return;
                }
            }
            
            setTotalQuestions(questions.length);
            socket.emit("create-session", questions);
        } catch {
            alert("Invalid JSON. Please check the format.");
        }
    };

    const startQuiz = () => {
        if (quizCode) {
            socket.emit("start-quiz", quizCode);
        }
    };

    const nextQuestion = () => {
        socket.emit("next-question", quizCode);
    };

    if (quizCompleted) {
        return (
            <main className="p-10 bg-linear-to-br from-purple-50 to-pink-100 min-h-screen">
                <h1 className="text-4xl font-bold mb-8">Quiz Completed!</h1>
                <div className="grid gap-6">
                    {winners.map((winner, index) => {
                        const medals = ["🥇", "🥈", "🥉"];
                        return (
                            <div
                                key={winner.id}
                                className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{medals[index]}</span>
                                        <div>
                                            <h3 className="text-xl font-bold">#{index + 1}</h3>
                                            <p className="text-lg text-gray-700">{winner.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-blue-600">{winner.score}</p>
                                        <p className="text-sm text-gray-600">Correct Answers</p>
                                        <p className="text-sm text-gray-600">Time: {winner.totalTime}s</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
                >
                    Start New Quiz
                </button>
            </main>
        );
    }

    if (quizStarted && currentQuestion) {
        return (
            <main className="p-10 bg-linear-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Quiz Running</h1>
                        <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                            <p className="text-sm text-gray-600">Code</p>
                            <p className="text-3xl font-bold text-blue-600">{quizCode}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-600 text-sm">Total Participants</p>
                            <p className="text-4xl font-bold text-blue-600">{participants.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-600 text-sm">Current Question</p>
                            <p className="text-4xl font-bold text-green-600">
                                {currentQuestionIndex + 1} / {totalQuestions}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-600 text-sm">Status</p>
                            <p className="text-4xl font-bold text-purple-600">Running</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => (
                                <div
                                    key={index}
                                    className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50"
                                >
                                    <p className="font-bold text-gray-700 mb-2">
                                        {String.fromCharCode(65 + index)}.
                                    </p>
                                    <p className="text-gray-800">{option}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                            <p className="text-sm text-gray-700 font-semibold">Correct Answer:</p>
                            <p className="text-xl font-bold text-green-700">
                                {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{" "}
                                {currentQuestion.options[currentQuestion.correctAnswer]}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={nextQuestion}
                            className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-blue-700 text-lg"
                        >
                            {currentQuestionIndex === totalQuestions - 1
                                ? "Finish Quiz"
                                : "Next Question"}
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-2xl font-bold mb-4">
                            Participants ({participants.length})
                        </h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {participants.map((p) => (
                                <div
                                    key={p.id}
                                    className="p-3 bg-gray-100 rounded-lg flex justify-between items-center"
                                >
                                    <span className="font-semibold text-gray-800">{p.name}</span>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                        Score: {p.score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (quizCode) {
        return (
            <main className="p-10 bg-linear-to-br from-green-50 to-blue-100 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Admin Panel - Ready to Start</h1>

                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Quiz Code</h2>
                            <div className="bg-blue-100 border-2 border-blue-600 p-6 rounded-lg">
                                <p className="text-5xl font-bold text-blue-600 text-center">{quizCode}</p>
                            </div>
                            <p className="text-center text-gray-600 mt-3 text-lg">
                                Share this code with participants to join the quiz
                            </p>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
                            <p className="text-blue-900 font-semibold">
                                Questions: {totalQuestions}
                            </p>
                        </div>

                        <button
                            onClick={startQuiz}
                            disabled={participants.length === 0}
                            className={`w-full px-6 py-4 rounded-lg font-bold text-white text-lg transition-all ${
                                participants.length > 0
                                    ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {participants.length === 0
                                ? "Waiting for participants..."
                                : `Start Quiz (${participants.length} participants)`}
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-2xl font-bold mb-4">
                            Participants ({participants.length})
                        </h3>
                        {participants.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">
                                Waiting for participants to join...
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {participants.map((p) => (
                                    <li
                                        key={p.id}
                                        className="p-3 bg-green-100 rounded-lg text-gray-800 font-semibold flex items-center"
                                    >
                                        <span className="text-green-600 mr-2">✓</span>
                                        {p.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-10 bg-linear-to-br from-purple-50 to-pink-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Create a Quiz</h2>
                    <p className="text-gray-600 mb-4">
                        Paste your quiz questions in JSON format:
                    </p>

                    <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm text-gray-700 overflow-x-auto">
                        <pre>{`[
  {
    "id": "q1",
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": 1
  },
  {
    "id": "q2",
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": 2
  }
]`}</pre>
                    </div>

                    <textarea
                        className="border-2 border-gray-300 w-full h-96 p-4 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-600"
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                        placeholder="Paste your quiz questions JSON here..."
                    />

                    <button
                        onClick={createQuiz}
                        className="w-full bg-blue-600 text-white px-6 py-4 mt-6 rounded-lg font-bold hover:bg-blue-700 text-lg transition-all"
                    >
                        Create Quiz
                    </button>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-900 font-semibold">
                        💡 Tip: Make sure to include all 4 required fields: id, question,
                        options (array of 4 items), and correctAnswer (index 0-3)
                    </p>
                </div>
            </div>
        </main>
    );
}

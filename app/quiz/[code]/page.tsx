"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Question } from "@/lib/types";

interface Props {
    params: {
        code: string;
    };
}

export default function QuizPage({ params }: Props) {
    const [question, setQuestion] = useState<Question | null>(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [participantId, setParticipantId] = useState<string>("");
    const [quizEnded, setQuizEnded] = useState(false);

    useEffect(() => {
        socket.connect();

        const normalizedCode = params.code.toUpperCase();
        const pId = localStorage.getItem(`participant-${normalizedCode}`);
        if (pId) {
            setParticipantId(pId);
        }

        socket.on("quiz-started", (data: { question: Question; questionIndex: number }) => {
            setQuestion(data.question);
            setQuestionIndex(data.questionIndex);
            setTimeLeft(30);
            setSelectedOption(null);
            setSubmitted(false);
        });

        socket.on("question-updated", (data: { question: Question; questionIndex: number }) => {
            setQuestion(data.question);
            setQuestionIndex(data.questionIndex);
            setTimeLeft(30);
            setSelectedOption(null);
            setSubmitted(false);
        });

        socket.on("quiz-completed", () => {
            setQuizEnded(true);
            window.location.href = `/results/${params.code.toUpperCase()}`;
        });

        return () => {
            socket.off("quiz-started");
            socket.off("question-updated");
            socket.off("quiz-completed");
        };
    }, [params.code]);

    useEffect(() => {
        if (!question || submitted || quizEnded) return;

        const timer = setTimeout(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                setSubmitted(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, question, submitted, quizEnded]);

    const handleSubmitAnswer = () => {
        if (selectedOption === null || !question || !participantId) return;

        socket.emit("submit-answer", {
            code: params.code.toUpperCase(),
            participantId,
            questionId: question.id,
            selectedOption,
            timeTaken: 30 - timeLeft
        });

        setSubmitted(true);
    };

    if (!question) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <h1 className="text-4xl">Waiting for quiz to start...</h1>
            </main>
        );
    }

    if (!participantId) {
        return (
            <main className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-xl text-gray-700 mb-6">
                        Invalid session. Please join the quiz again.
                    </p>
                    <button
                        onClick={() => window.location.href = "/join"}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
                    >
                        Back to Join
                    </button>
                </div>
            </main>
        );
    }

    if (quizEnded) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <h1 className="text-4xl">Quiz Ended! Redirecting...</h1>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-linear-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm text-gray-600">
                        Question {questionIndex + 1}
                    </h2>
                    <div className={`text-3xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-green-600"}`}>
                        {timeLeft}s
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-10 text-gray-900">
                    {question.question}
                </h1>

                <div className="space-y-4 mb-10">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!submitted) {
                                    setSelectedOption(index);
                                }
                            }}
                            disabled={submitted}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                selectedOption === index
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                            } ${submitted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <span className="font-semibold text-lg">
                                {String.fromCharCode(65 + index)}.
                            </span>
                            {" "}{option}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null || submitted}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white text-lg transition-all ${
                        selectedOption !== null && !submitted
                            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    {submitted ? "Answer Submitted" : "Submit Answer"}
                </button>
            </div>
        </main>
    );
}
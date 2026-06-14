"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function JoinPage() {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [joined, setJoined] = useState(false);
    const [message, setMessage] = useState("Waiting for host to start the quiz...");
    const [error, setError] = useState("");

    useEffect(() => {
        socket.connect();

        socket.on("quiz-started", (data: { code: string; question: any; questionIndex: number }) => {
            setMessage("Quiz Started! Redirecting...");
            setTimeout(() => {
                window.location.href = `/quiz/${data.code}`;
            }, 500);
        });

        socket.on("error-message", (errorMsg: string) => {
            setError(errorMsg);
            setJoined(false);
        });

        socket.on(
            "joined-session",
            (data: { participantId: string; code: string }) => {
                localStorage.setItem(`participant-${data.code}`, data.participantId);
            }
        );

        return () => {
            socket.off("quiz-started");
            socket.off("error-message");
            socket.off("joined-session");
        };
    }, []);

    const joinQuiz = () => {
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        if (!code.trim()) {
            setError("Please enter the quiz code");
            return;
        }

        setError("");

        socket.emit("join-session", {
            name: name.trim(),
            code: code.trim()
        });

        setJoined(true);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            joinQuiz();
        }
    };

    if (joined) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 to-blue-100 p-6">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome, {name}! 👋
                    </h1>
                    <p className="text-2xl text-gray-700 mb-8">{message}</p>
                    <div className="flex justify-center gap-2 mt-8">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                        <div
                            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                        ></div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-50 to-pink-100 p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-10">
                <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
                    Quiz
                </h1>
                <p className="text-center text-gray-600 mb-8">Join a quiz session</p>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quiz Code
                        </label>
                        <input
                            type="text"
                            placeholder="Enter quiz code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            maxLength={6}
                            className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-600 text-lg font-mono tracking-widest"
                        />
                    </div>

                    <button
                        onClick={joinQuiz}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all"
                    >
                        Join Quiz
                    </button>
                </div>
            </div>
        </main>
    );
}


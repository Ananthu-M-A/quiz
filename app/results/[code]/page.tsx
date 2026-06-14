"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Participant } from "@/lib/types";

interface Props {
    params: Promise<{
        code: string;
    }>;
}

export default function ResultsPage({ params: paramsPromise }: Props) {
    const params = React.use(paramsPromise);
    const [winners, setWinners] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.connect();

        const handleQuizCompleted = (data: { winners: Participant[] }) => {
            setWinners(data.winners);
            setLoading(false);
        };

        socket.on("quiz-completed", handleQuizCompleted);

        // Set a timeout to handle case where event was already emitted before component mounts
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setWinners([]);
        }, 3000);

        return () => {
            socket.off("quiz-completed", handleQuizCompleted);
            clearTimeout(timeoutId);
        };
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-yellow-50 to-orange-100">
                <h1 className="text-4xl font-bold text-gray-900">Loading results...</h1>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-linear-to-br from-yellow-50 to-orange-100">
            <div className="w-full max-w-4xl">
                <h1 className="text-5xl font-bold text-center mb-12 text-gray-900">
                    🎉 Quiz Results 🎉
                </h1>

                <div className="grid gap-8">
                    {winners.map((winner, index) => {
                        const medals = ["🥇", "🥈", "🥉"];
                        const bgColors = [
                            "from-yellow-400 to-yellow-600",
                            "from-gray-300 to-gray-500",
                            "from-orange-400 to-orange-600"
                        ];

                        return (
                            <div
                                key={winner.id}
                                className={`bg-linear-to-r ${bgColors[index]} rounded-lg shadow-2xl p-8 transform transition hover:scale-105`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <span className="text-6xl">{medals[index]}</span>
                                        <div>
                                            <h2 className="text-4xl font-bold text-white">
                                                #{index + 1}
                                            </h2>
                                            <p className="text-xl text-white opacity-90 mt-2">
                                                {winner.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-5xl font-bold text-white">
                                            {winner.score}
                                        </p>
                                        <p className="text-lg text-white opacity-90 mt-2">
                                            Correct Answers
                                        </p>
                                        <p className="text-sm text-white opacity-75 mt-1">
                                            Time: {winner.totalTime}s
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        </main>
    );
}

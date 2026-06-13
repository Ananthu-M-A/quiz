import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100 p-6">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">
                        🎯 Quiz Master
                    </h1>
                    <p className="text-2xl text-gray-700">
                        Create and participate in live quizzes with real-time scoring
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/admin">
                        <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer h-full">
                            <div className="text-5xl mb-4">🎤</div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Host Quiz
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Create a new quiz, manage questions, and see live results on the big screen
                            </p>
                            <div className="text-blue-600 font-semibold flex items-center gap-2">
                                Go to Admin Panel
                                <span>→</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/join">
                        <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer h-full">
                            <div className="text-5xl mb-4">👥</div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Join Quiz
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Join an active quiz using the code provided by the host and answer questions from your device
                            </p>
                            <div className="text-blue-600 font-semibold flex items-center gap-2">
                                Join Now
                                <span>→</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">How it works:</h3>
                    <ol className="text-gray-700 space-y-2 ml-4">
                        <li>
                            <span className="font-bold">1.</span> Host creates a quiz in the Admin Panel
                        </li>
                        <li>
                            <span className="font-bold">2.</span> Participants join using the quiz code
                        </li>
                        <li>
                            <span className="font-bold">3.</span> Host starts the quiz and questions appear on the main screen
                        </li>
                        <li>
                            <span className="font-bold">4.</span> Participants answer questions from their devices
                        </li>
                        <li>
                            <span className="font-bold">5.</span> Results and rankings are displayed after the quiz ends
                        </li>
                    </ol>
                </div>
            </div>
        </main>
    );
}
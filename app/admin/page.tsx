"use client";

import { useEffect } from "react";
import { useState } from "react";

import { socket } from "@/lib/socket";

export default function AdminPage() {

  const [jsonText,
    setJsonText] = useState("");

  const [quizCode,
    setQuizCode] =
    useState("");

  const [
    participants,
    setParticipants
  ] = useState<any[]>([]);

  useEffect(() => {

    socket.connect();

    socket.on(
      "session-created",
      (code) => {

        setQuizCode(code);

        socket.emit(
          "get-participants",
          code
        );

      }
    );

    socket.on(
      "participants-updated",
      (data) => {
        setParticipants(data);
      }
    );

    return () => {

      socket.off(
        "session-created"
      );

      socket.off(
        "participants-updated"
      );

    };

  }, []);

  const createQuiz = () => {

    try {

      const questions =
        JSON.parse(jsonText);

      socket.emit(
        "create-session",
        questions
      );

    } catch {

      alert(
        "Invalid JSON"
      );

    }

  };

  const startQuiz = () => {

    socket.emit(
      "start-quiz",
      quizCode
    );

  };

  return (

    <main className="p-10">

      <h1 className="text-3xl font-bold mb-5">
        Admin Panel
      </h1>

      <textarea
        className="border w-full h-64 p-3"
        value={jsonText}
        onChange={(e) =>
          setJsonText(
            e.target.value
          )
        }
      />

      <button
        onClick={createQuiz}
        className="bg-black text-white px-5 py-3 mt-3"
      >
        Create Quiz
      </button>

      {
        quizCode && (

          <>
            <h2 className="text-2xl mt-8">

              Quiz Code:
              {" "}
              {quizCode}

            </h2>

            <h3 className="mt-5 text-xl">

              Participants
              (
              {participants.length}
              )

            </h3>

            <ul>

              {
                participants.map(
                  (p) => (
                    <li
                      key={p.id}
                    >
                      {p.name}
                    </li>
                  )
                )
              }

            </ul>

            <button
              onClick={startQuiz}
              className="bg-green-600 text-white px-5 py-3 mt-6"
            >
              Start Quiz
            </button>

          </>

        )
      }

    </main>

  );

}
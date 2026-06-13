"use client";

import { useEffect } from "react";
import { useState } from "react";

import { socket } from "@/lib/socket";

export default function JoinPage() {

  const [name,
    setName] =
    useState("");

  const [code,
    setCode] =
    useState("");

  const [joined,
    setJoined] =
    useState(false);

  const [message,
    setMessage] =
    useState(
      "Waiting for host..."
    );

  useEffect(() => {

    socket.connect();

    socket.on(
      "quiz-started",
      () => {

        setMessage(
          "Quiz Started!"
        );

        window.location.href =
          `/quiz/${code}`;

      }
    );

    return () => {

      socket.off(
        "quiz-started"
      );

    };

  }, [code]);

  const joinQuiz = () => {

    socket.emit(
      "join-session",
      {
        name,
        code
      }
    );

    setJoined(true);

  };

  if (joined) {

    return (

      <main className="flex min-h-screen items-center justify-center">

        <h1 className="text-3xl">
          {message}
        </h1>

      </main>

    );

  }

  return (

    <main className="flex flex-col items-center justify-center min-h-screen gap-4">

      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
        className="border p-3"
      />

      <input
        placeholder="Quiz Code"
        value={code}
        onChange={(e) =>
          setCode(
            e.target.value
          )
        }
        className="border p-3"
      />

      <button
        onClick={joinQuiz}
        className="bg-black text-white px-5 py-3"
      >
        Join Quiz
      </button>

    </main>

  );

}
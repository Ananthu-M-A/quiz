import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

import { nanoid } from "nanoid";

import { quizStore } from "./lib/quizStore";

import { Question } from "./lib/types";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });

const handler = app.getRequestHandler();

app.prepare().then(() => {

  const httpServer = createServer(
    (req, res) => {
      handler(req, res);
    }
  );

  const io = new Server(httpServer, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log(
      "connected",
      socket.id
    );

    socket.on(
      "create-session",
      (questions) => {

        const code = nanoid(6).toUpperCase();

        quizStore[code] = {
          code,
          status: "waiting",
          questions,
          participants: [],
          answers: [],
          currentQuestionIndex: 0
        };

        // Admin joins the room to receive updates
        socket.join(code);

        socket.emit(
          "session-created",
          code
        );
      }
    );

    socket.on(
      "join-session",
      ({
        code,
        name
      }) => {

        const normalizedCode = code.toUpperCase();
        const session =
          quizStore[normalizedCode];

        if (!session) {
          socket.emit(
            "error-message",
            "Invalid Quiz Code"
          );
          return;
        }

        const participant = {
          id: nanoid(),
          name,
          score: 0,
          totalTime: 0
        };

        session.participants.push(
          participant
        );

        socket.join(normalizedCode);

        socket.emit(
          "joined-session",
          {
            participantId: participant.id,
            code: normalizedCode
          }
        );

        io.to(normalizedCode).emit(
          "participants-updated",
          session.participants
        );
      }
    );

    socket.on(
      "start-quiz",
      (code: string) => {

        const normalizedCode = code.toUpperCase();
        const session =
          quizStore[normalizedCode];

        if (!session) return;

        session.status =
          "running";

        const firstQuestion =
          session.questions[0];

        io.to(normalizedCode).emit(
          "quiz-started",
          {
            question:
              firstQuestion,
            questionIndex: 0
          }
        );

      }
    );

    socket.on(
      "get-participants",
      (code: string) => {

        const normalizedCode = code.toUpperCase();
        const session =
          quizStore[normalizedCode];

        if (!session) return;

        socket.emit(
          "participants-updated",
          session.participants
        );

      }
    );

    socket.on(
      "submit-answer",
      ({
        code,
        participantId,
        questionId,
        selectedOption,
        timeTaken
      }: {
        code: string;
        participantId: string;
        questionId: string;
        selectedOption: number;
        timeTaken: number;
      }) => {

        const normalizedCode = code.toUpperCase();
        const session =
          quizStore[normalizedCode];

        if (!session) return;

        const question =
          session.questions.find(
            (q) => q.id === questionId
          );

        if (!question) return;

        const isCorrect =
          question.correctAnswer ===
          selectedOption;

        const participant =
          session.participants.find(
            (p) => p.id === participantId
          );

        if (participant && isCorrect) {
          participant.score += 1;
          participant.totalTime +=
            timeTaken;
        }

        session.answers.push({
          participantId,
          questionId,
          selectedOption,
          timeTaken
        });

      }
    );

    socket.on(
      "next-question",
      (code: string) => {

        const normalizedCode = code.toUpperCase();
        const session =
          quizStore[normalizedCode];

        if (!session) return;

        if (
          session.currentQuestionIndex <
          session.questions.length - 1
        ) {
          session.currentQuestionIndex +=
            1;

          const nextQuestion =
            session.questions[
              session.currentQuestionIndex
            ];

          io.to(normalizedCode).emit(
            "question-updated",
            {
              question:
                nextQuestion,
              questionIndex:
                session.currentQuestionIndex
            }
          );
        } else {

          session.status =
            "completed";

          const winners =
            session.participants
              .sort(
                (a, b) => {
                  if (b.score !== a.score) {
                    return b.score -
                      a.score;
                  }
                  return a.totalTime -
                    b.totalTime;
                }
              )
              .slice(0, 3);

          io.to(normalizedCode).emit(
            "quiz-completed",
            {
              winners
            }
          );

        }

      }
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          "disconnected",
          socket.id
        );

      }
    );

  });

  httpServer.listen(
    3000,
    () => {
      console.log(
        "Running on port 3000"
      );
    }
  );

});
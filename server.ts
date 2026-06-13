import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

import { nanoid } from "nanoid";

import { quizStore } from "./lib/quizStore";

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

        const code = nanoid(6);

        quizStore[code] = {
          code,
          status: "waiting",
          questions,
          participants: [],
          answers: [],
          currentQuestionIndex: 0
        };

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

        const session =
          quizStore[code];

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

        socket.join(code);

        io.to(code).emit(
          "participants-updated",
          session.participants
        );
      }
    );

    socket.on(
      "start-quiz",
      (code: string) => {

        const session =
          quizStore[code];

        if (!session) return;

        session.status =
          "running";

        const firstQuestion =
          session.questions[0];

        io.to(code).emit(
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

        const session =
          quizStore[code];

        if (!session) return;

        socket.emit(
          "participants-updated",
          session.participants
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
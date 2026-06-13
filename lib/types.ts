export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  totalTime: number;
}

export interface Answer {
  participantId: string;
  questionId: string;
  selectedOption: number;
  timeTaken: number;
}

export interface QuizSession {
  code: string;

  status:
    | "waiting"
    | "running"
    | "completed";

  questions: Question[];

  participants: Participant[];

  answers: Answer[];

  currentQuestionIndex: number;
}
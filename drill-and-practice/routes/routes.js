import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicsController from "./controllers/topicsController.js";
import * as questionController from "./controllers/questionsController.js";
import * as authController from "./controllers/authController.js";
import * as quizController from "./controllers/quizController.js";
import * as questionsApi from "./apis/questionsApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicsController.showTopics);
router.get("/topics/:id", topicsController.showTopicById);
router.get("/topics/:id/questions/:qId", questionController.showQuestion);

router.post("/topics/:id/delete", topicsController.removeTopic);
router.post("/topics/:id/questions", questionController.addQuestion);
router.post(
  "/topics/:tId/questions/:qId/delete",
  questionController.removeQuestion,
);
router.post(
  "/topics/:tId/questions/:qId/options",
  questionController.addAnswerOption,
);
router.post(
  "/topics/:tId/questions/:qId/options/:oId/delete",
  questionController.removeAnswerOption,
);
router.post("/topics", topicsController.addTopic);

router.get("/quiz", quizController.listTopicsForQuiz);
router.get("/quiz/:tId", quizController.getRandomQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.showQuestion);
router.get(
  "/quiz/:tId/questions/:qId/correct",
  (ctx) => quizController.questionAnswerCheck(ctx, true),
);
router.get(
  "/quiz/:tId/questions/:qId/incorrect",
  (ctx) => quizController.questionAnswerCheck(ctx, false),
);
router.post(
  "/quiz/:tId/questions/:qId/options/:oId",
  quizController.answerHandler,
);

router.get("/auth/register", authController.showRegisterPage);
router.get("/auth/login", authController.showLoginPage);

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

router.get("/api/questions/random", questionsApi.getRandomQuestion);
router.post("/api/questions/answer", questionsApi.answerTheQuestion);

export { router };

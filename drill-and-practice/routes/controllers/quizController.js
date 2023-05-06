import * as topicsService from "../../services/topicsService.js";
import * as qService from "../../services/questionsService.js";

const listTopicsForQuiz = async ({ render }) => {
  const data = {
    topics: await topicsService.listTopicsOrdered(),
  };
  render("quizes.eta", data);
};

const getRandomQuestion = async ({ params, response, render }) => {
  const topicId = params.tId;
  const question = await qService.getRandomQuestion(topicId);
  if (question.length < 1) {
    render("noQuestions.eta");
  } else {
    response.redirect(`/quiz/${topicId}/questions/${question[0].id}`);
  }
};

const showQuestion = async ({ render, params }) => {
  const data = {
    question: await qService.getQuestionById(params.qId),
    answers: await qService.getAnswersForQuestion(params.qId),
  };
  render("questionQuiz.eta", data);
};

const answerHandler = async ({ params, response, user }) => {
  const tId = params.tId;
  const qId = params.qId;
  const oId = params.oId;
  await qService.saveUserAnswer(user.id, qId, oId);
  const isCorrect = (await qService.getAnswerCorrect(oId)).is_correct;
  if (isCorrect) {
    response.redirect(`/quiz/${tId}/questions/${qId}/correct`);
  } else {
    response.redirect(`/quiz/${tId}/questions/${qId}/incorrect`);
  }
};

const questionAnswerCheck = async ({ params, render }, isCorrect) => {
  const qId = params.qId;
  const tId = params.tId;
  if (isCorrect) {
    const data = {
      correct: true,
      topic_id: tId,
    };
    render("questionAnswerShow.eta", data);
  } else {
    const correctAnswer = await qService.getCorrectAnswer(qId);
    const data = {
      correct: false,
      topic_id: tId,
      answer: correctAnswer.option_text,
    };
    render("questionAnswerShow.eta", data);
  }
};

export {
  answerHandler,
  getRandomQuestion,
  listTopicsForQuiz,
  questionAnswerCheck,
  showQuestion,
};

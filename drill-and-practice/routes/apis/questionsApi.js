import * as qService from "../../services/questionsService.js";

const getRandomQuestion = async ({ response }) => {
  const randomQuestion = await qService.getRandomQuestionsFromAllTopics();
  if (!randomQuestion) {
    response.body = {};
    return;
  }
  const answers = await qService.getAnswersForQuestion(randomQuestion.id);
  const data = {
    questionId: randomQuestion.id,
    questionText: randomQuestion.question_text,
    answerOptions: answers.map((x) => {
      return { optionId: x.id, optionText: x.option_text };
    }),
  };
  response.body = data;
};

const answerTheQuestion = async ({ request, response }) => {
  const params = await request.body({ type: "json" }).value;
  const answerOption = await qService.getAnswerOptionById(params.optionId);
  response.body = {
    correct: answerOption?.question_id === params.questionId &&
      answerOption?.is_correct,
  };
};

export { answerTheQuestion, getRandomQuestion };

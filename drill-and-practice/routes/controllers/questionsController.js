import * as qService from "../../services/questionsService.js";
import * as topicController from "./topicsController.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  question_text: [validasaur.required, validasaur.minLength(1)],
};

const answerOptionValidationRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const params = await request.body({ type: "form" }).value;
  return { question_text: params.get("question_text") };
};

const getAnswerOptionData = async (request) => {
  const params = await request.body({ type: "form" }).value;
  return {
    option_text: params.get("option_text"),
    is_correct: params.get("is_correct") ? true : false,
  };
};

const showQuestion = async ({ params, render }, additional) => {
  const data = {
    question: await qService.getQuestionById(params.qId),
    answers: await qService.getAnswersForQuestion(params.qId),
    ...additional,
  };
  if (!data.option_text) data.option_text = "";
  render("question.eta", data);
};

const addQuestion = async ({ request, response, params, render, user }) => {
  const topicID = params.id;
  const questionData = await getQuestionData(request);
  questionData.user_id = user.id;
  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );
  if (!passes) {
    questionData.errors = errors;
    await topicController.showTopicById({ params, render }, questionData);
  } else {
    try {
      await qService.addQuestion(
        questionData.question_text,
        topicID,
        questionData.user_id,
      );
      response.redirect(`/topics/${topicID}`);
    } catch (e) {
      questionData.errors = {
        question_text: {
          unique: e.message,
        },
      };
      await topicController.showTopicById({ params, render }, questionData);
    }
  }
};

const addAnswerOption = async ({ params, request, response, render, user }) => {
  const tId = params.tId;
  const qId = params.qId;
  const optionData = await getAnswerOptionData(request);
  optionData.user_id = user.id;
  const [passes, errors] = await validasaur.validate(
    optionData,
    answerOptionValidationRules,
  );
  if (!passes) {
    optionData.errors = errors;
    await showQuestion({ params, render }, optionData);
  } else {
    try {
      await qService.addAnswer(
        qId,
        optionData.option_text,
        optionData.is_correct,
      );
      response.redirect(`/topics/${tId}/questions/${qId}`);
    } catch (e) {
      optionData.errors = {
        option_text: {
          unique: e.message,
        },
      };
      await showQuestion({ params, render }, optionData);
    }
  }
};

const removeAnswerOption = async ({ params, response }) => {
  const tId = params.tId;
  const qId = params.qId;
  const oId = params.oId;
  await qService.removeAnswer(oId);
  response.redirect(`/topics/${tId}/questions/${qId}`);
};

const removeQuestion = async ({ params, response }) => {
  const tId = params.tId;
  const qId = params.qId;
  await qService.removeQuestion(qId);
  response.redirect(`/topics/${tId}`);
};

export {
  addAnswerOption,
  addQuestion,
  removeAnswerOption,
  removeQuestion,
  showQuestion,
};

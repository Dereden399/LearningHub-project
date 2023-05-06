import { sql } from "../database/database.js";

const listQuestionsFromTopic = async (topicID) => {
  const rows =
    await sql`SELECT id, question_text FROM questions WHERE topic_id = ${topicID}`;
  return rows;
};

const getQuestionById = async (id) => {
  const row = await sql`SELECT * FROM questions WHERE id = ${id}`;
  return row[0];
};

const getAnswersForQuestion = async (id) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE question_id = ${id}`;
  return rows;
};

const getRandomQuestion = async (id) => {
  const rows =
    await sql`SELECT * FROM questions WHERE topic_id = ${id} ORDER BY RANDOM() LIMIT 1`;
  return rows;
};

const getRandomQuestionsFromAllTopics = async () => {
  return (await sql`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`)[0];
};

const addQuestion = async (text, topic_id, user_id) => {
  await sql`INSERT INTO questions(user_id, topic_id, question_text) VALUES(${user_id}, ${topic_id}, ${text})`;
};

const removeQuestion = async (id) => {
  await sql`DELETE FROM questions WHERE id = ${id}`;
};

const addAnswer = async (qId, text, correct) => {
  await sql`INSERT INTO question_answer_options(option_text, is_correct, question_id) VALUES(${text}, ${correct}, ${qId})`;
};

const removeAnswer = async (aId) => {
  await sql`DELETE FROM question_answer_options WHERE id = ${aId}`;
};

const saveUserAnswer = async (userId, questionId, optionId) => {
  await sql`INSERT INTO question_answers(user_id, question_id, question_answer_option_id) VALUES(${userId}, ${questionId}, ${optionId})`;
};

const getAnswerCorrect = async (oId) => {
  return (await sql`SELECT is_correct FROM question_answer_options WHERE id = ${oId}`)[
    0
  ];
};

const getCorrectAnswer = async (id) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE question_id = ${id} AND is_correct = true`;
  return rows[0];
};

const getAnswerOptionById = async (id) => {
  return (await sql`SELECT * FROM question_answer_options WHERE id = ${id}`)[0];
};

export {
  addAnswer,
  addQuestion,
  getAnswerCorrect,
  getAnswerOptionById,
  getAnswersForQuestion,
  getCorrectAnswer,
  getQuestionById,
  getRandomQuestion,
  getRandomQuestionsFromAllTopics,
  listQuestionsFromTopic,
  removeAnswer,
  removeQuestion,
  saveUserAnswer,
};

import { sql } from "../database/database.js";

const numberOfTopics = async () => {
  return (await sql`SELECT COUNT(*) AS count FROM topics`)[0].count;
};

const numberOfQuestions = async () => {
  return (await sql`SELECT COUNT(*) AS count FROM questions`)[0].count;
};

const numberOfAnswers = async () => {
  return (await sql`SELECT COUNT(*) AS count FROM question_answers`)[0].count;
};

export { numberOfAnswers, numberOfQuestions, numberOfTopics };

import { sql } from "../database/database.js";

const listTopics = async () => {
  const rows = await sql`SELECT id, name FROM topics`;
  return rows;
};

const listTopicsOrdered = async () => {
  const rows = await sql`SELECT id, name FROM topics ORDER BY name`;
  return rows;
};

const getTopicById = async (id) => {
  const row = await sql`SELECT * FROM topics WHERE id = ${id}`;
  return row[0];
};

const addTopic = async (user_id, name) => {
  await sql`INSERT INTO topics(name, user_id) VALUES(${name}, ${user_id})`;
};

const removeTopic = async (id) => {
  await sql`DELETE FROM topics WHERE id = ${id}`;
};

export { addTopic, getTopicById, listTopics, listTopicsOrdered, removeTopic };

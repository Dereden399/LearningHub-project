import * as topicsService from "../../services/topicsService.js";
import * as qService from "../../services/questionsService.js";
import { validasaur } from "../../deps.js";

const topicValidationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};

const getTopicData = async (request) => {
  const params = await request.body({ type: "form" }).value;
  return {
    name: params.get("name"),
  };
};

const showTopics = async ({ render }, additional) => {
  const data = {
    topics: await topicsService.listTopics(),
    ...additional,
  };
  if (!data.name) data.name = "";
  render("topics.eta", data);
};

const showTopicsOrdered = async ({ render }) => {
  const data = {
    topics: await topicsService.listTopicsOrdered(),
  };
  render("topics.eta", data);
};

const showTopicById = async ({ params, render }, additional) => {
  const id = params.id;
  const data = {
    topic: await topicsService.getTopicById(id),
    questions: await qService.listQuestionsFromTopic(id),
    ...additional,
  };
  if (!data.question_text) data.question_text = "";
  render("topic.eta", data);
};

const addTopic = async ({ request, response, render, user }) => {
  if (!user.admin) {
    response.redirect("/topics");
    return;
  }
  const topicData = await getTopicData(request);
  topicData.user_id = user.id;
  const [passes, errors] = await validasaur.validate(
    topicData,
    topicValidationRules,
  );
  if (!passes) {
    topicData.errors = errors;
    await showTopics({ render }, topicData);
  } else {
    try {
      await topicsService.addTopic(1, topicData.name);
      response.redirect("/topics");
    } catch (e) {
      topicData.errors = {
        name: {
          unique: "Topic name must be unique",
        },
      };
      await showTopics({ render }, topicData);
    }
  }
};

const removeTopic = async ({ params, response, user }) => {
  if (!user.admin) {
    response.redirect("/topics");
    return;
  }
  await topicsService.removeTopic(params.id);
  response.redirect("/topics");
};

export { addTopic, removeTopic, showTopicById, showTopics, showTopicsOrdered };

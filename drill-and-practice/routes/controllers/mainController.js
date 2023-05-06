import * as statisticsService from "../../services/statisticsService.js";

const showMain = async ({ render }) => {
  const data = {
    topicsCount: await statisticsService.numberOfTopics(),
    questionsCount: await statisticsService.numberOfQuestions(),
    answersCount: await statisticsService.numberOfAnswers(),
  };
  render("main.eta", data);
};

export { showMain };

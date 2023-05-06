# LearningHub project - for Web Software Development course

This website allows you to create topics, questions, and add answers to them. You can also do small quizzes to review topics. The application uses the Deno Oak library to control the frontend and Playwright for automatic end-to-end testing. Although the application is fully rendered on the server, some client-side JavaScript is used to control small aspects of the site.

## Starting the application
To start the application, follow these steps:
1. Download the source code from the repository.
2. Install Docker Compose if you haven't already.
3. In the root of the project, run the following command:
```bash
$ docker-compose up
```
### **Note**
The Deno container does not work well on Apple ARM chips. If you want to run the application on these machines, change the first line in the Dockerfile in the root directory from *FROM denoland/deno:alpine-1.29.2* to *FROM lukechannings/deno:v1.29.2*

## Testing
The application provides some end-to-end tests, which can be found in the e2e-playwright/tests folder. To run the tests, execute the following command in the root of the project:
```bash
$ docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf
```
If you add own tests, remember to run *docker-compose rm -sf* command in case of tests fail

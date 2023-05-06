const { test, expect } = require("@playwright/test");

const loginAsAdmin = async (page) => {
  await page.goto("/auth/login");
  await page.locator("input[id='email-field']").type("admin@admin.com");
  await page.locator("input[id='password-field']").type("123456");
  await page.locator("#login-button").click();
};

const loginAsNormal = async (page) => {
  await page.goto("/auth/login");
  await page.locator("input[id='email-field']").type("normal@normal.com");
  await page.locator("input[id='password-field']").type("123456");
  await page.locator("#login-button").click();
};

const logout = async (page) => {
  await page.goto("/auth/logout");
};

test("Main page shows a login and register links", async ({ page }) => {
  await page.goto("/");
  const register = await page.locator("a[href='/auth/register']").count();
  console.log(register);
  await expect(register).not.toBe(
    0,
  );
  const login = await page.locator("a[href='/auth/login']").count();
  await expect(login).not.toBe(0);
});

test("Main page shows statistics", async ({ page }) => {
  await page.goto("/");
  const element = await page.getByText("Statistics");
  await expect(element !== undefined).toBeTruthy();
});

test("Unauthorized user is redirected to login page", async ({ page }) => {
  await page.goto("/topics");
  await expect(page.locator("div.toast")).toHaveCount(1);
});

test("Incorrect user can not log in", async ({ page }) => {
  await page.goto("/auth/login");
  await page.locator("input[id='email-field']").type(
    "notExistqqweqweqweqweqwe@notExist.notExist",
  );
  await page.locator("input[id='password-field']").type(
    "notExistqqweqweqweqweqwe@notExist.notExist",
  );
  await page.locator("input[type='submit']").click();
  await expect(page.locator("#error")).toHaveCount(1);
});

test("User can log in as admin (with email: admin@admin.com, password: 123456)", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page).toHaveURL("/topics");
});

test("admin sees a form to add a topic, but normal user does not", async ({ page }) => {
  await logout(page);
  await loginAsAdmin(page);
  await page.goto("/topics");
  await expect(page.locator("input[aria-describedby='nameValidation']"))
    .toHaveCount(1);
  await logout(page);
  await loginAsNormal(page);
  await expect(page.locator("input[aria-describedby='nameValidation']"))
    .toHaveCount(0);
});

test("admin can add a topic", async ({ page }) => {
  await logout(page);
  await loginAsAdmin(page);
  await page.goto("/topics");
  await page.locator("input[aria-describedby='nameValidation']").type(
    "New Topic",
  );
  await page.locator("#add-topic-button").click();
  await expect(
    await page.locator("#topic-name", { hasText: "New Topic" }).count(),
  ).toBe(1);
});

test("admin can delete a topic", async ({ page }) => {
  await logout(page);
  await loginAsAdmin(page);
  const topicName = await page.locator("#topic-name", { hasText: "New Topic" });
  const topic = await page.locator(".topic-card", { has: topicName });
  await topic.locator(
    "#topic-delete-button",
  ).click();
  await expect(
    await page.locator("#topic-name", { hasText: "New Topic" }).count(),
  ).toBe(0);
});

test("user can add a question to the topic", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/topics/1");
  await page.locator("textarea[aria-describedby='questionValidation']").type(
    "Some question",
  );
  await page.locator("#question-add-button").click();
  await expect(
    await page.locator("#question-link", { hasText: "Some question" }).count(),
  ).toBe(1);
});

test("question without answers shows a delete button and can be deleted", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/topics/1");
  const element = await page.locator("#question-link", {
    hasText: "Some question",
  });
  await element.click();
  await expect(page).toHaveURL("/topics/1/questions/1");
  const deleteButton = await page.locator("#delete-question-button");
  await expect(await deleteButton.count()).toBe(1);
  await deleteButton.click();
  await expect(page).toHaveURL("/topics/1");
});

test("user can add an answer", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/topics/1");
  await page.locator("textarea[aria-describedby='questionValidation']").type(
    "Some question",
  );
  await page.locator("#question-add-button").click();
  const element = await page.locator("#question-link", {
    hasText: "Some question",
  });
  await element.click();
  await page.locator("#option_text-input").type("Answer 1 and it is incorrect");
  await page.locator("#answer-option-submit-button").click();
  await expect(
    await page.getByRole("listitem").filter({
      hasText: "Answer 1 and it is incorrect",
    })
      .count(),
  ).toBe(1);
  await expect(await page.locator(".badge").count()).toBe(0);

  await page.locator("#option_text-input").type("Answer 2 and it is correct");
  await page.locator("#is_correct-input").click();
  await page.locator("#answer-option-submit-button").click();
  await expect(
    await page.getByRole("listitem").filter({
      hasText: "Answer 2 and it is correct",
    })
      .count(),
  ).toBe(1);
  await expect(await page.locator(".badge").count()).toBe(1);
});

test("user can delete an answer", async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto("/topics/1");
  const element = await page.locator("#question-link", {
    hasText: "Some question",
  });
  await element.click();
  const answer = await page.getByRole("listitem").filter({
    hasText: "Answer 2 and it is correct",
  });
  await answer.locator("#delete-answer-button").click();
  await expect(
    await page.getByRole("listitem").filter({
      hasText: "Answer 2 and it is correct",
    }).count(),
  ).toBe(0);
});

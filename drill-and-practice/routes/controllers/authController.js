import * as userService from "../../services/userService.js";
import { bcrypt, validasaur } from "../../deps.js";

const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const showRegisterPage = async ({ render }, additional) => {
  const data = additional;
  if (!data.email) data.email = "";
  if (!data.password) data.password = "";
  render("register.eta", data);
};

const showLoginPage = async ({ render, cookies }, additional) => {
  if (cookies) {
    const authNeeded = await cookies.get("authNeeded");
    if (authNeeded) {
      await cookies.delete("authNeeded");
      additional.popup = "You must log in to watch restricted content.";
    }
  }
  render("login.eta", additional);
};

const getData = async (request) => {
  const params = await request.body({ type: "form" }).value;
  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};

const login = async ({ request, response, render, state }) => {
  const data = await getData(request);
  if (!data.email || !data.password) {
    await showLoginPage({ render }, {
      error: "Enter valid email and password",
    });
    return;
  }
  const userFromDB = (await userService.findUser(data.email))[0];
  if (!userFromDB) {
    await showLoginPage({ render }, { error: "Incorrect email or password" });
    return;
  }
  const passwordCorrect = await bcrypt.compare(
    data.password,
    userFromDB.password,
  );
  if (!passwordCorrect) {
    await showLoginPage({ render }, { error: "Incorrect email or password" });
    return;
  }
  await state.session.set("user", userFromDB);
  response.redirect("/topics");
};

const register = async ({ request, response, render }) => {
  const data = await getData(request);
  const [passes, errors] = await validasaur.validate(data, validationRules);

  if (!passes) {
    data.errors = errors;
    await showRegisterPage({ render }, data);
  } else {
    try {
      const passwordHash = await bcrypt.hash(data.password);
      await userService.addUser(data.email, passwordHash);
      response.redirect("/auth/login");
    } catch (e) {
      data.errors = {
        email: {
          unique: "This email is already in use",
        },
      };
      await showRegisterPage({ render }, data);
    }
  }
};

const logout = async ({ state, response }) => {
  await state.session.set("user", null);
  response.redirect("/");
};

export { login, logout, register, showLoginPage, showRegisterPage };

const authRequiredPath = ["/topics", "/quiz"];

const authMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");

  if (user) {
    await context.cookies.delete("authNeeded");
  }

  if (
    !user &&
    authRequiredPath.some((path) =>
      context.request.url.pathname.startsWith(path)
    )
  ) {
    await context.cookies.set("authNeeded", true);
    context.response.redirect("/auth/login");
  } else {
    await next();
  }
};

export { authMiddleware };

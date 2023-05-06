const errorsOnPage = document.querySelectorAll(".error");

errorsOnPage.forEach((err) => {
  const aria = err.id;
  if (aria) {
    const input = document.querySelector(`[aria-describedby="${aria}"]`);
    if (input) {
      input.classList.add("is-invalid");
    }
  }
});

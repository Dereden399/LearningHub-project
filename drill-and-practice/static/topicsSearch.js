const cards = document.querySelectorAll(".topic-card");

const filterList = (substring) => {
  cards.forEach((card) => {
    const cardName = card.querySelector("#topic-name").innerHTML;
    if (!cardName.toLowerCase().includes(substring)) {
      card.parentElement.classList.add("d-none");
    } else card.parentElement.classList.remove("d-none");
  });
};

const restore = () => {
  cards.forEach((x) => x.parentElement.classList.remove("d-none"));
};

const filterFieldHandler = () => {
  const text = document.querySelector("#filterField").value;
  if (text.length > 1) {
    filterList(text.toLowerCase());
  } else {
    restore();
  }
};

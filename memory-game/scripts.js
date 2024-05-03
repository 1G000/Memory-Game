const playground = document.querySelector(".playground");
let openedCars = [];
let cardsNumbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
let cardOne = "";
let cardTwo = "";
let counterNumber = document.querySelector(".counter");
const MaxScoreListSize = 10;
const winAudio = new Audio("./assets/audio/win.mp3");
const loseAudio = new Audio("./assets/audio/lose.mp3");
const winGameAudio = new Audio("./assets/audio/wingame.mp3");

function shuffleCards(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let randomInteger = Math.floor(Math.random() * (i + 1));
    let t = arr[i];
    arr[i] = arr[randomInteger];
    arr[randomInteger] = t;
  }
  return arr;
}

function finishGame(score) {
  const name = prompt("You win! Please insert your name!");
  addToLastResults(name, score);
  addToTopScores(name, score);
  fillTopScore();
  fillLastResults();
}

function cardClickListener(event) {
  const imageIndex = event.currentTarget.dataset.index;

  if (!cardOne) {
    cardOne = event.currentTarget;
    cardOne.classList.add("opened");
  } else if (!cardTwo) {
    cardTwo = event.currentTarget;
    cardTwo.classList.add("opened");

    const cardOneIndex = cardOne.dataset.index;
    if (cardOneIndex === imageIndex) {
      const score = Number(counterNumber.textContent) + 1;
      counterNumber.textContent = score;
      cardOne = "";
      cardTwo = "";
      winAudio.play();

      let cards = Array.from(playground.querySelectorAll(".card"));

      if (cards.every((card) => card.classList.contains("opened"))) {
        winGameAudio.play();
        setTimeout(() => finishGame(score), 300);
      }
    } else {
      counterNumber.textContent = Number(counterNumber.textContent) + 1;
      loseAudio.play();
      setTimeout(() => {
        cardOne.classList.remove("opened");
        cardOne = "";
        cardTwo.classList.remove("opened");
        cardTwo = "";
      }, 500);
    }
  }
}

function fillCards() {
  playground.innerHTML = "";
  for (let i = 0; i < cardsNumbers.length; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", "false");
    let image = document.createElement("img");
    image.classList.add("card-image");
    image.src = `./img/dog${cardsNumbers[i]}.jpg`;
    image.setAttribute("draggable", "false");
    playground.append(card);
    card.append(image);
    card.dataset.index = cardsNumbers[i];
    card.addEventListener("click", cardClickListener);
  }
}

function restart() {
  shuffleCards(cardsNumbers);
  fillCards();
  counterNumber.textContent = "0";
}

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", restart);

function getTopScores() {
  const topScores = localStorage.getItem("topScores") || "[]";
  return JSON.parse(topScores);
}

function getLastResults() {
  const lastResults = localStorage.getItem("lastResults") || "[]";
  return JSON.parse(lastResults);
}

function addToTopScores(name, score) {
  let topScores = getTopScores();
  topScores.push({
    name,
    score,
    time: new Date().getTime(),
  });

  topScores.sort((a, b) => {
    if (a.score === b.score) {
      return a.time - b.time;
    }
    return a.score - b.score;
  });

  topScores = topScores.slice(0, MaxScoreListSize);

  localStorage.setItem("topScores", JSON.stringify(topScores));
}

function addToLastResults(name, score) {
  let lastResults = getLastResults();
  lastResults.unshift({
    name,
    score,
  });
  lastResults = lastResults.slice(0, MaxScoreListSize);

  localStorage.setItem("lastResults", JSON.stringify(lastResults));
}

function fillTopScore() {
  const topScores = getTopScores();
  const topScoresList = document.querySelector(".top-scores");
  topScoresList.innerHTML = topScores
    .map((score) => `<li>${score.name}, result:${score.score}</li>`)
    .join("");
}

function fillLastResults() {
  const lastResults = getLastResults();
  const lastResultsList = document.querySelector(".last-results");
  lastResultsList.innerHTML = lastResults
    .map((score) => `<li>${score.name}, result:${score.score}</li>`)
    .join("");
}

shuffleCards(cardsNumbers);
fillCards();
fillTopScore();
fillLastResults();

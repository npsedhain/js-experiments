import Car from "./Car.js";

const GAME_WIDTH = 390;
const GAME_HEIGHT = 600;

let enemyCars = [];
let score = 0;
let gameShifter = 4;
let player = new Car(true);

let level = 0;
let interval;
let animation;
let scoreCard = createScoreCard();
let startButton = startScreen();

const canvas = document.getElementById("myCanvas");

window.addEventListener("keydown", e => {
  if (e.key === "a" || e.key === "ArrowLeft") {
    if (player.lane > 0) {
      player.changeLane(--player.lane);
    }
  }

  if (e.key === "d" || e.key === "ArrowRight") {
    if (player.lane < 2) {
      player.changeLane(++player.lane);
    }
  }
});

function createScoreCard() {
  let scoreCard = document.createElement("span");
  scoreCard.classList.add("score-card");
  document.body.appendChild(scoreCard);
  return scoreCard;
}

function startScreen() {
  let startButton = document.createElement("button");
  startButton.innerHTML = "Start";
  startButton.classList.add("start-button");
  document.body.appendChild(startButton);
  startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    scoreCard.innerHTML = "Score: 0";
    interval = setInterval(generateEnemyCars, 1100);
    draw();
  });
  return startButton;
}

function generateEnemyCars() {
  const enemyCar = new Car(false);
  enemyCars.push(enemyCar);
}

function draw() {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  canvas.style.backgroundColor = "grey";
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.lineWidth = 5;
  ctx.lineDashOffset = gameShifter;
  gameShifter -= 4;

  ctx.setLineDash([20, 40]);
  ctx.beginPath();
  ctx.moveTo(GAME_WIDTH / 3, 0);
  ctx.lineTo(GAME_WIDTH / 3, GAME_HEIGHT);
  ctx.stroke();

  ctx.setLineDash([20, 40]);
  ctx.beginPath();
  ctx.moveTo((GAME_WIDTH / 3) * 2, 0);
  ctx.lineTo((GAME_WIDTH / 3) * 2, GAME_HEIGHT);
  ctx.stroke();

  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  for (let i = 0; i < enemyCars.length; i++) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      enemyCars[i].x,
      enemyCars[i].y,
      enemyCars[i].width,
      enemyCars[i].height
    );
    if (score < 5) {
      enemyCars[i].y += 2;
    }
    if (score >= 5) {
      enemyCars[i].y += 4;
    }
    if (score >= 20) {
      enemyCars[i].y += 6;
    }
    if (score >= 30) {
      enemyCars[i].y += 8;
    }
    if (score >= 40) {
      enemyCars[i].y += 10;
    }
    if (score >= 50) {
      enemyCars[i].y += 12;
    }

    if (enemyCars[i].lane === player.lane) {
      if (player.checkCollision(enemyCars[i])) {
        score = 0;
        enemyCars = [];
        clearInterval(interval);
        window.cancelAnimationFrame(animation);
        startButton.style.display = "block";
        return;
      }
    }

    if (enemyCars[i].y > GAME_HEIGHT - 10) {
      enemyCars.splice(i, 1);
      score++;
      scoreCard.innerHTML = `Score: ${score}`;
    }
  }

  animation = window.requestAnimationFrame(draw);
}

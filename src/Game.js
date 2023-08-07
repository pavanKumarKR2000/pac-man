import TileMap from "./TileMap.js";

/**  constants */
const TILE_SIZE = 64;
const VELOCITY = 2;

const canvas = document.getElementById("gameCanvas");
const restartButton = document.getElementById("btn");

restartButton.addEventListener("click", () => window.location.reload());
const ctx = canvas.getContext("2d");
const tm = new TileMap(TILE_SIZE);
const pacman = tm.getPacman(VELOCITY);
const enemies = tm.getEnemies(VELOCITY);

let gameOver = false;
let gameWin = false;

const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

const gameLoop = () => {
  tm.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
};

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();

    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tm.didWin();

    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  let text;
  if (gameOver || gameWin) {
    text = gameOver ? "Game Over" : "You Win";

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 2.5, canvas.width, 80);

    ctx.font = "80px Wellfleet";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
}

tm.setCanvaSize(canvas);

setInterval(gameLoop, 1000 / 75);

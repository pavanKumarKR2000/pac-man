import TileMap from "./TileMap.js";

/**  constants */
const TILE_SIZE = 64;
const VELOCITY = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tm = new TileMap(TILE_SIZE);
const pacman = tm.getPacman(VELOCITY);

const gameLoop = () => {
  tm.draw(ctx);
  pacman.draw(ctx);
};

tm.setCanvaSize(canvas);

setInterval(gameLoop, 1000 / 75);

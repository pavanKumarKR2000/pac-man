import MovingDirection from "./MovingDirection.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tm) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tm = tm;
    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );
    this.directionTimerDefault = this.#random(1, 5);
    this.directionTimer = this.directionTimerDefault;

    this.#loadEnemyImages();
  }

  #random(min, max) {
    return min + Math.floor((max - min + 1) * Math.random());
  }

  draw(ctx, pause) {
    if (!pause) {
      this.#move(ctx);
      this.#changeDirection();
    }

    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #move(ctx) {
    if (
      !this.tm.didCollideWithEnvironment(this.x, this.y, this.movingDirection)
    ) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
      }
    }
  }

  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;

    if (this.directionTimer === 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (
      newMoveDirection !== null &&
      newMoveDirection !== this.movingDirection
    ) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tm.didCollideWithEnvironment(this.x, this.y, newMoveDirection)
        ) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  #loadEnemyImages() {
    this.normalGhost = new Image();
    this.normalGhost.src = "../images/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "../images/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "../images/scaredGhost2.png";

    this.image = this.normalGhost;
  }
}

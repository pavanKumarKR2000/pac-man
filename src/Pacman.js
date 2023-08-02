import MovingDirection from "./MovingDirection.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tm) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tm = tm;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    this.pacmanRotation = this.Rotation.right;

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  draw(ctx) {
    this.#move();
    this.#animate();
    this.#eatDot();

    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);

    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );

    ctx.restore();
  }

  #keydown = (e) => {
    if (e.keyCode === 38) {
      /** up */
      if (this.currentMovingDirection === MovingDirection.down) {
        this.currentMovingDirection = MovingDirection.up;
      }
      this.requestedMovingDirection = MovingDirection.up;
    } else if (e.keyCode === 40) {
      /** down */
      if (this.currentMovingDirection === MovingDirection.up) {
        this.currentMovingDirection = MovingDirection.down;
      }
      this.requestedMovingDirection = MovingDirection.down;
    } else if (e.keyCode === 37) {
      /** left */
      if (this.currentMovingDirection === MovingDirection.right) {
        this.currentMovingDirection = MovingDirection.left;
      }
      this.requestedMovingDirection = MovingDirection.left;
    } else if (e.keyCode === 39) {
      /** right */
      if (this.currentMovingDirection === MovingDirection.left) {
        this.currentMovingDirection = MovingDirection.right;
      }
      this.requestedMovingDirection = MovingDirection.right;
    }
  };

  #loadPacmanImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = "../images/pac0.png";

    const pacmanImage2 = new Image();
    pacmanImage2.src = "../images/pac1.png";

    const pacmanImage3 = new Image();
    pacmanImage3.src = "../images/pac2.png";

    const pacmanImage4 = new Image();
    pacmanImage4.src = "../images/pac1.png";

    this.pacmanImages = [
      pacmanImage1,
      pacmanImage2,
      pacmanImage3,
      pacmanImage4,
    ];

    this.pacmanImageIndex = 0;
  }

  #move() {
    //can only change direction when pacman is at the center of the cell
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tm.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        ) {
          this.currentMovingDirection = this.requestedMovingDirection;
        }
      }
    }

    if (
      this.tm.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 1;
      return;
    }

    if (
      this.currentMovingDirection !== null &&
      this.pacmanAnimationTimer === null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.pacmanRotation = this.Rotation.up;
        this.y -= this.velocity;
        break;
      case MovingDirection.down:
        this.pacmanRotation = this.Rotation.down;
        this.y += this.velocity;
        break;
      case MovingDirection.right:
        this.pacmanRotation = this.Rotation.right;
        this.x += this.velocity;
        break;
      case MovingDirection.left:
        this.pacmanRotation = this.Rotation.left;
        this.x -= this.velocity;
        break;
    }
  }

  #animate() {
    if (this.pacmanAnimationTimer === null) {
      return;
    }
    this.pacmanAnimationTimer--;
    if (this.pacmanAnimationTimer === 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex =
        (this.pacmanImageIndex + 1) % (this.pacmanImages.length - 1);
    }
  }

  #eatDot() {
    if (this.tm.eatDot(this.x, this.y)) {
      //play sound
    }
  }
}

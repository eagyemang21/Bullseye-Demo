let player;
let enemy;
function setup() {
  let canvas = createCanvas(500, 500);
  background(255, 0, 200);
  canvas.style("display", "block");
  canvas.center();

  class Player {
    constructor() {
      this.pos = createVector(width / 2, height / 1.1);
    }

    draw() {
      rect(this.pos.x, this.pos.y, 20, 20);
    }

    update() {
      let xSpeed = 0;
      let ySpeed = 0;
      if (keyIsDown(37)) {
        xSpeed = -4;
      }
      if (keyIsDown(39)) {
        xSpeed = 4;
      }
      if (keyIsDown(32)) {
        player.shoot();
      }
      this.pos.add(xSpeed, ySpeed);
    }
  }

  class Enemy {
    constructor() {
        this.pos = createVector(width / 2, height / 9);
    }
    draw() {
      rect(this.pos.x, this.pos.y, 40, 50);
    }
  }
  
  enemy = new Enemy()

  player = new Player();
}

function draw() {
  background(220);
  player.draw();
  enemy.draw();
  player.update();
}

document.body.addEventListener("keydown", function (event) {
  const key = event.key;
  switch (key) {
    case "ArrowLeft":
      str = "Left";
      break;
    case "ArrowRight":
      str = "Right";
      break;
  }
});

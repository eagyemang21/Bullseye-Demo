let player;
function setup() {
  let canvas = createCanvas(700, 700);
  background(255, 0, 200);
  canvas.style('display', 'block');
  canvas.center();
  
  class Player {
    constructor() {
      this.pos = createVector(width / 2, height / 2)
    }
  
    draw() {
      rect(this.pos.x, this.pos.y, 20, 20);
    }
    
    update() {
    let xSpeed = 0;
    let ySpeed = 0;
    if (keyIsDown(37)) {
      xSpeed = -2;
    }
    if (keyIsDown(39)) {
      xSpeed = 2;
    }
    if (keyIsDown(32)) {
      player.shoot();
    }
    this.pos.add(xSpeed, ySpeed);
  }
  }
  player = new Player();
}

function draw() {
  background(220);
  player.draw();
  player.update(); 
}
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

const enem1 = document.querySelector("#cpone");
const enem2 = document.querySelector("#cptwo");
const enem3 = document.querySelector("#cpthree");


enem1.addEventListener("click", () => {
  if (enem1.innerText > 0) {
    enem1.innerText -= 100;
  }
  enem1.style.backgroundColor = "red";
});

enem2.addEventListener("click", () => {
  if (enem2.innerText > 0) {
    enem2.innerText -= 100;
  }
  }
  player = new Player();
}

function draw() {
  background(220);
  player.draw();
  player.update(); 
}

    document.body.addEventListener('keydown', function(event){
    const key = event.key;
    switch (key) {
        case "ArrowLeft":
        str = 'Left';
        break;
        case "ArrowRight":
        str = 'Right';
        break;
    }
});


const result = hitCounter =>{
    if(enem1.innerText === 0 || enem1.innerText === 0 || enem3.innerText === 0){
        return "Game Over"
    }
    //implement the button here for restart and refresh the game
};


//health counter obj 
//the value is the number of shots the computer hits on you 
//afterwards, we make it to where they 
//health counter key 

//let healthPlayer1 /*(could be for player 1)*/ = {100}
//let healthComputer /*(would be for computer obj)*/ = {100}

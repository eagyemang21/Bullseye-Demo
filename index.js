
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
  enem2.style.backgroundColor = "red";
});

enem3.addEventListener("click", () => {
  if (enem3.innerText > 0) {
    enem3.innerText -= 100;
  }
  enem3.style.backgroundColor = "red";
});

let el_up = document.getElementById("GFG_UP");
let el_down = document.getElementById("GFG_DOWN");
let str = 'No key pressed';
  
function gfg_Run() {
    el_down.innerHTML = str;
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

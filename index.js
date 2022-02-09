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

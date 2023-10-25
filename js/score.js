//variables DOM
const score_container = document.getElementById('score');

//variables js
let score = 0;

function addScore(quantity){
    score += quantity;
    updateScore();
  }
  function resetScore(){
    score = 0;
    updateScore();
  }
  function updateScore(){
    score_container.textContent = score;
  }
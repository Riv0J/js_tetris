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
    const current_score = score;
    score_container.textContent = score;
  }
function calculateScore(lines_completed){
  let score_gained = SCORE_PER_LINE*lines_completed + (Math.pow(2, lines_completed)); //esto siempre da al menos 1, aunque lines_completed es 0
  return score_gained;
}
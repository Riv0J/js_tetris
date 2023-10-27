//variables DOM
const main_button = document.getElementById('main_button');
const watermark_container = document.getElementById('watermark');

const CLASS_START_BUTTON= 'start_button';
const CLASS_PAUSE_BUTTON= 'pause_button';
const CLASS_RESUME_BUTTON= 'resume_button';
const CLASS_RESTART_BUTTON= 'restart_button';

//variables js
const TICK_MS = 700;
const TICK_MS_MOVE_SIDES = 150;

let FREEZE_TIME_MS = TICK_MS/2;
let GAME_RESET_TIME_MS = 1000;

const GAME_STATE_NONE = 0;
const GAME_STATE_RUNNING = 1;
const GAME_STATE_PAUSED = 2;
const GAME_STATE_OVER = 3;

const SCORE_PER_LINE = 10;
const SCORE_PER_FREEZE = 1;

let current_game_state = GAME_STATE_NONE;
async function menu_button(button){
  switch (current_game_state) {
      case GAME_STATE_NONE:
          await start_game();
          break;
      case GAME_STATE_RUNNING:
          pause_game();
          break;
      case GAME_STATE_PAUSED:
          await resume_game();
          break;
      case GAME_STATE_OVER:
          await reset_game();
          await start_game();
          break;
      default:
          break;
  }
}
function change_game_state(new_state){
  switch (new_state) {
      case GAME_STATE_RUNNING:
          break;
      default:
          break;
  }
  current_game_state = new_state;
}

let currentPosition = 4
let currentRotation = 0

//randomly select a Tetromino and its first rotation
let random_number = Math.floor(Math.random()*theTetrominoes.length)
let current_tetromino = theTetrominoes[random_number][currentRotation]
let current_color = tetris_colors[random_number];

let nextRandom = 0;
let steps_this_tetromino = 0;
let timerId; 

//variables de presionar botones
let hold_move_down = false;
let moving_sides_loop = false;
let moving_left = false;
let moving_right = false;
let checking_lines = false;

let can_move_sides = true;

//core functions 
function draw() {
    current_tetromino.forEach(index => {
        grid_squares[currentPosition + index].classList.add('tetromino')
        grid_squares[currentPosition + index].style.backgroundColor = current_color;
    })
}
function undraw() {
    current_tetromino.forEach(index => {
        grid_squares[currentPosition + index].classList.remove('tetromino')
        grid_squares[currentPosition + index].style.backgroundColor = ''
    })
}
async function moveDown() {
    if(current_game_state != GAME_STATE_RUNNING || checking_lines === true){
        return;
    }
    undraw()
    currentPosition += width
    draw()

    //can current tetromino move down next run???
    const can_move_down = canMoveDown();
    if(can_move_down === false){
      freezeTetromino();
      //cant move down, check if lines have been completed
      const square_elements_current_tetromino = await getCurrentTetrominoSquares();
      checking_lines = true;
      const lines_completed = await checkLines();
      checking_lines = false;
      let score_gained = calculateScore(lines_completed);
      /*console.log('lines completed = '+lines_completed);
      console.log('score gained = '+score_gained);*/
      addScore(score_gained);
      if(steps_this_tetromino == 0){
        game_over();
        return;
      } else{
        await sleep(FREEZE_TIME_MS);
        steps_this_tetromino = 0;
        await newTetromino();
      }
    } else if(can_move_down == true){
      steps_this_tetromino +=1;
      await moveDownSleep();
    }
    await moveDown();
}
function canMoveDown(){
  //este bucle es un guardia de si el tetromino ha llegado al final
  for (let index of current_tetromino) {
    if (!grid_squares[currentPosition + index + width]) {
      return false;
    }
  }
  //si alguno de la posicion futura del tetromino tiene la clase 'taken' entonces ya hay otro tetromino blockeando el paso
  if(current_tetromino.some(index => grid_squares[currentPosition + index + width].classList.contains('taken'))){
    return false;
  }
  return true;
}
function freezeTetromino(){
  current_tetromino.forEach(index => grid_squares[currentPosition + index].classList.add('taken'));
}
async function newTetromino(){
  //set a new current tetromino
  
  //start a new tetromino falling
  nextRandom = Math.floor(Math.random() * theTetrominoes.length)

  random_number = nextRandom
  current_tetromino = theTetrominoes[random_number][currentRotation]
  current_color = tetris_colors[random_number]
  currentPosition = 4
  can_move_sides = true;
  draw()
  //displayShape()
}
  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    if(can_move_sides === false){
      return;
    }
    undraw()
    const isAtLeftEdge = current_tetromino.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current_tetromino.some(index => grid_squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }
  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    if(can_move_sides === false){
      return;
    }
    undraw()
    const isAtRightEdge = current_tetromino.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current_tetromino.some(index => grid_squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }
  async function moveSidesHold(){
    console.log('move side hold')
    if(moving_sides_loop === true){
      console.log('cannot create duplicate of holding sides')
      return;
    }
    moving_sides_loop = true;
    while(moving_right === true || moving_left === true){
      console.log('loopin')
      if(moving_right == true){
        moveRight();
      } else if(moving_left == true){
        moveLeft();
      }
      await moveSidesSleep();
    }
    moving_sides_loop = false;
  }
  ///FIX ROTATION OF TETROMINOS A THE EDGE 
  function isAtRight() {
    return current_tetromino.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  function isAtLeft() {
    return current_tetromino.some(index=> (currentPosition + index) % width === 0)
  }
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
function rotate() {
  const can_rotate = canRotate();
  if(can_rotate == false){
    return;
  }
  undraw()
  currentRotation ++
  //if the current rotation gets to 4, make it go back to 0
  if(currentRotation === current_tetromino.length) { 
    currentRotation = 0
  }
  current_tetromino = theTetrominoes[random_number][currentRotation]
  //si esto se desactiva, pasan cosas raras de portaless
  checkRotatedPosition()
  draw()
}
function canRotate(){
  return true;
}
function pause_game(){
  main_button.classList.remove(CLASS_PAUSE_BUTTON);
  main_button.classList.add(CLASS_RESUME_BUTTON);
  main_button.textContent = 'Resume';
  gray_grid();
  pauseTimer();
  change_game_state(GAME_STATE_PAUSED);
}
async function resume_game(){
  main_button.classList.remove(CLASS_RESUME_BUTTON);
  main_button.classList.add(CLASS_PAUSE_BUTTON);
  main_button.textContent = 'Pause';
  gray_grid();
  resumeTimer();
  change_game_state(GAME_STATE_RUNNING);
  await moveDown();
}
async function start_game(){
  main_button.classList.remove(CLASS_START_BUTTON);
  main_button.classList.add(CLASS_PAUSE_BUTTON);
  main_button.textContent = 'Pause';
  watermark_container.style.display = 'flex';
  change_game_state(GAME_STATE_RUNNING);

  startTimer();
  await moveDown();
}
async function reset_game(){
  gray_grid();
  resetTimer();
  resetLines();
  resetScore();
  await resetSquares();
  grid_blink();
  await sleep(GAME_RESET_TIME_MS);
}
function game_over(){
  clearInterval(timerId)
  timerId = null
  main_button.classList.remove(CLASS_PAUSE_BUTTON);
  main_button.classList.add(CLASS_RESUME_BUTTON);
  main_button.textContent = 'Restart';
  gray_grid();
  //run
  stopTimer();
  change_game_state(GAME_STATE_OVER);
  console.log('GAME OVER!');
}
function refresh_grid_squares(){
  const node_list = grid.querySelectorAll('.square');
  grid_squares = [];
  node_list.forEach(element =>{
    grid_squares.push(element);
  });
  console.log(grid_squares.length+', TOTAL SQUARES IN GRID_SQUARES');
}
function gray_grid(){
  const is_screen_gray = grid.classList.contains('grayed_out');
  if(is_screen_gray == true){
    grid.classList.remove('grayed_out');
  } else{
    grid.classList.add('grayed_out');
  }
}
//smart sleeps
async function moveDownSleep(){
  const loops = 32;
  for(i = 0; i < loops; i++){
    await sleep(TICK_MS/loops);
    if(hold_move_down === true){
      break;
    }
  }
}
async function moveSidesSleep(){
  const loops = 6;
  for(i = 0; i < loops; i++){
    await sleep(TICK_MS_MOVE_SIDES/loops);
    if(moving_left === false && moving_right === false){
      break;
    }
  }
}
async function drawProjection(){

}

async function getCurrentTetrominoSquares(){
  const squares = [];
  current_tetromino.forEach(index => {
    const square = grid_squares[currentPosition + index];
    squares.push(square);
  });
  return squares;
}
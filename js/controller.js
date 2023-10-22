const GAME_STATE_NONE = 0;
const GAME_STATE_RUNNING = 1;
const GAME_STATE_PAUSED = 2;

const CLASS_START_BUTTON= 'start_button';
const CLASS_PAUSE_BUTTON= 'pause_button';
const CLASS_RESUME_BUTTON= 'resume_button';

let current_game_state = GAME_STATE_NONE;

const main_button = document.getElementById('main_button');
const watermark_container = document.getElementById('watermark');
const score_container = document.getElementById('score');

function menu_button(button){
    switch (current_game_state) {
        case GAME_STATE_NONE:
            main_button.classList.remove(CLASS_START_BUTTON);
            main_button.classList.add(CLASS_PAUSE_BUTTON);
            main_button.textContent = 'Pause';
            watermark_container.style.display = 'flex';
            //start
            change_game_state(GAME_STATE_RUNNING);
            start_game();
            break;
        case GAME_STATE_RUNNING:
            pause_game();
            break;
        case GAME_STATE_PAUSED:
            resume_game();
            break;
        default:
            break;
    }
}
function change_game_state(new_state){
    switch (new_state) {
        case GAME_STATE_RUNNING:
            grid_squares.forEach(element => {
                element.classList.remove('blinking');
            })
            break;
    
        default:
            break;
    }
    current_game_state = new_state;
}
const tetris_colors = [
  '#FF4136',
  '#2ECC40',
  '#0074D9',
  '#FFDC00',
  '#FF851B',
  '#7FDBFF',
  '#B10DC9',
];
const width= 10;

//The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

//randomly select a Tetromino and its first rotation
let random_number = Math.floor(Math.random()*theTetrominoes.length)
let current_tetromino = theTetrominoes[random_number][currentRotation]
let current_color = tetris_colors[random_number];

let nextRandom = 0;
let score = 0;
let time_seconds = 0;
let time_this_tetromino = 0;
let timerId; 

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
function moveDown() {
    if(current_game_state === GAME_STATE_PAUSED){
        return;
    }
    undraw()
    currentPosition += width
    draw()
    freeze()
}

function freeze() {
  let blocked = false;
  current_tetromino.forEach(index =>{
    if(!grid_squares[currentPosition + index + width]){
      console.log('END');
      blocked = true;
    }
  });
  if(blocked == false && current_tetromino.some(index => grid_squares[currentPosition + index + width].classList.contains('taken'))) {
    blocked = true;
  }
  if(blocked == true){
    current_tetromino.forEach(index => grid_squares[currentPosition + index].classList.add('taken'))
    //start a new tetromino falling
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)

    random_number = nextRandom
    current_tetromino = theTetrominoes[random_number][currentRotation]
    current_color = tetris_colors[random_number]
    currentPosition = 4
    draw()
    //displayShape()
    
    const lines_completed = lines_checks();
    let score_gained = 10*lines_completed;
    add_score(score_gained);
    //gameOver()
  }
}
  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
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
    undraw()
    const isAtRightEdge = current_tetromino.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current_tetromino.some(index => grid_squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
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
    undraw()
    currentRotation ++
    console.log('rotate_attaempt current rotation = ',currentRotation)
    if(currentRotation === current_tetromino.length) { //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current_tetromino = theTetrominoes[random_number][currentRotation]
    checkRotatedPosition()
    draw()
  }
  
function start_game(){
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        //displayShape()
    }
}
function add_score(quantity){
  if(!quantity){
    quantity = 1;
  }
  score += quantity;
  score_container.textContent = score;
}
function action(action){
    if(current_game_state === GAME_STATE_PAUSED){
        return;
    }
    switch (action) {
        case 'moveLeft':
            moveLeft();
            break;
        case 'moveRight':
            moveRight();
            break;
        case 'moveDown':
            moveDown();
            break;
        case 'rotate':
            rotate();
            break;
        default:
            break;
    }
}
//assign functions to keyCodes
function control(e) {
    if(e.keyCode === 37) {
        action('moveLeft')
    } else if (e.keyCode === 38) {
        action('rotate')
    } else if (e.keyCode === 39) {
        action('moveRight')
    } else if (e.keyCode === 40) {
        action('moveDown')
    }
}
document.addEventListener('keyup', control)


function pause_game(){
  main_button.classList.remove(CLASS_PAUSE_BUTTON);
  main_button.classList.add(CLASS_RESUME_BUTTON);
  main_button.textContent = 'Resume';
  grid.classList.add('paused');
  //pause
  change_game_state(GAME_STATE_PAUSED);
}

function resume_game(){
  main_button.classList.remove(CLASS_RESUME_BUTTON);
  main_button.classList.add(CLASS_PAUSE_BUTTON);
  main_button.textContent = 'Pause';
  grid.classList.remove('paused');
  //run
  change_game_state(GAME_STATE_RUNNING);
}

function lines_checks(){
  const total_squares_number = grid_squares.length;
  let lines_completed = 0;
  let squares_to_delete = [];
  for (let i = 0; i < total_squares_number; i += 10) {
    const groupOfTen = grid_squares.slice(i, i + 10);
    const allTaken = groupOfTen.every(square => square.classList.contains('taken'));
    if(allTaken == true){
      lines_completed+=1;
      groupOfTen.forEach(sq => {
        squares_to_delete.push(sq);
      })
    }
  }
  /*let squares_to_replenish = squares_to_delete.length;
    squares_to_delete.forEach(sq => {
      sq.classList.add('blink');
  });*/
  
  squares_to_delete.forEach(sq => {
      grid.removeChild(sq);
  });

  for (let index = 0; index < squares_to_replenish; index++) {
    const square = document.createElement('div');
    square.style.width = '10%';
    square.style.aspectRatio = 1;
    
    grid.insertBefore(square,grid.firstChild);
    grid_squares.push(square);
    square.className = 'square';
  }
  console.log(grid_squares.length);
  return lines_completed;
}

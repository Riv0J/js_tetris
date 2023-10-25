const grid = document.getElementById('grid');
const game_container = document.getElementById('game_container');
const aside = document.getElementById('aside')
let grid_squares = [];

const GRID_WIDTH = 10;
const GRID_HEIGHT = 16;

const ASIDE_CONTAINER_WIDTH = Math.floor(GRID_WIDTH / 2);

const TOTAL_SQUARES = GRID_WIDTH*GRID_HEIGHT;
const TOTAL_GAME_WIDTH = GRID_WIDTH + ASIDE_CONTAINER_WIDTH;

async function init(){
    resizeGrid();
    resetSquares();
}
document.addEventListener("DOMContentLoaded", function () {
    init();
});

function resizeGrid(){
    //set the dimensions of game_container, 
    const dimensions = getOptimalDimensions();
    //game container
    game_container.style.width = dimensions['width']+'px';
    game_container.style.height = dimensions['height']+'px';

    //grid
    grid.style.width = GRID_WIDTH / TOTAL_GAME_WIDTH * 100 + '%';
    grid.style.height = '100%';

    //aside
    aside.style.width = ASIDE_CONTAINER_WIDTH / TOTAL_GAME_WIDTH * 100 + '%' ;
    aside.style.height = '100%';
    console.log(dimensions);
}
window.addEventListener('resize', resizeGrid);

function getOptimalDimensions() {
    // Get the width and height of the user's browser window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight - document.getElementById('header').clientHeight;

    // Determine the dimensions
    let dimensions;
    if(windowWidth < windowHeight){
        console.log('width smaller');
        dimensions = {
            width: windowWidth,
            height: (windowWidth * GRID_HEIGHT) / TOTAL_GAME_WIDTH,
        };
    } else{
        console.log('height smaller');
        dimensions = {
            width: (windowHeight * TOTAL_GAME_WIDTH) / GRID_HEIGHT,
            height: windowHeight,
        };
    }
    // Reduce the dimensions to the nearest multiple of 10
    dimensions.width = Math.floor(dimensions.width / 10) * 10;
    dimensions.height = Math.floor(dimensions.height / 10) * 10;
    return dimensions;
}
function resetSquares() {
    const get_squares = grid.querySelectorAll('.square');
    get_squares.forEach((square) => {
        grid.removeChild(square);
    });

    grid_squares = [];
    for (let index = 0; index < TOTAL_SQUARES; index++) {
        const square = newSquare();
        grid.appendChild(square);
        grid_squares.push(square);
    }
}
function newSquare(){
    const square = document.createElement('div');
    square.style.width = '10%';
    square.style.aspectRatio = 1;
    square.className = 'square';
    return square;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function grid_blink(){
    grid_squares.forEach((square) => {
        square.classList.add('blink');
    });
    remove_grid_blink();
}
function remove_grid_blink(){
    setTimeout(() => {
        grid_squares.forEach((square) => {
            square.classList.remove('blink');
        });
    }, 2000)
}
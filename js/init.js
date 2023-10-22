const nav = document.getElementsByTagName('nav')[0];
const grid = document.getElementById('grid');
let grid_squares = [];

const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;
const total_blocks = GRID_WIDTH*GRID_HEIGHT;

function init(){
    resizeGrid();
    add_squares(total_blocks);
}
document.addEventListener("DOMContentLoaded", function () {
    init();
    console.log('Loaded init.js');
});

function resizeGrid(){
    const dimensions = getOptimalDimensions();
    grid.style.width = dimensions['width']+'px';
    grid.style.height = dimensions['height']+'px';
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
            height: (windowWidth * GRID_HEIGHT) / GRID_WIDTH,
        };
    } else{
        console.log('height smaller');
        dimensions = {
            width: (windowHeight * GRID_WIDTH) / GRID_HEIGHT,
            height: windowHeight,
        };
    }
    // Reduce the dimensions to the nearest multiple of 10
    dimensions.width = Math.floor(dimensions.width / 10) * 10;
    dimensions.height = Math.floor(dimensions.height / 10) * 10;

    return dimensions;
}
function add_squares(quantity){
    for (let index = 0; index < quantity; index++) {
        const square = document.createElement('div');
        square.style.width = '10%';
        square.style.aspectRatio = 1;

        grid.appendChild(square);
        grid_squares.push(square);
        square.className = 'square';

        /*setTimeout(function() {
            square.classList.add('blinking');
        }, 20*index);*/
    }
}

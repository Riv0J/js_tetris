//variables DOM
const lines_container = document.getElementById('lines');

//variables js
let total_lines = 0;

async function checkLines(){
    line_checking = true;
    const total_squares_number = grid_squares.length;
    let lines_completed = 0;
    let square_counter = 0;
    let squares_to_delete = [];
    //un bucle que va de 10 en 10
    for (let i = 0; i < total_squares_number; i += 10) {
      const groupOfTen = grid_squares.slice(i, i + 10);
      //all taken es true cuando todos los squares cumple condicion
      const allTaken = groupOfTen.every(square => square.classList.contains('taken'));
      if(allTaken == true){
        lines_completed+=1;
        for (let index = 0; index < groupOfTen.length; index++) {
          //guardar en el mapa, el sq html y su indice en el codigo
          const square = groupOfTen[index];
          square.style.border='0.35rem solid black';
          squares_to_delete[square_counter] = square;
          square_counter+=1;
        }
      }
    }
    let squares_to_replenish = squares_to_delete.length;
  
    for (let index = 0; index < squares_to_delete.length; index++) {
      const square = squares_to_delete[index];
      grid.removeChild(square)
    }
  
    //restablecer grid_squares
    for (let index = 0; index < squares_to_replenish; index++) {
      const square = newSquare();
      grid.insertBefore(square,grid.firstChild);
      grid_squares.unshift(square);
      square.className = 'square';
    }
    refresh_grid_squares();
    //console.log(grid_squares.length);
    console.log(lines_completed+', TOTAL LINES JUST COMPLETED');
    total_lines += lines_completed;
    updateLines();
    return lines_completed;
  }

  function updateLines(){
    lines_container.textContent = total_lines;
  }
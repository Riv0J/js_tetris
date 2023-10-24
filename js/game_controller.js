
function action(action){
    //si el game_state es diferente de running, no se hace nada
    if(current_game_state != GAME_STATE_RUNNING){
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
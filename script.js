const BOARD_ELEMENT = document.getElementById("board_container");

const TILE_SIZE = 50;
const TILE_GAP = 10;

const BOARD_SIZE = TILE_SIZE * 8 + TILE_GAP * 7;
BOARD_ELEMENT.style.height = BOARD_SIZE + "px";
BOARD_ELEMENT.style.width = BOARD_SIZE + "px";

/*
function () {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let newSquare = document.createElement("div");
      newSquare.classList.add("tile");
      BOARD_ELEMENT.appendChild(newSquare);
    }
  }
}
*/

function makeEmptyBoard() {
  let resultingBoard = [];
  for (let r = 0; r < 8; r++) {
    let col = [];
    for (let c = 0; c < 8; c++) {
      col.push(" ");
    }
    resultingBoard.push(col);
  }
  return resultingBoard;
}

function setUpBoard() {
  let resultingBoard = makeEmptyBoard();
  for (let c = 0; c < 8; c++) {
    resultingBoard[1][c] = "p";
    resultingBoard[6][c] = "p";
  }
  for (let x of [0, 7]) {
    resultingBoard[x][0] = "r";
    resultingBoard[x][7] = "r";
    resultingBoard[x][1] = "n";
    resultingBoard[x][6] = "n";
    resultingBoard[x][2] = "b";
    resultingBoard[x][5] = "b";
  }
  resultingBoard[0][4] = "q";
  resultingBoard[0][3] = "k";
  resultingBoard[7][3] = "q";
  resultingBoard[7][4] = "k";

  return resultingBoard;
}

board = setUpBoard();

console.log(board);

//TODO: everything :(

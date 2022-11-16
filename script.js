const BOARD_ELEMENT = document.getElementById("board_container");

const TILE_SIZE = 50;
const TILE_GAP = 10;

const BOARD_SIZE = TILE_SIZE * 8 + TILE_GAP * 7;
BOARD_ELEMENT.style.height = BOARD_SIZE + "px";
BOARD_ELEMENT.style.width = BOARD_SIZE + "px";

let board = [];

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

function drawStartPieces(board) {}

function setUpBoard() {
  board = makeEmptyBoard();
  for (let c = 0; c < 8; c++) {
    board[1][c] = "p";
    board[6][c] = "p";
  }
  for (let x of [0, 7]) {
    board[x][0] = "r";
    board[x][7] = "r";
    board[x][1] = "n";
    board[x][6] = "n";
    board[x][2] = "b";
    board[x][5] = "b";
  }
  board[0][4] = "q";
  board[0][3] = "k";
  board[7][3] = "q";
  board[7][4] = "k";

  drawStartPieces(board);
}

setUpBoard();

console.log(board);

function checkLegalMove(move) {}

function makeMove(move) {
  if (checkLegalMove(move)) {
  } else {
    //do stuff
    animateMove(move);
  }
}

function animateMove(move) {}

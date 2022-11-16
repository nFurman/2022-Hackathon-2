const BOARD_ELEMENT = document.getElementById("board_container");

const TILE_SIZE = 50;
const TILE_GAP = 0;

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
      col.push(["empty"]);
    }
    resultingBoard.push(col);
  }
  return resultingBoard;
}

function drawPiece(color, piece, row, col) {
  console.log(
    "trying to draw a " + color + " " + piece + " at " + row + " " + col
  );
  let pieceImage = document.createElement("img");
  pieceImage.src = color === "white" ? whitePieces[piece] : blackPieces[piece];
  pieceImage.className = "piece";
  pieceImage.width = TILE_SIZE;
  pieceImage.height = TILE_SIZE;
  pieceImage.style.left = TILE_SIZE * col + TILE_GAP * col + "px";
  pieceImage.style.top = TILE_SIZE * row + TILE_GAP * row + "px";

  BOARD_ELEMENT.appendChild(pieceImage);
}

function drawStartPieces(board) {
  for (r in board) {
    for (c in board[r]) {
      let piece = board[r][c]; //either ["empty"] or ["color", "piece"]
      if (board[r][c] != "empty") {
        drawPiece(board[r][c][0], board[r][c][1], r, c);
      }
    }
  }
}

function setUpBoard() {
  board = makeEmptyBoard();
  for (let c = 0; c < 8; c++) {
    board[1][c] = ["black", "p"];
    board[6][c] = ["white", "p"];
  }

  board[0][0] = ["black", "r"];
  board[0][7] = ["black", "r"];
  board[0][1] = ["black", "n"];
  board[0][6] = ["black", "n"];
  board[0][2] = ["black", "b"];
  board[0][5] = ["black", "b"];

  board[7][0] = ["white", "r"];
  board[7][7] = ["white", "r"];
  board[7][1] = ["white", "n"];
  board[7][6] = ["white", "n"];
  board[7][2] = ["white", "b"];
  board[7][5] = ["white", "b"];

  board[0][4] = ["black", "q"];
  board[0][3] = ["black", "k"];
  board[7][3] = ["white", "q"];
  board[7][4] = ["white", "k"];

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

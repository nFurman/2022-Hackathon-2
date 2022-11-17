//import $ from "jquery";

const BOARD_ELEMENT = document.getElementById("board_container");

const TILE_SIZE = 50;

const BOARD_SIZE = TILE_SIZE * 8;
BOARD_ELEMENT.style.height = BOARD_SIZE + "px";
BOARD_ELEMENT.style.width = BOARD_SIZE + "px";

let board = [];
let turn = 0;

let playerPerspectiveIsWhite = true;

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
  row = +row;
  col = +col;
  //console.log( "trying to draw a " + color + " " + piece + " at " + row + " " + col);
  let pieceImage = document.createElement("img");
  pieceImage.src = color === "white" ? whitePieces[piece] : blackPieces[piece];
  pieceImage.className = "piece";
  pieceImage.id = row.toString() + col.toString();
  pieceImage.draggable = true;
  pieceImage.width = TILE_SIZE;
  pieceImage.height = TILE_SIZE;
  if (playerPerspectiveIsWhite) {
    pieceImage.style.left = TILE_SIZE * col + "px";
    pieceImage.style.top = BOARD_SIZE - TILE_SIZE * (row + 1) + "px";
  } else {
    pieceImage.style.left = BOARD_SIZE - TILE_SIZE * (col + 1) + "px";
    pieceImage.style.top = TILE_SIZE * row * row + "px";
  }

  BOARD_ELEMENT.appendChild(pieceImage);
}

function drawStartPieces(board) {
  for (let r in board) {
    for (let c in board[r]) {
      r = +r;
      c = +c;
      let piece = board[r][c]; //either ["empty"] or ["color", "piece"]
      if (piece != "empty") {
        drawPiece(piece[0], piece[1], r, c);
      }
    }
  }
}

function setUpBoard() {
  board = makeEmptyBoard();
  for (let c = 0; c < 8; c++) {
    board[6][c] = ["black", "p"];
    board[1][c] = ["white", "p"];
  }

  board[7][0] = ["black", "r"];
  board[7][7] = ["black", "r"];
  board[7][1] = ["black", "n"];
  board[7][6] = ["black", "n"];
  board[7][2] = ["black", "b"];
  board[7][5] = ["black", "b"];

  board[0][0] = ["white", "r"];
  board[0][7] = ["white", "r"];
  board[0][1] = ["white", "n"];
  board[0][6] = ["white", "n"];
  board[0][2] = ["white", "b"];
  board[0][5] = ["white", "b"];

  board[7][4] = ["black", "q"];
  board[7][3] = ["black", "k"];
  board[0][3] = ["white", "q"];
  board[0][4] = ["white", "k"];

  drawStartPieces(board);
}

setUpBoard();

//console.log(board);

function checkLegalMove(move) {
  if (checkCastleAttempt(move)) {
    //do stuff
    return;
  }
  let endSquare = board[move.endRow][move.endCol];
  if (endSquare === "empty") {
    if (canReach(move)) {
      return true;
    } else {
      return false;
    }
  }

  if (move.side != endSquare[0]) {
    //0th index corresponds to color of piece on square
    if (canReach(move)) {
      return true;
    } else {
      return false;
    }
  }

  return false;
}

//checks if the move is valid (doesnt go through other pieces)
function canReach(move) {
  let { side, piece, startRow, startCol, endRow, endCol } = move;
  let endSquare = board[endRow][endCol];
  switch (piece) {
    case "p":
      switch (side) {
        case "white":
          if (
            endCol === startCol &&
            endRow - startRow === 2 &&
            board[endRow][endCol] === "empty" &&
            board[endRow - 1][endCol] === "empty"
          ) {
            return true;
          }
          if (
            endCol === startCol &&
            endRow - startRow === 1 &&
            endSquare === "empty"
          ) {
            return true;
          }
          if (
            Math.abs(endCol - startCol) === 1 &&
            endRow - startRow === 1 &&
            endSquare != "empty"
          ) {
            return true;
          }
          break;
        case "black":
          if (
            endCol === startCol &&
            endRow - startRow === -2 &&
            board[endRow][endCol] === "empty" &&
            board[endRow + 1][endCol] === "empty"
          ) {
            return true;
          }
          if (
            endCol === startCol &&
            endRow - startRow === -1 &&
            endSquare === "empty"
          ) {
            return true;
          }
          if (
            Math.abs(endCol - startCol) === 1 &&
            endRow - startRow === -1 &&
            endSquare != "empty"
          ) {
            return true;
          }
          break;
      }
      return false;
    case "r":
      if (startRow != endRow && startCol != endCol) {
        return false;
      }
      if (startCol === endCol) {
        for (let r = startRow + 1; r < endRow; r++) {
          if (board[r][startCol] != "empty") return false;
        }
        return true;
      }
      if (startRow === endRow) {
        for (let c = startCol + 1; c < endCol; c++) {
          if (board[startRow][c] != "empty") return false;
        }
        return true;
      }
      console.log("panic!");
    case "b":
      if (Math.abs(endRow - startRow) != Math.abs(endCol - startCol)) {
        return false;
      }
      if (endRow - startRow === endCol - startCol) {
        //anti diagonal case
        if (endRow - startRow > 0) {
          //going to the topright
          for (let i = 1; i < endRow - startRow; i++) {
            if (board[startRow + i][startCol + i] != "empty") return false;
          }
          return true;
        } else {
          //going to the bottomleft
          for (let i = -1; i > endRow - startRow; i--) {
            if (board[startRow + i][startCol + i] != "empty") return false;
          }
          return true;
        }
      }
      if (endRow - startRow === -1 * (endCol - startCol)) {
        //diagonal case
        if (endRow - startRow > 0) {
          //going to the bottomright
          for (let i = 1; i < endRow - startRow; i++) {
            if (board[startRow + i][startCol - i] != "empty") return false;
          }
          return true;
        } else {
          //going to the topleft
          for (let i = -1; i > endRow - startRow; i--) {
            if (board[startRow + i][startCol - i] != "empty") return false;
          }
          return true;
        }
      }
      console.log("panic!");
    case "q":
      if (startRow === endRow || startCol === endCol) {
        //rook movement

        if (startCol === endCol) {
          for (let r = startRow + 1; r < endRow; r++) {
            if (board[r][startCol] != "empty") return false;
          }
          return true;
        }
        if (startRow === endRow) {
          for (let c = startCol + 1; c < endCol; c++) {
            if (board[startRow][c] != "empty") return false;
          }
          return true;
        }
        console.log("panic!");
      } else if (Math.abs(endRow - startRow) === Math.abs(endCol - startCol)) {
        //bishop movement
        if (endRow - startRow === endCol - startCol) {
          //anti diagonal case
          if (endRow - startRow > 0) {
            //going to the topright
            for (let i = 1; i < endRow - startRow; i++) {
              if (board[startRow + i][startCol + i] != "empty") return false;
            }
            return true;
          } else {
            //going to the bottomleft
            for (let i = -1; i > endRow - startRow; i--) {
              if (board[startRow + i][startCol + i] != "empty") return false;
            }
            return true;
          }
        }
      } else {
        return false;
      }
      console.log("panic!");
    case "n":
      if (
        (Math.abs(endRow - startRow) == 2 &&
          Math.abs(endCol - startCol) == 1) ||
        (Math.abs(endRow - startRow) == 1 && Math.abs(endCol - startCol) == 2)
      ) {
        return true;
      } else {
        return false;
      }
      console.log("panic!");
    case "k":
      if (Math.abs(endRow - startRow) > 1 || Math.abs(endCol - startCol) > 1) {
        return false;
      }
      return true;
  }
}

function checkCastleAttempt(move) {
  if (
    board[move.startRow][move.startCol][0] === "k" &&
    board[move.startRow][move.startCol][2] === "true"
  ) {
    return true;
  } else {
    return false;
  }
}

function makeMove(move) {
  if (checkLegalMove(move)) {
    //updates the board array
    board[move.endRow][move.endCol] = JSON.parse(
      JSON.stringify(board[move.startRow][move.startCol])
    );
    board[move.startRow][move.startCol] = "empty";

    //updates the html pieces
    let movingPiece = document.getElementById(
      move.startRow.toString() + move.startCol.toString()
    );

    if (playerPerspectiveIsWhite) {
      movingPiece.style.left = TILE_SIZE * move.endCol + "px";
      movingPiece.style.top = BOARD_SIZE - TILE_SIZE * (move.endRow + 1) + "px";
    } else {
      movingPiece.style.left =
        BOARD_SIZE - TILE_SIZE * (move.endCol + 1) + "px";
      movingPiece.style.top = TILE_SIZE * move.endRow + +"px";
    }
    movingPiece.id = move.endRow.toString() + move.endCol.toString();

    //prevents king from castling
    if (board[move.endRow][move.endCol][1] === ["k"]) {
      board[move.endRow][move.endCol][2] = false;
      //the 2nd index of the tile correlates to the kings ability to castle
    }

    turn++;
    animateMove(move);
  } else {
    //do stuff
  }
}

function animateMove(move) {}

let testMove = new Move("white", "n", 0, 6, 2, 5);

console.log(board[2][5]);

makeMove(testMove);

console.log(board[2][5]);

document.querySelectorAll(".piece").forEach((piece) => {
  piece.addEventListener("dragend", () => {
    dragging(piece);
  });
});

function dragging(piece) {
  //is called whenever a piece is dropped down
  console.log("cum");
}

const BOARD_ELEMENT = document.getElementById("board_container");

const TILE_SIZE = 70;

const BOARD_SIZE = TILE_SIZE * 8;
BOARD_ELEMENT.style.height = BOARD_SIZE + "px";
BOARD_ELEMENT.style.width = BOARD_SIZE + "px";

let realBoard = [];
let hypotheticalBoard = [];
let turn = 0;

let playerPerspectiveIsWhite = true;

const availableMoves = {
  white: {},
  black: {},
};

function makeGrid() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let newSquare = document.createElement("div");
      newSquare.classList.add("tile");
      newSquare.width = TILE_SIZE;
      newSquare.height = TILE_SIZE;

      if (playerPerspectiveIsWhite) {
        newSquare.dataset.row = 7 - row;
        newSquare.dataset.col = col;
      } else {
        newSquare.dataset.row = row;
        newSquare.dataset.col = 7 - col;
      }

      if ((row + col) % 2 == 0) {
        newSquare.classList.add("light");
      } else {
        newSquare.classList.add("dark");
      }
      BOARD_ELEMENT.appendChild(newSquare);
    }
  }
}

makeGrid();

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

function drawPiece(color, piece, row, col, idCount) {
  row = +row;
  col = +col;
  //console.log( "trying to draw a " + color + " " + piece + " at " + row + " " + col);
  let pieceImage = document.createElement("img");
  pieceImage.src = color === "white" ? whitePieces[piece] : blackPieces[piece];
  pieceImage.className = "piece";
  pieceImage.dataset.row = row;
  pieceImage.dataset.col = col;
  pieceImage.id = idCount;

  pieceImage.draggable = true;
  pieceImage.width = TILE_SIZE;
  pieceImage.height = TILE_SIZE;
  if (playerPerspectiveIsWhite) {
    pieceImage.style.left = TILE_SIZE * col + "px";
    pieceImage.style.top = BOARD_SIZE - TILE_SIZE * (row + 1) + "px";
  } else {
    pieceImage.style.left = BOARD_SIZE - TILE_SIZE * (col + 1) + "px";
    pieceImage.style.top = TILE_SIZE * row + "px";
  }

  BOARD_ELEMENT.appendChild(pieceImage);
}

function drawStartPieces() {
  let idCount = 0;
  for (let r in realBoard) {
    for (let c in realBoard[r]) {
      r = +r;
      c = +c;
      let piece = realBoard[r][c]; //either ["empty"] or ["color", "piece"]
      if (piece[0] != "empty") {
        drawPiece(piece[0], piece[1], r, c, idCount);
        idCount++;
      }
    }
  }
}

function setUpBoard() {
  realBoard = makeEmptyBoard();
  for (let c = 0; c < 8; c++) {
    realBoard[6][c] = ["black", "p"];
    realBoard[1][c] = ["white", "p"];
  }

  realBoard[7][0] = ["black", "r", true];
  realBoard[7][7] = ["black", "r", true];
  realBoard[7][1] = ["black", "n"];
  realBoard[7][6] = ["black", "n"];
  realBoard[7][2] = ["black", "b"];
  realBoard[7][5] = ["black", "b"];

  realBoard[0][0] = ["white", "r", true];
  realBoard[0][7] = ["white", "r", true];
  realBoard[0][1] = ["white", "n"];
  realBoard[0][6] = ["white", "n"];
  realBoard[0][2] = ["white", "b"];
  realBoard[0][5] = ["white", "b"];

  realBoard[7][3] = ["black", "q"];
  realBoard[7][4] = ["black", "k", true];
  realBoard[0][3] = ["white", "q"];
  realBoard[0][4] = ["white", "k", true];

  drawStartPieces();
}

setUpBoard();

function checkLegalMove(move) {
  if (
    (turn % 2 == 0 && move.side == "black") ||
    (turn % 2 == 1 && move.side == "white")
  ) {
    return false;
  }
  if (checkCastleAttempt(move)) {
    //do stuff
    return true;
  }
  let endSquare = realBoard[move.endRow][move.endCol];
  if (endSquare[0] === "empty") {
    if (canReach(move)) {
      hypotheticalBoard = JSON.parse(JSON.stringify(realBoard));
      updateBoardArray(hypotheticalBoard, move);
      if (checkForCheck(move.side, hypotheticalBoard)) {
        console.log("invalid move");
        return false;
      } else {
        console.log("valid move");

        return true;
      }
    } else {
      return false;
    }
  }
  if (move.side != endSquare[0]) {
    //0th index corresponds to color of piece on square
    if (canReach(move)) {
      hypotheticalBoard = JSON.parse(JSON.stringify(realBoard));
      updateBoardArray(hypotheticalBoard, move);
      if (checkForCheck(move.side, hypotheticalBoard)) {
        console.log("invalid move");
        return false;
      } else {
        console.log("valid asf move");
        return true;
      }
    } else {
      return false;
    }
  }
  return false;
}

//checks if the move is valid (doesnt go through other pieces)
function canReach(move) {
  let board = realBoard;
  let { side, piece, startRow, startCol, endRow, endCol } = move;
  let endSquare = board[endRow][endCol];
  switch (piece) {
    case "p":
      switch (side) {
        case "white":
          if (
            endCol === startCol &&
            startRow === 1 &&
            endRow === 3 &&
            board[endRow][endCol][0] === "empty" &&
            board[endRow - 1][endCol][0] === "empty"
          ) {
            return true;
          }

          if (
            endCol === startCol &&
            endRow - startRow === 1 &&
            endSquare[0] === "empty"
          ) {
            return true;
          }
          if (
            Math.abs(endCol - startCol) === 1 &&
            endRow - startRow === 1 &&
            endSquare[0] != "empty"
          ) {
            return true;
          }
          break;
        case "black":
          if (
            endCol === startCol &&
            startRow === 6 &&
            endRow === 4 &&
            board[endRow][endCol][0] === "empty" &&
            board[endRow + 1][endCol][0] === "empty"
          ) {
            return true;
          }
          if (
            endCol === startCol &&
            endRow - startRow === -1 &&
            endSquare[0] === "empty"
          ) {
            return true;
          }
          if (
            Math.abs(endCol - startCol) === 1 &&
            endRow - startRow === -1 &&
            endSquare[0] != "empty"
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
          if (board[r][startCol][0] != "empty") return false;
        }
        return true;
      }
      if (startRow === endRow) {
        for (let c = startCol + 1; c < endCol; c++) {
          if (board[startRow][c][0] != "empty") return false;
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
            if (board[startRow + i][startCol + i][0] != "empty") return false;
          }
          return true;
        } else {
          //going to the bottomleft
          for (let i = -1; i > endRow - startRow; i--) {
            if (board[startRow + i][startCol + i][0] != "empty") return false;
          }
          return true;
        }
      }
      if (endRow - startRow === -1 * (endCol - startCol)) {
        //diagonal case
        if (endRow - startRow > 0) {
          //going to the bottomright
          for (let i = 1; i < endRow - startRow; i++) {
            if (board[startRow + i][startCol - i][0] != "empty") return false;
          }
          return true;
        } else {
          //going to the topleft
          for (let i = -1; i > endRow - startRow; i--) {
            if (board[startRow + i][startCol - i][0] != "empty") return false;
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
            if (board[r][startCol][0] != "empty") return false;
          }
          return true;
        }
        if (startRow === endRow) {
          for (let c = startCol + 1; c < endCol; c++) {
            if (board[startRow][c][0] != "empty") return false;
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
              if (board[startRow + i][startCol + i][0] != "empty") return false;
            }
            return true;
          } else {
            //going to the bottomleft
            for (let i = -1; i > endRow - startRow; i--) {
              if (board[startRow + i][startCol + i][0] != "empty") return false;
            }
            return true;
          }
        }
        if (endRow - startRow === -1 * (endCol - startCol)) {
          //diagonal case
          if (endRow - startRow > 0) {
            //going to the bottomright
            for (let i = 1; i < endRow - startRow; i++) {
              if (board[startRow + i][startCol - i][0] != "empty") return false;
            }
            return true;
          } else {
            //going to the topleft
            for (let i = -1; i > endRow - startRow; i--) {
              if (board[startRow + i][startCol - i][0] != "empty") return false;
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

function checkForMate(color, board) {
  console.log("chouesr");
  for (let r in board) {
    for (let c in board[r]) {
      if (board[r][c][0] === color) {
        for (let rr in board) {
          for (let cc in board[r]) {
            let move = {
              side: color,
              piece: board[r][c],
              startRow: +r,
              startCol: +c,
              endRow: +rr,
              endCol: +cc,
            };
            if (checkLegalMove(move)) {
              console.log("not mate because " + move);
              return false;
            }
          }
        }
      }
    }
  }
  return true;
}

//returns true or false
function checkForCheck(color, board) {
  let oppositeColor = color === "white" ? "black" : "white";
  let kingRow, kingCol;

  for (let r in board) {
    for (let c in board[r]) {
      if (board[r][c][0] === color && board[r][c][1] === "k") {
        kingRow = +r;
        kingCol = +c;
      }
    }
  }
  console.log(
    "checking for check: " +
      color +
      " king at " +
      kingRow +
      ", " +
      kingCol +
      "."
  );

  let d; //distance from king square
  let keepGoing;

  //checks for rook moves (include queen)

  d = 1;
  keepGoing = true;

  //checks for the rows greater than kingrow
  while (kingRow + d < 8 && keepGoing) {
    let potentialThreat = board[kingRow + d][kingCol];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "r" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (potentialThreat[0] === "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  //checks for the rows less than kingrow

  d = 1;
  keepGoing = true;
  while (kingRow - d > -1 && keepGoing) {
    let potentialThreat = board[kingRow - d][kingCol];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "r" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (potentialThreat[0] === "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  //checks for the cols greater than kingrow

  d = 1;
  keepGoing = true;
  while (kingCol + d < 8 && keepGoing) {
    let potentialThreat = board[kingRow][kingCol + d];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "r" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (board[kingRow][kingCol + d][0] === "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  //checks for the cols less than kingrow

  d = 1;
  keepGoing = true;
  while (kingCol - d > -1 && keepGoing) {
    let potentialThreat = board[kingRow][kingCol - d];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "r" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (potentialThreat[0] === "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  //checks for bishop moves (include queen)

  d = 1;
  keepGoing = true;

  //checks top right of king
  while (keepGoing && kingRow + d < 8 && kingCol + d < 8) {
    let potentialThreat = board[kingRow + d][kingCol + d];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "b" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (potentialThreat[0] === "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  d = 1;
  keepGoing = true;

  //checks top left of king
  while (keepGoing && kingRow + d < 8 && kingCol - d > 0) {
    let potentialThreat = board[kingRow + d][kingCol - d];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "b" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (potentialThreat[0] === "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  d = 1;
  keepGoing = true;

  //checks bottom left of king
  while (keepGoing && kingRow - d > 0 && kingCol - d > 0) {
    let potentialThreat = board[kingRow - d][kingCol - d];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "b" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (potentialThreat[0] == "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  d = 1;
  keepGoing = true;

  //checks bottom right of king
  while (keepGoing && kingRow - d > 0 && kingCol + d < 8) {
    let potentialThreat = board[kingRow - d][kingCol + d];
    if (
      potentialThreat[0] === oppositeColor &&
      (potentialThreat[1] === "b" || potentialThreat[1] === "q")
    ) {
      return true;
    }
    if (potentialThreat[0] === "empty") {
      d++;
    } else {
      keepGoing = false;
    }
  }

  //checks for knight moves

  function checkKnightCheck(knightRow, knightCol) {
    knightRow += kingRow;
    knightCol += kingCol;

    if (knightRow < 0 || knightRow > 7 || knightCol < 0 || knightCol > 7) {
      return false;
    }
    if (
      board[knightRow][knightCol][0] === oppositeColor &&
      board[knightRow][knightCol][1] === "n"
    ) {
      return true;
    }
    return false;
  }

  if (checkKnightCheck(2, 1)) return true;
  if (checkKnightCheck(1, 2)) return true;
  if (checkKnightCheck(-1, 2)) return true;
  if (checkKnightCheck(-2, 1)) return true;
  if (checkKnightCheck(2, -1)) return true;
  if (checkKnightCheck(1, -2)) return true;
  if (checkKnightCheck(-1, -2)) return true;
  if (checkKnightCheck(-2, -1)) return true;
  //fuck off i know it doesnt look good but its fast and straightforward

  //checks for kings touching

  for (let rowD = -1; rowD < 2; rowD++) {
    if (kingRow + rowD < 0 || kingRow + rowD > 7) continue;
    for (let colD = -1; colD < 2; colD++) {
      if (kingCol + colD < 0 || kingCol + colD > 7) continue;
      let potentialSquare = board[kingRow + rowD][kingCol + colD];
      if (potentialSquare[0] === oppositeColor && potentialSquare[1] === "k") {
        return true;
      }
    }
  }

  //checks for pawn moves

  if (color === "white") {
    if (kingRow < 6) {
      if (kingCol > 0) {
        if (
          board[kingRow + 1][kingCol - 1][0] === oppositeColor &&
          board[kingRow + 1][kingCol - 1][0] === "p"
        ) {
          return true;
        }
      }
      if (kingCol < 7) {
        if (
          board[kingRow + 1][kingCol + 1][0] === oppositeColor &&
          board[kingRow + 1][kingCol + 1][0] === "p"
        ) {
          return true;
        }
      }
    }
  } else {
    if (kingRow > 1) {
      if (kingCol > 0) {
        if (
          board[kingRow - 1][kingCol - 1][0] === oppositeColor &&
          board[kingRow - 1][kingCol - 1][0] === "p"
        ) {
          return true;
        }
      }
      if (kingCol < 7) {
        if (
          board[kingRow - 1][kingCol + 1][0] === oppositeColor &&
          board[kingRow - 1][kingCol + 1][0] === "p"
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkCastleAttempt(move) {
  //can return either "queenside" "kingside" or "none"
  if (realBoard[move.startRow][move.startCol][0] != "k") {
    return "none";
  }
  if (realBoard[move.startRow][move.startCol][2] === true) {
    //checks if king can castle
    if (move.side === "white" && move.endRow === 0) {
      if (move.endCol === 1) {
        if (realBoard[0][0][1] === "r" && realBoard[0][0][2] === true) {
          return "kingside";
        }
      } else if (move.endCol === 6) {
        if (realBoard[0][7][1] === "r" && realBoard[0][7][2] === true) {
          return "queenside";
        }
      }
    } else if (move.side === "black" && move.endRow === 7) {
      if (move.endCol === 1) {
        if (realBoard[7][0][1] === "r" && realBoard[7][0][2] === true) {
          return "kingside";
        }
      } else if (move.endCol === 6) {
        if (realBoard[7][7][1] === "r" && realBoard[7][7][2] === true) {
          return "queenside";
        }
      }
    }
  }
  return "none";
}

function recieveMove(move) {
  updateHTMLBoard(move);
  updateBoardArray(realBoard, move);
}

function makeMove(move) {
  if (checkLegalMove(move)) {
    updateHTMLBoard(move);
    updateBoardArray(realBoard, move);

    let oppositeColor = move.side === "white" ? "black" : "white";

    if (checkForCheck(oppositeColor, realBoard)) {
      console.log("cjeck!");
      if (checkForMate(oppositeColor, realBoard)) {
        alert("gg");
        console.log("mate ");
      }
    }
    turn++;

    broadcastMove(move);
  } else {
    //do stuff
  }
}

function updateBoardArray(board, move) {
  board[move.endRow][move.endCol] = JSON.parse(
    JSON.stringify(board[move.startRow][move.startCol])
  );
  board[move.startRow][move.startCol] = ["empty"];

  //prevents king from castling
  if (board[move.endRow][move.endCol][1] === "k") {
    board[move.endRow][move.endCol][2] = false;
    //the 2nd index of the tile correlates to the kings ability to castle
  }
  //same with rook
  if (board[move.endRow][move.endCol][1] === "r") {
    board[move.endRow][move.endCol][2] = false;
    //the 2nd index of the tile correlates to the kings ability to castle
  }
}

function updateHTMLBoard(move) {
  if (realBoard[move.endRow][move.endCol][0] != "empty") {
    let capturedPiece = getPieceByRowCol(move.endRow, move.endCol);
    console.log("captured a piece: " + capturedPiece);
    capturedPiece.remove();
  }
  let movingPiece = getPieceByRowCol(move.startRow, move.startCol);
  if (playerPerspectiveIsWhite) {
    movingPiece.style.left = TILE_SIZE * move.endCol + "px";
    movingPiece.style.top = BOARD_SIZE - TILE_SIZE * (move.endRow + 1) + "px";
  } else {
    movingPiece.style.left = BOARD_SIZE - TILE_SIZE * (move.endCol + 1) + "px";
    movingPiece.style.top = TILE_SIZE * move.endRow + "px";
  }

  movingPiece.dataset.row = move.endRow;
  movingPiece.dataset.col = move.endCol;
}

function getPieceByRowCol(row, col) {
  return document.querySelector(
    '.piece[data-row="' + row + '"][data-col="' + col + '"]'
  );
}

function animateMove(move) {
  // let movingPiece = getPieceByRowCol(move.endRow, move.endCol);
}

let pieceCurrentlyDragged = []; //[row, col]

document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("drop", (e) => {
    drop(e, tile);
  });
  tile.addEventListener("dragover", (e) => {
    dragover(e);
  });
});

document.querySelectorAll(".piece").forEach((piece) => {
  piece.addEventListener("dragstart", (e) => {
    dragstart(piece);
  });
  piece.addEventListener("dragover", (e) => {
    dragover(e);
  });
  piece.addEventListener("drop", (e) => {
    drop(e, piece);
  });
});

function dragstart(piece) {
  pieceCurrentlyDragged = [piece.dataset.row, +piece.dataset.col];
}

function drop(e, item) {
  //"item" could be tile or piece
  //is called whenever a piece is dropped down
  e.preventDefault();

  let pieceInfo = realBoard[pieceCurrentlyDragged[0]][pieceCurrentlyDragged[1]];
  makeMove({
    side: pieceInfo[0],
    piece: pieceInfo[1],
    startRow: +pieceCurrentlyDragged[0],
    startCol: +pieceCurrentlyDragged[1],
    endRow: +item.dataset.row,
    endCol: +item.dataset.col,
  });
}

function dragover(e) {
  e.preventDefault();
}

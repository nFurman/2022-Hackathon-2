const BOARD_ELEMENT = document.getElementById("board_container");
let chatBox = document.getElementById("chatBoxDiv");

const TILE_SIZE = 70;

const BOARD_SIZE = TILE_SIZE * 8;
BOARD_ELEMENT.style.height = BOARD_SIZE + "px";
BOARD_ELEMENT.style.width = BOARD_SIZE + "px";

let realBoard = [];
let hypotheticalBoard = [];
let turn = 0;

let numUsersConnected = 1;
let playerIsWhite = false;
let gamePlaying = false;

let lightColor = "burlywood";
let darkColor = "saddlebrown";

let chatEnabled = true;
let numMessages = 0;

function disableChat() {
  chatEnabled = false;
  chatBox.remove();
}

function showMessage(msg) {
  if (!chatEnabled) return;
  let newMsg = document.createElement("h2");
  newMsg.textContent = msg;
  newMsg.style.top = 81 + numMessages * 2 + "%";
  numMessages++;
  chatBox.appendChild(newMsg);
}

function userConnected() {
  numUsersConnected++;
  console.log("i see that a user has been connected :)");
  if (numUsersConnected == 2) {
    playerIsWhite = true;
    console.log("i am playiingas white");
    startGame();
    broadcastStartGame();
  }
}

const whiteScreen = document.getElementById("whiteScreen");

function startGame() {
  numUsersConnected = 2;
  makeGrid();
  setUpBoard();
  setupEventListeners();
  whiteScreen.remove();
  startClock();
}

const settingsDiv = document.getElementById("settingsDiv");
settingsDiv.remove();
const screenCover = document.getElementById("screenCover");
screenCover.remove();

const backgroundDiv = document.querySelector(".background");

function settingsBtnClicked() {
  backgroundDiv.appendChild(screenCover);
  backgroundDiv.appendChild(settingsDiv);
}

function exitSettings() {
  const lightColorValue = document.getElementById("lightColor").value;

  if (lightColorValue != "") {
    lightColor = lightColorValue;
    document.querySelectorAll(".light").forEach((lightTile) => {
      lightTile.style.backgroundColor = lightColorValue;
    });
  }
  const darkColorValue = document.getElementById("darkColor").value;

  if (darkColorValue != "") {
    darkColor = darkColorValue;
    document.querySelectorAll(".dark").forEach((darkTile) => {
      darkTile.style.backgroundColor = darkColorValue;
    });
  }
  settingsDiv.remove();
  screenCover.remove();
}

const moveTracker = document.getElementById("moveTracker");

const clock = document.getElementById("clock");
const oppClock = document.getElementById("oppClock");
const yourClock = document.getElementById("yourClock");

let turnStartTime, oppTime, yourTime;
const TIME_LIMIT = 5 * 60 * 1000;

function startClock() {
  turnStartTime = Date.now();
  yourTime = TIME_LIMIT;
  oppTime = TIME_LIMIT;
  yourClock.textContent = displayTime(TIME_LIMIT);
  oppClock.textContent = displayTime(TIME_LIMIT);
  gamePlaying = true;
  updateClock();
}

function updateClock() {
  if (gamePlaying) requestAnimationFrame(updateClock);

  if (playerIsWhite === (turn % 2 == 0)) {
    yourClock.textContent = displayTime(
      yourTime - (Date.now() - turnStartTime)
    );
    if (yourTime - (Date.now() - turnStartTime) < 0) {
      alert("LOST ON TIME LLLLLL");
      gamePlaying = false;
    }
  } else {
    oppClock.textContent = displayTime(oppTime - (Date.now() - turnStartTime));
    if (oppTime - (Date.now() - turnStartTime) < 0) {
      alert("WON ON TIME");
      gamePlaying = false;
    }
  }
}

function displayTime(ms) {
  if (ms <= 0) {
    ms = 0;
  }
  ms = Math.ceil(ms / 1000) * 1000;
  let minutes = Math.floor(ms / 60000);
  let seconds = Math.floor((ms - minutes * 60000) / 1000);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}

function makeGrid() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let newSquare = document.createElement("div");
      newSquare.classList.add("tile");
      newSquare.style.width = TILE_SIZE + "px";
      newSquare.style.height = TILE_SIZE + "px";

      if (playerIsWhite) {
        newSquare.dataset.row = 7 - row;
        newSquare.dataset.col = col;
      } else {
        newSquare.dataset.row = row;
        newSquare.dataset.col = 7 - col;
      }

      if ((row + col) % 2 == 0) {
        newSquare.classList.add("light");
        console.log(lightColor);
        newSquare.style.backgroundColor = lightColor;
      } else {
        newSquare.classList.add("dark");
        newSquare.style.backgroundColor = darkColor;
      }
      BOARD_ELEMENT.appendChild(newSquare);
    }
  }
}

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
  if (playerIsWhite) {
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
    realBoard[6][c] = ["black", "p", true];
    realBoard[1][c] = ["white", "p", true];
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

function checkLegalMove(move, board = realBoard) {
  console.log("checking legal move");

  let castleAttemptResult = checkCastleAttempt(move);
  if (castleAttemptResult == undefined) {
    console.log("panic!");
    return false;
  }
  if (
    castleAttemptResult === "kingside" ||
    castleAttemptResult === "queenside"
  ) {
    return true;
  }
  if (castleAttemptResult === "illegal") return false;

  let endSquare = board[move.endRow][move.endCol];
  if (endSquare[0] === "empty") {
    if (canReach(move, board)) {
      let hypotheticalBoard = JSON.parse(JSON.stringify(board));
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
    if (canReach(move, board)) {
      let hypotheticalBoard = JSON.parse(JSON.stringify(board));
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
function canReach(move, board = realBoard) {
  let { side, piece, startRow, startCol, endRow, endCol } = move;
  let endSquare = board[endRow][endCol];
  switch (piece) {
    case "p":
      switch (side) {
        case "white":
          //en p

          if (
            Math.abs(endCol - startCol) == 1 &&
            startRow === 4 &&
            endRow === 5 &&
            board[4][endCol][0] === "black" &&
            board[4][endCol][1] === "p" &&
            board[4][endCol][2] === true
          ) {
            return true;
          }
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
          //en p
          if (
            Math.abs(endCol - startCol) == 1 &&
            startRow === 3 &&
            endRow === 2 &&
            board[3][endCol][0] === "white" &&
            board[3][endCol][1] === "p" &&
            board[3][endCol][2] === true
          ) {
            return true;
          }
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
        //going up
        if (endRow > startRow) {
          for (let r = startRow + 1; r < endRow; r++) {
            if (board[r][startCol][0] != "empty") return false;
          }
        } else {
          //going down
          for (let r = startRow - 1; r > endRow; r--) {
            if (board[r][startCol][0] != "empty") return false;
          }
        }
        return true;
      }
      if (startRow === endRow) {
        if (endCol > startCol) {
          //going right
          for (let c = startCol + 1; c < endCol; c++) {
            if (board[startRow][c][0] != "empty") return false;
          }
        } else {
          //going left
          for (let c = startCol - 1; c > endCol; c--) {
            if (board[startRow][c][0] != "empty") return false;
          }
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
  for (let r in board) {
    for (let c in board[r]) {
      if (board[r][c][0] === color) {
        for (let rr in board) {
          for (let cc in board[r]) {
            let move = {
              side: color,
              piece: board[r][c][1],
              startRow: +r,
              startCol: +c,
              endRow: +rr,
              endCol: +cc,
            };
            if (board[r][c][1] === "k" && rr == 6 && cc == 5) {
              console.log(move);
              console.log(checkLegalMove(move));
            }
            if (checkLegalMove(move, board)) {
              console.log("not mate because ");
              console.log(move);
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
          board[kingRow + 1][kingCol - 1][1] === "p"
        ) {
          return true;
        }
      }
      if (kingCol < 7) {
        if (
          board[kingRow + 1][kingCol + 1][0] === oppositeColor &&
          board[kingRow + 1][kingCol + 1][1] === "p"
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
          board[kingRow - 1][kingCol - 1][1] === "p"
        ) {
          return true;
        }
      }
      if (kingCol < 7) {
        if (
          board[kingRow - 1][kingCol + 1][0] === oppositeColor &&
          board[kingRow - 1][kingCol + 1][1] === "p"
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkCastleAttempt(move) {
  //can return either "queenside" "kingside" "not attempted" or "illegal"
  if (realBoard[move.startRow][move.startCol][1] != "k") {
    return "not attempted";
  }
  if (realBoard[move.startRow][move.startCol][2] === true) {
    console.log("should be able");
    //checks if king can castle
    if (move.side === "white" && move.endRow === 0) {
      console.log("should be true, row 0");
      if (move.endCol === 0 || move.endCol === 1 || move.endCol === 2) {
        if (realBoard[0][0][1] === "r" && realBoard[0][0][2] === true) {
          if (
            realBoard[0][1][0] == "empty" &&
            realBoard[0][2][0] == "empty" &&
            realBoard[0][3][0] == "empty"
          ) {
            return "queenside";
          } else {
            return "illegal";
          }
        }
      } else if (move.endCol === 6 || move.endCol === 7) {
        console.log("should be true, col 6");
        if (realBoard[0][7][1] === "r" && realBoard[0][7][2] === true) {
          if (realBoard[0][6][0] == "empty" && realBoard[0][5][0] == "empty") {
            return "kingside";
          } else {
            return "illegal";
          }
        }
      }
    } else if (move.side === "black" && move.endRow === 7) {
      if (move.endCol === 0 || move.endCol === 1 || move.endCol === 2) {
        if (realBoard[7][0][1] === "r" && realBoard[7][0][2] === true) {
          if (
            realBoard[7][1][0] == "empty" &&
            realBoard[7][2][0] == "empty" &&
            realBoard[7][3][0] == "empty"
          ) {
            return "queenside";
          } else {
            return "illegal";
          }
        }
      } else if (move.endCol === 6 || move.endCol === 7) {
        if (realBoard[7][7][1] === "r" && realBoard[7][7][2] === true) {
          if (realBoard[7][6][0] == "empty" && realBoard[7][5][0] == "empty") {
            return "kingside";
          } else {
            return "illegal";
          }
        }
      }
    }
  }
  return "not attempted";
}

function gameOver(winner) {
  gamePlaying = false;
  alert(winner + " wins!");
}

function preventFutureEnP() {
  for (let c in realBoard[0]) {
    if (realBoard[3][c][1] === "p") {
      realBoard[3][c][2] = false;
    }
    if (realBoard[2][c][1] === "p") {
      realBoard[2][c][2] = false;
    }
    if (realBoard[4][c][1] === "p") {
      realBoard[4][c][2] = false;
    }
    if (realBoard[5][c][1] === "p") {
      realBoard[5][c][2] = false;
    }
  }
}

function receiveMove(moveData) {
  let { move, castling, datenow, checkmateStatus } = moveData;

  if (checkmateStatus === "#") {
    gameOver(move.side);
  }

  addMoveToTracker(move, castling, checkmateStatus);

  let capture = false;
  if (realBoard[move.endRow][move.endCol] != "empty") {
    capture = true;
  }
  updateBoardArray(realBoard, move, castling);
  animateMove(move, castling, capture);

  if (playerIsWhite === (turn % 2 == 0)) {
    yourTime = yourTime - (datenow - turnStartTime);
  } else {
    oppTime = oppTime - (datenow - turnStartTime);
  }
  turnStartTime = datenow;

  turn++;
}

function makeMove(move, castling, datenow, checkmateStatus) {
  if (checkmateStatus === "#") {
    gameOver(move.side);
  }
  addMoveToTracker(move, castling, checkmateStatus);

  let capture = false;
  if (realBoard[move.endRow][move.endCol] != "empty") {
    capture = true;
  }

  updateBoardArray(realBoard, move, castling);
  updateHTMLBoard(move, castling, capture);

  preventFutureEnP();

  if (playerIsWhite === (turn % 2 == 0)) {
    yourTime = yourTime - (datenow - turnStartTime);
  } else {
    oppTime = oppTime - (datenow - turnStartTime);
  }
  turnStartTime = datenow;

  turn++;
}

function addMoveToTracker(move, castling, checkmateStatus) {
  moveToBeAdded = document.createElement("div");
  moveToBeAdded.classList.add("moveTrackerMove");
  switch (castling) {
    case "not attempted":
      let pieceText = move.piece === "p" ? "" : move.piece.toUpperCase();
      if (realBoard[move.endRow][move.endCol][0] != "empty") {
        if (move.piece === "p") {
          pieceText += (move.startCol + 10).toString(36);
        }
        pieceText += "x";
      }
      moveToBeAdded.textContent =
        pieceText +
        (move.endCol + 10).toString(36) +
        (move.endRow + 1) +
        checkmateStatus;
      break;
    case "kingside":
      moveToBeAdded.textContent = "O-O" + checkmateStatus;
      break;
    case "queenside":
      moveToBeAdded.textContent = "O-O-O" + checkmateStatus;
      break;
  }

  moveTracker.append(moveToBeAdded);
}

function attemptMove(move) {
  if (
    (turn % 2 === 0 && move.side === "black") ||
    (turn % 2 === 1 && move.side === "white")
  ) {
    return;
  }
  if (
    (playerIsWhite && move.side === "black") ||
    (!playerIsWhite && move.side === "white")
  ) {
    return;
  }
  if (checkLegalMove(move)) {
    let castling = checkCastleAttempt(move);
    console.log("castling: " + castling);

    let oppositeColor = move.side === "white" ? "black" : "white";
    let checkmateStatus = "";

    hypotheticalBoard = JSON.parse(JSON.stringify(realBoard));
    updateBoardArray(hypotheticalBoard, move);
    if (checkForCheck(oppositeColor, hypotheticalBoard)) {
      console.log("cjeck!");
      checkmateStatus = "!";
      if (checkForMate(oppositeColor, hypotheticalBoard)) {
        checkmateStatus = "#";
        console.log("mate ");
      }
    }

    makeMove(move, castling, Date.now(), checkmateStatus);

    broadcastMove({
      move: move,
      castling: castling,
      datenow: Date.now(),
      checkmateStatus: checkmateStatus,
    });
  } else {
    //do stuff
  }
}

function updateBoardArray(board, move, castling = "not attempted") {
  if (castling != "not attempted") {
    console.log("castling: " + castling);
  }
  switch (castling) {
    case "not attempted":
      //promotion
      if (move.piece === "p") {
        if (move.side === "white" && move.endRow === 7) {
          board[move.endRow][move.endCol] = ["white", "q"];
          board[move.startRow][move.startCol] = ["empty"];
          return;
        } else if (move.side === "black" && move.endRow === 0) {
          board[move.endRow][move.endCol] = ["black", "q"];
          board[move.startRow][move.startCol] = ["empty"];
          return;
        }
        if (
          move.side === "white" &&
          move.endRow === 5 &&
          move.startCol != move.endCol &&
          realBoard[move.endRow][move.endCol][0] === "empty"
        ) {
          board[move.endRow][move.endCol] = ["white", "p"];
          board[move.startRow][move.startCol] = ["empty"];
          board[move.startRow][move.endCol] = ["empty"];
          return;
        }
        if (
          move.side === "black" &&
          move.endRow === 2 &&
          move.startCol != move.endCol &&
          realBoard[move.endRow][move.endCol][0] === "empty"
        ) {
          board[move.endRow][move.endCol] = ["black", "p"];
          board[move.startRow][move.startCol] = ["empty"];
          board[move.startRow][move.endCol] = ["empty"];
          return;
        }
      }
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
      break;
    case "kingside":
      //king
      board[move.endRow][6] = JSON.parse(
        JSON.stringify(board[move.startRow][4])
      );
      board[move.startRow][4] = ["empty"];

      //rook
      board[move.endRow][5] = JSON.parse(
        JSON.stringify(board[move.startRow][7])
      );
      board[move.startRow][7] = ["empty"];

      board[move.endRow][5][2] = false;
      board[move.endRow][6][2] = false;
      break;
    case "queenside":
      //king
      board[move.endRow][2] = JSON.parse(
        JSON.stringify(board[move.startRow][4])
      );
      board[move.startRow][4] = ["empty"];

      //rook
      board[move.endRow][3] = JSON.parse(
        JSON.stringify(board[move.startRow][0])
      );
      board[move.startRow][0] = ["empty"];

      board[move.endRow][2][2] = false;
      board[move.endRow][3][2] = false;
      break;
  }
}

function moveHTMLPiece(movingPiece, row, col) {
  console.log("moving " + movingPiece + " to " + row + " " + col);
  if (playerIsWhite) {
    movingPiece.style.left = TILE_SIZE * col + "px";
    movingPiece.style.top = BOARD_SIZE - TILE_SIZE * (row + 1) + "px";
  } else {
    movingPiece.style.left = BOARD_SIZE - TILE_SIZE * (col + 1) + "px";
    movingPiece.style.top = TILE_SIZE * row + "px";
  }
  movingPiece.dataset.row = row;
  movingPiece.dataset.col = col;
}

function updateHTMLBoard(move, castling = "not attempted", capture) {
  let kingPiece, rookPiece;
  switch (castling) {
    case "not attempted":
      //capture
      if (capture) {
        let capturedPiece = getPieceByRowCol(move.endRow, move.endCol);
        console.log("captured a piece: " + capturedPiece);
        capturedPiece.remove();
      }

      //promotion
      if (move.piece === "p") {
        if (
          (move.side === "white" && move.endRow === 7) ||
          (move.side === "black" && move.endRow === 0)
        ) {
          let movingPiece = getPieceByRowCol(move.startRow, move.startCol);
          movingPiece.src =
            move.side === "white" ? whitePieces["q"] : blackPieces["q"];
        }

        if (
          move.side === "white" &&
          move.endRow === 5 &&
          move.startCol != move.endCol &&
          realBoard[move.endRow][move.endCol][0] === "empty"
        ) {
          let capturedPiece = getPieceByRowCol(move.startRow, move.endCol);
          console.log("captured a piece: " + capturedPiece);
          capturedPiece.remove();
        }
        if (
          move.side === "black" &&
          move.endRow === 2 &&
          move.startCol != move.endCol &&
          realBoard[move.endRow][move.endCol][0] === "empty"
        ) {
          let capturedPiece = getPieceByRowCol(move.startRow, move.endCol);
          console.log("captured a piece: " + capturedPiece);
          capturedPiece.remove();
        }
      }

      //normal movement
      let movingPiece = getPieceByRowCol(move.startRow, move.startCol);
      moveHTMLPiece(movingPiece, move.endRow, move.endCol);
      break;
    case "kingside":
      kingPiece = getPieceByRowCol(move.startRow, 4);
      rookPiece = getPieceByRowCol(move.endRow, 7);
      moveHTMLPiece(kingPiece, move.endRow, 6);
      moveHTMLPiece(rookPiece, move.startRow, 5);
      break;
    case "queenside":
      kingPiece = getPieceByRowCol(move.startRow, 4);
      rookPiece = getPieceByRowCol(move.endRow, 0);
      moveHTMLPiece(kingPiece, move.endRow, 2);
      moveHTMLPiece(rookPiece, move.startRow, 3);
      break;
  }
}

function getPieceByRowCol(row, col) {
  return document.querySelector(
    '.piece[data-row="' + row + '"][data-col="' + col + '"]'
  );
}

function animateMove(move, castling, capture) {
  let kingPiece, rookPiece;
  switch (castling) {
    case "not attempted":
      //capture
      if (capture) {
        let capturedPiece = getPieceByRowCol(move.endRow, move.endCol);
        console.log("captured a piece: " + capturedPiece);
        capturedPiece.remove();
      }

      //promotion
      if (move.piece === "p") {
        if (
          (move.side === "white" && move.endRow === 7) ||
          (move.side === "black" && move.endRow === 0)
        ) {
          let movingPiece = getPieceByRowCol(move.startRow, move.startCol);
          movingPiece.src =
            move.side === "white" ? whitePieces["q"] : blackPieces["q"];
        }
        if (
          move.side === "white" &&
          move.endRow === 5 &&
          move.startCol != move.endCol &&
          realBoard[move.endRow][move.endCol][0] === "empty"
        ) {
          let capturedPiece = getPieceByRowCol(move.startRow, move.endCol);
          console.log("captured a piece: " + capturedPiece);
          capturedPiece.remove();
        }
        if (
          move.side === "black" &&
          move.endRow === 2 &&
          move.startCol != move.endCol &&
          realBoard[move.endRow][move.endCol][0] === "empty"
        ) {
          let capturedPiece = getPieceByRowCol(move.startRow, move.endCol);
          console.log("captured a piece: " + capturedPiece);
          capturedPiece.remove();
        }
      }

      //normal movement
      let movingPiece = getPieceByRowCol(move.startRow, move.startCol);
      animateHTMLPiece(
        movingPiece,
        move.startRow,
        move.startCol,
        move.endRow,
        move.endCol
      );
      break;
    case "kingside":
      kingPiece = getPieceByRowCol(move.startRow, 4);
      rookPiece = getPieceByRowCol(move.endRow, 7);
      animateHTMLPiece(kingPiece, move.startRow, move.startCol, move.endRow, 6);
      animateHTMLPiece(rookPiece, move.startRow, 7, move.startRow, 5);
      break;
    case "queenside":
      kingPiece = getPieceByRowCol(move.startRow, 4);
      rookPiece = getPieceByRowCol(move.endRow, 0);
      animateHTMLPiece(kingPiece, move.startRow, move.startCol, move.endRow, 2);
      animateHTMLPiece(rookPiece, move.startRow, 0, move.startRow, 3);
      break;
  }
}

function animateHTMLPiece(movingPiece, startRow, startCol, endRow, endCol) {
  movingPiece.dataset.row = endRow;
  movingPiece.dataset.col = endCol;
  let startTime = performance.now();
  function animationFrameMoveAnimationFunctionSuckMyCockBalls() {
    let timeProg = (performance.now() - startTime) / 400;
    if (timeProg < 1) {
      requestAnimationFrame(animationFrameMoveAnimationFunctionSuckMyCockBalls);
      let colProg = startCol + timeProg * (endCol - startCol);
      let rowProg = startRow + timeProg * (endRow - startRow);
      if (playerIsWhite) {
        movingPiece.style.left = TILE_SIZE * colProg + "px";
        movingPiece.style.top = BOARD_SIZE - TILE_SIZE * (rowProg + 1) + "px";
      } else {
        movingPiece.style.left = BOARD_SIZE - TILE_SIZE * (colProg + 1) + "px";
        movingPiece.style.top = TILE_SIZE * rowProg + "px";
      }
    } else {
      if (playerIsWhite) {
        movingPiece.style.left = TILE_SIZE * endCol + "px";
        movingPiece.style.top = BOARD_SIZE - TILE_SIZE * (endRow + 1) + "px";
      } else {
        movingPiece.style.left = BOARD_SIZE - TILE_SIZE * (endCol + 1) + "px";
        movingPiece.style.top = TILE_SIZE * endRow + "px";
      }
    }
  }
  animationFrameMoveAnimationFunctionSuckMyCockBalls();
}

let pieceCurrentlyDragged = []; //[row, col]

function setupEventListeners() {
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

    let pieceInfo =
      realBoard[pieceCurrentlyDragged[0]][pieceCurrentlyDragged[1]];
    attemptMove({
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
}

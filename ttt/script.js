const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const messageElement = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let isOTurn = false;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

restartBtn.addEventListener("click", startGame);

function startGame() {
  isOTurn = false;
  messageElement.textContent = "";
  cells.forEach(cell => {
    cell.classList.remove("x");
    cell.classList.remove("o");
    cell.textContent = "";
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = isOTurn ? "o" : "x";
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    isOTurn = !isOTurn;
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass.toUpperCase();
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains("x") || cell.classList.contains("o");
  });
}

function endGame(draw) {
  if (draw) {
    messageElement.textContent = "It's a Draw! 😶";
  } else {
    messageElement.textContent = `${isOTurn ? "O" : "X"} Wins! 🎉`;
  }
  cells.forEach(cell => cell.removeEventListener("click", handleClick));
}
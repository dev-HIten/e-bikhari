const board = document.getElementById("chessboard");

const initialBoardState = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

let boardState = JSON.parse(JSON.stringify(initialBoardState));
let selectedCell = null;
let moveHistory = []; // Stores the history of moves for undo functionality

// Function to draw the board
function drawBoard() {
    board.innerHTML = ""; // Clear the board
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Alternate light/dark squares
            cell.classList.add((row + col) % 2 === 0 ? "light" : "dark");

            // Add piece if present
            const piece = boardState[row][col];
            if (piece) {
                const pieceElem = document.createElement("span");
                pieceElem.textContent = piece;
                pieceElem.classList.add("piece");
                cell.appendChild(pieceElem);
            }

            // Add event listeners for click/tap
            cell.addEventListener("click", () => handleCellClick(row, col));
            board.appendChild(cell);
        }
    }
}

// Handle cell clicks
function handleCellClick(row, col) {
    if (selectedCell) {
        const [prevRow, prevCol] = selectedCell;

        // Move only if the selected piece is being moved to a different cell
        if (prevRow !== row || prevCol !== col) {
            // Save the current board state before the move
            moveHistory.push(JSON.parse(JSON.stringify(boardState)));

            // Move the selected piece to the new cell
            boardState[row][col] = boardState[prevRow][prevCol];
            boardState[prevRow][prevCol] = "";
            selectedCell = null; // Deselect the piece
        } else {
            selectedCell = null; // Deselect if clicking on the same cell
        }
        drawBoard(); // Redraw the board
    } else if (boardState[row][col]) {
        // Select a piece if it exists
        selectedCell = [row, col];
    }
}

// Undo the last move
function undoMove() {
    if (moveHistory.length > 0) {
        boardState = moveHistory.pop(); // Revert to the last state
        selectedCell = null;
        drawBoard();
    } else {
        alert("No moves to undo!");
    }
}

// Reset the game
function resetGame() {
    boardState = JSON.parse(JSON.stringify(initialBoardState));
    selectedCell = null;
    moveHistory = []; // Clear move history
    drawBoard();
}

// Initialize the board
drawBoard();
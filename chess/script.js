const board = document.getElementById("chessboard");

// Initial board state
let boardState = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

let selectedCell = null;
let currentPlayer = "white"; // white or black
const moveHistory = [];

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
                pieceElem.classList.add("piece", getPieceColor(piece));
                cell.appendChild(pieceElem);
            }

            // Add event listeners for click/tap
            cell.addEventListener("click", () => handleCellClick(row, col));
            board.appendChild(cell);
        }
    }
}

// Determine the color of a piece
function getPieceColor(piece) {
    return "♜♞♝♛♚♟".includes(piece) ? "black" : "white";
}

// Validate a move
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = boardState[fromRow][fromCol];
    const targetPiece = boardState[toRow][toCol];
    const color = getPieceColor(piece);
    const targetColor = targetPiece ? getPieceColor(targetPiece) : null;

    // Ensure the move is within bounds
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

    // Prevent capturing pieces of the same color
    if (targetColor === color) return false;

    // Handle movement rules for each piece
    switch (piece) {
        case "♙": // White pawn
            if (color === "white") {
                if (toCol === fromCol && boardState[toRow][toCol] === "") {
                    // Move forward
                    return fromRow - toRow === 1 || (fromRow === 6 && fromRow - toRow === 2 && boardState[fromRow - 1][fromCol] === "");
                } else if (Math.abs(toCol - fromCol) === 1 && fromRow - toRow === 1 && targetColor === "black") {
                    // Capture diagonally
                    return true;
                }
            }
            break;
        case "♟": // Black pawn
            if (color === "black") {
                if (toCol === fromCol && boardState[toRow][toCol] === "") {
                    // Move forward
                    return toRow - fromRow === 1 || (fromRow === 1 && toRow - fromRow === 2 && boardState[fromRow + 1][fromCol] === "");
                } else if (Math.abs(toCol - fromCol) === 1 && toRow - fromRow === 1 && targetColor === "white") {
                    // Capture diagonally
                    return true;
                }
            }
            break;
        case "♖": // Rook
        case "♜":
            // Horizontal and vertical movement
            if (fromRow === toRow || fromCol === toCol) {
                return isPathClear(fromRow, fromCol, toRow, toCol);
            }
            break;
        case "♘": // Knight
        case "♞":
            // L-shape movement
            return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) || (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
        case "♗": // Bishop
        case "♝":
            // Diagonal movement
            if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
                return isPathClear(fromRow, fromCol, toRow, toCol);
            }
            break;
        case "♕": // Queen
        case "♛":
            // Rook or Bishop movement
            if (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
                return isPathClear(fromRow, fromCol, toRow, toCol);
            }
            break;
        case "♔": // King
        case "♚":
            // Move one square in any direction
            return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
    }
    return false;
}

// Check if the path between two cells is clear (no pieces in the way)
function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);
    let row = fromRow + rowStep;
    let col = fromCol + colStep;

    while (row !== toRow || col !== toCol) {
        if (boardState[row][col] !== "") return false;
        row += rowStep;
        col += colStep;
    }
    return true;
}

// Handle cell clicks
function handleCellClick(row, col) {
    // Prevent default touch behavior
    event?.preventDefault();
    
    if (selectedCell) {
        const [fromRow, fromCol] = selectedCell;
        if (isValidMove(fromRow, fromCol, row, col)) {
            moveHistory.push(JSON.parse(JSON.stringify(boardState)));
            boardState[row][col] = boardState[fromRow][fromCol];
            boardState[fromRow][fromCol] = "";
            currentPlayer = currentPlayer === "white" ? "black" : "white";
            
            // Add visual feedback for move completion
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.style.backgroundColor = "#ffeb3b";
            setTimeout(() => cell.style.backgroundColor = "", 300);
        }
        selectedCell = null;
    } else if (boardState[row][col] && getPieceColor(boardState[row][col]) === currentPlayer) {
        selectedCell = [row, col];
        
        // Add visual feedback for selection
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.style.backgroundColor = "#81c784";
    }
    drawBoard();
}

// Undo the last move
function undoMove() {
    if (moveHistory.length > 0) {
        boardState = moveHistory.pop(); // Revert to the last state
        currentPlayer = currentPlayer === "white" ? "black" : "white"; // Restore turn
        selectedCell = null;
        drawBoard();
    } else {
        alert("No moves to undo!");
    }
}

// Reset the game
function resetGame() {
    boardState = [
        ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
        ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    ];
    currentPlayer = "white";
    selectedCell = null;
    moveHistory.length = 0; // Clear move history
    drawBoard();
}

// Initialize the game with touch event handling
function initializeGame() {
    drawBoard();
    
    // Prevent unwanted scrolling/zooming on mobile
    document.addEventListener('touchmove', function(event) {
        if (event.target.closest('.board')) {
            event.preventDefault();
        }
    }, { passive: false });
}

// Replace the final drawBoard() call with initializeGame()
initializeGame();
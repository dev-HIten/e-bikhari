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
let lastMovedPawn = null; // Track pawn that just moved two squares [row, col]
let kingsMoved = {
    white: false,
    black: false
};
let rooksMoved = {
    white: { left: false, right: false },
    black: { left: false, right: false }
};

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
                    if (fromRow - toRow === 1) return true;
                    if (fromRow === 6 && fromRow - toRow === 2 && boardState[fromRow - 1][fromCol] === "") return true;
                } else if (Math.abs(toCol - fromCol) === 1 && fromRow - toRow === 1 && targetColor === "black") {
                    return true;
                }
                // En passant
                else if (Math.abs(toCol - fromCol) === 1 && fromRow - toRow === 1 && 
                        lastMovedPawn && lastMovedPawn[0] === fromRow && lastMovedPawn[1] === toCol) {
                    return true;
                }
            }
            break;
        case "♟": // Black pawn
            if (color === "black") {
                if (toCol === fromCol && boardState[toRow][toCol] === "") {
                    if (toRow - fromRow === 1) return true;
                    if (fromRow === 1 && toRow - fromRow === 2 && boardState[fromRow + 1][fromCol] === "") return true;
                } else if (Math.abs(toCol - fromCol) === 1 && toRow - fromRow === 1 && targetColor === "white") {
                    return true;
                }
                // En passant
                else if (Math.abs(toCol - fromCol) === 1 && toRow - fromRow === 1 && 
                        lastMovedPawn && lastMovedPawn[0] === fromRow && lastMovedPawn[1] === toCol) {
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
        case "♔": // White king
        case "♚": // Black king
            // Normal king moves
            if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
                return true;
            }
            // Castling
            if (fromRow === toRow && Math.abs(fromCol - toCol) === 2) {
                if (!isKingInCheck(color)) {
                    if (color === "white" && !kingsMoved.white) {
                        // Kingside castling
                        if (toCol === 6 && !rooksMoved.white.right &&
                            isPathClear(fromRow, fromCol, toRow, 7) &&
                            !isSquareUnderAttack(fromRow, 5, color) &&
                            !isSquareUnderAttack(fromRow, 6, color)) {
                            return true;
                        }
                        // Queenside castling
                        if (toCol === 2 && !rooksMoved.white.left &&
                            isPathClear(fromRow, fromCol, toRow, 0) &&
                            !isSquareUnderAttack(fromRow, 3, color) &&
                            !isSquareUnderAttack(fromRow, 2, color)) {
                            return true;
                        }
                    } else if (color === "black" && !kingsMoved.black) {
                        // Kingside castling
                        if (toCol === 6 && !rooksMoved.black.right &&
                            isPathClear(fromRow, fromCol, toRow, 7) &&
                            !isSquareUnderAttack(fromRow, 5, color) &&
                            !isSquareUnderAttack(fromRow, 6, color)) {
                            return true;
                        }
                        // Queenside castling
                        if (toCol === 2 && !rooksMoved.black.left &&
                            isPathClear(fromRow, fromCol, toRow, 0) &&
                            !isSquareUnderAttack(fromRow, 3, color) &&
                            !isSquareUnderAttack(fromRow, 2, color)) {
                            return true;
                        }
                    }
                }
            }
            return false;
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

// Add these new helper functions
function isSquareUnderAttack(row, col, defendingColor) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = boardState[i][j];
            if (piece && getPieceColor(piece) !== defendingColor) {
                if (isValidMove(i, j, row, col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isKingInCheck(color) {
    // Find king's position
    let kingRow, kingCol;
    const kingPiece = color === "white" ? "♔" : "♚";
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (boardState[i][j] === kingPiece) {
                kingRow = i;
                kingCol = j;
                break;
            }
        }
    }
    return isSquareUnderAttack(kingRow, kingCol, color);
}

// Handle cell clicks
function handleCellClick(row, col) {
    // Prevent default touch behavior
    event?.preventDefault();
    
    if (selectedCell) {
        const [fromRow, fromCol] = selectedCell;
        const piece = boardState[fromRow][fromCol];
        
        if (isValidMove(fromRow, fromCol, row, col)) {
            moveHistory.push({
                board: JSON.parse(JSON.stringify(boardState)),
                lastMovedPawn: lastMovedPawn,
                kingsMoved: {...kingsMoved},
                rooksMoved: JSON.parse(JSON.stringify(rooksMoved))
            });

            // Handle en passant capture
            if ((piece === "♙" || piece === "♟") && 
                Math.abs(fromCol - col) === 1 && 
                boardState[row][col] === "") {
                boardState[fromRow][col] = ""; // Remove captured pawn
            }

            // Handle castling
            if ((piece === "♔" || piece === "♚") && Math.abs(fromCol - col) === 2) {
                // Kingside castling
                if (col === 6) {
                    boardState[row][5] = boardState[row][7];
                    boardState[row][7] = "";
                }
                // Queenside castling
                if (col === 2) {
                    boardState[row][3] = boardState[row][0];
                    boardState[row][0] = "";
                }
            }

            // Update piece tracking
            if (piece === "♔") kingsMoved.white = true;
            if (piece === "♚") kingsMoved.black = true;
            if (piece === "♖") {
                if (fromCol === 0) rooksMoved.white.left = true;
                if (fromCol === 7) rooksMoved.white.right = true;
            }
            if (piece === "♜") {
                if (fromCol === 0) rooksMoved.black.left = true;
                if (fromCol === 7) rooksMoved.black.right = true;
            }

            // Track pawn double moves for en passant
            if ((piece === "♙" || piece === "♟") && Math.abs(fromRow - row) === 2) {
                lastMovedPawn = [row, col];
            } else {
                lastMovedPawn = null;
            }

            // Make the move
            boardState[row][col] = boardState[fromRow][fromCol];
            boardState[fromRow][fromCol] = "";
            currentPlayer = currentPlayer === "white" ? "black" : "white";
            
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.style.backgroundColor = "var(--cell-moved)";
            setTimeout(() => cell.style.backgroundColor = "", 300);
        }
        selectedCell = null;
    } else if (boardState[row][col] && getPieceColor(boardState[row][col]) === currentPlayer) {
        selectedCell = [row, col];
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.style.backgroundColor = "var(--cell-selected)";
    }
    drawBoard();
}

// Undo the last move
function undoMove() {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        boardState = lastMove.board;
        lastMovedPawn = lastMove.lastMovedPawn;
        kingsMoved = lastMove.kingsMoved;
        rooksMoved = lastMove.rooksMoved;
        currentPlayer = currentPlayer === "white" ? "black" : "white";
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
    lastMovedPawn = null;
    kingsMoved = { white: false, black: false };
    rooksMoved = {
        white: { left: false, right: false },
        black: { left: false, right: false }
    };
    moveHistory.length = 0;
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
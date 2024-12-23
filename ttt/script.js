const cells = document.querySelectorAll('[data-cell]');
const result = document.getElementById('result');
const winnerMessage = document.getElementById('winner-message');
const restartButton = document.getElementById('restart-button');

let currentPlayer = 'X';

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

function checkWinner() {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        });
    });
}

function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
}

function handleClick(e) {
    const cell = e.target;

    // Mark cell
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    // Check for win or draw
    if (checkWinner()) {
        winnerMessage.textContent = `${currentPlayer} Wins!`;
        result.classList.remove('hidden');
    } else if (checkDraw()) {
        winnerMessage.textContent = `It's a Draw!`;
        result.classList.remove('hidden');
    } else {
        // Switch players
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function restartGame() {
    // Refresh the entire page
    window.location.reload();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleClick, { once: true }));
restartButton.addEventListener('click', restartGame);

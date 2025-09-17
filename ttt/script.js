document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status-message');
    const restartButton = document.getElementById('restart-button');
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;

    // Game State Variables
    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = ['', '', '', '', '', '', '', '', ''];

    // Winning Conditions
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Functions
    const handleCellClick = (e) => {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));

        if (boardState[cellIndex] !== '' || !gameActive) {
            return;
        }

        boardState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        checkResult();
        switchPlayer();
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `Player ${currentPlayer}'s turn`;
    };

    const checkResult = () => {
        let roundWon = false;
        let winningCombination = null;

        for (let i = 0; i < winConditions.length; i++) {
            const condition = winConditions[i];
            const a = boardState[condition[0]];
            const b = boardState[condition[1]];
            const c = boardState[condition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }

            if (a === b && b === c) {
                roundWon = true;
                winningCombination = condition;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            statusMessage.textContent = `Player ${currentPlayer} has won! 🎉`;
            highlightWinningCells(winningCombination);
            return;
        }

        const isDraw = !boardState.includes('');
        if (isDraw) {
            gameActive = false;
            statusMessage.textContent = "It's a draw! 🤝";
        }
    };

    const highlightWinningCells = (combination) => {
        combination.forEach(index => {
            cells[index].classList.add('win-cell');
        });
    };

    const restartGame = () => {
        gameActive = true;
        currentPlayer = 'X';
        boardState = ['', '', '', '', '', '', '', '', ''];
        statusMessage.textContent = `Player X's turn`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win-cell');
        });
    };

    const toggleMode = () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        // Save user preference
        const currentMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentMode);
    };

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    modeToggle.addEventListener('click', toggleMode);

    // Initial Setup
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme + '-mode');
    } else {
        body.classList.add('dark-mode'); // Default to dark mode
    }

    statusMessage.textContent = `Player X's turn`;
});
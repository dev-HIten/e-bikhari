// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const canvasSize = 400;
const initialLength = 3;

// Game state
let snake = [{ x: 80, y: 100 }, { x: 60, y: 100 }, { x: 40, y: 100 }];
let direction = 'RIGHT';
let food = { x: 200, y: 200 };
let score = 0;
let gameInterval;
let isGameOver = false;

// Set up canvas size
canvas.width = canvasSize;
canvas.height = canvasSize;

// Function to draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#39ff14' : '#ff0066'; // Head: Green, Body: Neon Pink
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Function to draw the food
function drawFood() {
    ctx.fillStyle = '#00ccff'; // Neon Blue Food
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'RIGHT') head.x += gridSize;

    snake.unshift(head); // Add new head to snake

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    // Check for game over conditions
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || collision(head)) {
        gameOver();
    }
}

// Function to check collision with body
function collision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Function to spawn food at random location
function spawnFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Function to update the score display
function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Function to end the game
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    ctx.fillStyle = '#ff0066';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 3, canvas.height / 2);
    ctx.fillText('Swipe or Press Arrow Keys to Restart', canvas.width / 4, canvas.height / 2 + 40);
}

// Function to start a new game
function restartGame() {
    snake = [{ x: 80, y: 100 }, { x: 60, y: 100 }, { x: 40, y: 100 }];
    direction = 'RIGHT';
    food = { x: 200, y: 200 };
    score = 0;
    isGameOver = false;
    updateScore();
    gameInterval = setInterval(gameLoop, 100);
}

// Function to handle the game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawSnake();
    drawFood();
    moveSnake();
    updateScore();
}

// Event listener for mobile swipe gestures
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== 'LEFT') direction = 'RIGHT';
        if (diffX < 0 && direction !== 'RIGHT') direction = 'LEFT';
    } else {
        if (diffY > 0 && direction !== 'UP') direction = 'DOWN';
        if (diffY < 0 && direction !== 'DOWN') direction = 'UP';
    }
});

// Event listener for keyboard arrow keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Start the
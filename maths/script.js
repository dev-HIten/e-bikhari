let score = 0;
let timeLeft = 60;
let timer;
let currentAnswer;
let highScore = localStorage.getItem('mathQuizHighScore') || 0;

const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const highScoreElement = document.getElementById('highScore');
highScoreElement.textContent = highScore;

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    const operations = [
        { symbol: '+', operation: (a, b) => a + b },
        { symbol: '-', operation: (a, b) => a - b },
        { symbol: '×', operation: (a, b) => a * b },
        { symbol: '÷', operation: (a, b) => a / b }
    ];

    let selectedOp;
    do {
        selectedOp = operations[Math.floor(Math.random() * operations.length)];
        if (selectedOp.symbol === '÷') {
            // Generate simpler division questions
            const divisor = Math.floor(Math.random() * 12) + 1; // 1-12 for easier division
            const dividend = divisor * (Math.floor(Math.random() * 10) + 1); // Ensures whole number result
            currentAnswer = dividend / divisor;
            questionElement.textContent = `${dividend} ${selectedOp.symbol} ${divisor} = ?`;
        } else {
            currentAnswer = selectedOp.operation(num1, num2);
            questionElement.textContent = `${num1} ${selectedOp.symbol} ${num2} = ?`;
        }
    } while (selectedOp.symbol === '÷' && num1 * num2 > 100);

    answerInput.value = '';
    resultElement.textContent = '';
    timeLeft = 60;
    clearInterval(timer);
    startTimer();
    
    // Remove any existing warning class
    document.querySelector('.timer').classList.remove('warning');
    
    // Enable input and button
    answerInput.disabled = false;
    submitButton.disabled = false;
    
    // Focus on input for better UX
    answerInput.focus();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        // Add warning class when time is low
        if (timeLeft <= 10) {
            document.querySelector('.timer').classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Update high score if current score is higher
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('mathQuizHighScore', highScore);
                highScoreElement.textContent = highScore;
            }
            resultElement.textContent = `Time's up! Final score: ${score}`;
            resultElement.className = 'result wrong';
            score = 0; // Reset score
            scoreElement.textContent = score;
            
            // Disable input and button during timeout
            answerInput.disabled = true;
            submitButton.disabled = true;
            
            setTimeout(generateQuestion, 2000);
        }
    }, 1000);
}

function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value);
    
    if (isNaN(userAnswer)) {
        showResult("Please enter a valid number", 'wrong');
        answerInput.value = '';
        return;
    }

    // Disable input and button while processing
    answerInput.disabled = true;
    submitButton.disabled = true;

    if (Math.abs(userAnswer - currentAnswer) < 0.1) {
        score++;
        scoreElement.textContent = score;
        showResult("Correct!", 'correct');
        
        document.querySelector('.quiz-box').classList.add('loading');
        setTimeout(() => {
            document.querySelector('.quiz-box').classList.remove('loading');
            generateQuestion();
        }, 1000);
    } else {
        showResult(`Wrong! The correct answer was ${currentAnswer}`, 'wrong');
        setTimeout(() => {
            generateQuestion();
        }, 2000);
    }
}

function showResult(message, className) {
    resultElement.textContent = message;
    resultElement.className = `result ${className}`;
}

// Debounce implementation
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Event listeners
const debouncedCheck = debounce(() => checkAnswer(), 300);

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!submitButton.disabled) {
        debouncedCheck();
    }
});

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !answerInput.disabled) {
        e.preventDefault();
        debouncedCheck();
    }
});

// Touch feedback with cleanup
document.querySelectorAll('.stat-item, button').forEach(element => {
    let touchTimeout;
    
    element.addEventListener('touchstart', function(e) {
        if (!element.disabled) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
        }
    });
    
    element.addEventListener('touchend', function() {
        this.style.transform = '';
        clearTimeout(touchTimeout);
    });
    
    element.addEventListener('touchcancel', function() {
        this.style.transform = '';
        clearTimeout(touchTimeout);
    });
});

// Initialize the quiz
generateQuestion();

let balance = 1000;

// Elements
const balanceDisplay = document.getElementById("balance");
const betAmountInput = document.getElementById("bet-amount");
const dice = document.getElementById("dice");
const outcomeMessage = document.getElementById("outcome-message");
const resetButton = document.getElementById("reset-btn");
const aboveButton = document.getElementById("above-btn");
const belowButton = document.getElementById("below-btn");
const sevenButton = document.getElementById("seven-btn");

// Update Balance Display
function updateBalanceDisplay() {
    balanceDisplay.textContent = balance;
}

// Generate Biased Dice Roll (Favoring Loss)
function rollDice() {
    const roll = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
    if (roll <= 40) {
        return Math.floor(Math.random() * 6) + 8; // Favoring numbers > 7 (winning for "Above 7")
    } else if (roll <= 55) {
        return 7; // Favoring "Exactly 7" wins occasionally
    } else {
        return Math.floor(Math.random() * 6) + 2; // Favoring numbers < 7 (winning for "Below 7")
    }
}

// Dice Animation
function animateDice(callback) {
    dice.textContent = "?";
    dice.style.animation = "roll 1s linear";
    setTimeout(() => {
        dice.style.animation = "none";
        callback();
    }, 1000);
}

// Handle Bet
function handleBet(prediction) {
    const betAmount = parseInt(betAmountInput.value);

    if (isNaN(betAmount) || betAmount <= 0) {
        outcomeMessage.textContent = "Enter a valid bet amount!";
        outcomeMessage.style.color = "yellow";
        return;
    }

    if (betAmount > balance) {
        outcomeMessage.textContent = "Not enough balance!";
        outcomeMessage.style.color = "red";
        return;
    }

    const roll = rollDice();
    animateDice(() => {
        dice.textContent = roll;

        let result = false;
        if (prediction === "above" && roll > 7) result = true;
        if (prediction === "seven" && roll === 7) result = true;
        if (prediction === "below" && roll < 7) result = true;

        if (result) {
            const payout = prediction === "seven" ? betAmount * 3 : betAmount * 2;
            balance += payout;
            outcomeMessage.textContent = `🎉 You won ${payout} coins!`;
            outcomeMessage.style.color = "#00ff88";
        } else {
            balance -= betAmount;
            outcomeMessage.textContent = `😢 You lost ${betAmount} coins!`;
            outcomeMessage.style.color = "red";
        }

        if (balance <= 0) {
            outcomeMessage.textContent = "💔 Game Over! Reset to play again.";
            balance = 0;
        }

        updateBalanceDisplay();
    });
}

// Reset Game
function resetGame() {
    balance = 1000;
    updateBalanceDisplay();
    dice.textContent = "?";
    outcomeMessage.textContent = "Game reset! Start betting.";
    outcomeMessage.style.color = "white";
}

// Event Listeners
aboveButton.addEventListener("click", () => handleBet("above"));
belowButton.addEventListener("click", () => handleBet("below"));
sevenButton.addEventListener("click", () => handleBet("seven"));
resetButton.addEventListener("click", resetGame);

// Initial Setup
updateBalanceDisplay();
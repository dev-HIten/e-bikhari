const yard = document.querySelector(".yard");
const flags = document.querySelector(".flags");
const timerElement = document.querySelector(".timer");
const dropdown = document.querySelector(".difficulty-container");
const popup = document.getElementById("myModal");
const difficultySelector = document.querySelector(".difficulty-dropdown");

let minesCount;
let index = [];
let tileNo = 1;
let mineTiles = {};
let noOnTiles = {};
let noOfFlags;
let tilesCleared;
let timerStarted = false;
let timer = null;
let safeTiles;
let once = true;

let hours = 0;
let minutes = 0;
let seconds = 0;
let toggle = 1;

function boardSetup() {
    
    for(let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        yard.append(row);
        toggle = (i % 2 === 0) ? 1 : 0;
        for(let j = 1; j <= 10; j++) {

            const buttons = document.createElement("button");
            buttons.id = tileNo;
            (j % 2 === toggle) ? buttons.classList.add("tile", "tile1") : buttons.classList.add("tile", "tile2");
            row.append(buttons)
            mineTiles[tileNo] = false;
            tileNo++;
        }

    }
    const difficulty = getCookie("difficulty") || "easy";
    setDifficulty(difficulty);
    
}

function minesSetup() {
    const tiles = Array.from({ length: 100 }, (_, i) => i + 1);
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    const mineTilesArray = tiles.slice(0, minesCount);
    mineTilesArray.forEach(tile => {
        mineTiles[tile] = true

    });
    for (let i = 1; i <= Object.keys(mineTiles).length; i++) {
        if (mineTiles[i] === false) {
            noOnTiles[i] = noOfMines(i);
            

        }
    }
}

function noOfMines(tileNo, mineNo = false) {
    let tiles = [];
    let mines = 0;
    switch (true) {
        case tileNo === 1:
            tiles.push(2, 11, 12);
            break;

        case tileNo === 10:
            tiles.push(9, 20, 19);
            break;

        case tileNo === 91:
            tiles.push(82, 81, 92);
            break;

        case tileNo === 100:
            tiles.push(89, 90, 99);
            break;

        case tileNo > 1 && tileNo < 10:
            tiles.push(tileNo + 10, tileNo + 11, tileNo + 9, tileNo - 1, tileNo + 1);
            break;

        case tileNo > 91 && tileNo < 100:
            tiles.push(tileNo - 10, tileNo - 11, tileNo - 9, tileNo - 1, tileNo + 1);
            break;

        case tileNo >= 20 && tileNo <= 90 && tileNo % 10 === 0:
            tiles.push(tileNo - 1, tileNo + 10, tileNo - 10, tileNo - 11, tileNo + 9);
            break;

        case tileNo >= 11 && tileNo <= 81 && (tileNo - 1) % 10 === 0:
            tiles.push(tileNo + 1, tileNo + 10, tileNo - 10, tileNo + 11, tileNo - 9);
            break;

        default:
            tiles.push(tileNo + 1, tileNo - 1, tileNo + 10, tileNo - 10, tileNo + 11, tileNo + 9, tileNo - 11, tileNo - 9);
            break;
    }
    if (!mineNo) {
        for (let tile of tiles) {
            if (mineTiles[tile] === true) {
                mines++;
            }
        }
        return mines || "";
    } else{
        return tiles;
    }
    
}


function startTimer() {
    timer = setInterval(() => {
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes === 60) {
            hours++;
        }
        if (hours === 60) {
            gameOver(false);
        }
        seconds++;
        
        timerElement.textContent = `⏱: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

    }, 1000);
}

yard.addEventListener("mousedown", event => {
    const button = event.target;
    if (!button.classList.contains("tile")) return;

    const tileNo = Number(button.id);
    if (!timerStarted) {
        timerStarted = true;
        startTimer();
    }

    if (event.button === 0) {

        
        if (dropdown.style.display == "flex" && !button.classList.contains("difficulty-dropdown")) {
        dropdown.style.display = "none";
        
        }
        
        if (button.textContent == "") {
            button.textContent = setNoOfMines(tileNo);
            button.disabled = true;
            button.style.backgroundColor = (button.classList.contains("tile1")) ? "white" : "rgb(245, 245, 245)";
            button.style.cursor = "default";
            tilesCleared++;
            
            switch(button.textContent) {
                case "":
                    clearTiles(tileNo);
                    break;
                
                case '1':
                button.style.color = "blue";
                break;
                
                case '2':
                    button.style.color = "green";
                    break;

                case '3':
                    button.style.color = "red";
                    break;
                
                case '4':
                    button.style.color = "purple";
                    break;

                case '5':
                    button.style.color = "orange";
                    break;

                case '6':
                    button.style.color = "lightblue";
                    break;

                case '7':
                    button.style.color = "yellow";
                    break;

                case '8':
                    button.style.color = "lightpurple";
                    break;
            }
            
            if (tilesCleared == safeTiles) {
                gameOver(true);
            }
        }
        

    } else if (event.button === 2) {

        if (button.textContent === "" && noOfFlags > 0) {
            button.textContent = "🚩"
            noOfFlags--;
            flags.textContent = `🚩 : ${noOfFlags}`;

        } else if (button.textContent === "🚩") {
            button.textContent = "";
            noOfFlags++;
            flags.textContent = `🚩 : ${noOfFlags}`;
            
        }
    }

    button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    
    });

});

function setNoOfMines(tileNo) {
    const button = document.getElementById(tileNo);
    if (mineTiles[tileNo] === true) {
        gameOver(false);
        button.style.backgroundImage = "url(https://freepngimg.com/thumb/android/91765-minesweeper-star-microsoft-symmetry-classic-free-hq-image.png)";
        button.style.backgroundSize = "50%";
        button.style.backgroundRepeat = "no-repeat";
        button.style.backgroundPosition = "center";
        return;
    }

    if (once) clearTiles(tileNo);
    once = false;
    button.textContent = noOnTiles[tileNo];
    return noOnTiles[tileNo]; 

}

function clearTiles(tileNo) {

    let recursionTiles = noOfMines(tileNo, true);
    let button = null;

    recursionTiles.forEach(tile => {
        if (mineTiles[tile] === false) {
            button = document.getElementById(tile);
            
            if (button.disabled === false) {
                button.textContent = noOnTiles[tile];
                button.disabled = true;
                button.style.backgroundColor = (button.classList.contains("tile1")) ? "white" : "rgb(245, 245, 245)";
                button.style.cursor = "default";
                tilesCleared++;

                switch(button.textContent) {
                    case "":
                        clearTiles(tile);
                        break;
        
                    case '1':
                        button.style.color = "blue";
                        break;
                    
                    case '2':
                        button.style.color = "green";
                        break;
        
                    case '3':
                        button.style.color = "red";
                        break;
                    
                    case '4':
                        button.style.color = "purple";
                        break;
        
                    case '5':
                        button.style.color = "orange";
                        break;
        
                    case '6':
                        button.style.color = "lightblue";
                        break;
        
                    case '7':
                        button.style.color = "yellow";
                        break;
        
                    case '8':
                        button.style.color = "lightpurple";
                        break;
                }
            }
            
        }
    });

    if (tilesCleared == safeTiles) {
        gameOver(true);
    }

}

function gameOver(win, difficulty = "easy") {
    const allButtons = document.querySelectorAll(".tile");
    const result = document.getElementById("result");
    const restart = document.getElementById("closeModal");
    const time = document.getElementById("time");
    const cancel = document.querySelector(".cancel-btn");

    cancel.addEventListener("click", event => {
        if (popup.style.display == "flex") {
            popup.style.display = "none";
        }
    });
    
    if (win === true) {
        allButtons.forEach(button => {
            button.disabled = true;
            button.style.cursor = "default";
        });
        result.textContent = "You Won!";
        time.textContent = `Your Time: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        clearInterval(timer);
        timerStarted = false;
        popup.style.display = "flex";

        restart.addEventListener("click", event => {
            location.reload();
        });
        
    } else if (win === false) {
        result.textContent = "Game Over!";
        time.textContent = `Your Time: ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        clearInterval(timer);
        timerStarted = false;
        popup.style.display = "flex";

        restart.addEventListener("click", event => {
            location.reload();
        });

        allButtons.forEach(button => {
            button.disabled = true;
            button.style.cursor = "default";
            if (mineTiles[button.id] === true) {
                button.textContent = "";
                button.style.backgroundImage = "url(https://freepngimg.com/thumb/android/91765-minesweeper-star-microsoft-symmetry-classic-free-hq-image.png)";
                button.style.backgroundSize = "50%";
                button.style.backgroundRepeat = "no-repeat";
                button.style.backgroundPosition = "center";
                button.style.backgroundColor = (button.classList.contains("tile1")) ? "white" : "rgb(245, 245, 245)";
                
            }
        });

    } else if (win === null){
        result.textContent = "Are you sure you wanna restart the game?";
        time.textContent = "";
        popup.style.display = "flex";
        restart.addEventListener("click", event => {
            clearInterval(timer);
            timerStarted = false;
            popup.style.display = "none";

            resetBoard(difficulty);
            
        });

    }

}

function showDropDown() {
    
    if (dropdown.style.display == "flex") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "flex";
    }
    
}

document.body.addEventListener("click", event => {
    
    const click = event.target;
    if (event.button === 0 && dropdown.style.display == "flex" && !click.classList.contains("difficulty-dropdown")) {
        dropdown.style.display = "none";
        
    } 
});

function setDifficulty(difficulty) {
    document.cookie = `difficulty=${difficulty}; path=/;`;
    if (difficulty.toLowerCase() == "easy") {
        minesCount = 10;

    } else if (difficulty.toLowerCase() == "medium") {
        minesCount = 20;

    } else if (difficulty.toLowerCase() == "hard") {
        minesCount = 30;

    }
    noOfFlags = minesCount;
    safeTiles = 100 - minesCount;
    tilesCleared = 0;
    flags.textContent =  `🚩 : ${noOfFlags}`;
    difficultySelector.textContent = `Difficulty: ${difficulty}`;
    minesSetup();
}

function resetBoard(difficulty) {
    const allButtons = document.querySelectorAll(".tile");
    clearInterval(timer);
    timerStarted = false;

    once = true;
    hours = 0;
    minutes = 0;
    seconds = 0;

    timerElement.textContent = `⏱: 00:00:00`;

    allButtons.forEach(button => {
        mineTiles[button.id] = false;
        button.disabled = false;
        button.style.cursor = "pointer";
        button.textContent = "";
        button.style.backgroundColor = (button.classList.contains("tile1")) ? "rgb(0, 179, 0)" : (button.classList.contains("tile2")) ? "rgb(0, 165, 0)" : "none";
    });
    setDifficulty(difficulty);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null; // Return null if the cookie doesn't exist
}
        
boardSetup();
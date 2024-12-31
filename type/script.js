const textDisplay = document.querySelector('.text-display');
const textInput = document.querySelector('.text-input');
const timerElement = document.querySelector('.timer');
const wpmElement = document.querySelector('.wpm');
const accuracyElement = document.querySelector('.accuracy');
const restartBtn = document.querySelector('.restart-btn');

const sampleTexts = [
    "The human brain is a remarkable organ that processes vast amounts of information every second. It controls our thoughts, memories, emotions, and physical movements. Scientists continue to discover new aspects of its complexity, from neural pathways to cognitive functions.",
    
    "Climate change represents one of the most significant challenges facing our planet today. Rising temperatures, extreme weather events, and melting ice caps are just some of the observable effects. Scientists worldwide are working to develop sustainable solutions.",
    
    "The evolution of technology has transformed how we live, work, and communicate. From smartphones to artificial intelligence, innovations continue to reshape society at an unprecedented pace. While these advances bring numerous benefits and challenges.",
    
    "The art of storytelling has been central to human culture throughout history. Stories help us make sense of the world, share experiences, and preserve cultural heritage. Whether through oral traditions or modern digital media.",
    
    "Space exploration continues to captivate human imagination and drive scientific innovation. From the first moon landing to modern Mars missions, our quest to understand the cosmos has led to countless technological breakthroughs and discoveries.",
    
    "The global food system faces unprecedented challenges in feeding a growing population sustainably. Innovation in agriculture, reducing waste, and changing consumption patterns are key to ensuring food security for future generations.",
    
    "Ocean conservation has become increasingly crucial as marine ecosystems face multiple threats. Plastic pollution, overfishing, and climate change impact these delicate environments that are vital to Earth's biodiversity and human survival.",
    
    "The development of renewable energy sources marks a crucial shift in how we power our world. Solar, wind, and hydroelectric power offer sustainable alternatives to fossil fuels, helping combat climate change and energy insecurity.",
    
    "Digital privacy has emerged as a fundamental concern in our connected world. The balance between technological convenience and personal data protection challenges individuals, companies, and governments in the information age.",
    
    "The human immune system is an incredibly complex defense mechanism. It protects us from countless pathogens while maintaining the delicate balance necessary for our survival. Understanding its function is crucial for modern medicine.",
    
    "Artificial intelligence continues to evolve and reshape various industries. From healthcare to transportation, AI applications are becoming increasingly sophisticated, raising both exciting possibilities and important ethical considerations."
];

let timeLeft = 60;
let timer = null;
let isTestActive = false;
let correctCharacters = 0;
let totalCharacters = 0;

function initializeTest() {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    textDisplay.innerHTML = randomText.split('').map(char => 
        `<span>${char}</span>`
    ).join('');
    textInput.value = '';
    timeLeft = 60;
    timerElement.textContent = timeLeft;
    isTestActive = false;
    correctCharacters = 0;
    totalCharacters = 0;
    updateStats();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        updateStats();
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    clearInterval(timer);
    textInput.disabled = true;
    isTestActive = false;
}

function updateStats() {
    const minutes = (60 - timeLeft) / 60;
    const wpm = Math.round((correctCharacters / 5) / minutes) || 0;
    const accuracy = totalCharacters > 0 
        ? Math.round((correctCharacters / totalCharacters) * 100) 
        : 100;

    wpmElement.textContent = `${wpm} WPM`;
    accuracyElement.textContent = `${accuracy}% ACC`;
}

textInput.addEventListener('input', () => {
    if (!isTestActive) {
        isTestActive = true;
        startTimer();
    }

    const inputText = textInput.value;
    const characters = textDisplay.querySelectorAll('span');
    
    totalCharacters = inputText.length;
    correctCharacters = 0;

    characters.forEach((char, index) => {
        char.classList.remove('correct', 'incorrect', 'current');
        
        if (index < inputText.length) {
            if (char.textContent === inputText[index]) {
                char.classList.add('correct');
                correctCharacters++;
            } else {
                char.classList.add('incorrect');
            }
        } else if (index === inputText.length) {
            char.classList.add('current');
        }
    });

    updateStats();
});

restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    textInput.disabled = false;
    initializeTest();
});

initializeTest();

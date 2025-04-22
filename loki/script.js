const rainShitButton = document.getElementById('rainShit');
const shitRainContainer = document.getElementById('shitRainContainer');
const mainImage = document.getElementById('mainImage');
const fuckVideo = document.getElementById('fuckVideo');
const gymVideo = document.getElementById('gymVideo');
const cutVideo = document.getElementById('cutVideo');
const videoContainer = document.querySelector('.video-container');
const videos = {
    'playFuck': fuckVideo,
    'playGym': gymVideo,
    'playCut': cutVideo
};
let currentVideo = null;

function playVideo(videoId) {
    if (currentVideo) {
        currentVideo.style.display = 'none';
        currentVideo.pause();
    }

    const videoElement = videos[videoId];
    if (videoElement) {
        mainImage.style.opacity = 0;
        videoElement.style.display = 'block';
        videoElement.controls = false;
        videoElement.muted = false;
        videoElement.play();
        currentVideo = videoElement;

        videoElement.addEventListener('ended', () => {
            videoElement.style.display = 'none';
            mainImage.style.opacity = 1;
            currentVideo = null;
        }, { once: true }); // Ensure the listener runs only once
    }
}

rainShitButton.addEventListener('click', () => {
    const rainInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const shitEmoji = document.createElement('div');
            shitEmoji.textContent = '💩';
            shitEmoji.classList.add('shit-emoji');
            const randomX = Math.random() * videoContainer.offsetWidth;
            shitEmoji.style.setProperty('--random-x', `${randomX}px`);
            shitEmoji.style.left = `${randomX}px`;
            shitRainContainer.appendChild(shitEmoji);

            shitEmoji.addEventListener('animationend', () => {
                shitEmoji.remove();
            });
        }
    }, 500);

    setTimeout(() => {
        clearInterval(rainInterval);
    }, 2000);
});

document.getElementById('playFuck').addEventListener('click', () => playVideo('playFuck'));
document.getElementById('playGym').addEventListener('click', () => playVideo('playGym'));
document.getElementById('playCut').addEventListener('click', () => playVideo('playCut'));

// Crop vertical videos
Object.values(videos).forEach(video => {
    video.addEventListener('loadedmetadata', () => {
        if (video.videoWidth < video.videoHeight) {
            video.style.objectFit = 'contain';
        }
    });
});
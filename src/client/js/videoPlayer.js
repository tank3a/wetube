const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 1;
video.volume = volumeValue;

const handlePlayClick = (event) => {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
}
const handleMute = (event) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "unmute" : "mute";
    volumeRange.value = video.muted ? 0 : (volumeValue === "0" ? 0.5 : volumeValue);
    volumeValue = volumeRange.value;
}
const handleVolumeChange = (event) => {
    const {
        target: {value},
    } = event;
    if(video.muted && value !== "0") {
        video.muted = false;
        muteBtn.innerText = "mute";
    }
    console.log(typeof value);
    if(value === "0") {
        video.muted = true;
        muteBtn.innerText = "unmute";
    }
    volumeValue = value;
    video.volume = value;
}
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
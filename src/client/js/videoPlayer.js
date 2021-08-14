const video = document.querySelector("video");
const videoContainer = document.querySelector(".video_video");
const videoControls = document.querySelector(".video_video__controls");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullScreen");

let volumeValue = 1;
video.volume = volumeValue;

let controlsTimeout = null;
let controlsMovementTimeout = null;

const formatTimeMaxSec = (seconds) => new Date(seconds * 1000).toISOString().substr(15, 4);
const formatTimeMaxMin = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);
const formatTimeMaxHour = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);
const videoTimeControl = (seconds) => {
    if(seconds < 10*60) {
        return formatTimeMaxSec(seconds);
    } else if( seconds < 60*60) {
        return formatTimeMaxMin(seconds);
    } else {
        return formatTimeMaxHour(seconds);
    }
}

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
const handleLoadedMetaData = () => {
    totalTime.innerText = videoTimeControl(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
}
const handleTimeUpdate = (event) => {
    currentTime.innerText = videoTimeControl(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
}
const handleTimelineChange = (event) => {
    const {
        target: {value},
    } = event;

    video.currentTime = value;
}

const hideControls = () => videoControls.classList.remove("showing");
const handleMouseMove = (event) => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}
const handleMouseLeave = (event) => {
    controlsTimeout = setTimeout(hideControls, 3000);
}

const handleFullScreen = () => {
    if(document.fullscreenElement === null) {
        fullScreenBtn.innerText = "Exit full Screen";
        videoContainer.requestFullscreen();
    } else {
        fullScreenBtn.innerText = "Enter full Screen";
        document.exitFullscreen();
    }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
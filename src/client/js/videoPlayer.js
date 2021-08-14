const video = document.querySelector("video");
const videoContainer = document.querySelector(".video_video");
const videoControls = document.querySelector(".video_video__controls");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");

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

const handleKeyDown = (event) => {
    const { code } = event;
    if(code === "Space") {
        handlePlayClick();
    } else if(code === "ArrowRight") {
        video.currentTime = video.currentTime + 3;
    } else if(code === "ArrowLeft") {
        video.currentTime = video.currentTime - 3;
    }
}
const handlePlayClick = (event) => {
    video.focus();
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
}
const handleMute = (event) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    if(video.muted) {
        volumeRange.value = 0;
    } else {
        if(volumeValue === "0") {
            volumeRange.value = 0.5;
            volumeValue = volumeRange.value;
        }
        volumeRange.value = volumeValue;
    }
    muteBtnIcon.className = video.muted ? "fas fa-volume-mute"  : (volumeValue > 0.5 ? "fas fa-volume-up" : "fas fa-volume-down");
}
const handleVolumeChange = (event) => {
    const {
        target: {value},
    } = event;
    muteBtnIcon.className = value > 0.5 ? "fas fa-volume-up" : "fas fa-volume-down";
    if(video.muted) {
        video.muted = false;
    }
    if(value === "0") {
        video.muted = true;
        muteBtnIcon.className = "fas fa-volume-mute";
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
        fullScreenBtnIcon.className = "fas fa-compress-alt";
        videoContainer.requestFullscreen();
    } else {
        fullScreenBtnIcon.className = "fas fa-expand-alt";
        document.exitFullscreen();
    }
};
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayClick);
video.addEventListener("dblclick", handleFullScreen);
document.addEventListener("keydown", handleKeyDown);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
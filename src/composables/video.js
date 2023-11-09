import hls from "hls.js";

export function changeVideo(state, video, url) {
    if (!video || !url) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
    } else if (hls.isSupported()) {
        const h = new hls();
        h.loadSource(url);
        h.attachMedia(video);
        console.log('hls.js loaded...');
    }
    playVideo(state, video);
}

export const playVideo = (state, video) => {
    if (video.paused) {
        video.play();
        state.playing = true;
    } else {
        video.pause();
        state.playing = false;
    }
}

export const toggleMute = (state, video, volume) => {
    state.muted = video.muted = !video.muted;
    if (video.muted) {
        volume.setAttribute("data-volume", state.volume);
        state.volume = 0;
    } else {
        state.volume = volume.value = volume.dataset.volume;
    }
}

export const changeVolume = (state, video, volume) => {
    if (video.muted) {
        toggleMute(state, video, volume);
    }
    video.volume = volume.value;
}

export const toggleFullScreen = (state, player) => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        state.fullscreen = false;
    } else if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
        state.fullscreen = false;
    } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen();
        state.fullscreen = true;
    } else {
        player.requestFullscreen();
        state.fullscreen = true;
    }
}
<script setup>
import { reactive, ref, onMounted, watchEffect } from "vue";
import { playVideo, toggleMute, changeVideo, changeVolume, toggleFullScreen } from "../composables/video";

const props = defineProps(["src", "title", "logo"]);

const state = reactive({
    playing: false,
    volume: 0,
    fullscreen: false,
    muted: false
});

const video = ref();
const volume = ref();
const player = ref();


onMounted(() => {
    state.muted = video.value.muted;
    state.volume = video.value.volume;
    watchEffect(() => changeVideo(state, video.value, props.src));
});

function updateFullscreen() {
    state.fullscreen = !!document.fullscreenElement;
}

</script>

<template>
    <div ref="player" class="player" @fullscreenchange="updateFullscreen">
        <div class="w-full h-full aspect-video overflow-hidden">
            <video @click="() => props.src && playVideo(state, video)" class="border-2" ref="video" preload="metadata">
                Your browser does not support the video tag.
            </video>
        </div>
        <div class="flex items-center p-1.5 w-full overflow-x-auto">
            <div class="flex-centered">
                <button @click="() => props.src && playVideo(state, video)">
                    <svg>
                        <use v-if="!state.playing" href="#play"></use>
                        <use v-else href="#pause"></use>
                    </svg>
                </button>
            </div>
            <div class="flex-grow text-left flex-centered py-2 px-2">
                <img v-if="props.logo" :src="props.logo" class="w-4 h-4 mr-1" />
                <div v-text="props.title" class="truncate"></div>
            </div>
            <div class="flex-centered space-x-2 mr-2">
                <button @click="() => toggleMute(state, video, volume)">
                    <svg>
                        <use v-if="state.muted || state.volume == 0" href="#mute"></use>
                        <use v-else-if="!state.muted && state.volume > 0 && state.volume <= 0.5" href="#low-volume"></use>
                        <use v-else href="#high-volume"></use>
                    </svg>
                </button>
                <input ref="volume" v-model="state.volume" @change="() => changeVolume(state, video, volume)" data-volume="0.5" type="range" min="0" max="1" step="0.01">
            </div>
            <div class="flex-centered">
                <button @click="() => toggleFullScreen(state, player)">
                    <svg>
                        <use v-if="!state.fullscreen" href="#enter-fullscreen"></use>
                        <use v-else href="#exit-fullscreen"></use>
                    </svg>
                </button>
            </div>
        </div>
        <svg style="display: none">
            <defs>
                <symbol id="pause" viewBox="0 0 24 24">
                    <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
                </symbol>

                <symbol id="play" viewBox="0 0 24 24">
                    <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
                </symbol>

                <symbol id="high-volume" viewBox="0 0 24 24">
                <path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
                </symbol>

                <symbol id="low-volume" viewBox="0 0 24 24">
                <path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
                </symbol>

                <symbol id="mute" viewBox="0 0 24 24">
                <path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
                </symbol>

                <symbol id="enter-fullscreen" viewBox="0 0 24 24">
                <path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z"></path>
                </symbol>

                <symbol id="exit-fullscreen" viewBox="0 0 24 24">
                <path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>
                </symbol>

            </defs>
        </svg>
    </div>
</template>

<style scoped>
.player {
    @apply flex flex-col container max-w-5xl mx-auto aspect-video;
}

.player > div {
    @apply box-border w-full max-w-full;
}

video {
    @apply w-full h-full max-w-full max-h-full bg-black border border-black;
}

button {
    @apply relative p-1.5 cursor-pointer;
}

button > svg {
    @apply w-8 h-8 fill-current stroke-current;
}

input[type=range] {
    @apply w-16;
}

.flex-centered {
    @apply flex items-center;
}
</style>
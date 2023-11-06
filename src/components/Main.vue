<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { getChannels, getResolutions } from "../composables/channels";

const categories = [
    "Animation",
    "Auto",    
    "Cooking",	
    "Family",  
    "Relax",	 
    "Science", 
    "Weather",	
    "Travel",	
    "Outdoor",
];

const player = ref();

const channels = ref([]);

const category = ref(categories[5]);

const channelURL = ref(null);

const resolutions = ref([]);
const resolution = ref();

onMounted(() => {

    watchEffect(async () => {
        const c = category.value.toLowerCase();
        console.log("fetching channels for : ", c);
        const r = await getChannels(c);
        channels.value = r;
        console.log("channels for : ", c, r);
    });

    watchEffect(async () => {
        const url = channelURL.value;
        if (!url) return;
        console.log("Now streaming : ", url);
        player.value.src = url;
        player.value.play();
        const r = await getResolutions(url);
        resolutions.value = r;
        console.log("resolutions: ", r);
    });

    watchEffect(() => {
        const r = resolution.value;
        if (r) {
            player.value.src = r;
            player.value.play();
        }
    });

});

</script>

<template>
    <div class="flex flex-col space-y-3 justify-center place-items-center p-2 sm:p-4 lg:p-6">
        <div class="w-full px-4">
            <video ref="player" controls preload="auto">
                Your browser does not support the video tag.
            </video>
        </div>
        <div class="flex space-x-4 align-center justify-center">
            <div>
                <label for="categories" class="block mb-2 text-sm font-medium">Category</label>
                <select v-model="category" id="categories" class="block w-full p-2.5">
                    <option selected disabled>Choose a category</option>
                    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
            </div>
            <div>
                <label for="channels" class="block mb-2 text-sm font-medium">TV Channels</label>
                <select v-model="channelURL" id="channels" class="block w-full p-2.5">
                    <option selected disabled>Choose a channel</option>
                    <option v-for="c in channels" :key="c.name" :value="c.url">{{ c.name }}</option>
                </select>
            </div>
            <div>
                <label for="resolution" class="block mb-2 text-sm font-medium">Resolution</label>
                <select v-model="resolution" id="resolution" class="block w-full p-2.5">
                    <option selected disabled>Choose a resolution</option>
                    <option v-for="r in resolutions" :key="r.text" :value="r.value">{{ r.text }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped>
video {
    @apply aspect-video min-h-full min-w-full max-w-6xl inline-block mx-auto object-cover
    border border-black;
}
</style>
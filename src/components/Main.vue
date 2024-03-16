<script setup>
import { reactive, ref, onMounted, watchEffect } from "vue";
import { getChannels, getResolutions } from "../composables/channels";
import VPlayer from "./VideoPlayer.vue";

const categories = [
    "Animation",
    "Auto",
    "Business",
    "Classic",
    "Comedy",
    "Cooking",
    "Culture",
    "Documentary",
    "Education",
    "Family",
    "Kids",
    "Legislative",
    "Lifestyle",
    "Movies",
    "Music",
    "Outdoor",
    "Relax",
    "Science",
    "Series",
    "Shop",
    "Sports",
    "Travel",
    "Weather",
];

const category = ref(categories[0]);

const channels = ref([]);
const channelID = ref(null);
const channel = reactive({
    name: null,
    tvgLogo: null,
    url: null
});

const resolutions = ref([]);
const resolution = ref();

const playing = ref(false);

onMounted(() => {

    let isSameChannel = false;

    watchEffect(() => {
        const index = channelID.value;
        if (index && channels.value[index - 1]) {
            const { name, url, tvgLogo } = channels.value[index - 1];
            channel.name = name;
            channel.url = url;
            channel.tvgLogo = tvgLogo;
            isSameChannel = false;
        }
    });

    watchEffect(async () => {
        const c = category.value.toLowerCase();
        console.log("fetching channels for : ", c);
        const r = await getChannels(c);
        channels.value = r.map((c, i) => { c.i = i + 1; return c; });
        console.log("channels for : ", c, r);
        if (channels.value.length > 0) channelID.value = channels.value[0].i;
    });

    watchEffect(async () => {
        const url = channel.url;
        if (url && !isSameChannel) {
            const r = await getResolutions(url);
            resolutions.value = r;
            console.log("resolutions: ", r);
        }
    });

    watchEffect(() => {
        isSameChannel = true;
        channel.url = resolution.value;
    });

});

</script>

<template>
    <div class="container mx-auto relative">
        <div v-if="!playing" class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center italics">
            <svg class="inline w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path fill="currentColor" d="M25 18c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1"/><path fill="currentColor" d="M25 42c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1m4-23c-.2 0-.3 0-.5-.1c-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3c.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4M17 39.8c-.2 0-.3 0-.5-.1c-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3c.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4" opacity="0.3"/><path fill="currentColor" d="M21 19c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3c.4-.3 1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3c-.2.2-.3.2-.5.2" opacity="0.93"/><path fill="currentColor" d="M33 39.8c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3c.4-.3 1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3c-.2.1-.3.2-.5.2" opacity="0.3"/><path fill="currentColor" d="M17 26H9c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1" opacity="0.65"/><path fill="currentColor" d="M41 26h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1" opacity="0.3"/><path fill="currentColor" d="M18.1 21.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3c.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3c-.2.3-.5.4-.8.4" opacity="0.86"/><path fill="currentColor" d="M38.9 33.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3c.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3c-.2.3-.5.4-.8.4" opacity="0.3"/><path fill="currentColor" d="M11.1 33.9c-.3 0-.6-.2-.8-.5c-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3c.3.4.1 1-.3 1.3l-6.9 4c-.1.2-.3.2-.5.2" opacity="0.44"/><path fill="currentColor" d="M31.9 21.9c-.3 0-.6-.2-.8-.5c-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3c.3.4.1 1-.3 1.3l-6.9 4c-.2.2-.3.2-.5.2" opacity="0.3"/></svg>
            loading...
        </div>
        <VPlayer @play="x => playing = x" :title="channel.name || 'Select a channel'" :src="channel.url" :logo="channel.tvgLogo" />
        <div
            class="flex flex-col sm:flex-row px-4 py-6 space-y-4 sm:space-y-0 sm:space-x-4 align-center justify-center">
            <div>
                <label for="categories">Category</label>
                <select v-model="category" id="categories">
                    <option selected disabled>Choose a category</option>
                    <option v-for="(c,i) in categories" :key="i" :value="c">{{ c }}</option>
                </select>
            </div>
            <div>
                <label for="channels">TV Channels</label>
                <select v-model="channelID" id="channels">
                    <option selected disabled>Choose a channel</option>
                    <option v-for="(c,i) in channels" :key="i" :value="c.i">{{ c.name }}</option>
                </select>
            </div>
            <div>
                <label for="resolution">Resolution</label>
                <select v-model="resolution" id="resolution">
                    <option selected disabled>Choose a resolution</option>
                    <option v-for="(r,i) in resolutions" :key="i" :value="r.value">{{ r.text }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped>
label {
    @apply block mb-2 text-sm font-medium;
}

select {
    @apply block w-full px-2.5 py-1.5 rounded-lg text-gray-100 bg-slate-600;
}
</style>
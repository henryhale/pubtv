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
    "Travel",	
    "Weather",	
];

const category = ref(categories[5]);

const channels = ref([]);
const channelID = ref(null);
const channel = reactive({
    name: null,
    tvgLogo: null,
    url: null
});

const resolutions = ref([]);
const resolution = ref();

onMounted(() => {

    let isSameChannel = false;

    watchEffect(() => {
        const index = channelID.value;
        if (index) {
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
        channels.value = r.map((c, i) => { c.i = i+1; return c; });
        console.log("channels for : ", c, r);
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
    <div class="container mx-auto">
        <VPlayer :title="channel.name || 'Select a channel'" :src="channel.url" :logo="channel.tvgLogo" />
        <div class="flex flex-col sm:flex-row px-4 py-6 space-y-4 sm:space-y-0 sm:space-x-4 align-center justify-center">
            <div>
                <label for="categories">Category</label>
                <select v-model="category" id="categories">
                    <option selected disabled>Choose a category</option>
                    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
            </div>
            <div>
                <label for="channels">TV Channels</label>
                <select v-model="channelID" id="channels">
                    <option selected disabled>Choose a channel</option>
                    <option v-for="c in channels" :key="c.name" :value="c.i">{{ c.name }}</option>
                </select>
            </div>
            <div>
                <label for="resolution">Resolution</label>
                <select v-model="resolution" id="resolution">
                    <option selected disabled>Choose a resolution</option>
                    <option v-for="r in resolutions" :key="r.text" :value="r.value">{{ r.text }}</option>
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
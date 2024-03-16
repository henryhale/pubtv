import axios from "axios";
import { parseM3U } from "@iptv/playlist";

const url_part = "https://iptv-org.github.io/iptv/categories/";

const cache = {};
export async function getChannels(category) {
    let result = [];
    try {
        if (cache[category]) {
            return cache[category];
        }
        const list = await axios.get(`${url_part}${category}.m3u`);
        result = Array.from(new Set(parseM3U(await list.data).channels));
        cache[category] = result;
    } catch (error) {
        console.error(error);
    }
    return result;
}

const rCache = {};
export async function getResolutions(url) {
    let result = [];
    try {
        if (rCache[url]) {
            return rCache[url];
        }
        const list = await axios.get(url);
        result = extractResolutionData(url, await list.data);
        cache[url] = result;
    } catch (error) {
        // console.error(error);
    }
    return result;
}

function extractResolutionData(url, data) {
    let result = [];
    const opts = data.match(/RESOLUTION=(\d+x\d+)/g);
    if (opts) {
        opts.forEach(option => {
            const res = option.match(/\d+x\d+/)[0];
            result.push({ text: res, value: url.replace(".m3u8", "_"+res+".m3u8") });
        });
    }
    return result;
}
import axios from "axios";

const url_part = "https://iptv-org.github.io/iptv/categories/";

const cache = {};
export async function getChannels(category) {
    let result = [];
    try {
        if (cache[category]) {
            return cache[category];
        }
        const list = await fetch(`${url_part}${category}.m3u`);
        result = extractChannelData(await list.text());
        cache[category] = result;
    } catch (error) {
        console.error(error);
    }
    return result;
}

function extractChannelData(data = "") {
    const lines = data.split('\n');
    const channels = [];
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF:')) {
            const d = lines[i].split(',');

            const channel = {
                name: d[1],
                url: lines[i+1]
            };

            channels.push(channel);
        }
    }

    return channels.filter(c => {
        if (!c.url.startsWith("https://") || c.name.includes("[Not 24/7]") || c.name.includes("[Geo-blocked]")) {
            return false;
        }
        return true;
    });
}

const rCache = {};
export async function getResolutions(url) {
    let result = [];
    try {
        if (rCache[url]) {
            return rCache[url];
        }
        const list = await fetch(url);
        result = extractResolutionData(url, await list.text());
        cache[url] = result;
    } catch (error) {
        console.error(error);
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
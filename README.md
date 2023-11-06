![](./public/logo.png)

# pubtv
📺 A basic client for streaming some of the many [IPTV](https://en.wikipedia.org/wiki/Internet_Protocol_television) channels worldwide

## overview

>IPTV stands for Internet Protocol Television

This project is based on the publicly available IPTV channels at [iptv-org/iptv](https://github.com/iptv-org/iptv) from all over the world.

This repository contains sourcecode for setting up a video player in order
to enable visitors stream these channels in the browser.

## live demo

Here is a demo for streaming channels organised by categories: [pubtv demo](https://henryhale.github.io/pubtv/).

## supported browsers

Using the live demo, Google Chrome for mobile devices offers a nice experience.

You are most likely going to bump into a pool of errors when using browsers
that don't support certain media formats such as `application/vnd.apple.mpegurl` on Firefox.

>In that case, update your browser: ensure that your browser is up-to-date. Otherwise use other means such as another browser or use VLC to stream.

Latest versions of Google Chrome and Safari are recommended since they have good support for [HLS streams](https://en.wikipedia.org/wiki/HTTP_Live_Streaming).

## development

This project is still under heavy development, expect some bugs or errors.

- setup: install `node` and `npm`
- dev server: run `npm run dev`

## license

Copyright (c) 2023 [Henry Hale](https://github.com/henryhale).

Released under the [MIT License](./LICENSE.md).


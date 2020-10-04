# Esbuild cra setup

requires golang to be installed.
https://golang.org/doc/install

## how it works

First we build all the js files at entry `entry.tsx` and output it to the `es_dist` folder and the using webpack we copy that output + built html into dist folder
Also we hook up into webpack dev server and show esbuild errors during development.

## TODO

What works:

- typescript support
- buggy live reload
- full build using esbuild
- svgr plugin implemented in golang, you have to use `svgr:./pathtosvg.svg`

What doesn't work:

- css modules
- sass
- service worker/web workers (TODO)
- babel macros
- no env plugin (TODO)

## Notes:

watch implemented using parcel watch which uses watchman and fallbacks to brute force so for speed pls install watchman.
Esbuild config is located in ./esbuild folder

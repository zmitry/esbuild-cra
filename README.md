Esbuild cra setup
requires golang to be installed.
https://golang.org/doc/install

What works:

- typescript support
- buggy live reload
- full build using esbuild
- svgr plugin implemented in golang, you have to use `svgr:./pathtosvg.svg`

What doesn't work:

- css modules
- sass
- service worker
- babel macros

# Notes:

watch implemented using parcel watch which uses watchman and fallbacks to brute force so for speed pls install watchman.
Esbuild config is located in ./esbuild folder

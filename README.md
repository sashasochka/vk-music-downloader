# VK.com simple music downloader

This is a fork of https://github.com/vredniy/vk-music-downloader
 
 - with Windows support
 - rewritten from CoffeeScript to ES6
 - removed web gui
 - removed nconf which didn't work for me. 
 
Instructions:
 - get VK's access_token for your user with required permissions
 - set it as `VK_ACCESS_TOKEN` env varible
 - (optional) set download directory using `DOWNLOAD_DIR` env variable. (it needs to be created before running the script).
 - `npm install`
 - `npm run`
 
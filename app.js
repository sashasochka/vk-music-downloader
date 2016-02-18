'use strict';

const async = require('async');
const exec = require('child_process').exec;
const colors = require('colors');
const fs = require('fs');
const http = require('http');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');
const url = require('url');

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || '.';

const downloadFileWget = (audioObj, callback) => {
  let fileName = `${audioObj.artist} - ${audioObj.title}`.substr(0, 240);

  // These needed only on Windows
  fileName = fileName.replace(/\&/g, ' and ');
  fileName = fileName.replace(/\[/g, '(');
  fileName = fileName.replace(/\]/g, ')');
  fileName = fileName.replace(/'/g, '`\'');

  // Everywhere
  fileName = sanitizeFilename(fileName);
  fileName += ".mp3";

  fs.exists(`${DOWNLOAD_DIR}/${fileName}`, exists => {
    if (exists) {
      console.log(`${fileName} already exists`.white.bgRed);
      callback();
    }
    else {
      console.log(`Downloading to ${fileName}`.black.bgWhite);
      const wget = `powershell -C invoke-webrequest ${audioObj.url} -O '${DOWNLOAD_DIR}/${fileName}'`;
      const child = exec(wget, (err, stdout, stderr) => {
        if (err) err;
        else {
          callback();
          console.log(`${fileName} downloaded to ${DOWNLOAD_DIR}`.green);
        }
      });
    }
  });
};

const vk = require('vkontakte')(process.env.VK_ACCESS_TOKEN);

vk('audio.get', (err, audios) => {
  if (err) throw err;

  const q = async.eachLimit(audios, 50, (audio, callback) => {
    downloadFileWget(audio, callback);
  }, 5);
});

'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const async = require('async');
const exec = require('child_process').exec;

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || '.';

const sanitizeFilename = require('sanitize-filename');

const downloadFileWget = (audioObj, callback) => {
  let fileName = `${audioObj.artist} - ${audioObj.title}.mp3`;

  // These needed only on Windows
  fileName = fileName.replace(/\&/g, ' and ');
  fileName = fileName.replace(/\[/g, '(');
  fileName = fileName.replace(/\]/g, ')');
  fileName = fileName.replace(/'/g, '`\'');

  // Everywhere
  fileName = sanitizeFilename(fileName);

  fs.exists(`${DOWNLOAD_DIR}/${fileName}`, exists => {
    if (exists) {
      console.log(`${fileName} already exists`);
      callback();
    }
    else {
      const wget = `powershell -C invoke-webrequest ${audioObj.url} -O '${DOWNLOAD_DIR}/${fileName}'`;

      const child = exec(wget, (err, stdout, stderr) => {
        if (err) err;
        else {
          callback();
          console.log(`${fileName} downloaded to ${DOWNLOAD_DIR}`);
        }
      });
    }
  });
};

const vk = require('vkontakte')(process.env.VK_ACCESS_TOKEN);

vk('audio.get', (err, audios) => {
  if (err) throw err;

  const q = async.queue((audio, callback) => {
    console.log(`start processing audio '${audio.artist} - ${audio.title}'`);
    downloadFileWget(audio, callback);
  }, 5);

  q.drain = () => res.end('completed');

  for (let audio of audios) {
    q.push(audio, err => console.log(`${audio.artist} - ${audio.title} has been processed`));
  }
});

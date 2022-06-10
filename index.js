const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const axiosRequest = require('./utils/request');
// var request = require('request');

//  axiosRequest.get(src, {
  axiosRequest.get('https://media.w3.org/2010/05/sintel/trailer.mp4', {
    responseType: 'stream'
  }).then(response => {
    console.log()
    const total = response.headers['content-length']
    
     var bate = new Buffer.from('');
     let result = 0
     const res = response.data

    res.on('data', (chunk) => {
        bate = Buffer.concat([bate,chunk]);
        // console.log(bate.length)
        console.log('当前进度==>', ((bate.length/total)*100).toFixed(2) + '%')

        fs.appendFileSync("88.mp4",chunk, (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });
    });
    res.on('end', () => {
      try {
        fs.writeFileSync('11.mp4', bate);  // 可删除
      } catch (e) {
        console.error(e.message);
      }
    });
  
  
  });

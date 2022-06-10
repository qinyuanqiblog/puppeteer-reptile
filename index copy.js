const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const axiosRequest = require('./utils/request');
// var request = require('request');

//  axiosRequest.get(src, {
  axiosRequest.get('https://media.w3.org/2010/05/sintel/trailer.mp4', {
    responseType: 'stream'
  }).then(res => {
  
    const file = res.data.pipe(fs.createWriteStream(`65.mp4`))
    file.on("finish", () => {
         file.close();
         console.log("Download Completed");
     });
     file.on("data", (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
     });
     file.on("error", (err) => {
         console.log("Download fail", err);
     });
  
  
  });



// 日志
class Log {
 constructor() {
     this.consoleLog = console.log
 }
 info(msg) {
     this.consoleLog(chalk.blue(msg))
 }
 success(msg) {
     this.consoleLog(chalk.green(msg))
 }
 error(msg) {
     this.consoleLog(chalk.red(msg))
 }
}



(async () => {
  const browser = await puppeteer.launch(
   {
    headless:true
   }
  );

  const page = await browser.newPage();
  // 随便设置个ua,伪装成一个良民
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.3');
  await page.goto('http://www.6dm.cc/play/993-1-1.html');
  // 等待两秒
  // await page.waitForTimeout(2000)
  // .then(() => console.log('Waited a second!'));
 const MacPlayer = await page.evaluate(async () => {
     // await window.MacPlayer;
     return window.MacPlayer
  });
 const remoteUrl = MacPlayer.Parse + MacPlayer.PlayUrl
 console.log('成功获取到解析地址==>', remoteUrl)
 const newPage = await browser.newPage();
 // 随便设置个ua,伪装成一个良民
 await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.3');
 await newPage.goto(remoteUrl);
 console.log('等待2s，让浏览器加载完毕之后，再做后续操作')
 await newPage.waitForTimeout(3000)
 const src = await newPage.evaluate('document.querySelector("#lelevideo").getAttribute("src")')
 console.log('成功获取到视频源地址==>', src)




//  axiosRequest.get(src, {
 axiosRequest.get('https://media.w3.org/2010/05/sintel/trailer.mp4', {
  responseType: 'stream'
}).then(res => {

  // var bate = new Buffer.from('');

  // res.on('data', (chunk) => {
  //       bate = Buffer.concat([bate,chunk]);
  //       console.log(bate.length)
  //       fs.appendFileSync("1.mp4",chunk, (error)  => {
  //           if (error) return console.log("追加文件失败" + error.message);
  //           console.log("追加成功");
  //       });
  //   });
  //   res.on('end', () => {
  //     try {
  //       fs.writeFileSync('11.mp4', bate);  // 可删除
  //     } catch (e) {
  //       console.error(e.message);
  //     }
  //   });

  const file = res.data.pipe(fs.createWriteStream(`65.mp4`))
  file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
   file.on("data", (chunk) => {
      console.log(`Received ${chunk.length} bytes of data.`);
   });
   file.on("error", (err) => {
       console.log("Download fail", err);
   });


// 下载视频 已经验证过是可以的
// const file = fs.createWriteStream("99.mp4");
// https.get(src, function(response) {
//    response.pipe(file);

//    // after download completed close filestream
//    file.on("finish", () => {
//        file.close();
//        console.log("Download Completed");
//    });
//    file.on("pipe", () => {
//        console.log("Download start");
//    });
//    file.on("error", (err) => {
//        console.log("Download fail", err);
//    });

});


  // 关闭浏览器实例
  await browser.close();
})();


function savefileToPath (fileData) {
 let fileFullName = `./99.mp4`
 return new Promise((resolve, reject) => {
   fs.writeFile(fileFullName, fileData, 'binary', function (err) {
     if (err) {
       console.log('savefileToPath error:', err)
     }
     resolve('已下载')
   })
 })
}


function getVideoData (url, encoding) {
 return new Promise((resolve, reject) => {
   let req = https.get(url, function (res) {
     let result = ''
     encoding && res.setEncoding(encoding)
     res.on('data', function (d) {
       result += d
     })
     res.on('end', function () {
       resolve(result)
     })
     res.on('error', function (e) {
       reject(e)
     })
   })
   req.end()
 })
}
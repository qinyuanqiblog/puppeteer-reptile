const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const axiosRequest = require('./utils/request');

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


/**
 * 下载图片
 * @return {promise} 返回下载图片的promise集合
 */
 function downloadPicture() {

  return this.imgUrlList.splice(0, 10).reduce((accumulator, currentValue, currentIndex, array) => {
      const promise = axiosRequest.get(currentValue.fullUrl, {
          responseType: 'stream'
      }).then(res => {
          this.uploadSuccessArray.push(currentValue)
          const result = res.pipe(fs.createWriteStream(`${this.saveDir}${currentValue.fileName}`))
          log.success(`成功保存图片到本地，保存位置==>${this.saveDir}${currentValue.fileName}`)
      }).catch(err => {
          log.error(err)
          this.uploadFailArray.push(currentValue)
          log.error(`爬取图片失败 ，图片地址==> ${currentValue.fullUrl}`)
      })
      accumulator.push(promise)
      return accumulator
  }, [])
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
 console.log('remoteUrl', remoteUrl)
 const newPage = await browser.newPage();
 // 随便设置个ua,伪装成一个良民
 await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.3');
 await newPage.goto(remoteUrl);
 await newPage.waitForTimeout(2000)
 const src = await newPage.evaluate('document.querySelector("#lelevideo").getAttribute("src")')
 console.log(src)

 await getVideoData(src, 'binary').then(fileData => {
  console.log('下载视频中：', video.title)
  savefileToPath(fileData).then(res =>
    console.log(`${res}: 66mp4`)
  )
})
//  axiosRequest.get(src, {
//   responseType: 'arraybuffer'
// }).then(res => {
//  console.log('请求资源成功，开始下载')
//   fs.writeFile('./bb.mp4', res, 'binary', function (err) {
//       if (err) {
//         console.log('savefileToPath error:', err)
//       }
//       console.log('我已经开始在下载了~')
//     })
//   }).catch(err => {
//    console.log('狗带了', err)
//   })

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
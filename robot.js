const puppeteer = require('puppeteer');
const fs = require('fs');

const axiosRequest = require('./utils/request');
const commonUtils = require('./utils');
const Log = require('./utils/log');
const download = require('./download');

const log = new Log()

module.exports = class Reptile {
 constructor({
  reptileUrl,
  saveDir,
  waiteTime = 5,
  startIndex = 0,
  excelFileName = '爬虫excel报告',
 }) {
  // 爬取的网站
  this.reptileUrl = reptileUrl;
  // 保存的文件夹
  this.saveDir = saveDir;
  // 页面等待时间，需要等页面加载完毕，才能获取元素，网络不好的情况，就调长一点，单位s
  // 目前的设计是所有的等待时间公用一个变量
  this.waiteTime = waiteTime;
  // 支持从第几集开始爬，从1开始，按照正常用户的操作
  this.startIndex = startIndex;
  // excel文件名
  this.excelFileName = excelFileName;
  // 所有的源数据合集
  this.totalUrlList = []
  // 下载成功的地址合集
  this.uploadSuccessArray = []
  // 下载失败的地址合集
  this.uploadFailArray = []
  // puppeteer browser实例
  this.browser = null
  // 准备下载的资源
  this.downloadArray = []
  // 当然任务消耗了多少时长
  this.totalTime = 0

  this.arrayUserAgent = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.3']

  this.init()
 }
 /**
  * 初始化配置
  */
 initConfig() {
  log.info('主程序开始启动，请您耐心等待~')
  log.info(`开始爬取${this.reptileUrl}的电影`)
  log.error(`文件将会被保存到以下地址中：${this.saveDir}`)
  // 判断本地存储文件夹是否存在
  if (!fs.existsSync(this.saveDir)) {
   log.error('目标文件不存在，开始目标文件夹~')
   fs.mkdirSync(this.saveDir);
  }
 }
 init() {
  this.initConfig()
  this.initPuppeteer()
 }
 async initPuppeteer() {
  const browser = await puppeteer.launch({
   // 是否开启无头模式
   headless: true
  });
  const page = await browser.newPage();
  this.browser = browser

  // 随机获取一个userAgent
  const itemAgent = this.arrayUserAgent[Math.floor(Math.random() * this.arrayUserAgent.length)];
  // 随便设置个ua,伪装成一个良民
  await page.setUserAgent(itemAgent);

  // 随便填一个可以获取到播放列表的页面
  // await page.goto('http://www.6dm.cc/play/993-1-1.html');
  await page.goto(this.reptileUrl);
  const waiteTime = this.waiteTime * 1000
  log.info(`休息${this.waiteTime}s, 等待页面加载完毕，才能干活~`)
  this.totalTime += this.waiteTime
  await page.waitForTimeout(waiteTime)
   .then(() => log.info(`${this.waiteTime}s过去了,继续干活~`));
  log.info(`开始获取播放列表`)
  const urlList = await page.$$eval("#playlist1 a", el => el.map((v, i) => {
   const href = v.getAttribute('href')
  //  这里面怎么吧值带进来，还不懂怎么搞，只能写死
   const prefix = 'http://www.6dm.cc'
   const url = `${prefix}${href}`
   return {
    url,
    name: v.innerHTML
   }
  }));
  page.close()
  log.success(`成功获取播放列表，总共${urlList.length}集`)
  // console.log(urlList)

  // log.info(`开始获取下载资源`)

  //  第一集都没下载那就重新从头开始下载吧 哈哈
  // startIndex 支持从第几集开始下载，感觉这个很强烈需要哈
  if (this.startIndex) {
    urlList.splice(0, this.startIndex -1)
  }
  // 列表名称里面有国语和备用的就过滤掉，不下载了
  this.downloadArray = urlList.filter(v => v.name !== '备用' && v.name !== '国语')
  // console.log('downloadArray', this.downloadArray)
  this.downloadTask()
 }
 async downloadTask() {
  const waiteTime = this.waiteTime * 1000
  const downloadArray = this.downloadArray
  // 没有数据了，收摊了
  if(!this.finally()){
    return false
  }
    
   const current = downloadArray.shift();
   const page = await this.browser.newPage();
   // 随机获取一个userAgent
   const itemAgent = this.arrayUserAgent[Math.floor(Math.random() * this.arrayUserAgent.length)];
   // 随便设置个ua,伪装成一个良民
   await page.setUserAgent(itemAgent);
   await page.goto(current.url);
   log.info(`休息${this.waiteTime}s, 等待页面加载完毕，才能干活~`)
   await page.waitForTimeout(waiteTime)
   this.totalTime += this.waiteTime
   // 页面里面的一些重要信息
   const pageInfo = await page.evaluate(async () => {
    // await window.MacPlayer;
    return {
     MacPlayer: window.MacPlayer,
     player_aaaa: window.player_aaaa,
    }
   });
   
   // 获取资源地址
   const MacPlayer = pageInfo.MacPlayer
   const remoteUrl = MacPlayer.Parse + MacPlayer.PlayUrl
  //  console.log('MacPlayer', MacPlayer)
   console.log('成功获取到解析地址==>', remoteUrl);
   page.close()

   log.info('开始新开一个页面去获取资源地址~')
   const newPage = await this.browser.newPage();
   // 随便设置个ua,伪装成一个良民
   await newPage.setUserAgent(itemAgent);
   await newPage.goto(remoteUrl);
   log.info(`等待${this.waiteTime}s，让浏览器加载完毕之后，再做后续操作`);
   await newPage.waitForTimeout(waiteTime)
   this.totalTime += this.waiteTime
   // 获取目标资源的地址
   const src = await newPage.evaluate('document.querySelector("#lelevideo").getAttribute("src")')
   log.success('成功获取到视频源地址==>', src)
   newPage.close()
   const suffix = pageInfo.player_aaaa && pageInfo.player_aaaa.from || 'mp4'

   download({
    url: src,
    fileName: `${this.saveDir}${current.name}.${suffix}`
   }).then((url)=>{
    // 记录下载成功数量
    this.uploadSuccessArray.push(url)
    // 没有数据了，收摊了
    if(!this.finally()){
      return false
    }
    
    // 一开始我是2秒后就开始爬，后来发现这个网站直接把我的ip给封了，看来还是搞时间长一点，😄😄😄,
    //  如果你的ip也被封掉了，就重启下路由器吧， 哈哈
    // 所以就搞了个随机算法，以等待时间乘以一个随机数 10-40 以内，如果不行就再把随机的值变大一点
    this.sleep().then(()=>{
      this.downloadTask()
    })
   })
   .catch((err, url)=>{
    // 记录下载失败数量
    this.uploadFailArray.push(url)
   })
  }
  /**
   *  关闭浏览器进程，显示时长等信息
   * @returns {boolean}  false
   */
  finally(){
    if (!this.downloadArray.length){
      const time = commonUtils.secondToDate(this.totalTime)
      // 关闭浏览器实例
      log.info(`下载完毕，关闭浏览器实例,总共消耗时间： ${time} `)
      log.info(`下载成功： ${this.uploadSuccessArray.length} 个`)
      log.error(`下载失败：${this.uploadFailArray.length} 个`)
      this.browser.close();
      return false
    }
    return true
  }
  /**
   * 休息一会，再继续爬
   */
  sleep() {
    const promise = new Promise((resolve, reject)=> {
      const sleepTimeout = commonUtils.getRandomNumber(20, 60)
      this.totalTime += sleepTimeout
      let copyTimeout = sleepTimeout
      log.error(`爬太多了，有点累了，休息${sleepTimeout}秒，后再继续`)
      let logTimer = null
      clearInterval(logTimer)
      logTimer = setInterval(() => {
          if (copyTimeout <= 1) {
              clearInterval(logTimer)
          }
          log.success(`倒计时  ${copyTimeout--}   秒后开始继续干活~`)
      }, 1000);

      setTimeout(() => {
          resolve()
      }, sleepTimeout * 1000);
    })

    return promise
  }

}

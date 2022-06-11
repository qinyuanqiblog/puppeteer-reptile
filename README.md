# 使用 puppeteer + nodejs 爬取喜欢的动漫资源

## 四月是你的谎言 😄😄😄😄😄

![效果图](https://api2.mubu.com/v3/document_image/7b5a7786-6473-4bad-8094-1a9a53bb969f-2331693.jpg)

## 使用方法

* 下载项目
* 更新依赖
* 配置需要下载的页面，保存的路径
* 执行命令  node index

```shell
git clone https://github.com/qinyuanqiblog/puppeteer-reptile
```

```shell
npm install
```

```js
 // index.js 
new Reptile({
  reptileUrl: 'https://www.6dm.cc/play/993-1-1.html',
  // saveDir: 'E:/四月是你的谎言/',
  // 支持从第几集开始爬
  // startIndex: 20,
  // window环境必须用我这种写法，不然凉凉
  saveDir: 'E:/视频剪辑/动漫/四月是你的谎言/',
  // 我发现下面这种写法好像不行~
  // saveDir: 'E:\视频剪辑\动漫\四月是你的谎言',
})
```

```shell
node index
```

## 更新记录

* 2022-06-11：🎉🎉 初始化项目，支持爬取[www.6dm.cc](www.6dm.cc) 的视频


## 思路
[nodejs 爬取喜欢的的背景图片-思否](https://segmentfault.com/a/1190000038665950)

[爬取动漫网站视频-幕布](https://mubu.com/doc/20QyeaHXzRd)
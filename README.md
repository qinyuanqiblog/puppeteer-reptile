# 使用 puppeteer + nodejs 爬取喜欢的动漫资源

## 起源

* 最近突然想尝试剪视频，所以就想先从动漫开始，二次元搞起来，剪视频就必须需要原视频，怎么找到这些资源呢，知乎一搜一大把
* 我经常会上六DM 里面去看动漫,里面的动漫清晰度也还可以，所以就想怎么写个爬虫直接把喜欢的动漫下载下来，毕竟是干前端的，手动下载有点丢人把 😄😄😄

## 最终效果

![效果图](https://api2.mubu.com/v3/document_image/3b4a9907-f3a4-4ed8-aa95-a90219b72eeb-2331693.jpg)
![效果图](https://api2.mubu.com/v3/document_image/5d0810bc-b69d-4514-9c51-066640023495-2331693.jpg)
![效果图](https://api2.mubu.com/v3/document_image/7b5a7786-6473-4bad-8094-1a9a53bb969f-2331693.jpg)

## 下载后的文件名不是.mp4 怎么解决
> 比如说我下载的这个龙猫就是啥yum格式的，我直接后缀名改成.mp4 搞定，如果还不行，就上个格式工厂 应该就好了
![效果图](https://api2.mubu.com/v3/document_image/9cdcbf9e-6055-4dfb-b13a-0e552e56e09c-2331693.jpg)
![效果图](https://api2.mubu.com/v3/document_image/cd08e69e-acf7-4156-82d7-bfa2ff72d65a-2331693.jpg)
![效果图](https://api2.mubu.com/v3/document_image/27cecfe6-ab41-43f6-917b-137b5f6af53a-2331693.jpg)

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

[爬取动漫网站视频-思否](https://segmentfault.com/a/1190000041970773)

[爬取动漫网站视频-幕布](https://mubu.com/doc/20QyeaHXzRd)
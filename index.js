const Reptile = require('./robot')

//调用方式1：www.6dm.cc 网站调用入口
new Reptile({
  // 这种的也可以
  // reptileUrl: 'https://www.6dm.cc/play/3376-1-1.html',
  // 反正可以去到列表的就可以下载哦
  reptileUrl: 'https://www.6dm.cc/video/3376.html',
  // saveDir: 'E:/四月是你的谎言/',
  // 支持从第几集开始爬
  // startIndex: 20,
  // window环境必须用我这种写法，不然凉凉
  saveDir: 'E:/视频剪辑/动漫/龙猫/',
  // 我发现下面这种写法好像不行~
  // saveDir: 'E:\视频剪辑\动漫\四月是你的谎言',
})

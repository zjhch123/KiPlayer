# kirisame

> mac music player

![preview](https://github.com/zjhch123/KiPlayer/blob/master/preview/preview.gif)

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[de85f81](https://github.com/SimulatedGREG/electron-vue/tree/de85f81890c01500113738bfe57bef136f9fbf52) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

---
感谢[Material Design](https://www.uplabs.com/material)设计师[Dhanish](https://www.uplabs.com/dhanishgajjar)无私提供的[设计原稿](https://www.uplabs.com/posts/music-player-mockup)。

Thanks for the designer [Dhanish](https://www.uplabs.com/dhanishgajjar) selflessly supplied [design manuscripts](https://www.uplabs.com/posts/music-player-mockup).

#### 程序运行截图
##### 1. 主界面
![主界面](https://raw.githubusercontent.com/zjhch123/KiPlayer/master/preview/main.jpg)
1. 构成:
 * 歌曲封面图
 * 黑色透明模糊的进度条
2. 交互:
 * 刚启动时，显示菜单栏/歌曲列表，没有任何操作的话1s消失
 * 鼠标移入app，显示菜单栏/歌曲列表(如果激活的话)，进度条渐隐
##### 2. 显示菜单栏
![菜单栏](https://github.com/zjhch123/KiPlayer/blob/master/preview/hover.jpg)
1. 构成:
 * 是否随机播放
 * 上一首
 * 播放 / 暂停 【外围歌曲进度条】
 * 下一首
 * 歌曲列表
2. 交互:
 * 点击按钮，按钮有scale动效
 * 部分按钮激活态变色
 * 点击歌曲列表，移入歌曲列表层

##### 3. 歌曲列表
![列表](https://github.com/zjhch123/KiPlayer/blob/master/preview/showList.jpg)
1. 构成:
 * 歌曲列表 
2. 交互:
 * 点击歌曲，scale效果
 
#### 目前功能
能获取网易云音乐指定歌单的歌曲信息，拉取封面图，并播放歌曲 api: [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

线上预览链接: [时光遣散了故人](https://blog.hduzplus.xyz), 右侧
#### 未来预计
1. [] 用户能指定播放歌单
2. [] 保存用户信息
3. [] 自动更新

<template>
  <div id="app" :class="{'f-normal': !isInputListId, 'f-prev': isPrev}">
    <header class="g-header"></header>
    <main class="g-main" v-dbclick="fShowInputListDOMHandler">
      <div class="u-mask" :style="{transform: 'translate3d(' + (progress - 100) + '%,0,0)'}"></div>
      <div class="u-bg" :style="{backgroundImage: 'url(' + bg + ')'}"></div>
    </main>
    <section class="g-list" :class="{'f-show': isListShow}">
      <div
          v-for="(music, index) in musicList"  
          class="u-item list-complete-item" 
          :class="{'f-played': nowPlayIndex == index}"
          v-bind:key="music.id"
          @click.stop.capture="fMusicItemClickHandler" 
          :data-index="index">
          <span class="name">{{music.name}}</span>
          <span class="singer">{{music.singer}}</span>
      </div>
    </section>
    <footer class="g-footer">
      <div class="u-bg"></div>
      <div class="m-controller">
        <div class="m-mode" :class="{'f-random': isRandom, 'f-normal': !isRandom}" @click="fChangeModeClickHandler">
          <a href="javascript:;" class="u-mode-random u-btn"></a>
          <a href="javascript:;" class="u-mode-normal u-btn"></a>
        </div>
        <a href="javascript:;" class="u-prev u-btn" @click="fPrevMusicClickHandler"></a>
        <div class="m-staus" :class="{'f-play': isPlaying, 'f-pause': !isPlaying}" @click="fChangeStatusClickHandler">
          <canvas width="224" height="224" class="u-progress J_progress"></canvas>
          <a href="javascript:;" class="u-pause u-btn"></a>
          <a href="javascript:;" class="u-play u-btn"></a>
        </div>
        <a href="javascript:;" class="u-next u-btn" @click="fNextMusicClickHandler"></a>
        <div class="m-list" :class="{'f-fill': isListShow, 'f-unfill': !isListShow}" @click="fShowListClickHandler">
          <a href="javascript:;" class="u-list u-btn"></a>  
          <a href="javascript:;" class="u-list-fill u-btn"></a>  
        </div>
      </div>
    </footer>
    <div class="g-input" :class="{'f-show': isInputListId, 'f-waiting': isFetching}">
      <div class="g-mask" @click="fHideInputListClickHandler"></div>
      <input type="text" class="u-input J_input" @keyup.enter="fSwitchMusicListHandler" value="926638907"/>
      <p class="u-tip">请输入歌单ID</p>
      <div class="u-waiting">
        获取歌单中...
      </div>
    </div>
    <audio src="" 
        class="f-hide J_Player" 
        @canplay="uAudioCanPlay"
        @timeupdate="uTimeUpdate"
        @ended="uPlayEnd"/>
  </div>
</template>
<script>
  import MusicAPI from './MusicAPI.js';
  export default {
    name: 'kirisame',
    data: () => ({
      isPrev: true,
      bg: require('./assets/bg.jpg'),
      isInputListId: false,
      isRandom: false,
      isPlaying: false,
      isListShow: true,
      musicList: [],
      ctx: null,
      player: null,
      progress: 0,
      nowPlayIndex: -1,
      musicListId: 926638907,
      isFetching: false
    }),
    created: async function() {
      const self = this;
      let pid;
      if (self.fGetCookies('pid')) {
        pid = self.fGetCookies('pid');
      } else if (self.uGetUrlParam(window.location.search, 'id')) {
        pid = self.uGetUrlParam(window.location.search, 'id');
      } 
      if (pid) {
        this.musicListId = pid;
      }
      try {
        self.musicList = await MusicAPI.getPlayListById(this.musicListId);
        self.nowPlayIndex = -1;
        self.progress = 0;
        self.bg = require('./assets/bg.jpg');
      } catch (exception) {
        alert('拉取歌单信息失败');
      }
    },
    mounted: function() {
      setTimeout(() => {
        this.isPrev = false;
      }, 1000);
      this.player = document.querySelector('.J_Player');
      this.ctx = document.querySelector('.J_progress').getContext('2d');
      this.ctx.lineWidth = 40;
      this.ctx.strokeStyle = '#50E3C2';
      setInterval(function() {
        this.fResize()
      }.bind(this), 100);
      document.querySelector('.J_input').value = this.musicListId;
    },
    watch: {
      nowPlayIndex: async function(newVal) {
        if (newVal != -1) {
          const music = this.musicList[newVal];
          this.bg = music.pic ? music.pic : require('./assets/bg.jpg');
          try {
            this.player.src = await MusicAPI.getMusicById(music.id);
            this.isPlaying = true;
            this.mIsPlaying(this.isPlaying);
          } catch (exception) {
            alert('获取歌曲信息失败...');
          }
        }
      },
      progress: function(newVal) {
        this.uDrawCircle(Math.PI * 2.0 * newVal / 100);
      },
      musicListId: async function(newVal) {
        this.isFetching = true;
        try {
          const newMusicList = await MusicAPI.getPlayListById(this.musicListId);
          this.isPlaying = false;
          this.mIsPlaying(this.isPlaying);
          this.player.src = '';
          this.musicList = newMusicList;
          this.bg = require('./assets/bg.jpg');
          this.nowPlayIndex = -1;
          this.progress = 0;
        } catch (exception) {
          alert('拉取歌单信息失败');
          this.isFetching = false;
          return;
        }
        this.isFetching = false;
        this.fSetPidToCookie(newVal);
        setTimeout(() => {
          this.isInputListId = false;
        }, 600);
      }
    },
    methods: {
      mIsPlaying: function(val) {
        if (this.player && val == true) {
          // 设置为true, 则开始播放
          this.player.play();
        }
        if (this.player && val == false) {
          // 设置为false, 则暂停
          this.player.pause();
        }
      },
      fDoubleClick: function(func, timer) {
        let count = 0;
        let timeoutId = 0;
        let args, context;
        return function() {
          args = arguments;
          context = this;
          count += 1;
          clearTimeout(timeoutId);
          if (count == 2) {
            count = 0;
            func.apply(context, args);
            return;
          }
          timeoutId = setTimeout(function() {
            count = 0;
          }, timer);
        }
      },
      fResize: function() {
        let targetWidth = document.documentElement.clientWidth;
        targetWidth = targetWidth > 400 ? 400 : targetWidth;
        const percent = targetWidth / 400.0;
        document.body.style.transform = `scale(${percent})`;
        document.body.style.width = 400 * percent + 'px';
        document.body.style.height = 400 * percent + 'px';
      },
      fGetCookies: function (name) {
        const r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
        const m = document.cookie.match(r);
        return (!m ? '' : unescape(m[2]));
      },
      fSetCookie: function(name, v, expire, domain, path) {
        let s = name + "=" + escape(v) + "; path=" + (path || '/') + (domain ? ("; domain=" + domain) : '');
        if (expire > 0) {
            const d = new Date();
            d.setTime(d.getTime() + (+expire || 30) * 24 * 60 * 60 * 1000);
            s += ";expires=" + d.toUTCString();
        }
        document.cookie = s;
      },
      fGetPidFromCookie: function() {
        return this.fGetCookies('pid');
      },
      fSetPidToCookie: function(pid) {
        this.fSetCookie('pid', pid, 30);
      },
      fPrevMusicClickHandler: function() {
        this.uPrevMusic();
      },
      fNextMusicClickHandler: function() {
        this.uNextMusic();
      },
      fChangeModeClickHandler: function() {
        this.isRandom = !this.isRandom;
      },
      fChangeStatusClickHandler: function() {
        this.uChangeStatus();
      },
      fShowListClickHandler: function() {
        this.uSwitchListStatus();
      },
      fSwitchMusicListHandler: async function(e) {
        const musicListId = e.target.value;
        this.uSwitchMusiList(musicListId);
      },
      fMusicItemClickHandler: function(e) {
        const id = ~~e.target.getAttribute('data-index');
        this.uSwitchMusic(id);
      },
      fHideInputListClickHandler: function() {
        this.uHideInputList();
      },
      fShowInputListDOMHandler: function() {
        this.uShowInputListDOM();
      },
      uShowInputListDOM: function() {
        this.isInputListId = true;
        setTimeout(function() {
          document.querySelector('.J_input').focus();
        }, 1800);
      },
      uSwitchListStatus: function() {
        this.isListShow = !this.isListShow;
      },
      uSwitchMusiList: function(musicListId) {
        this.musicListId = musicListId;
      },
      uSwitchMusic: function(id) {
        this.nowPlayIndex = id;
      },
      uHideInputList: function() {
        this.isInputListId = false;
      },
      uChangeStatus: function() {
        if (this.nowPlayIndex === -1) {
          this.nowPlayIndex = 0;
          return;
        }
        this.isPlaying = !this.isPlaying;
        this.mIsPlaying(this.isPlaying);
      },
      uDrawCircle: function(degree) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 224, 224);
        ctx.beginPath();
        ctx.arc(112.5, 112.5, 80, -Math.PI / 2,degree - Math.PI / 2, false);
        ctx.stroke();
      },
      uTimeUpdate: function(e) {
        const currentTime = e.target.currentTime;
        const totalTime = e.target.duration;
        this.progress = currentTime / totalTime * 100;
      },
      uPrevMusic: function() {
        this.nowPlayIndex = (this.nowPlayIndex <= 0 ? this.musicList.length : this.nowPlayIndex) - 1;
      },
      uNextMusic: function() {
        this.nowPlayIndex = (this.nowPlayIndex + 1) % this.musicList.length;
      },
      uPlayEnd: function() {
        if (this.isRandom) {
          this.nowPlayIndex = Math.floor(Math.random() * 100 % this.musicList.length);
        } else {
          this.uNextMusic();
        }
      },
      uAudioCanPlay: function() {
        if (this.isPlaying) {
          this.player.play();
        }
      },
      uGetUrlParam: function(_str, _name) {
        let _reg = new RegExp('(^|&|\\?)' + _name + '=([^&]*)(&|$)'),
            _r = _str.replace(/script|%22|%3E|%3C|'|"|>|<|\\/g,'_').match(_reg);

        if (_r != null) return decodeURIComponent(_r[2]); return '';
      },
    },
    directives: {
      dbclick: {
        bind: function(el, binding, vnode) {
          const func = binding.expression;
          el.addEventListener('click', vnode.context.fDoubleClick(vnode.context[func], 300));
        }
      }
    }
  }
</script>
<style lang="scss">
html {
  margin: 0;
  width: 100%;
  max-width: 400px;
  font-family: 'PingFangSC-Light','STHeiTi';
  -webkit-font-smoothing: antialiased;
  user-select: none;
  font-size: 100px;
}
body {
  margin: 0;
  height: 4rem;
  width: 4rem;
  position: relative;
  transform-origin: left top;
  overflow: hidden;
}
#app {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 4rem;
  height: 4rem;
  overflow: hidden;
  .g-header {
    width: 4rem;
    height: .22rem;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-app-region: drag;
    z-index: 2;
  }
  .g-main {
    .u-mask {
      background-color: rgba(0,0,0,0);
    }
  }
  &.f-normal {
    .g-main .u-mask {
      display: block;
      background-color: rgba(0,0,0,.4);
    }
  }
  &.f-normal.f-prev,&.f-normal:hover {
    .g-footer, .g-list.f-show {
      transform: translate3d(0,0,0);
    }
    .u-mask {
      background-color: rgba(0,0,0,0);
    }
  }
}
.g-main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  .u-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    filter: blur(8px);
    z-index: 3;
    transition: all .6s;
  }
  .u-bg {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
}
.g-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: .84rem;
  overflow: hidden;
  background-color: rgba(0,0,0,0.8);
  z-index: 9;
  transform: translate3d(0,100%,0);
  transition: all .6s;
  .m-controller {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    padding: 0 .28rem;
    .u-btn {
      display: block;
      background-size: 100% auto;
      background-repeat: no-repeat;
      &:active {
        transform: scale(.9);
      }
    }
    .m-mode {
      height: .17rem;
      width: .22rem;
      position: relative;
      &.f-random {
        .u-mode-random {
          opacity: 1;
          pointer-events: auto;
        }
        .u-mode-normal {
          transform: scale(.8);
          pointer-events: none;
        }
      }
      &.f-normal {
        .u-mode-random {
          transform: scale(.8);
          pointer-events: none;
        }
        .u-mode-normal {
          opacity: 1;
          pointer-events: auto;
        }
      }
      .u-mode-random, .u-mode-normal {
        position: absolute;
        top: 0;
        left: 0;
        width: .22rem;
        height: .17rem;
        opacity: 0;
        transition: all .6s;
      }
      .u-mode-random {
        background-image: url('./assets/mode_random.svg');  
      }
      .u-mode-normal {
        background-image: url('./assets/mode_normal.svg');   
      }
    }
    .u-next, .u-prev {
      height: .18rem;
      width: .22rem;
      transition: all .6s;
      &:active {
        transform: scale(.8);
      }
    }
    .u-prev {
      background-image: url('./assets/prev.svg');
    }
    .u-next {
      background-image: url('./assets/next.svg');
    }
    .m-staus {
      width: .56rem;
      height: .56rem;
      position: relative;
      &.f-play {
        .u-pause {
          opacity: 1;
          pointer-events: auto;
        }
        .u-play {
          transform: scale(.9);
          pointer-events: none;
        }
      }
      &.f-pause {
        .u-pause {
          transform: scale(.9);
          pointer-events: none;
        }
        .u-play {
          opacity: 1;
          pointer-events: auto;
        }
      }
      .u-pause, .u-play {
        position: absolute;
        top: .06rem;
        left: .06rem;
        height: .44rem;
        width: .44rem;
        transition: all .6s;
        opacity: 0;
      }
      .u-pause {
        background-image: url('./assets/pause.svg');
      }
      .u-play {
        background-image: url('./assets/play.svg');
      }
    }
    .m-list {
      width: .22rem;
      height: .15rem;
      position: relative;
      &.f-fill {
        .u-list-fill {
          opacity: 1;
          pointer-events: auto;
        }
        .u-list {
          transform: scale(.8);
          pointer-events: none;
        }
      }
      &.f-unfill {
        .u-list-fill {
          transform: scale(.8);
          pointer-events: none;
        }
        .u-list {
          opacity: 1;
          pointer-events: auto;
        }
      }
      .u-list, .u-list-fill {
        height: .15rem;
        width: .22rem; 
        transition: all .6s;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }
      .u-list {
        background-image: url('./assets/list.svg');
      }
      .u-list-fill {
        background-image: url('./assets/list_fill.svg');
      }
    }
    .u-progress {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%,0);
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.g-list {
  position: absolute;
  height: 3.16rem;
  width: 4rem;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.6);
  -webkit-app-region: none;
  z-index: 9;
  transform: translate3d(0,-100%, 0);
  transition: all .6s;
  padding: .24rem .16rem;
  box-sizing: border-box;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .u-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: .4rem;
    position: relative;
    padding: 0 .06rem;
    cursor: pointer;
    &.f-played {
      .name, .singer{
        color: #50E3C2;
      }
      &:after {
        background-color: rgba(80,227,194, .3);
      }
    }
    &:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: .01rem;
      background-color: rgba(255, 255, 255, .3);
      transform: scaleY(.5) translateZ(0);
      content: '';
    }
    &:active {
      .name, .singer {
        transform: scale(.9);
      }
    }
    .name {
      color: white;
      font-size: .14rem;
      font-weight: bold;
    }
    .singer {
      font-size: .12rem;
      color: rgba(255,255,255,.8);
    }
    .name, .singer {
      display: block;
      transition: all .6s;
      pointer-events: none;
    }
  }
  .f-hide {
    display: none;
  }
}
@keyframes InputDOMFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes InputLabelFadeIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
.g-input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0, .8);
  z-index: 51;
  opacity: 0;
  pointer-events: none;
  transition: all .6s .6s;
  &.f-show {
    opacity: 1;
    pointer-events: auto;
    .u-input {
      transition: all .6s 1.2s;
      transform: scaleX(1);
    }
  }
  &.f-waiting {
    .u-waiting {
      opacity: 1;
      pointer-events: auto;
    }
  }
  .g-mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .u-input {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    margin-left: -1.25rem;
    margin-top: -.2rem;
    width: 2.5rem;
    height: .4rem;
    font-size: .22rem;
    color: black;
    outline: none;
    padding-left: .08rem;
    border: none;
    transform-origin: center center;
    transform: scaleX(0);
    transition: all .6s;
    -webkit-app-region: no-drag;
  }
  .u-tip {
    position: absolute;
    left: 50%;
    top: 34%;
    font-size: .22rem;
    color: white;
    z-index: 11;
    transform: translate3d(-50%, -50%, 0);
  }
  .u-waiting {
    position: absolute;
    z-index: 31;
    background-color: rgba(0,0,0,.8);
    font-size: .24rem;
    color: white;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    line-height: 4rem;
    text-align: center;
    pointer-events: none;
    opacity: 0;
    transition: all .6s;
  }
}
</style>

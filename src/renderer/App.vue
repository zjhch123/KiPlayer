<template>
  <div id="app" :class="{prev: isPrev}">
    <main class="g-main">
      <div class="u-mask" :style="{transform: 'translateX(' + (progress - 100) + '%)'}"></div>
      <div class="u-bg" :style="{backgroundImage: 'url(' + bg + ')'}"></div>
    </main>
    <section class="g-list" :class="{show: isListShow}">
      <div
          v-for="(music, index) in musicList"  
          class="u-item list-complete-item" 
          :class="{played: nowPlayIndex == index}"
          v-bind:key="music.id"
          @click.stop.capture="fMusicClick" 
          :data-index="index">
          <span class="name">{{music.name}}</span>
          <span class="singer">{{music.singer}}</span>
      </div>
    </section>
    <footer class="g-footer">
      <div class="u-bg"></div>
      <div class="m-controller">
        <div class="m-mode" :class="{random: isRandom, normal: !isRandom}" @click="fChangeMode">
          <a href="javascript:;" class="u-mode-random u-btn"></a>
          <a href="javascript:;" class="u-mode-normal u-btn"></a>
        </div>
        <a href="javascript:;" class="u-prev u-btn" @click="fPrevMusic"></a>
        <div class="m-staus" :class="{play: isPlaying, pause: !isPlaying}" @click="fChangeStatus">
          <canvas width="224" height="224" class="u-progress J_progress"></canvas>
          <a href="javascript:;" class="u-pause u-btn"></a>
          <a href="javascript:;" class="u-play u-btn"></a>
        </div>
        <a href="javascript:;" class="u-next u-btn" @click="fNextMusic"></a>
        <div class="m-list" :class="{fill: isListShow, unfill: !isListShow}" @click="fShowListClick">
          <a href="javascript:;" class="u-list u-btn"></a>  
          <a href="javascript:;" class="u-list-fill u-btn"></a>  
        </div>
      </div>
    </footer>
    <audio src="" 
        class="f-hide J_Player" 
        @timeupdate="uTimeUpdate"
        @ended="uPlayEnd"/>
  </div>
</template>
<script>
  export default {
    name: 'kirisame',
    data: () => ({
      isPrev: true,
      bg: require('./assets/bg.jpg'),
      isRandom: false,
      isPlaying: false,
      isListShow: true,
      musicList: [],
      ctx: null,
      player: null,
      progress: 0,
      nowPlayIndex: -1,
    }),
    created: function() {
      const self = this;
      fetch(`http://182.254.148.53:3000/playlist/detail?id=926638907`, {
        method: 'get',
        mode: 'cors'
      }).then((res) => {
          return res.json()
      }).then((data) => {
        if (data.code === 200) {
          return data.playlist.tracks;
        } 
        throw new Error('网络异常');
      }).then((list) => {
        return list.reduce((a, b) => {
          a.push({
            name: b.name,
            id: b.id,
            singer: b.ar[0] && b.ar[0].name,
            pic: b.al.picUrl + '?param=400y400'
          });
          return a;
        }, []);
      }).then((list) => {
        self.musicList = list;
      }).catch(() => {
        alert('拉取歌单失败...');
      });
    },
    mounted: function() {
      setTimeout(() => {
        this.isPrev = false;
      }, 1000);
      this.player = document.querySelector('.J_Player');
      this.ctx = document.querySelector('.J_progress').getContext('2d');
      this.ctx.lineWidth = 40;
      this.ctx.strokeStyle = '#50E3C2';
    },
    watch: {
      nowPlayIndex: function(newVal) {
        const music = this.musicList[newVal];
        this.bg = music.pic ? music.pic : require('./assets/bg.jpg');
        const self = this;
        fetch(`http://182.254.148.53:3000/music/url?id=${music.id}`, {
          method: 'GET',
          mode: 'cors'
        }).then(res => {
          return res.json();
        }).then(res => {
          self.player.src = res.data[0].url;
          this.player.play();
          this.isPlaying = true;
        });
      }
    },
    methods: {
      fPrevMusic: function() {
        this.uPrevMusic();
      },
      fNextMusic: function() {
        this.uNextMusic();
      },
      fChangeMode: function() {
        this.isRandom = !this.isRandom;
      },
      fChangeStatus: function() {
        if (this.nowPlayIndex === -1) {
          this.nowPlayIndex = 0;
          return;
        }
        if (this.isPlaying) {
          this.player.pause();
        } else {
          this.player.play();
        }
        this.isPlaying = !this.isPlaying;
      },
      fShowListClick: function() {
        this.isListShow = !this.isListShow;
      },
      fMusicClick: function(e) {
        const id = ~~e.target.getAttribute('data-index');
        this.nowPlayIndex = id;
      },
      uDrawCircle: function(degree) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 224, 224);
        ctx.beginPath();
        ctx.arc(112.5, 112.5, 88, -Math.PI / 2,degree - Math.PI / 2, false);
        ctx.stroke();
      },
      uTimeUpdate: function(e) {
        const currentTime = e.target.currentTime;
        const totalTime = e.target.duration;
        this.progress = currentTime / totalTime * 100;
        this.uDrawCircle(Math.PI * 2.0 * this.progress / 100);
      },
      uPrevMusic: function() {
        this.nowPlayIndex = (this.nowPlayIndex === 0 ? this.musicList.length : this.nowPlayIndex) - 1;
      },
      uNextMusic: function() {
        this.nowPlayIndex = (this.nowPlayIndex + 1) % this.musicList.length;
      },
      uPlayEnd: function(e) {
        if (this.isRandom) {
          this.nowPlayIndex = Math.floor(Math.random() * 100 % this.musicList.length);
        } else {
          this.uNextMusic();
        }
      }
    }
  }
</script>
<style lang="scss">
html, body {
  margin: 0;
  height: 100%;
  width: 100%;
  max-width: 400px;
  max-height: 400px;
  font-family: 'PingFangSC-Light','STHeiTi';
  -webkit-font-smoothing: antialiased;
  user-select: none;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .g-main {
    -webkit-app-region: drag;
  }
  &.prev,&:hover {
    .g-footer, .g-list.show {
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
  height: 84px;
  overflow: hidden;
  background-color: rgba(0,0,0,0.8);
  z-index: 9;
  transform: translateY(100%);
  transition: all .6s;
  .m-controller {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    padding: 0 28px;
    .u-btn {
      display: block;
      background-size: 100% auto;
      background-repeat: no-repeat;
      &:active {
        transform: scale(.9);
      }
    }
    .m-mode {
      height: 17px;
      width: 22px;
      position: relative;
      &.random {
        .u-mode-random {
          opacity: 1;
          pointer-events: auto;
        }
        .u-mode-normal {
          transform: scale(.8);
          pointer-events: none;
        }
      }
      &.normal {
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
        width: 22px;
        height: 17px;
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
      height: 18px;
      width: 22px;
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
      width: 56px;
      height: 56px;
      position: relative;
      &.play {
        .u-pause {
          opacity: 1;
          pointer-events: auto;
        }
        .u-play {
          transform: scale(.9);
          pointer-events: none;
        }
      }
      &.pause {
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
        top: 6px;
        left: 6px;
        height: 44px;
        width: 44px;
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
      width: 22px;
      height: 15px;
      position: relative;
      &.fill {
        .u-list-fill {
          opacity: 1;
          pointer-events: auto;
        }
        .u-list {
          transform: scale(.8);
          pointer-events: none;
        }
      }
      &.unfill {
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
        height: 15px;
        width: 22px; 
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
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.g-list {
  position: absolute;
  height: 316px;
  width: 400px;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.6);
  -webkit-app-region: none;
  z-index: 9;
  transform: translate3d(0,-100%, 0);
  transition: all .6s;
  padding: 24px 16px;
  box-sizing: border-box;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .u-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    position: relative;
    padding: 0 6px;
    cursor: pointer;
    &.played {
      .name, .singer{
        color: #50E3C2;
      }
      &:after {
        background-color: #50E3C2;
      }
    }
    &:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background-color: white;
      opacity: .3;
      transform: scaleY(.5);
      content: '';
    }
    &:active {
      .name, .singer {
        transform: scale(.9);
      }
    }
    .name {
      color: white;
      font-size: 14px;
      font-weight: bold;
    }
    .singer {
      font-size: 12px;
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
</style>

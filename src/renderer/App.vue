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
        <div class="m-mode" :class="{range: isRange, normal: !isRange}" @click="fChangeMode">
          <a href="javascript:;" class="u-mode-range u-btn"></a>
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
      isRange: false,
      isPlaying: false,
      isListShow: true,
      musicList: [ { name: '躊躇いのユリカゴ',
    id: 498286386,
    singer: '兎明',
    url: 'http://m7.music.126.net/20171014144819/7e2ce21f59f347a0d13bcda4c0c61199/ymusic/82a7/8712/e996/21b9770fd4e01660b00f4d62085d81c6.mp3',
    pic: 'https://p3.music.126.net/wSb6GmWEQ8sVoc9dkmzDKw==/18915998044547110.jpg?param=400y400' },
  { name: '共鳴しない愛のカタチ',
    id: 436016269,
    singer: 'senya',
    url: 'http://m7c.music.126.net/20171014144819/ce8bc84802f37daa458ecea20cc43b48/ymusic/8860/f677/88b0/24d807420ccd4437821984a726451e75.mp3',
    pic: 'https://p3.music.126.net/wtWyaZEqkXmjpS7R1PrQRw==/3440371896258514.jpg?param=400y400' },
  { name: '泡沫、哀のまほろば',
    id: 22780387,
    singer: '幽閉サテライト',
    url: 'http://m8c.music.126.net/20171014144820/261669b708b48773edf24577d84675cf/ymusic/6b34/fa9d/d764/6ce2fcbfc9b607d7fed487f4d67093c5.mp3',
    pic: 'https://p3.music.126.net/qxi0Fdds5I4-BOUqBg_Nzw==/918092209216702.jpg?param=400y400' },
  { name: '可能性の化身',
    id: 412951951,
    singer: '幽閉サテライト',
    url: 'http://m7c.music.126.net/20171014144820/6a1203ff6650c364dfa0ff51e463679b/ymusic/8a49/d257/d271/43472d7e5394e61985b3dfa8222eb198.mp3',
    pic: 'https://p3.music.126.net/-bP_lAlTxSxck9Zrlf6k2w==/1396379776620530.jpg?param=400y400' },
  { name: '魂の語りに導かれて',
    id: 34338787,
    singer: 'senya',
    url: 'http://m7c.music.126.net/20171014144820/2f346ee49ff532a32140c2fa85bb6863/ymusic/40c7/1d4e/4769/565e6a0cec5f4d29830d6936430b1ce7.mp3',
    pic: 'https://p3.music.126.net/-ynvwfh7uHlqEIzl2R7YXQ==/3278743674495923.jpg?param=400y400' },
  { name: 'コノ葉隠れ',
    id: 33020436,
    singer: 'senya',
    url: 'http://m7.music.126.net/20171014144820/73d79a06d4c256ab2f356ce4a2ed1c13/ymusic/990d/6ba8/702a/504fd01b2e6bca0452e9e12702064bb9.mp3',
    pic: 'https://p3.music.126.net/YKlovqwujy_FIB2ALa8ztA==/2895014118485777.jpg?param=400y400' },
  { name: '華鳥風月',
    id: 869119,
    singer: 'senya',
    url: 'http://m8.music.126.net/20171014144820/dcbd60df4acfcdbbebac8e94ea31ba59/ymusic/5ed6/a2c6/311b/df585179bbfa8a9c6b90542d089baf21.mp3',
    pic: 'https://p3.music.126.net/RwsPGpySHPY4OZfRQzxkLQ==/910395627841603.jpg?param=400y400' },
  { name: '残響は鳴り止まず',
    id: 28953086,
    singer: 'senya',
    url: 'http://m7c.music.126.net/20171014144820/066f893b617be4240f0ef84fbc454c2b/ymusic/d3e0/c9f8/14d9/2200529284bd3bc62fc9f13ffb2c4415.mp3',
    pic: 'https://p3.music.126.net/HjXQ-kqwHV0YJMKOOi67xw==/8900546627195926.jpg?param=400y400' },
  { name: '夜桜に君を隠して',
    id: 28167582,
    singer: '森永真由美',
    url: 'http://m7c.music.126.net/20171014144820/07b162c192f1cadb8f795b8800fed519/ymusic/dcae/9bf0/24b3/bb73b231c3570f10bf0fcc2392bc1c3e.mp3',
    pic: 'https://p3.music.126.net/kg8RKNH_HaB06YAQopOlow==/5861496487725357.jpg?param=400y400' },
  { name: 'ヒトリシズカ',
    id: 26457750,
    singer: 'senya',
    url: 'http://m7.music.126.net/20171014144820/ac12d0777fdc29e58583d87e1e1fd045/ymusic/e03f/2af5/73d0/b8405a2d02d895a39daa7d813144813b.mp3',
    pic: 'https://p3.music.126.net/Ka79KRY6uh43NKX3GWcUUg==/2417826069537067.jpg?param=400y400' },
  { name: 'Opposite World(原曲:亡き王女の为のセプテット)',
    id: 869438,
    singer: 'senya',
    url: 'http://m8.music.126.net/20171014144820/6146a151344670f0ed34e678ae06a594/ymusic/815f/a5cd/6daa/6bbffb26d3d1de4820a04794875dba64.mp3',
    pic: 'https://p3.music.126.net/AAuXOnRy4czh5bM6JmjiXw==/912594651097170.jpg?param=400y400' },
  { name: '月に叢雲華に風',
    id: 869190,
    singer: '幽閉サテライト',
    url: 'http://m8c.music.126.net/20171014144820/3c86c9f6f65af980936772b279a94a17/ymusic/eb2c/dcb3/d545/dbf2884f94a37bfe28969149625b00d5.mp3',
    pic: 'https://p3.music.126.net/fZ8Zik-SiUVFA8GGvruQAA==/815837627853177.jpg?param=400y400' },
  { name: '色は匂へど散りぬるを',
    id: 869450,
    singer: '幽閉サテライト',
    url: 'http://m8c.music.126.net/20171014144820/21422a4e9686e3094d5202f0fc604d27/ymusic/6379/ca12/a276/106cd1a31d10f4bc4871476eed00c805.mp3',
    pic: 'https://p3.music.126.net/hIHEyc0Qqr1UDC9HconC5A==/937883418539102.jpg?param=400y400' } ],
      ctx: null,
      player: null,
      progress: 0,
      nowPlayIndex: -1,
    }),
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
        this.player.src = music.url;
        this.player.play();
        this.isPlaying = true;
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
        this.isRange = !this.isRange;
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
        if (this.isRange) {
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
  * {
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
      &.range {
        .u-mode-range {
          opacity: 1;
          pointer-events: auto;
        }
        .u-mode-normal {
          transform: scale(.8);
          pointer-events: none;
        }
      }
      &.normal {
        .u-mode-range {
          transform: scale(.8);
          pointer-events: none;
        }
        .u-mode-normal {
          opacity: 1;
          pointer-events: auto;
        }
      }
      .u-mode-range, .u-mode-normal {
        position: absolute;
        top: 0;
        left: 0;
        width: 22px;
        height: 17px;
        opacity: 0;
        transition: all .6s;
      }
      .u-mode-range {
        background-image: url('./assets/mode_range.svg');  
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
  top: 0;
  height: 316px;
  width: 400px;
  left: 0;
  background-color: rgba(0,0,0,.6);
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

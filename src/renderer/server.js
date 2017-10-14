const NeteaseMusic = require('simple-netease-cloud-music')
const nm = new NeteaseMusic()

async function get() {
  const playList = await nm.playlist('50787020');
  const ids = playList.privileges.map(d => d.id);
  let musicList = [];
  for (let i = 0; i < ids.length; i++) {
    const songDetail = await nm.song(ids[i]);
    const picUrl = await nm.picture('' + songDetail.songs[0].al.pic, 400);
    const songUrl = await nm.url('' + ids[i]);
    musicList.push({
      name: songDetail.songs[0].name,
      id: ids[i],
      singer: songDetail.songs[0].ar[0].name,
      url: songUrl.data[0].url,
      pic: picUrl.url
    });
  }
  console.log(musicList);
  return musicList;
}

export default get;
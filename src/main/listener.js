import { ipcMain } from 'electron';
import NeteaseMusic from 'simple-netease-cloud-music';

const nm = new NeteaseMusic();

export default function() {
  ipcMain.on('getMusicList', async (event, args) => {
    const playList = await nm.playlist(args);
    const ids = playList.privileges.map(d => d.id);
    let musicList = [];
    for (let i = 0; i < ids.length; i++) {
      const songDetail = await nm.song(ids[i]);
      const picUrl = await nm.picture('' + songDetail.songs[0].al.pic, 400);
      musicList.push({
        name: songDetail.songs[0].name,
        id: ids[i],
        singer: songDetail.songs[0].ar[0].name,
        pic: picUrl.url
      });
    }
    event.sender.send('getMusicListReply', musicList);
  })

  ipcMain.on('getMusicUrl', async (event, args) => {
    const songUrl = await nm.url(args);
    event.sender.send('getMusicUrlReply', songUrl.data[0].url);
  })
}
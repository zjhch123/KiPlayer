const Host = 'https://api.hduzplus.xyz';

export default {
  getPlayListById: (id) => {
    return new Promise((resolve, reject) => {
      fetch(`${Host}/playlist/detail?id=${id}`, {
        method: 'get',
        mode: 'cors'
      }).then(res => {
          return res.json()
      }).then(data => {
        if (data.code === 200) {
          return data.playlist.tracks;
        } 
        reject(new Error('接口返回异常'));
      }).then(list => {
        return list.reduce((a, b) => {
          a.push({
            name: b.name,
            id: b.id,
            singer: b.ar[0] && b.ar[0].name,
            pic: b.al.picUrl.replace('http:', 'https:') + '?param=400y400'
          });
          return a;
        }, []);
      }).then(result => {
        resolve(result);
      }).catch(() => {
        reject(new Error('网络请求失败'));
      })
    })
  },
  getMusicById: (id) => {
    return new Promise((resolve, reject) => {
      fetch(`${Host}/music/url?id=${id}`, {
        method: 'GET',
        mode: 'cors'
      }).then(res => {
        return res.json();
      }).then(data => {
        resolve(data.data[0].url.replace('http:', 'https:'));
      }).catch(() => {
        reject(new Error('网络请求失败'));
      })
    });
  }
};


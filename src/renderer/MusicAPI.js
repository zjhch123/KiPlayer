
export default {
  getPlayListById: (id) => {
    return new Promise((resolve, reject) => {
      fetch(`http://182.254.148.53:3000/playlist/detail?id=${id}`, {
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
            pic: b.al.picUrl + '?param=400y400'
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
      fetch(`http://182.254.148.53:3000/music/url?id=${id}`, {
        method: 'GET',
        mode: 'cors'
      }).then(res => {
        return res.json();
      }).then(data => {
        resolve(data.data[0].url);
      }).catch(() => {
        reject(new Error('网络请求失败'));
      })
    });
  }
};


const {webContents} = require('electron')

export default [
    {
      label: '操作',
      submenu: [
        {
          label: '更改歌单',
          click () {
            webContents.getFocusedWebContents().send('control', 'switchList');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '暂停 / 播放',
          accelerator: 'CmdOrCtrl+Option+J',
          click() {
            webContents.getFocusedWebContents().send('control', 'switchStatus');
          }
        },
        {
          label: '上一首',
          accelerator: 'CmdOrCtrl+Option+H',
          click() {
            webContents.getFocusedWebContents().send('control', 'prev');
          }
        },
        {
          label: '下一首',
          accelerator: 'CmdOrCtrl+Option+K',
          click() {
            webContents.getFocusedWebContents().send('control', 'next');
          }
        },
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '前进',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    },
    {
      label: '关于',
      submenu: [
        {
          label: '项目地址',
          click () { require('electron').shell.openExternal('https://github.com/zjhch123/KiPlayer') }
        },
        {type: 'separator'},
        {
          label: '作者',
          click () { require('electron').shell.openExternal('https://www.hduzplus.xyz/') }
        }
      ]
    }
  ]
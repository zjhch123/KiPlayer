'use strict'

import { app, BrowserWindow, Menu, MenuItem, dialog } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let inputWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1060,
    height: 600,
    useContentSize: true,
    resizable: false,
    titleBarStyle: 'hidden',
    fullscreenable: false,
    // frame: false,
    webPreferences: {
      defaultFontFamily: 'standard',
      defaultEncoding: 'utf-8'
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const template = [
    {
      label: '操作',
      submenu: [
        {
          label: '更改歌单',
          click () {
            dialog.showOpenDialog({
              properties: ['openFile', 'openDirectory', 'multiSelections']
            })
          }
        },
        {
          type: 'separator'
        },
        {
          label: '暂停播放',
          accelerator: 'CmdOrCtrl+K',
          click() {
          }
        },
        {
          label: '上一首',
          accelerator: 'CmdOrCtrl+J',
          click() {
          }
        },
        {
          label: '下一首',
          accelerator: 'CmdOrCtrl+L',
          click() {
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
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}



app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


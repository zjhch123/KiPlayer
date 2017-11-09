'use strict'

import { app, BrowserWindow, Menu, MenuItem, globalShortcut } from 'electron'
import tabMenu from './tab';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  if (process.env.NODE_ENV !== 'production') {
    mainWindow = new BrowserWindow({
      width: 1040,
      height: 600,
      useContentSize: true,
      resizable: false,
      titleBarStyle: 'hidden',
      fullscreenable: false,
      show: false,
      frame: false,
      webPreferences: {
        defaultFontFamily: 'standard',
        defaultEncoding: 'utf-8'
      }
    })
  } else {
    mainWindow = new BrowserWindow({
      width: 400,
      height: 400,
      useContentSize: true,
      resizable: false,
      titleBarStyle: 'hidden',
      fullscreenable: false,
      show: false,
      frame: false,
      webPreferences: {
        defaultFontFamily: 'standard',
        defaultEncoding: 'utf-8'
      }
    })
  }

  mainWindow.loadURL(winURL)

  if (process.env.NODE_ENV !== 'development') {
    mainWindow.on('close', (e) => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
        e.preventDefault();
      }
    });
  }

  mainWindow.on('closed', (e) => {
    mainWindow = null;
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  const menu = Menu.buildFromTemplate(tabMenu);
  Menu.setApplicationMenu(menu);
  globalShortcut.register('CmdOrCtrl+Option+J', () => {
    mainWindow.webContents.send('control', 'switchStatus');
  });
  globalShortcut.register('CmdOrCtrl+Option+H', () => {
    mainWindow.webContents.send('control', 'prev');
  });
  globalShortcut.register('CmdOrCtrl+Option+K', () => {
    mainWindow.webContents.send('control', 'next');
  });
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
  } else {
    mainWindow.show();
  }
})


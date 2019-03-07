'use strict'
const join = require('path').join
const app = require('electron').app
const ipc = require('electron').ipcMain
const shell = require('electron').shell
const Tray = require('electron').Tray
const Menu = require('electron').Menu
const config = require('./config')
const createMainMenu = require('./menu')
const createMainWindow = require('./window')

require('electron-debug')()

let mainWindow

function handleResize () {
  if (!mainWindow.isFullScreen()) {
    config.set('lastWindowState', mainWindow.getBounds())
  }
}

function handleClosed () {
  mainWindow = null
}

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.hide()
  } else {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(handleResize, handleClosed)
  }
})

let tray = null
app.on('ready', () => {
  mainWindow = createMainWindow(handleResize, handleClosed)
  createMainMenu()
  tray = new Tray(join(__dirname, '../build/icon.png'))
  tray.setToolTip('Toggle Google Keep') 
  let hidden = true
  tray.on('click', function(){
    if(hidden){
      mainWindow.show()
    } else {
      mainWindow.hide()
    }
    hidden = !hidden
  })
  mainWindow.hide()
})

ipc.on('clicklink', (event, url) => {
  event.preventDefault()
  shell.openExternal(url)
})

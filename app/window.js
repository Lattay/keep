'use strict'
const join = require('path').join
const BrowserWindow = require('electron').BrowserWindow
const config = require('./config')

module.exports = function createMainWindow (handleResize, handleClosed) {
  const lastWindowState = config.get('lastWindowState')

  const window = new BrowserWindow({
    minWidth: 615,
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    icon: join(__dirname, '../build/icon.png'),
    title: 'Keep',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: `${__dirname}/browser.js`
    },
    hidden: true,
  })

  window.loadURL('https://keep.google.com')
  window.on('resize', handleResize)
  window.on('minimize',function(event){
    event.preventDefault();
    window.hide();
    window.hidden = true;
  })
  window.on('closed', handleClosed)

  return window
}

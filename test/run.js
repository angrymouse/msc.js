let electron = require('electron');
let BrowserWindow = electron.BrowserWindow
let app = electron.app
app.on('ready', (arguments) => {

  let win = new BrowserWindow({
    width: 1024,
    height: 1024,
    //fullscreen:true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  console.log(__dirname);
  win.webContents.loadFile("index.html")
});

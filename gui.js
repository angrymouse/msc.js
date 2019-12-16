let electron=require('electron'),
    app=electron.app,
    BrowserWindow=electron.BrowserWindow;
app.on('ready', () => {
  let window=new BrowserWindow({
    width:1024,
    height:512,
    webPreferences:{
      nodeIntegration:true,
      menu:null
    },
    title:"Verix Engine Menu"
  })

window.loadFile("gui/gui.html")

});

const { app, BrowserWindow, ipcMain } = require('electron')

const http = require("./utils/http");
const constants = require("./utils/constants");
const adBreakParser = require("./parsers/adBreakParser");
const vmapParser = require("./parsers/vmapParser");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('app/index.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("fetch", async (event, args) => {
  const url = args;
  //
  const fs = require("fs");
  const path = require("path");
  const vast = fs.readFileSync(path.join(__dirname, "tests/mock/vast.xml"), "utf-8");
  const vmap = fs.readFileSync(path.join(__dirname, "tests/mock/vmap.xml"), "utf-8");
  const xml = vmap;
  // const xml = await http.get(url);
  if (xml) {
    const format = xml.includes(constants.Format.VMAP)
      ? constants.Format.VMAP
      : constants.Format.VAST;

    let printData;
    switch (format) {
      case constants.Format.VAST:
        printData = adBreakParser.parse(xml, null, true);
        break;
      case constants.Format.VMAP:
        printData = vmapParser.parse(xml, true);
        break;
    }
    event.sender.send("data", printData);
  }
});

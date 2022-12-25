const { app, BrowserWindow, ipcMain } = require('electron')
const SerialPort = require('serialport')
const serialport = new SerialPort('/dev/ttyUSB0', { baudRate: 115200})

app.on('ready', () => {
  const first = new BrowserWindow({
    title: 'first',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  first.loadFile('src/renderer/first.html')
  const second = new BrowserWindow({
    title: 'second',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  second.loadFile('src/renderer/second.html')
  ipcMain.on('speed', (_, value) => second.webContents.send('speed', value))
  ipcMain.on('track', (_, value) => second.webContents.send('track', value))
  ipcMain.on('stop', (_, value) => second.webContents.send('stop', value))
  ipcMain.on('pause', (_, value) => second.webContents.send('pause', value))
  ipcMain.on('play', (_, value) => second.webContents.send('play', value))
  ipcMain.on('loop', (_, value) => second.webContents.send('loop', value))
  ipcMain.on('reverse', (_, value) => second.webContents.send('reverse', value))
  ipcMain.on('time', (_, value) => second.webContents.send('time', value))
  ipcMain.on('bg', (_, value) => second.webContents.send('bg', value))
  ipcMain.on('enable-layer', (_, value) => second.webContents.send('enable-layer', value))
  ipcMain.on('disable-layer', (_, value) => second.webContents.send('disable-layer', value))
	ipcMain.on('end', (_, value) => first.webContents.send('end', value))
	serialport.on('data', data => {
		let byte = data.readInt8(0)
		switch(byte) {
			case 1:
				first.webContents.send('presentation')
				break
			case 2:
				first.webContents.send('guide')
				break
			case 3:
				first.webContents.send('waiting')
				break
			case 4:
				first.webContents.send('waiting1')
				break
			case 5:
				first.webContents.send('waiting2')
				break
		}
	})
})

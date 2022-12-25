const utils = {
	ipc: require('electron').ipcRenderer,
	waitToEnd: video => new Promise(resolve => video.onended = resolve),
	sleep: delay => new Promise(resolve => setTimeout(resolve, delay))
}

const { ipcRenderer } = require('electron')

const videos = document.querySelectorAll('video')
const bg = document.getElementById('bg')

ipcRenderer.on('loop', (_, {value, layer = 0}) => videos[layer].loop = value)
ipcRenderer.on('speed', (_, {value, layer = 0}) => videos[layer].playbackRate = value)
ipcRenderer.on('time', (_, {value, layer = 0}) => videos[layer].currentTime = value)
ipcRenderer.on('play', (_, {layer}) => videos[layer].play())
ipcRenderer.on('pause', (_, { layer }) => videos[layer].pause())
ipcRenderer.on('track', (_, {value, layer = 0}) => {
	videos[layer].classList.remove('hidden')
  videos[layer].src = value
  videos[layer].play()
})
ipcRenderer.on('stop', () => {
  videos.forEach(video => video.classList.add('hidden'))
})
ipcRenderer.on('enable-layer', (_, { layer }) => {
	document.getElementById('bg-layer'+layer).classList.remove('hidden')
})
ipcRenderer.on('disable-layer', (_, { layer }) => {
	document.getElementById('bg-layer'+layer).classList.add('hidden')
})

ipcRenderer.on('reverse', (_, { value, layer }) => {
	let time = videos[layer].duration - videos[layer].currentTime
	videos[layer].src = value
	videos[layer].currentTime = time
})

ipcRenderer.on('bg', (_, src) => {
	bg.style.backgroundImage = `url("${src}")`
})

videos.forEach((video, i) => {
	video.onended = () => ipcRenderer.send('end', i)
})

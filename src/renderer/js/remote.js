const remote = {
	waiting: [() => {}, () => {}, () => {}],
  speed(value, layer = 0) {
    utils.ipc.send('speed', { value, layer })
  },
  track(value, layer = 0) {
    utils.ipc.send('track', { value, layer })
		this.waiting[layer] = () => {}
  },
  loop(value, layer = 0) {
    utils.ipc.send('loop', { value, layer })
  },
  stop(layer = 0) {
    utils.ipc.send('stop', { layer })
		this.waiting[layer] = () => {}
  },
  play(layer = 0) {
    utils.ipc.send('play', { layer })
  },
  pause(layer = 0) {
		console.log(layer)
    utils.ipc.send('pause', { layer })
  },
  time(value, layer = 0) {
    utils.ipc.send('time', { value, layer })
  },
  enableLayer(layer = 0) {
    utils.ipc.send('enable-layer', { layer })
  },
  disableLayer(layer = 0) {
    utils.ipc.send('disable-layer', { layer })
  },
	bg(value) {
		utils.ipc.send('bg', value)
	},
	reverse(value, layer = 0) {
		utils.ipc.send('reverse', { value, layer })
	},
	waitToEnd(layer = 0) {
		return new Promise(resolve => this.waiting[layer] = resolve)
	},
	resolve(layer) {
		this.waiting[layer]()
		this.waiting[layer] = () => {}
	}
}

utils.ipc.on('end', (_, value) => remote.resolve(value))

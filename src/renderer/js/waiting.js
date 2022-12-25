const waiting = {
	timeout: null,
	mode: 1,
	loaded: false,
  async load() {
		remote.track('videos/platform_intro.WebM', 1)
		remote.bg('videos/bg1.png', 1)
		remote.loop(false, 1)
		this.loaded = true
		await utils.sleep(4000)
		if(!this.loaded) return
		remote.loop(true, 1)
		remote.track('videos/semi-oraque.webm', 1)
		this.mode == 1 ? await this.setMode1() : await this.setMode2()
  },
	async setMode1() {
		console.log('setting mode 1, current mode is ',this.mode)
		remote.disableLayer(0)
		remote.disableLayer(2)
		remote.bg('videos/bg1.png')
		this.mode = 1
	},
	async setMode2() {
		console.log('setting mode 2, current mode is ',this.mode)
		remote.disableLayer(0)
		remote.disableLayer(2)
		remote.bg('videos/bg2.png')
		this.mode = 2
	},
	async transition21() {
		console.log('setting mode 21, current mode is ',this.mode)
		if(this.mode == 1 || this.mode == 3) return
		//if(this.mode == 4) {
			//remote.reverse('videos/trees_outro.WebM')
			//remote.reverse('videos/overlay_outro.WebM', 2)
		//} else {
			remote.track('videos/trees_outro.WebM')
			remote.track('videos/overlay_outro.WebM', 2)
		//}
		this.mode = 3
		remote.waitToEnd(2).then(() => this.setMode1())
	},
	async transition12() {
		console.log('setting mode 12, current mode is ',this.mode)
		if(this.mode == 2 || this.mode == 4) return
		//if(this.mode == 1) {
		//
			remote.track('videos/trees_intro.WebM')
			remote.track('videos/overlay_intro.WebM', 2)
		//}
		this.mode = 4
		remote.waitToEnd(2).then(() => this.setMode2())
	},
	exit() {
		if(this.mode == 3) this.mode = 1
		if(this.mode == 4) this.mode = 2
		this.loaded = false
		remote.disableLayer(1)
		remote.disableLayer(2)
		clearTimeout(this.timeout)
	}
}

utils.ipc.on("waiting1", () => {
	if(waiting.loaded) waiting.transition21()
	else waiting.mode = 1
})
utils.ipc.on("waiting2", () => {
	if(waiting.loaded) waiting.transition12()
	else waiting.mode = 2
})
utils.ipc.on("waiting", () => load(2))

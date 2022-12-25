const guide = {
	root: document.getElementById('guide'),
	video: document.querySelector('#guide video'),
	buttonImages: document.querySelectorAll('#guide .button-image'),
	buttonHitboxes: document.querySelectorAll('#guide .button-hitbox'),
	bg: document.querySelector('#guide-bg'),
	interactive: false,
	mode: 1,
	loaded: false,
	async load() {
		this.loaded = true
		animatedButton(
			this.buttonHitboxes[0],
			this.buttonImages[0],
			'guide0',
			() => this.setMode(1)
		)
		animatedButton(
			this.buttonHitboxes[1],
			this.buttonImages[1],
			'guide1',
			() => this.setMode(2)
		)
		animatedButton(
			this.buttonHitboxes[2],
			this.buttonImages[2],
			'guide2',
			() => this.setMode(3)
		)
		animatedButton(
			this.buttonHitboxes[3],
			this.buttonImages[3],
			'guide3',
			toMenu
		)
		this.root.classList.remove('hidden')
		this.play('videos/guide/0.WebM')
		this.video.loop = false
		remote.loop(false)
		await utils.waitToEnd(this.video)
		this.interactive = true
		this.video.loop = true
		remote.loop(true)
		this.play('videos/guide/1.WebM')
	},
	play(clip) {
		this.video.src = clip
		remote.track(clip)
		this.video.currentTime = 0
		remote.time(0)
		this.video.play()
	},
	setBg(index) {
		this.bg.style.backgroundImage = `url("videos/guide/${index}.png")`
		remote.bg(`videos/guide/${index}.png`)
	},
	async setMode(mode) {
		if(!this.interactive || mode == this.mode) return
		console.log('setting mode ', mode)
		this.interactive = false
		this.video.loop = false
		remote.loop(false)
		let prevMode = this.mode
		this.setBg(prevMode)
		await this.skip()
		this.video.src = `videos/guide/${prevMode}${mode}.WebM`
		remote.track(`videos/guide/${prevMode}${mode}.WebM`)
		this.video.play()
		setTimeout(() => this.setBg(mode), 100)
		await utils.waitToEnd(this.video)
		this.video.src = `videos/guide/${mode}.WebM`
		remote.track(`videos/guide/${mode}.WebM`)
		this.mode = mode
		this.video.play()
		this.interactive = true
		this.video.loop = true
		remote.loop(true)
	},
	async skip() {
		let duration = (this.video.duration - this.video.currentTime) * 1000
		console.log(duration)
		this.video.playbackRate = 2
		remote.speed(2)
		await utils.sleep(duration / 8)
		remote.speed(4)
		this.video.playbackRate = 4
		await utils.sleep(duration / 8)
		remote.speed(2)
		this.video.playbackRate = 2
		await utils.sleep(duration / 8)
		this.video.playbackRate = 1
		remote.speed(1)
		// await utils.waitToEnd(this.video)
	},
	next() {
		if(this.mode == 3) this.setMode(1)
		else this.setMode(this.mode + 1)
	},
	exit() {
		this.root.classList.add('hidden')
		this.video.pause()
		remote.stop()
		this.loaded = false
	}
}
utils.ipc.on('guide', () => !guide.loaded ? load(1) : guide.next())

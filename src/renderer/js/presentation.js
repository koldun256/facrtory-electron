const presentation = {
  root: document.getElementById('presentation'),
  video: document.querySelector('#presentation video'),
  buttonImages: document.querySelectorAll('#presentation .button-image'),
  buttonHitboxes: document.querySelectorAll('#presentation .button-hitbox'),
  progress: document.querySelector('progress'),
  progressContent: document.querySelector('progress *'),
  exitTimeout: null,
  paused: false,
  loaded: false,
  async load() {
		this.loaded = true
    this.root.classList.remove('hidden')
    remote.time(0)
    remote.loop(false)
    remote.track(this.video.src)
    this.video.play()
    this.video.currentTime = 0
    this.video.loop = false
    this.video.muted = false
    animatedButton(
      this.buttonHitboxes[0],
      this.buttonImages[0],
      'presentation0',
      () => this.pause()
    )
    animatedButton(
      this.buttonHitboxes[1],
      this.buttonImages[1],
      'presentation1',
      () => this.play()
    )
    animatedButton(
      this.buttonHitboxes[2],
      this.buttonImages[2],
      'presentation2',
      () => this.video.muted = true
    )
    animatedButton(
      this.buttonHitboxes[3],
      this.buttonImages[3],
      'presentation3',
      toMenu
    )
	this.video.onended = () => setTimeout(toMenu, 5000)
  },
  play() {
	this.paused = false
	remote.play()
    this.video.play()
  },
  pause() {
		this.paused = true
		remote.pause()
    this.video.pause()
  },
  togglePause() {
	!this.paused ? this.pause() : this.play()
  },
  exit() {
    this.root.classList.add('hidden')
	this.loaded = false
    this.video.pause()
	this.video.paused = true
    remote.stop()
    if(this.exitTimeout) clearTimeout(this.exitTimeout)
  }
}

setTimeout(() => 
	presentation.progress.setAttribute('max', presentation.video.duration),
200)
presentation.video.addEventListener('timeupdate', () => {
	presentation.progress.value = presentation.video.currentTime
	presentation.progressContent.style.width = 
		Math.floor(
			(presentation.video.currentTime / presentation.video.duration) * 100
		) + '%'
})
utils.ipc.on('presentation', () => {
	console.log(presentation.loaded)
	!presentation.loaded ? load(0) : presentation.togglePause()
})

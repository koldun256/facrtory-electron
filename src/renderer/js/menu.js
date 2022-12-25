const menu = document.getElementById('menu')
const transitionVideo = document.getElementById('transition')

let modes = [presentation, guide, waiting]
let currentMode = -1
let timeout
let interactive = true

async function toMenu() {
  modes[currentMode].exit()
  if(currentMode != 2) {
		await transition()
	}
  //menu.classList.remove('hidden')
  timeout = setTimeout(() => load(2), 10000)
	currentMode = -1
}

async function load(i) {
	console.log(`trying to load mode ${i} from mode ${currentMode}, interactive: ${interactive}`)
  if(i == currentMode || !interactive) return
  try {modes[currentMode].exit()}catch(_){}
  clearTimeout(timeout)
	interactive = false
  //menu.classList.add('hidden')
  console.log('loading mode ', i)
  if(i == 2) {
    currentMode = i
    modes[i].load()
		interactive = true
    return
  }
  //await transition()
  currentMode = i
  await modes[i].load()
	interactive = true
}
async function transition() {
  console.log('asdf')
  transitionVideo.classList.remove('hidden')
  transitionVideo.play()
  transitionVideo.currentTime = 0
  remote.track('./videos/transition.mp4')
  await utils.waitToEnd(transitionVideo)
  transitionVideo.classList.add('hidden')
  remote.stop()
}

load(2)

const buttonsHitboxes = document.querySelectorAll('#menu .button-hitbox')
const buttonsImages = document.querySelectorAll('#menu .button-image')

buttonsHitboxes.forEach(
  (btn, i) => animatedButton(
    btn,
    buttonsImages[i],
    `menu${i}`,
    () => load(i)
  )
)

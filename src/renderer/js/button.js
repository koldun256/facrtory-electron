const animatedButton = (buttonHitbox, buttonImage, prefix, callback) => {
  const setFrame = frame => {
    let url = `url("ui/buttons/${prefix}${frame}.png")`
    buttonImage.style.backgroundImage = url
  }
  setFrame(0)
  buttonHitbox.onclick = () => {
    let frame = 0
    let rising = true
    function update() {
      setFrame(rising ? frame++ : frame--)
      if(frame == 5) {
        frame--
        rising = false
        callback()
      }
      if(frame !== -1 || rising) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }
}

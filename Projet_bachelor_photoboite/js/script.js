

class Video {

  constructor(){
    this.renderType = 'normal'
    this.colors = [128, 128, 128]
  }
  
  static ready(){
    return new Video().stream()
  }

  // Stream de la video
  stream(){
    const video = document.querySelector('.video')
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      video.srcObject = localMediaStream
      video.play()
    })
    .catch(err => {
      // Si la caméra n'est pas oppérationelle, retourne une image par défaut
      console.error('Error', err)
    })
    this.output(video)
  }


  // render which output to show
  output(video){
    const btns = document.querySelectorAll('.btn')
    const inputs = document.querySelectorAll('.input')
    const photo = new Photo()
    

    // loop through each btn
    btns.forEach(btn => {
      btn.addEventListener('click', ()=>{
        this.renderType = btn.classList[1]
        this.render(video, this.renderType)
      })
    })

    // loop through each input range
    inputs.forEach((input, i) => { 
      input.addEventListener('input', () => {
        this.renderType = 'custom'
        this.colors[i] = input.value
      })
    })

    // call the output to render the image

    this.render(video, photo)

    

  }

  // output the desired image style
  render(video, photo) {
    const canvas = document.querySelector('.canvas')
    const ctx = canvas.getContext('2d')
    const shot = document.querySelector('.takePhoto')
    
    
    // création interval de rendu
    setInterval(()=>{
      ctx.drawImage(video, 0, 0, 640, 480)
      let pixels = ctx.getImageData(0, 0, 640, 480)
      // render image normale
      if(this.renderType == 'normal') pixels = normal(pixels) 
      // rendu image en négatif
      if(this.renderType == 'negative') pixels = negative(pixels)
      // rendu image customisée
      if(this.renderType == 'custom') pixels = custom(pixels, this.colors)

      ctx.putImageData(pixels, 0, 0)
    }, 16)

    shot.addEventListener('click', ()=> { 
      console.log('click')
      var counter=6
        const counterzone = document.querySelector('.counter')
         var interval=setInterval(IntervalRepeat, 1000)



      function IntervalRepeat(){
        counter--
            console.log(counter,this)
            counterzone.innerHTML=counter
            if (counter==0){
               photo.newImage(canvas.toDataURL('image/jpeg'))
            }


            if (counter<0){
              clearInterval(interval)
              counterzone.innerHTML=""

            }
      }
      
    })

  }


}


class Photo {
  constructor(){
    this.photos = []
  }
  // crétion nouvelle image
  newImage(image){
    const images = document.querySelectorAll('.image')
    const snap = document.querySelector('.snap')

    // Joue l'audio quand clic
    snap.currentTime = 0
    snap.play()

    this.photos.unshift(image)
    // rendue de  l'image
    this.photos.forEach((img, i) =>{
      images[i].innerHTML = `
        
        <a href=${img} download>
          <img src="${img}" alt="image ${i+1}">
        </a>
      `
    })

  }
    

}


// normal image rendering
const normal = (pixels) => {
  return pixels
}


const negative = (pixels) => {
  // convert each pixels to appear black and white
  for (let x = 0; x < pixels.data.length; x = x + 4) {
    pixels.data[x + 0] = 255 - pixels.data[x + 0]
    pixels.data[x + 1] = 255 - pixels.data[x + 1]
    pixels.data[x + 2] = 255 - pixels.data[x + 2]
  }
  return pixels
  
}

const custom = (pixels, colors) => {
  // convert pixels to its custom color
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + colors[0] / 2
    pixels.data[i + 1] = pixels.data[i + 1] + colors[1] / 2
    pixels.data[i + 2] = pixels.data[i + 2] + colors[2] / 2
  }
  return pixels
}
  
// start the app
const start = Video.ready()
  
  
  
  
var canvas
var canvasContext

var audioContext
var source
var sourceStream
var sourceBuffer
var analyser

var bufferLength
var dataArray
var useMic = true;

// loading stuff in on page load
window.onload = function () {
  canvas = document.getElementById('AudioVisual')
  canvas.focus()
  canvasContext = canvas.getContext('2d')

  canvasContext.fillStyle = 'black'
  canvasContext.fillRect(0,0,canvas.width,canvas.height)

  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioContext.createAnalyser()

  if (useMic) {
    hide(document.getElementById("audioControls"))
    micLoad();
  } else {
    document.querySelector('input').addEventListener('change', fileLoad)
  }
}

function micLoad () {
    navigator.getUserMedia(
          {"audio": true},
           gotStream, function(e) {
              alert('Error getting audio');
              console.log(e);
          });

  function gotStream(stream) {
    var source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser)
      //analyser.connect(audioContext.destination)
      setupAnalyser()
  }
}

// loads the sound into buffer when you upload
function fileLoad () {
  var fileReader = new FileReader()
  fileReader.onload = function () {
    sourceBuffer = this.result
  }

  fileReader.readAsArrayBuffer(this.files[0])

  var url = URL.createObjectURL(this.files[0])
  audio_player.src = url

  audio_player.play()
  var source = audioContext.createMediaElementSource(document.querySelector('audio'))
  
  source.connect(analyser)
  analyser.connect(audioContext.destination)

  setupAnalyser()
}

function setupAnalyser () {
 analyser.fftSize = Math.pow(2, Math.floor(Math.log2(canvas.width)))
 bufferLength = analyser.frequencyBinCount
 dataArray = new Uint8Array(bufferLength)

 analyser.getByteTimeDomainData(dataArray)

 canvasContext.clearRect(0, 0, canvas.width, canvas.height)

    // drawColorCircles()
    drawBubbleVisual()
//    drawStandardVisual()
}

function drawStandardVisual () {
  var drawVisual = requestAnimationFrame(drawStandardVisual)

  analyser.getByteFrequencyData(dataArray)

  canvasContext.fillStyle = 'rgb(0,0,0)'
  canvasContext.fillRect(0, 0, canvas.width, canvas.height)
  var barWidth = (canvas.width / bufferLength)
  var barHeight
  var x = 0

  for (var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * canvas.height / 100
    intensity = dataArray[i] / 100
    canvasContext.fillStyle = 'rgb(' + 255*intensity + ',' + 50 + ',' + 255*(1-intensity)
    canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

    x += barWidth
  }
}

function drawColorCircles () {
    var drawVisual = requestAnimationFrame(drawColorCircles)
    analyser.getByteFrequencyData(dataArray)

    canvasContext.fillStyle = 'rgb(0,0,0)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    for (var i = 0; i < bufferLength; i += 15) {

        third = dataArray[bufferLength * 7 / 8] / 255
        second = dataArray[bufferLength * 4 / 8] / 255
        first = dataArray[bufferLength * 1 / 8] / 255

        canvasContext.fillStyle = 'rgb(' + 255 * first + ',' + 255 * second + ',' + 255 * third + ')'
        canvasContext.fillRect(0, 0, canvas.width, canvas.height)

//      canvasContext.strokeStyle = 'rgb(255,255,255)';

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * second + ',' + 255 * first + ',' + 255 * third + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height + 300, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * third + ',' + 255 * first + ',' + 255 * second + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height + 200, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * second + ',' + 255 * third + ',' + 255 * first + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height + 100, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke();

        canvasContext.beginPath();
        canvasContext.fillStyle = 'rgb(' + 255 * third + ',' + 255 * second + ',' + 255 * first + ')'
        canvasContext.arc(canvas.width / 2, canvas.height / 2, second * canvas.height, 0, 2 * Math.PI);
        canvasContext.fill();
//      canvasContext.stroke()
    }
}

  function drawStandardVisual () {
      var drawVisual = requestAnimationFrame(drawStandardVisual)

      analyser.getByteFrequencyData(dataArray)

      canvasContext.fillStyle = 'rgb(0,0,0)'
      canvasContext.fillRect(0, 0, canvas.width, canvas.height)
      var barWidth = (canvas.width / bufferLength)
      var barHeight
      var x = 0

      for (var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] * canvas.height / 100
          intensity = dataArray[i] / 100
          canvasContext.fillStyle = 'rgb(' + 255*intensity + ',' + 50 + ',' + 255*(1-intensity)
          canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

          x += barWidth
      }
  }

  function drawBubbleVisual () {
      var drawVisual = requestAnimationFrame(drawBubbleVisual)

      analyser.getByteFrequencyData(dataArray)

      canvasContext.fillStyle = 'rgb(0,0,0)'
      canvasContext.fillRect(0, 0, canvas.width, canvas.height)
      var barWidth = (canvas.width / bufferLength)
      var barHeight
      var x = 0

      for (var i = 0; i < bufferLength; i+= 100) {

          third = dataArray[bufferLength *  7/ 8] / 255
          second = dataArray[bufferLength * 4 / 8] / 255
          first = dataArray[bufferLength * 1 / 8] / 255

          canvasContext.fillStyle = 'rgb(' + 255* first + ',' + 255 * second + ',' + 255* third + ')'
          canvasContext.fillRect(0, 0, canvas.width, canvas.height)

//      canvasContext.strokeStyle = 'rgb(255,255,255)';

          canvasContext.beginPath();
          canvasContext.fillStyle = 'rgb(' + 255* second + ',' + 255 * first + ',' + 255* third + ')'
          canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random() ,first * canvas.height,0,2*Math.PI);
          canvasContext.fill();
//      canvasContext.stroke();

          canvasContext.beginPath();
          canvasContext.fillStyle = 'rgb(' + 255* third + ',' + 255 * first + ',' + 255* second + ')'
          canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random() ,third * canvas.height,0,2*Math.PI);
          canvasContext.fill();
//      canvasContext.stroke();

          canvasContext.beginPath();
          canvasContext.fillStyle = 'rgb(' + 255* second + ',' + 255 * third + ',' + 255* first + ')'
          canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random() ,second * canvas.height,0,2*Math.PI);
          canvasContext.fill();
//      canvasContext.stroke();

          canvasContext.beginPath();
          canvasContext.fillStyle = 'rgb(' + 255* third + ',' + 255 * second + ',' + 255* first + ')'
          canvasContext.arc(canvas.width * Math.random(),canvas.height * Math.random(),second * canvas.height,0,2*Math.PI);
          canvasContext.fill();
//      canvasContext.stroke()
      }

  }


function hide (elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = 'none';
  }
}


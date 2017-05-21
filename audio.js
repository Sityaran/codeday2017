var source
var audioContext = new (window.AudioContext || window.webkitAudioContext)()
var analyser = audioContext.createAnalyser()
var maxFFT = 1024
analyser.fftSize = maxFFT
var dataArray = new Uint8Array(analyser.fftSize)
var bufferLength = analyser.frequencyBinCount

var canvas
var canvasContext

var drawPick = 4

var randomOffsets = []
var numOffsets = 8;
var offSetRange = 100;

window.onload = function () {
    navigator.getUserMedia(
        {"audio": true},
        function gotStream(stream) {
            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            setup();
        }, 
        function(e) { 
            alert('Error getting audio'); 
            console.log(e); 
        }
    );
    
    for (var i = 0; i < numOffsets; i++) {
        randomOffsets.push(Math.floor(Math.random() * (offSetRange + offSetRange)) - offSetRange)
    }
    
}

function setup() {
    
    canvas = document.getElementById('canvas0')
    canvas.focus()
    canvasContext = canvas.getContext('2d')
    
    canvas.addEventListener('mousedown', function (e) {
        drawPick = (drawPick + 1) % 5
        if (drawPick === 0 || drawPick === 4) {
            analyser.fftSize = maxFFT
            dataArray = new Uint8Array(analyser.fftSize)
            bufferLength = analyser.frequencyBinCount
        } else {
            analyser.fftSize = 32
            dataArray = new Uint8Array(analyser.fftSize)
            bufferLength = analyser.frequencyBinCount
        }
    })
    
    setInterval(update, 10)
}

function update() {
    analyser.getByteFrequencyData(dataArray)
    if (drawPick === 0) {
        drawStandardVisual()
    } else if (drawPick === 1) {
        draw1()
    } else if (drawPick === 2) {
        draw2()
    } else if (drawPick === 3) {
       drawColorCircles()
    } else if (drawPick === 4) {
        canvasContext.fillStyle = 'rgba(0,0,0,' + Math.random() + ')'; 
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        analyser.getByteTimeDomainData(dataArray);
        for (var i = 0; i < numOffsets; i++) {
            drawWave(randomOffsets[i])
        }
    }
}

function drawColorCircles () {
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
    analyser.getByteFrequencyData(dataArray)

    canvasContext.fillStyle = 'rgba(0,0,0, .1)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    var barWidth = 1.5 * (canvas.width / bufferLength)
    var barHeight
    var x = 0

    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * canvas.height / 255
        intensity = dataArray[i] / 200
        canvasContext.fillStyle = 'rgb(' + 255*intensity + ',' + 50 + ',' + 255*(1-intensity)
        canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth
    }
}

function drawBubbleVisual () {
    analyser.getByteFrequencyData(dataArray)

    canvasContext.fillStyle = 'rgb(0,0,0)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

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

function draw1 () {
    var r = Math.min(dataArray[2], 200)
    var g = Math.min(dataArray[4], 190)
    var b = Math.min(dataArray[8], 180)
    var avg = (r+g+b)/3
    
    canvasContext.fillStyle = 'rgb(' + (255-r) + ',' + (255-g) + ',' + (255 - b) + ')'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    
    canvasContext.beginPath()
    canvasContext.arc(canvas.width/2, canvas.height/2, canvas.width * avg / 2 / 250, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'rgb(' + (255-b) + ',' + r + ',' + (255-g) + ')'
    canvasContext.fill()
    canvasContext.closePath()
    
    canvasContext.beginPath()
    canvasContext.arc(canvas.width/2, canvas.height/2, canvas.width * avg / 4 / 250, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'rgb(' + r + ',' + (255 - b) + ',' + (255-g) + ')'
    canvasContext.fill()
    canvasContext.closePath()
    
    canvasContext.beginPath()
    canvasContext.arc(canvas.width/2, canvas.height/2, canvas.width * avg / 8 / 250, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = 'rgb(' + (255-g) + ',' + (255-b) + ',' + (255-r) + ')'
    canvasContext.fill()
    canvasContext.closePath()  
}

function draw2 () {
    // draw bg
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    for (var i = 0; i < bufferLength; i++) {       
        // draw circle
        canvasContext.beginPath()
        canvasContext.arc(canvas.width/2, canvas.height/2, Math.sqrt(canvas.width*canvas.width + canvas.height*canvas.height) * (1 - i / bufferLength) / 2, 0, 2 * Math.PI, false);

        canvasContext.fillStyle = 'rgba(' + (dataArray[i]) + ',' + (dataArray[bufferLength - i]) + ',' + (255 - dataArray[i]) + ',' + (1 - i/bufferLength) + ')'
        canvasContext.fill()
        canvasContext.closePath()  
    }
}


function drawWave(offset) {    

    canvasContext.lineWidth = 4;
    canvasContext.strokeStyle = 'rgba(255, 255, 255,' + .5 + ')';

    canvasContext.beginPath();

    var sliceWidth = canvas.width / bufferLength;
    var x = 0;
    
    
    for(var i = 0; i < bufferLength; i++) {

        var v = (dataArray[i] - 128.0) / 128;
        var y = v * 100 + canvas.height / 2;
        
        if(i === 0) {
            canvasContext.moveTo(x, y + offset);
        } else {
            canvasContext.lineTo(x, y + offset);
        }

        x += sliceWidth;
    }

    canvasContext.lineTo(canvas.width, canvas.height/2 + offset);
    canvasContext.stroke();
    canvasContext.closePath();
}

function drawMultiWave() {
    
}

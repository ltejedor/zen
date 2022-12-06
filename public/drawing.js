let anxiety = 0.5;
let gcodeHeader = ";---> this code is for cnc-ino <---\n; Img Size: (500,500)pixel to (500,500)mm\n; Process Error: 75.92%\n; Tool Diameter: 10\n; Scale Axes: 500\n; Deep Step: -1\n; Z Save: 1\n; Z White: 0\n; Z Black: -1\nG21 ; Set units to mm\nG90 ; Absolute positioning\n"
let gcode = gcodeHeader
let maxSize = 420

let calmingDown = false
let calmDown // Calmdown interval

let anxietySpeed = 1.005
let calmSpeed = 0.995
let element 
let context
let radius = 4;  


window.addEventListener('load', function () {

  document.body.style.setProperty('--maxsize', maxSize + 'px');

  // Get context
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  let start = 0; 
  let end = Math.PI * 2; 
  let dragging = false;
  let margin = 100

  // Set width and height
  canvas.width = Math.max( document.body.clientHeight/2, document.body.clientWidth/2 - margin*2); 
  canvas.height = canvas.width
  context.lineWidth = radius * 2;  

  let putPoint = function(e) {
  	if(dragging){

      // Draw on the canvas
  		context.lineTo(e.offsetX, e.offsetY);
  		context.stroke();
  		context.beginPath(); 
  		context.arc(e.offsetX, e.offsetY, radius, start, end);
      context.fillStyle = '#999'
      context.strokeStyle = '#999'
  		context.fill(); 
  		context.beginPath();
  		context.moveTo(e.offsetX, e.offsetY);
      
      // Write Gcode
      let mmX = Math.round( e.offsetX / canvas.width * maxSize ) * -1 + maxSize/2
      let mmY = Math.round( e.offsetY / canvas.height * maxSize ) - maxSize/2

      // Add to the gcode
      gcode += "G01 Z1 ;X" + mmX + " Y" + mmY + " Z1\n"

      // Increase anxiety when drawing
      if(anxiety < maxSize/2) {
        anxiety *= anxietySpeed;
      } else {
        anxiety = maxSize/2
      }

      document.body.style.setProperty('--anxiety', Math.round(anxiety*10)/10 + 'px');
      let xx =  (Math.random() * anxiety -anxiety/2) 
      let yy = (Math.random() * anxiety  -anxiety/2) 

      document.querySelector('#canvas').style.left = xx + 'px'
      document.querySelector('#canvas').style.top = yy + 'px'
      document.querySelector('#canvas').style.transform = 'translate( -' + xx + 'px, -' + yy + 'px )' 
      console.log(xx, yy)
      // visualization
      document.querySelector('.bar').style.width = anxiety/ (maxSize/2) *100 +"vw"


      // Making sure we are updating the sandbox
      textures.bumpMap.needsUpdate = true
      topSand.material.bumpMap.needsUpdate = true
      topSand.material.displacementMap.needsUpdate = true
      // console.log(topSand.material.bumpMap.needsUpdate)

  	}
  }

  let engage = function(e){
    
    // Reset canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    calmingDown = false
  	dragging = true;

    // Start new gcode 
    gcode = gcodeHeader
  
    // First Gcode point
    gcode += "G01 Z1 ;X" + ( Math.round( e.offsetX / canvas.width * maxSize ) * -1 ) + " Y" + ( Math.round( e.offsetY / canvas.height * maxSize )) + " Z1 Line Init\n"

    // Update the sandbox texture
    textures.bumpMap.needsUpdate = true
    topSand.material.bumpMap.needsUpdate = true
    topSand.material.displacementMap.needsUpdate = true
    // Draw the point
  	putPoint(e);
  }

  let disengage = function(){
    calmingDown = true
  	dragging = false;

    // Calm down a little
    calmDown = setInterval(function() {
        if(calmingDown) {
          if(anxiety > 0.5 ) {
            anxiety /= anxietySpeed
          } else {
            anxiety > 0.5
          }
          document.querySelector('.bar').style.width = anxiety/(maxSize/2)*100 +"vw"

          document.body.style.setProperty('--anxiety', Math.round(anxiety*10)/10 + 'px');
          console.log("calming down " + Math.round(anxiety*10)/10 )
        } else {
          clearInterval(calmDown)
          console.log('stopped calming down')
        }
    }, 20)

    // console.log(gcode)
  	context.beginPath();
  }


  canvas.addEventListener('mousedown', engage);
  canvas.addEventListener('mousemove', putPoint);
  canvas.addEventListener('mouseup', disengage);  

  // Save the image
  element = document.getElementById("saveimg");
  element.addEventListener("click", saveFunction);

})

// Resize window and canvas
window.addEventListener('resize', function() {
  canvas.width = Math.max( document.body.clientHeight/2, document.body.clientWidth/2 - margin*2); 
  canvas.height = canvas.width
  context.lineWidth = radius * 2;  

})


function fillCanvasBackgroundWithColor(canvas, color) {
 
  // Get the 2D drawing context from the provided canvas.
  const context = canvas.getContext('2d');
  context.save();
  context.globalCompositeOperation = 'destination-over';
  context.fillStyle = '#ffffff33';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

// let fs = require('fs')

function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}



function saveFunction() {

  // filename = document.getElementById("savename").value;
  filename = "zenbot";
  if (filename.length>0){
    savename = filename + ".gcode";
    download(savename, gcode)
  }
}
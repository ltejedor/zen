let anxiety = 0.5;
let gcode = ";---> this code is for cnc-ino <---\n; Img Size: (500,500)pixel to (500,500)mm\n; Process Error: 75.92%\n; Tool Diameter: 10\n; Scale Axes: 500\n; Deep Step: -1\n; Z Save: 1\n; Z White: 0\n; Z Black: -1\nG21 ; Set units to mm\nG90 ; Absolute positioning\n"
let maxSize = 420

window.addEventListener('load', function () {

  canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var radius = 2;  //不要犯蠢，第一次竟然打成0，根本就不會有東西跑出來啊
  var start = 0; //起始點
  var end = Math.PI * 2;  //結束點
  var dragging = false;

  canvas.width = Math.min( document.body.clientHeight, document.body.clientWidth );  //設定canvas的寬
  canvas.height = Math.min(  document.body.clientWidth, document.body.clientHeight );  //設定canvas的高

  context.lineWidth = radius * 2;  //試著改變參數，會發現裡頭有線連著

  var putPoint = function(e) {
  	if(dragging){

  		context.lineTo(e.offsetX, e.offsetY);
  		context.stroke();
  		context.beginPath(); //請把這條beginPath到fill一起看
  		context.arc(e.offsetX, e.offsetY, radius, start, end);
      context.fillStyle= '#999999'
      context.strokeStyle= '#999999'
  		context.fill();  //填滿它
  		context.beginPath();
  		context.moveTo(e.offsetX, e.offsetY);
      
      let mmX = Math.round( e.offsetX / canvas.width * maxSize ) * -1 + maxSize/2
      let mmY = Math.round( e.offsetY / canvas.height * maxSize ) - maxSize/2

      gcode += "G01 Z1 ;X" + mmX + " Y" + mmY + " Z1\n"

      anxiety*=1.005;


      // console.log(anxiety)
      document.body.style.setProperty('--anxiety', anxiety + 'px');
      document.querySelector('#canvas').style.top= (Math.random() * anxiety  -anxiety/2)  + 'px'
      document.querySelector('#canvas').style.left = (Math.random() * anxiety -anxiety/2) + 'px'

  	}
  }

  var engage = function(e){
    context.clearRect(0, 0, canvas.width, canvas.height);
  	dragging = true;
    gcode = ";---> this code is for cnc-ino <---\n; Img Size: (500,500)pixel to (500,500)mm\n; Process Error: 75.92%\n; Tool Diameter: 10\n; Scale Axes: 500\n; Deep Step: -1\n; Z Save: 1\n; Z White: 0\n; Z Black: -1\nG21 ; Set units to mm\nG90 ; Absolute positioning\n"
    gcode += "G01 Z1 ;X" + ( Math.round( e.offsetX / canvas.width * maxSize ) * -1 ) + " Y" + ( Math.round( e.offsetY / canvas.height * maxSize )) + " Z1 Line Init\n"

  	putPoint(e);
  }

  var disengage = function(){
  	dragging = false;
    console.log(gcode)

  	context.beginPath();
  }

  canvas.addEventListener('mousedown', engage);
  canvas.addEventListener('mousemove', putPoint);//當有人在canvas上mousedown時觸發putPoint
  canvas.addEventListener('mouseup', disengage);
  // document.getElementById("textbox").innerHTML = "Hello!";

  
})

const element = document.getElementById("saveimg");
element.addEventListener("click", saveFunction);

function fillCanvasBackgroundWithColor(canvas, color) {
  // Get the 2D drawing context from the provided canvas.
  const context = canvas.getContext('2d');

  // We're going to modify the context state, so it's
  // good practice to save the current state first.
  context.save();

  // Normally when you draw on a canvas, the new drawing
  // covers up any previous drawing it overlaps. This is
  // because the default `globalCompositeOperation` is
  // 'source-over'. By changing this to 'destination-over',
  // our new drawing goes behind the existing drawing. This
  // is desirable so we can fill the background, while leaving
  // the chart and any other existing drawing intact.
  // Learn more about `globalCompositeOperation` here:
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  context.globalCompositeOperation = 'destination-over';

  // Fill in the background. We do this by drawing a rectangle
  // filling the entire canvas, using the provided color.
  context.fillStyle = '#ffffff33';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Restore the original context state from `context.save()`
  context.restore();
}
const fs = require('fs')

function download(filename, text) {
  var element = document.createElement('a');
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
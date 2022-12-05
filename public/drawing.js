window.addEventListener('load', function () {

  canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var radius = 2;  //不要犯蠢，第一次竟然打成0，根本就不會有東西跑出來啊
  var start = 0; //起始點
  var end = Math.PI * 2;  //結束點
  var dragging = false;

  canvas.width = document.body.clientWidth;  //設定canvas的寬
  canvas.height = document.body.clientHeight;  //設定canvas的高

  context.lineWidth = radius * 2;  //試著改變參數，會發現裡頭有線連著

  var putPoint = function(e){
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
  	}
  }

  var engage = function(e){
    context.clearRect(0, 0, canvas.width, canvas.height);
    
  	dragging = true;
  	putPoint(e);
  }

  var disengage = function(){
  	dragging = false;
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

function saveFunction() {
  // canvas = document.getElementById('canvas');
  // fillCanvasBackgroundWithColor(canvas, 'white');
  // const img = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)

  // const link = document.createElement('a')
  // link.href = img
  // link.download = 'test.png'
  // document.body.appendChild(link)
  // link.click()
  // document.body.removeChild(link)

  canvas = document.getElementById('canvas');
  fillCanvasBackgroundWithColor(canvas, 'white');
   canvas.resizeAndExport = function(width, height){
    var c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    c.getContext('2d').drawImage(this, 0,0,this.width, this.height, 0,0,width, height);
    return c.toDataURL('image/png');
    }
  const img = canvas.resizeAndExport(100, 100).replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)

  const link = document.createElement('a')
  link.href = img
  link.download = document.getElementById("savename").value+".png";
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  document.getElementById("imgtogcode").click();

  document.getElementById("textbox").innerHTML = "Exported Gcode!";

}

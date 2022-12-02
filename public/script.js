window.addEventListener('load', function () {

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var radius = 5;  //不要犯蠢，第一次竟然打成0，根本就不會有東西跑出來啊
  var start = 0; //起始點
  var end = Math.PI * 2;  //結束點
  var dragging = false;

  canvas.width = 500;  //設定canvas的寬
  canvas.height = 500;  //設定canvas的高

  context.lineWidth = radius * 2;  //試著改變參數，會發現裡頭有線連著

  var putPoint = function(e){
  	if(dragging){
  		context.lineTo(e.offsetX, e.offsetY);
  		context.stroke();
  		context.beginPath(); //請把這條beginPath到fill一起看
  		context.arc(e.offsetX, e.offsetY, radius, start, end);
  		context.fill();  //填滿它
  		context.beginPath();
  		context.moveTo(e.offsetX, e.offsetY);
  	}
  }

  var engage = function(e){
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
})

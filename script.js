var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var mode = document.getElementById('mode').value;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = function(event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

alert("Click Anywhere on the grid to set the mystery point\nThen select any 3 spots on the grid and it will pin point the mystery location")

function gameLoop() {
  requestAnimationFrame(gameLoop)

  ctx.clearRect(0,0,canvas.width,canvas.height)
  drawGrid()
}

var gridBlockSize = canvas.width/50;
var points = []
var point1;
var point2;
var point3;
var mysteryPoint;

function drawGrid() {
  var gridNumber = 1;
  var gridLetterIndex = 0;
  for (var x = 0; x < canvas.width; x += gridBlockSize) {
      for (var y = 0; y < canvas.height; y += gridBlockSize) {
        ctx.strokeStyle = '#696969';
        ctx.strokeRect(x, y, gridBlockSize, gridBlockSize);
        ctx.fillStyle = 'black'
        ctx.lineWidth = 5
      }
  }

  var fillColors = [`rgba(0,255,0,0.5)`,`rgba(0,0,255,0.5)`,`rgba(255,0,255,0.5)`]
  var strokeColors = [`rgba(0,150,0,1)`,`rgba(0,0,150,1)`,`rgba(150,0,150,1)`]
  for(var i=0;i<points.length;i++) {
    var point = points[i]
    
    ctx.fillStyle = strokeColors[i%3]
    ctx.beginPath();
    ctx.arc(point[0], point[1], 10, 0, 2 * Math.PI);
    ctx.fill() 
    
    if(mode == 'circles') {
      ctx.strokeStyle = strokeColors[i%3]
      ctx.fillStyle = fillColors[i%3]
      ctx.beginPath();
      ctx.arc(point[0], point[1], point[2], 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill()
    }
    if(mode == 'lines' && points.length >= 3) {
      ctx.strokeStyle = fillColors[i%3]
      ctx.moveTo(point[0],point[1])
      for(var x=0;x<points.length;x++) ctx.lineTo(intersection[0],intersection[1])
      ctx.stroke()
    }

    ctx.fillStyle = 'white'
    ctx.fillText(Math.floor(dist(point[0], point[1],mysteryPoint[0],mysteryPoint[1]))+' Distance',point[0]-20, point[1]-10)
  }
  
  if(intersection) {
    ctx.fillStyle = `red`
    ctx.beginPath();
    ctx.arc(intersection[0], intersection[1], 10, 0, 2 * Math.PI);
    ctx.fill()
    ctx.fillStyle = 'white'
    ctx.fillText(`(${intersection[0]}, ${intersection[1]})`,intersection[0]-20, intersection[1]-10)
  }
}

document.onmousedown = function(event) {
  if(event.target.id != "canvas") return
    if(!mysteryPoint || event.button == 2) {
      points = []
      mysteryPoint = [event.clientX, event.clientY]
      alert("Mystery position set")
    } else {
      points.push([event.clientX, event.clientY, dist(mysteryPoint[0],mysteryPoint[1],event.clientX,event.clientY)])
    }
    if(points.length>=3) {
      getIntersection()
    }
}

setInterval(function() {
  var title = '';
  if(mysteryPoint) title+=`POS: ${mysteryPoint[0]},${mysteryPoint[1]}  `
  if(intersection) title+=`PRE: ${intersection[0]},${intersection[1]}`
  document.getElementById('title').innerText = title;
  mode = document.getElementById('mode').value;
},1000)

var intersection;

function getIntersection() {
  for(var x=0;x<canvas.width;x++) {
    for(var y=0;y<canvas.height;y++) {
      var inPoint1 = dist(x,y,points[0][0],points[0][1]) == points[0][2];
      var inPoint2 = dist(x,y,points[1][0],points[1][1]) == points[1][2];
      var inPoint3 = dist(x,y,points[2][0],points[2][1]) == points[2][2];
      if(inPoint1 && inPoint2 && inPoint3) {
        intersection = [x,y]
      }
    }
  }
}

function dist(x1,y1,x2,y2) {
  return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))
}

gameLoop()
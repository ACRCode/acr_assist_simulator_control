// stores the device context of the canvas we use to draw the outlines
// initialized in myInit, used in myHover and myLeave
var hdc;
var can;

// shorthand func
function byId(e) {
  return document.getElementById(e);
}

function addCanvas() {
  var can = document.createElement("canvas");
  can.id = "myCanvas";
  document.body.appendChild(can);
  return can;
}

function drawCircle(coordon) {
  var coord = coordon.split(',');

  var c = byId('myCanvas');
  var hdc = c.getContext("2d");
  hdc.beginPath();

  hdc.arc(coord[0], coord[1], coord[2], 0, 2 * Math.PI);
  hdc.stroke();

  hdc.fillStyle = '#d3d3d3';
  hdc.fill();
}


// takes a string that contains coords eg - "227,307,261,309, 339,354, 328,371, 240,331"
// draws a line from each co-ord pair to the next - assumes starting point needs to be repeated as ending point.
function drawPoly(coOrdStr) {
  var mCoords = coOrdStr.split(',');
  var i, n;
  n = mCoords.length;

  hdc.beginPath();
  hdc.moveTo(mCoords[0], mCoords[1]);
  for (i = 2; i < n; i += 2) {
    hdc.lineTo(mCoords[i], mCoords[i + 1]);
  }
  hdc.lineTo(mCoords[0], mCoords[1]);
  hdc.stroke();
  hdc.closePath();
  hdc.fillStyle = '#d3d3d3';
  hdc.fill();
}

function drawRect(coOrdStr) {
  var mCoords = coOrdStr.split(',');
  var top, left, bot, right;
  left = mCoords[0];
  top = mCoords[1];
  right = mCoords[2];
  bot = mCoords[3];
  hdc.fillStyle = '#d3d3d3';
  hdc.strokeStyle = 'red';
  hdc.fillRect(left, top, right - left, bot - top);
  hdc.strokeRect(left, top, right - left, bot - top);
}

function myHover(element) {

  var imgID = element.getAttribute('imgID');
  loadCanvas(imgID);
  var coordStr = element.getAttribute('coords');
  var areaType = element.getAttribute('shape');

  switch (areaType) {
    case 'polygon':
    case 'poly':
      drawPoly(coordStr);
      break;

    case 'rect':
      drawRect(coordStr);
      break;
    case 'circle':
      drawCircle(coordStr);
      break;
  }


}

function myLeave() {
  // can.remove();
  var canvas = byId('myCanvas');
  hdc.clearRect(0, 0, canvas.width, canvas.height);
}

function loadCanvas(imgID) {
  // get the target image
  var img = byId(imgID);

  var x, y, w, h;

  // get it's position and width+height
  x = img.offsetLeft;
  y = img.offsetTop;
  w = img.clientWidth;
  h = img.clientHeight;

  // move the canvas, so it's contained by the same parent as the image
  var imgParent = img.parentNode;
  var can = byId('myCanvas');
  if (can == undefined) {
    can = addCanvas();
  }

  imgParent.appendChild(can);

  can.style.zIndex = 1;

  can.style.left = x + 'px';
  can.style.top = y + 'px';

  can.setAttribute('width', w + 'px');
  can.setAttribute('height', h + 'px');

  hdc = can.getContext('2d');

  hdc.fillStyle = 'red';
  hdc.strokeStyle = 'red';
}
$(document).ready(function () {
  init_SimulatorUI();
});

var init_SimulatorUI = function () {
  $("#toggleWrapper").click(function (e) {
    $("body").toggleClass("sidebar-collapse");
  });
}

function zoomIn() {
  var id = document.getElementsByClassName('item zoom active')[0].children[0].children[0].children[0].id;
  var myImg = document.getElementById(id);
  var currWidth = myImg.clientWidth;
  if (currWidth == 2500) return false;
  else {
    myImg.style.width = (currWidth + 100) + "px";
  }
}

function zoomOut() {
  var id = document.getElementsByClassName('item zoom active')[0].children[0].children[0].children[0].id;
  var myImg = document.getElementById(id);
  var currWidth = myImg.clientWidth;
  if (currWidth == 100) return false;
  else {
    myImg.style.width = (currWidth - 100) + "px";
  }
}

function resizeKeyImages() {
  let windowHeight = window.innerHeight;
  let reportTextHeight = $('#div-right-reportText').height();
  let height = windowHeight - reportTextHeight - 150;
  $('#carousel-example-generic').height(height+'px');

}

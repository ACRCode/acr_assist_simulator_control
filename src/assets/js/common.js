$(document).ready(function () {
  init_SimulatorUI();
});

var init_SimulatorUI = function () {
  $("#toggleWrapper").click(function (e) {
    $("body").toggleClass("sidebar-collapse");
  });
}

function toggleSidebar() {
  var width = window.innerWidth;
  if (width <= 766) {
    if ($('body').hasClass('sidebar-open')) {
      $('body').removeClass('sidebar-open');
    } else {
      $('body').addClass('sidebar-open ');
    }
  } else {
    if ($('body').hasClass('sidebar-collapse')) {
      $('body').removeClass('sidebar-collapse');
    } else {
      $('body').addClass('sidebar-collapse ');
    }
  }
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

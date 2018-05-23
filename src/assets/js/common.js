$(document).ready(function () {
  init_SimulatorUI();
});

var init_SimulatorUI = function () {
  
  $("#toggleWrapper").click(function (e) {
    $("body").toggleClass("sidebar-collapse");
  });

  init_keyImagesUI();
}

var init_keyImagesUI = function () {
  $('.img-decissionTree').loupe();
  windowHeight = window.innerHeight;
  $('#carousel-example-generic').css({
    "height": '' + (windowHeight - 455) + 'px',
    "overflow-y": "auto",
    "overflow-x": "hidden"
  });
}



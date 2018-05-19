$(document).ready(function () {
  init_SimulatorUI();
});

var init_SimulatorUI = function () {
  
  windowHeight = window.innerHeight;
  $('#div-simulator-form').css({
    "height": '' + (windowHeight - 102) + 'px',
    "overflow-y": "scroll",
    "overflow-x": "hidden"
  });
  $('#carousel-example-generic').css({
    "height": '' + (windowHeight - 403) + 'px',
    "overflow-y": "auto",
    "overflow-x": "hidden"
  });

  $("#toggleWrapper").click(function (e) {
    $("body").toggleClass("sidebar-collapse");
  });

  init_keyImagesUI();
}

var init_keyImagesUI = function () {
  $('.img-decissionTree').loupe();
  windowHeight = window.innerHeight;
  $('#carousel-example-generic').css({
    "height": '' + (windowHeight - 145) + 'px',
    "overflow-y": "auto",
    "overflow-x": "hidden"
  });
}

var reportTextCollapse = function () {
  if ($('#icon_reporttext').hasClass('fa fa-minus')) {
    $('#icon_reporttext').removeClass('fa fa-minus');
    $('#icon_reporttext').addClass('fa fa-plus');
    $('#body_reporttext').css({
      'display': 'none'
    });
  } else {
    $('#icon_reporttext').removeClass('fa fa-plus');
    $('#icon_reporttext').addClass('fa fa-minus');
    $('#body_reporttext').removeAttr('style');
  }
}

var keyDiagramCollapse = function () {
  if ($('#icon_keydiagram').hasClass('fa fa-minus')) {
    $('#icon_keydiagram').removeClass('fa fa-minus');
    $('#icon_keydiagram').addClass('fa fa-plus');
    $('#body_keydiagram').css({
      'display': 'none'
    });
  } else {
    $('#icon_keydiagram').removeClass('fa fa-plus');
    $('#icon_keydiagram').addClass('fa fa-minus');
    $('#body_keydiagram').removeAttr('style');
  }
}


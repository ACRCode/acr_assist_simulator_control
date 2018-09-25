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
  // $('.img-decissionTree').loupe();
}

function loadMangnifier(activate) {
  $("#BlowupLens").remove();
  $('.img-decissionTree').each(function (i, img) {
    if (activate) {
      let $maginifier = $(img).blowup({
        background: "#FCEBB6"
      });
    } else {
      $("#BlowupLens").remove();
      $(img).css('cursor', 'pointer');
    }
  });

}

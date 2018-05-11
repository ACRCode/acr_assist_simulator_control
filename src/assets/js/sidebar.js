$( document ).ready(function() {
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

$(document).ready(function() {
    windowHeight = window.innerHeight;
    $('#div-simulator-form').css({
        "height": '' + (windowHeight - 250) + 'px',
        "overflow-y": "scroll",
        "overflow-x": "hidden"
    });
});
$( document ).ready(function() {
    $("#toggleWrapper").click(function(e) {
        $("body").toggleClass("sidebar-collapse");
    });
});

$(document).ready(function() {
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
});
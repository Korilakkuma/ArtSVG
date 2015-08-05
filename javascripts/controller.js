$(function() {

    var WIDTH  = 300;
    var HEIGHT = 300;

    var svg       = document.querySelector('svg');
    var container = svg.parentNode;

    var artSVG = new ArtSVG(container, svg, WIDTH, HEIGHT);

});

$(function() {

    var WIDTH  = 300;
    var HEIGHT = 300;

    var PALLETE = [
        ['rgb(255,   0, 0)', 'rgb(  0, 255,   0)', 'rgb(  0,   0, 255)'],
        ['rgb(255, 255, 0)', 'rgb(  0, 255, 255)', 'rgb(255,   0, 255)'],
        ['rgb(  0,   0, 0)', 'rgb(127, 127, 127)', 'rgb(255, 255, 255)']
    ];

    var svg       = document.querySelector('svg');
    var container = svg.parentNode;

    var artSVG = new ArtSVG(container, svg, WIDTH, HEIGHT);

    $('#select-mode').change(function() {
        artSVG.setMode(this.value);
    });

    $('#color-fill').spectrum({
        preferredFormat      : 'rgb',
        color                : 'rgba(0, 0, 0, 1.0)',
        allowEmpty           : true,
        showInput            : true,
        showAlpha            : true,
        showPalette          : true,
        pallete              : PALLETE,
        showSelectionPalette : true,
        hide                 : function(color) {
            artSVG.setFill(color.toRgbString());
        }
    });

    $('#color-stroke').spectrum({
        preferredFormat      : 'rgb',
        color                : 'rgba(0, 0, 0, 1.0)',
        allowEmpty           : true,
        showInput            : true,
        showAlpha            : true,
        showPalette          : true,
        pallete              : PALLETE,
        showSelectionPalette : true,
        hide                 : function(color) {
            artSVG.setStroke(color.toRgbString());
        }
    });

    $('#number-stroke-width').change(function() {
        artSVG.setStrokeWidth(this.valueAsNumber);
    });

});

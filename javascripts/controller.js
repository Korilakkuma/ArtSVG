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
        if (this.value === ArtSVG.Mode.SELECT) {
            artSVG.setMode(this.value);
        } else {
            artSVG.setMode(ArtSVG.Mode.DRAW);
            artSVG.setDrawerType(this.value);
        }
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

    $('#select-stroke-linecap').change(function() {
        artSVG.setStrokeLinecap(this.value);
    });

    $('#select-stroke-linejoin').change(function() {
        artSVG.setStrokeLinejoin(this.value);
    });

    $('#select-font-family').change(function() {
        artSVG.setFontFamily(this.value);
    });

    $('#number-font-size').change(function() {
        artSVG.setFontSize(this.value + 'px');
    });

    $('#button-undo').on(ArtSVG.MouseEvents.CLICK, function() {
        if (!artSVG.undo()) {
            console.log('Cannot undo');
        }
    });

    $('#button-redo').on(ArtSVG.MouseEvents.CLICK, function() {
        if (!artSVG.redo()) {
            console.log('Cannot redo');
        }
    });

    $('#button-clear').on(ArtSVG.MouseEvents.CLICK, function() {
        artSVG.clear();
    });

});

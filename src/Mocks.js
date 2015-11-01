(function(global) {
    'use strict';

    // Mocks

    function ArtSVG(container, svg, width, height) {
    }

    ArtSVG.XMLNS = 'http://www.w3.org/2000/svg';
    ArtSVG.XLINK = 'http://www.w3.org/1999/xlink';

    function MouseEvents() {
    }

    var click = '';
    var start = '';
    var move  = '';
    var end   = '';

    // Touch Panel ?
    if (/iPhone|iPad|iPod|Android/.test(navigator.userAgent)) {
        click = 'click';
        start = 'touchstart';
        move  = 'touchmove';
        end   = 'touchend';
    } else {
        click = 'click';
        start = 'mousedown';
        move  = 'mousemove';
        end   = 'mouseup';
    }

    MouseEvents.CLICK = click;
    MouseEvents.START = start;
    MouseEvents.MOVE  = move;
    MouseEvents.END   = end;

    function Mode() {
    }

    Mode.SELECT = 'select';
    Mode.DRAW   = 'draw';

    ArtSVG.MouseEvents = MouseEvents;
    ArtSVG.Mode        = Mode;

    function Color(red, green, blue, alpha) {
    }

    function Drawer(container) {
    }

    function Type() {
    }

    Type.PATH      = 'path';
    Type.RECTANGLE = 'rectangle';
    Type.SQUARE    = 'square';
    Type.CIRCLE    = 'circle';
    Type.ELLIPSE   = 'ellipse';
    Type.LINE      = 'line';
    Type.TEXT      = 'text';

    function StrokeLinecap() {
    }

    StrokeLinecap.BUTT   = 'butt';
    StrokeLinecap.ROUND  = 'round';
    StrokeLinecap.SQUARE = 'square';

    function StrokeLinejoin() {
    }

    StrokeLinejoin.MITER = 'miter';
    StrokeLinejoin.ROUND = 'round';
    StrokeLinejoin.BEVEL = 'bevel';

    function FontStyle() {
    }

    FontStyle.NORMAL  = 'normal';
    FontStyle.ITALIC  = 'italic';
    FontStyle.OBLIQUE = 'oblique';

    Drawer.Type           = Type;
    Drawer.StrokeLinecap  = StrokeLinecap;
    Drawer.StrokeLinejoin = StrokeLinejoin;
    Drawer.FontStyle      = FontStyle;

    function History(svg) {
    }

    History.prototype.updateHistory = function() {
    };

    ArtSVG.Color   = Color;
    ArtSVG.Drawer  = Drawer;
    ArtSVG.History = History;

    // Export
    global.Mocks        = {};
    global.Mocks.ArtSVG = ArtSVG;

})(window);

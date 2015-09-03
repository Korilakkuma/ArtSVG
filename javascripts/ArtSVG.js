/**
 * ArtSVG.js
 * @fileoverview HTML5 SVG Library
 *
 * Copyright 2013@Tomohiro IKEDA
 * Released under the MIT license
 */
 
 
 
(function(global) {

    /**
     * This class can be used as global object.
     * This class has classes that are defined by "ArtSVG.js" as class property.
     * This class manages data for drawing.
     * This class defines accessor methods as facade.
     * @param {HTMLElement} container This argument is the instance of HTMLElement for wrapping SVGElement.
     * @param {SVGElement} svg This argument is the instance of SVGElement.
     * @param {number} width This argument is SVG width. The default value is 300 (px).
     * @param {number} height This argument is SVG height. The default value is 300 (px).
     * @constructor
     */
    function ArtSVG(container, svg, width, height) {
        this.container = document.body;
        this.svg       = null;

        if (container instanceof HTMLElement) {
            this.container = container;
        }

        if (svg instanceof SVGElement) {
            this.svg = svg;
        } else {
            this.svg = document.createElement('svg');
            this.container.appendChild(svg);
        }

        this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        this.svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

        var w = parseInt(width);
        var h = parseInt(height);

        this.container.style.width  = (w > 0) ? (w + 'px') : (ArtSVG.DEFAULT_SIZES.WIDTH  + 'px');
        this.container.style.height = (h > 0) ? (h + 'px') : (ArtSVG.DEFAULT_SIZES.HEIGHT + 'px');

        this.svg.setAttribute('width',  (w > 0) ? w : ArtSVG.DEFAULT_SIZES.WIDTH);
        this.svg.setAttribute('height', (h > 0) ? h : ArtSVG.DEFAULT_SIZES.HEIGHT);

        this.drawer = new ArtSVG.Drawer(this.container);

        this.mode = ArtSVG.Drawer.MODES.PATH;

        var self = this;

        var isDown = false;

        this.container.addEventListener(ArtSVG.MouseEvents.START, function(event) {
            if (isDown) {
                return;
            }

            isDown = true;

            self.drawer.draw(event, self.mode);
        }, true);

        this.container.addEventListener(ArtSVG.MouseEvents.MOVE, function(event) {
            if (!isDown) {
                return;
            }

            // for Touch Panel
            event.preventDefault();

            self.drawer.draw(event, self.mode);
        }, true);

        global.addEventListener(ArtSVG.MouseEvents.END, function(event) {
            if (!isDown) {
                return;
            }

            isDown = false;

            self.drawer.draw(event, self.mode);
        }, true);
    }

    /** Constant values as class properties (static properties) */
    ArtSVG.DEFAULT_SIZES        = {};
    ArtSVG.DEFAULT_SIZES.WIDTH  = 300;
    ArtSVG.DEFAULT_SIZES.HEIGHT = 300;

    /**
     * This method is getter for container width for drawing.
     * @return {number} This is returned as container width for drawing.
     */
    ArtSVG.prototype.getContainerWidth = function() {
        return parseInt(this.container.style.width);
    };

    /**
     * This method is getter for container height for drawing.
     * @return {number} This is returned as container height for drawing.
     */
    ArtSVG.prototype.getContainerHeight = function() {
        return parseInt(this.container.style.height);
    };

    /**
     * This method returns the selected drawer.
     * @return {string} This is returned as string for the selected drawer.
     */
    ArtSVG.prototype.getMode = function() {
        return this.mode;
    };

    /**
     * This method selects drawer.
     * @param {string} mode This argument is one of 'path', 'rectangle', 'circle', 'ellipse', 'line'.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setMode = function(mode) {
        if (String(mode).toUpperCase() in ArtSVG.Drawer.MODES) {
            this.mode = String(mode).toLowerCase();
        }

        return this;
    };

    /**
     * This method gets fill color.
     * @return {string} This is returned as fill color string.
     */
    ArtSVG.prototype.getFill = function() {
        return this.drawer.getFill();
    };

    /**
     * This method sets fill color.
     * @param {string} fill This argument is string for color.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setFill = function(fill) {
        this.drawer.setFill(fill);
        return this;
    };

    /**
     * This method gets stroke color.
     * @return {string} This is returned as stroke color string.
     */
    ArtSVG.prototype.getStroke = function() {
        return this.drawer.getStroke();
    };

    /**
     * This method sets stroke color.
     * @param {string} stroke This argument is string for color.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setStroke = function(stroke) {
        this.drawer.setStroke(stroke);
        return this;
    };

    (function($) {

        /**
         * This static class wraps event for drawing.
         */
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

        // Export
        $.MouseEvents = MouseEvents;

    })(ArtSVG);

    (function($) {

        /**
         * This class is to represent color.
         * @param {number} red This argument is between 0 and 255.
         * @param {number} green This argument is between 0 and 255.
         * @param {number} blue This argument is between 0 and 255.
         * @param {number} alpha This argument is between 0 and 1.
         * @constructor
         */
        function Color(red, green, blue, alpha) {
            this.red   = 0;
            this.green = 0;
            this.blue  = 0;
            this.alpha = 1;

            var r = parseInt(red);
            var g = parseInt(green);
            var b = parseInt(blue);
            var a = parseFloat(alpha);

            if (!isNaN(r) && (r >= 0) && (r <= 255)) {
                this.red = r;
            }

            if (!isNaN(g) && (g >= 0) && (g <= 255)) {
                this.green = g;
            }

            if (!isNaN(b) && (b >= 0) && (b <= 255)) {
                this.blue = b;
            }

            if (!isNaN(a) && (a >= 0) && (a <= 1)) {
                this.alpha = a;
            }
        }

        /**
         * This method gets value of red.
         * @return {number} This is returned as value of red.
         */
        Color.prototype.getRed = function() {
            return this.red;
        };

        /**
         * This method gets value of green.
         * @return {number} This is returned as value of green.
         */
        Color.prototype.getGreen = function() {
            return this.green;
        };

        /**
         * This method gets value of blue.
         * @return {number} This is returned as value of blue.
         */
        Color.prototype.getBlue = function() {
            return this.blue;
        };

        /**
         * This method gets value of alpha.
         * @return {number} This is returned as value of alpha.
         */
        Color.prototype.getAlpha = function() {
            return this.alpha;
        };

        /**
         * This method gets color string as rgba format.
         * @return {string} This is returned as color string as rgba format.
         * @override
         */
        Color.prototype.toString = function() {
            var rgba = 'rgba(' + this.red
                     + ', '    + this.green
                     + ', '    + this.blue
                     + ', '    + this.alpha
                     + ')';

             return rgba;
        };

        /**
         * This method gets color string as hex format.
         * @return {string} This is returned as color string as hex format.
         */
        Color.prototype.toHexString = function() {
            var hex = '#';

            hex += this.red.toString(16) + this.green.toString(16) + this.blue.toString(16);

            return hex;
        };

        // Export
        $.Color = Color;

    })(ArtSVG);

    (function($) {

        /**
         * This class defines properties and methods for drawing.
         * @param {HTMLElement} container This argument is the instance of HTMLElement for wrapping SVGElement.
         * @constructor
         */
        function Drawer(container) {
            this.container = document.body;

            if (container instanceof HTMLElement) {
                this.container = container;
            }

            this.numberOfObjects = 0;

            this.attributes = {
                'fill'            : new $.Color(0, 0, 0, 1).toString(),
                'stroke'          : new $.Color(0, 0, 0, 1).toString(),
                'stroke-width'    : 1,
                'stroke-linecap'  : 'butt',
                'stroke-linejoin' : 'miter'
            };

            this.points = {
                x1 : 0,
                y1 : 0
            };
        }

        /** Constant values as class properties (static properties) */
        Drawer.ELEMENT_ID_PREFIX = 'art-svg-';

        Drawer.MODES           = {};
        Drawer.MODES.PATH      = 'path';
        Drawer.MODES.RECTANGLE = 'rectangle';
        Drawer.MODES.CIRCLE    = 'circle';
        Drawer.MODES.ELLIPSE   = 'ellipse';
        Drawer.MODES.LINE      = 'line';

        /**
         * This method is facade method for drawing.
         * @param {Event} event This argument is event object.
         * @param {string} mode This argument is one of 'path', 'rectangle', 'circle', 'ellipse', 'line'.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.draw = function(event, mode) {
            switch (mode) {
                case Drawer.MODES.PATH :
                    this.drawPath(event);
                    break;
                case Drawer.MODES.RECTANGLE :
                    this.drawRect(event);
                    break;
                case Drawer.MODES.CIRCLE :
                    this.drawCircle(event);
                    break;
                case Drawer.MODES.ELLIPSE :
                    this.drawEllipse(event);
                    break;
                case Drawer.MODES.LINE :
                    this.drawLine(event);
                    break;
                default :
                    break;
            }

            return this;
        };

        /**
         * This method draws path.
         * @param {Event} event This argument is event object.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.drawPath = function(event) {
            if (!(event instanceof Event)) {
                return this;
            }

            var x = Drawer.getOffsetX(event, this.container);
            var y = Drawer.getOffsetY(event, this.container);

            switch (event.type) {
                case $.MouseEvents.START :
                    var html = this.container.innerHTML.replace('</svg>', '') + '<path id="' + (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects) + '" /></svg>';

                    this.container.innerHTML = html;

                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    element.setAttribute('fill',            'none');
                    element.setAttribute('stroke',          this.attributes['stroke']);
                    element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                    element.setAttribute('stroke-linecap',  this.attributes['stroke-linecap']);
                    element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                    element.setAttribute('d', ('M' + x + ' ' + y));

                    break;
                case $.MouseEvents.MOVE :
                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    element.setAttribute('d', (element.getAttribute('d') + ', L' + x + ' ' + y));

                    break;
                case $.MouseEvents.END :
                    this.numberOfObjects++;

                    break;
                default :
                    break;
            }

            return this;
        };

        /**
         * This method draws rectangle.
         * @param {Event} event This argument is event object.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.drawRect = function (event) {
            if (!(event instanceof Event)) {
                return this;
            }

            var x = Drawer.getOffsetX(event, this.container);
            var y = Drawer.getOffsetY(event, this.container);

            switch (event.type) {
                case $.MouseEvents.START :
                    var html = this.container.innerHTML.replace('</svg>', '') + '<rect id="' + (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects) + '" /></svg>';

                    this.container.innerHTML = html;

                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    element.setAttribute('fill',            this.attributes['fill']);
                    element.setAttribute('stroke',          this.attributes['stroke']);
                    element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                    element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                    element.setAttribute('x', x);
                    element.setAttribute('y', y);

                    this.points.x1 = x;
                    this.points.y1 = y;

                    break;
                case $.MouseEvents.MOVE :
                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    var x1 = this.points.x1;
                    var y1 = this.points.y1;

                    var startX = Math.min(x, x1);
                    var startY = Math.min(y, y1);
                    var endX   = Math.max(x, x1);
                    var endY   = Math.max(y, y1);
                    var width  = Math.abs(endX - startX);
                    var height = Math.abs(endY - startY);

                    element.setAttribute('x',      startX);
                    element.setAttribute('y',      startY);
                    element.setAttribute('width',  width);
                    element.setAttribute('height', height);

                    break;
                case $.MouseEvents.END :
                    this.numberOfObjects++;
                    this.clearPoints();

                    break;
                default :
                    break;
            }

            return this;
        };

        /**
         * This method draws circle.
         * @param {Event} event This argument is event object.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.drawCircle = function(event) {
            if (!(event instanceof Event)) {
                return this;
            }

            var x = Drawer.getOffsetX(event, this.container);
            var y = Drawer.getOffsetY(event, this.container);

            switch (event.type) {
                case $.MouseEvents.START :
                    var html = this.container.innerHTML.replace('</svg>', '') + '<circle id="' + (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects) + '" /></svg>';

                    this.container.innerHTML = html;

                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    element.setAttribute('fill',         this.attributes['fill']);
                    element.setAttribute('stroke',       this.attributes['stroke']);
                    element.setAttribute('stroke-width', this.attributes['stroke-width']);

                    element.setAttribute('cx', x);
                    element.setAttribute('cy', y);

                    this.points.x1 = x;
                    this.points.y1 = y;

                    break;
                case $.MouseEvents.MOVE :
                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    var x1 = this.points.x1;
                    var y1 = this.points.y1;

                    var startX = Math.min(x, x1);
                    var startY = Math.min(y, y1);
                    var endX   = Math.max(x, x1);
                    var endY   = Math.max(y, y1);
                    var r      = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
                    // var r      = Math.sqrt(Math.pow((endX - startX), 2), Math.pow(Math.abs(endY - startY), 2));

                    element.setAttribute('r', r);

                    break;
                case $.MouseEvents.END :
                    this.numberOfObjects++;
                    this.clearPoints();

                    break;
                default :
                    break;
            }

            return this;
        };

        /**
         * This method draws ellipse.
         * @param {Event} event This argument is event object.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.drawEllipse = function(event) {
            if (!(event instanceof Event)) {
                return this;
            }

            var x = Drawer.getOffsetX(event, this.container);
            var y = Drawer.getOffsetY(event, this.container);

            switch (event.type) {
                case $.MouseEvents.START :
                    var html = this.container.innerHTML.replace('</svg>', '') + '<ellipse id="' + (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects) + '" /></svg>';

                    this.container.innerHTML = html;

                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    element.setAttribute('fill',         this.attributes['fill']);
                    element.setAttribute('stroke',       this.attributes['stroke']);
                    element.setAttribute('stroke-width', this.attributes['stroke-width']);

                    element.setAttribute('cx', x);
                    element.setAttribute('cy', y);

                    this.points.x1 = x;
                    this.points.y1 = y;

                    break;
                case $.MouseEvents.MOVE :
                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    var x1 = this.points.x1;
                    var y1 = this.points.y1;

                    var startX = Math.min(x, x1);
                    var startY = Math.min(y, y1);
                    var endX   = Math.max(x, x1);
                    var endY   = Math.max(y, y1);
                    var rx     = Math.abs(endX - startX);
                    var ry     = Math.abs(endY - startY);

                    element.setAttribute('rx', rx);
                    element.setAttribute('ry', ry);

                    break;
                case $.MouseEvents.END :
                    this.numberOfObjects++;
                    this.clearPoints();

                    break;
                default :
                    break;
            }

            return this;
        };

        /**
         * This method draws line.
         * @param {Event} event This argument is event object.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.drawLine = function(event) {
            if (!(event instanceof Event)) {
                return this;
            }

            var x = Drawer.getOffsetX(event, this.container);
            var y = Drawer.getOffsetY(event, this.container);

            switch (event.type) {
                case $.MouseEvents.START :
                    var html = this.container.innerHTML.replace('</svg>', '') + '<line id="' + (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects) + '" /></svg>';

                    this.container.innerHTML = html;

                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    element.setAttribute('fill',            'none');
                    element.setAttribute('stroke',          this.attributes['stroke']);
                    element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                    element.setAttribute('stroke-linecap',  this.attributes['stroke-linecap']);
                    element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                    this.points.x1 = x;
                    this.points.y1 = y;

                    break;
                case $.MouseEvents.MOVE :
                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    var x1 = this.points.x1;
                    var y1 = this.points.y1;

                    element.setAttribute('x1', x1);
                    element.setAttribute('y1', y1);
                    element.setAttribute('x2', x);
                    element.setAttribute('y2', y);

                    break;
                case $.MouseEvents.END :
                    this.numberOfObjects++;
                    this.clearPoints();

                    break;
                default :
                    break;
            }

            return this;
        };

        /**
         * This method clears the held coordinates.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.clearPoints = function() {
            this.points.x1 = 0;
            this.points.y1 = 0;

            return this;
        };

        /**
         * This method gets fill color.
         * @return {string} This is returned as fill color string.
         */
        Drawer.prototype.getFill = function() {
            return this.attributes['fill'];
        };

        /**
         * This method sets fill color.
         * @param {string} fill This argument is string for color.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.setFill = function(fill) {
            this.attributes['fill'] = String(fill);
            return this;
        };

        /**
         * This method gets stroke color.
         * @return {string} This is returned as stroke color string.
         */
        Drawer.prototype.getStroke = function() {
            return this.attributes['stroke'];
        };

        /**
         * This method sets stroke color.
         * @param {string} stroke This argument is string for color.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.setStroke = function(stroke) {
            this.attributes['stroke'] = String(stroke);
            return this;
        };

        /**
         * This class method calculates relative horizontal coordinate on canvas from event object.
         * @param {Event} event This argument is to get coordinates at cursor.
         * @param {HTMLElement} container This argument is the instance of HTMLElement for wrapping SVGElement.
         * @return {number} This is returned as relative horizontal coordinate on SVG.
         */
        Drawer.getOffsetX = function(event, container) {
            if (!(event instanceof Event)) {
                return 0;
            }

            if (!(container instanceof HTMLElement)) {
                return 0;
            }

            if (event.pageX) {
                // Desktop
            } else if (event.touches[0]) {
                // Touch Panel
                event = event.touches[0];
            } else if (event.changedTouches[0]) {
                // Touch Panel
                event = event.changedTouches[0];
            }

            return event.pageX - container.offsetLeft + container.scrollLeft;
        };

        /**
         * This class method calculates relative vertical coordinate on canvas from event object.
         * @param {Event} event This argument is to get coordinates at cursor.
         * @param {HTMLElement} container This argument is the instance of HTMLElement for wrapping SVGElement.
         * @return {number} This is returned as relative vertical coordinate on SVG.
         */
        Drawer.getOffsetY = function(event, container) {
            if (!(event instanceof Event)) {
                return 0;
            }

            if (!(container instanceof HTMLElement)) {
                return 0;
            }

            if (event.pageY) {
                // Desktop
            } else if (event.touches[0]) {
                // Touch Panel
                event = event.touches[0];
            } else if (event.changedTouches[0]) {
                // Touch Panel
                event = event.changedTouches[0];
            }

            return event.pageY - container.offsetTop + container.scrollTop;
        };

        // Export
        $.Drawer = Drawer;

    })(ArtSVG);

    // Export
    global.ArtSVG = ArtSVG;

})(window);

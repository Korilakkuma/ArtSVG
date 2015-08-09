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

        this.attributes = {
            stroke   : new ArtSVG.Color(0, 0, 0, 1).toString(),
            fill     : new ArtSVG.Color(0, 0, 0, 1).toString(),
            width    : 1,
            linecap  : 'butt',
            linejoin : 'miter',
            family   : 'Arial',
            size     : 24
        };

        this.numberOfObjects = 0;

        var self = this;

        var isDown = false;

        var getX = function(event) {
            if (event.pageX) {
                // Desktop
            } else if (event.touches[0]) {
                // Touch Panel
                event = event.touches[0];
            } else if (event.changedTouches[0]) {
                // Touch Panel
                event = event.changedTouches[0];
            }

            return event.pageX - self.container.offsetLeft;
        };

        var getY = function(event) {
            if (event.pageY) {
                // Desktop
            } else if (event.touches[0]) {
                // Touch Panel
                event = event.touches[0];
            } else if (event.changedTouches[0]) {
                // Touch Panel
                event = event.changedTouches[0];
            }

            return event.pageY - self.container.offsetTop;
        };

        var drawPath = function(phase, x, y) {
            switch (phase) {
                case ArtSVG.MouseEvents.START :
                    var html = self.container.innerHTML.replace('</svg>', '') + '<path id="' + (ArtSVG.OBJECT_ID_PREFIX + self.numberOfObjects) + '" /></svg>';

                    self.container.innerHTML = html;

                    var element = document.getElementById(ArtSVG.OBJECT_ID_PREFIX + self.numberOfObjects);

                    element.setAttribute('stroke',          self.attributes.stroke);
                    element.setAttribute('fill',            'none');
                    element.setAttribute('stroke-width',    self.attributes.width);
                    element.setAttribute('stroke-linecap',  self.attributes.linecap);
                    element.setAttribute('stroke-linejoin', self.attributes.linejoin);
                    element.setAttribute('d',               ('M' + x + ' ' + y));

                    break;
                case ArtSVG.MouseEvents.MOVE :
                    var element = document.getElementById(ArtSVG.OBJECT_ID_PREFIX + self.numberOfObjects);

                    element.setAttribute('d', (element.getAttribute('d') + ', L' + x + ' ' + y));

                    break;
                case ArtSVG.MouseEvents.END :
                    break;
                default :
                    break;
            }
        };

        this.container.addEventListener(ArtSVG.MouseEvents.START, function(event) {
            if (isDown) {
                return;
            }

            isDown = true;

            var x = getX(event);
            var y = getY(event);

            drawPath(event.type, x, y);
        }, true);

        this.container.addEventListener(ArtSVG.MouseEvents.MOVE, function(event) {
            if (!isDown) {
                return;
            }

            // for Touch Panel
            event.preventDefault();

            var x = getX(event);
            var y = getY(event);

            drawPath(event.type, x, y);
        }, true);

        global.addEventListener(ArtSVG.MouseEvents.END, function(event) {
            if (!isDown) {
                return;
            }

            self.numberOfObjects++;
            isDown = false;
        }, true);
    }

    /** Constant values as class properties (static properties) */
    ArtSVG.OBJECT_ID_PREFIX = 'object-';

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
     * This method is getter for stroke color.
     * @return {string} This is returned as stroke color string.
     */
    ArtSVG.prototype.getStroke = function() {
        return this.attributes.stroke;
    };

    /**
     * This method is setter for stroke color.
     * @param {string} stroke This argument is string for color.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setStroke = function(stroke) {
        this.attributes.stroke = String(stroke);
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

    // Export
    global.ArtSVG = ArtSVG;

})(window);

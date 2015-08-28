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

        this.svg.setAttribute('xmlns',       ArtSVG.XMLNS);
        this.svg.setAttribute('xmlns:xlink', ArtSVG.XLINK);

        var w = parseInt(width);
        var h = parseInt(height);

        this.container.style.width  = (w > 0) ? (w + 'px') : (ArtSVG.DEFAULT_SIZES.WIDTH  + 'px');
        this.container.style.height = (h > 0) ? (h + 'px') : (ArtSVG.DEFAULT_SIZES.HEIGHT + 'px');

        this.svg.setAttribute('width',  (w > 0) ? w : ArtSVG.DEFAULT_SIZES.WIDTH);
        this.svg.setAttribute('height', (h > 0) ? h : ArtSVG.DEFAULT_SIZES.HEIGHT);

        this.drawer  = new ArtSVG.Drawer(this.container);
        this.history = new ArtSVG.History(this.container);

        this.mode = ArtSVG.Mode.SELECT;

        this.drawerType = ArtSVG.Drawer.Type.PATH;

        /** {@type Array.<SVGElement>} */
        this.selectedElements = [];

        var self = this;

        var isDown = false;

        /**
         * This method selects the drawn element.
         * @param {Event} event This argument is event object.
         */
        var _select = function(event) {
            if (!(event instanceof Event)) {
                return;
            }

            if ((event.target === self.container) || (event.target === self.svg)) {
                return;
            }

            switch (event.type) {
                case ArtSVG.MouseEvents.START :
                    self.selectedElements[0] = event.target;

                    break;
                case ArtSVG.MouseEvents.MOVE :
                    var x = ArtSVG.Drawer.getOffsetX(event, self.container);
                    var y = ArtSVG.Drawer.getOffsetY(event, self.container);

                    for (var i = 0, len = self.selectedElements.length; i < len; i++) {
                        self.drawer.move(self.selectedElements[i], x, y);
                    }

                    break;
                case ArtSVG.MouseEvents.END :
                    self.history.updateHistory();

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

            if (self.mode === ArtSVG.Mode.SELECT) {
                _select(event);
            } else {
                self.drawer.draw(event, self.drawerType);
            }
        }, true);

        this.container.addEventListener(ArtSVG.MouseEvents.MOVE, function(event) {
            if (!isDown) {
                return;
            }

            // for Touch Panel
            event.preventDefault();

            if (self.mode === ArtSVG.Mode.SELECT) {
                _select(event);
            } else {
                self.drawer.draw(event, self.drawerType);
            }
        }, true);

        global.addEventListener(ArtSVG.MouseEvents.END, function(event) {
            if (!isDown) {
                return;
            }

            isDown = false;

            if (self.mode === ArtSVG.Mode.SELECT) {
                _select(event);
            } else {
                self.drawer.draw(event, self.drawerType);
                self.history.updateHistory();
            }
        }, true);
    }

    /** Constant values as class properties (static properties) */
    ArtSVG.XMLNS = 'http://www.w3.org/2000/svg';
    ArtSVG.XLINK = 'http://www.w3.org/1999/xlink';

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
     * This method is getter for application mode.
     * @return {string} This is returned as string for application mode.
     */
    ArtSVG.prototype.getMode = function() {
        return this.mode;
    };

    /**
     * This method is setter for application mode.
     * @param {string} mode This argument is either 'select' or 'draw'.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setMode = function(mode) {
        if (String(mode).toUpperCase() in ArtSVG.Mode) {
            this.mode = String(mode).toLowerCase();
        }

        return this;
    };

    /**
     * This method returns drawer type.
     * @return {string} This is returned as string for drawer type.
     */
    ArtSVG.prototype.getDrawerType = function() {
        return this.drawerType;
    };

    /**
     * This method sets drawer type.
     * @param {string} drawerType This argument is one of 'path', 'rectangle', 'square', 'circle', 'ellipse', 'line'.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setDrawerType = function(drawerType) {
        if (String(drawerType).toUpperCase() in ArtSVG.Drawer.Type) {
            this.drawerType = String(drawerType).toLowerCase();
        }

        return this;
    };

    /**
     * This method returns the array that contains the selected element.
     * @return {Array.<SVGElement>} This is returnes as the array that contains the selected element.
     */
    ArtSVG.prototype.getSelectedElements = function() {
        return this.selectedElements;
    };

    /**
     * This method executes undo.
     * @return {boolean} If undo is executed, this value is true. Otherwise, this value is false.
     */
    ArtSVG.prototype.undo = function() {
        return this.history.undo();
    };

    /**
     * This method executes redo.
     * @return {boolean} If redo is executed, this value is true. Otherwise, this value is false.
     */
    ArtSVG.prototype.redo = function() {
        return this.history.redo();
    };

    /**
     * This method clears the all of drawn element.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.clear = function() {
        this.drawer.clear();
        this.history.updateHistory();

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

    /**
     * This method gets stroke width.
     * @return {number} This is returned as stroke width.
     */
    ArtSVG.prototype.getStrokeWidth = function() {
        return this.drawer.getStrokeWidth();
    };

    /**
     * This method sets stroke width.
     * @param {number} strokeWidth This argument is number for stroke width.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setStrokeWidth = function(strokeWidth) {
        this.drawer.setStrokeWidth(strokeWidth);
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
         * This static class defines strings for representing application status.
         */
        function Mode() {
        }

        Mode.SELECT = 'select';
        Mode.DRAW   = 'draw';

        // Export
        $.Mode = Mode;

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

        /**
         * This method is facade method for drawing.
         * @param {Event} event This argument is event object.
         * @param {string} type This argument is one of 'path', 'rectangle', 'square', 'circle', 'ellipse', 'line'.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.draw = function(event, type) {
            switch (type) {
                case Drawer.Type.PATH :
                    this.drawPath(event);
                    break;
                case Drawer.Type.RECTANGLE :
                    this.drawRect(event);
                    break;
                case Drawer.Type.SQUARE :
                    this.drawSquare(event);
                    break;
                case Drawer.Type.CIRCLE :
                    this.drawCircle(event);
                    break;
                case Drawer.Type.ELLIPSE :
                    this.drawEllipse(event);
                    break;
                case Drawer.Type.LINE :
                    this.drawLine(event);
                    break;
                default :
                    break;
            }

            return this;
        };

        /**
         * This method is facade method for moving element.
         * @param {SVGElement} element This argument is the SVGElement that is target of movement.
         * @param {number} x This argument is the amount of horizontal movement.
         * @param {number} y This argument is the amount of vertical movement.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.move = function(element, x, y) {
            if (element instanceof SVGRectElement) {
                this.moveRectangle(element, x, y);
            } else if ((element instanceof SVGCircleElement) || (element instanceof SVGEllipseElement)) {
                this.moveEllipse(element, x, y);
            } else if (element instanceof SVGLineElement) {
                this.moveLine(element, x, y);
            } else if (element instanceof SVGPathElement) {
                this.movePath(element, x, y);
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
                    var element = document.createElementNS($.XMLNS, 'path');

                    element.setAttribute('id',              (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                    element.setAttribute('fill',            'none');
                    element.setAttribute('stroke',          this.attributes['stroke']);
                    element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                    element.setAttribute('stroke-linecap',  this.attributes['stroke-linecap']);
                    element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                    element.setAttribute('d', ('M' + x + ' ' + y));

                    this.container.querySelector('svg').appendChild(element);

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
                    var element = document.createElementNS($.XMLNS, 'rect');

                    element.setAttribute('id',              (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                    element.setAttribute('fill',            this.attributes['fill']);
                    element.setAttribute('stroke',          this.attributes['stroke']);
                    element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                    element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                    element.setAttribute('x', x);
                    element.setAttribute('y', y);

                    this.container.querySelector('svg').appendChild(element);

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
         * This method draws square.
         * @param {Event} event This argument is event object.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.drawSquare = function (event) {
            if (!(event instanceof Event)) {
                return this;
            }

            var x = Drawer.getOffsetX(event, this.container);
            var y = Drawer.getOffsetY(event, this.container);

            switch (event.type) {
                case $.MouseEvents.START :
                    var element = document.createElementNS($.XMLNS, 'rect');

                    element.setAttribute('id',              (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                    element.setAttribute('fill',            this.attributes['fill']);
                    element.setAttribute('stroke',          this.attributes['stroke']);
                    element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                    element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                    element.setAttribute('x', x);
                    element.setAttribute('y', y);

                    this.container.querySelector('svg').appendChild(element);

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
                    var size   = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));

                    element.setAttribute('x',      startX);
                    element.setAttribute('y',      startY);
                    element.setAttribute('width',  size);
                    element.setAttribute('height', size);

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
                    var element = document.createElementNS($.XMLNS, 'circle');

                    element.setAttribute('id',           (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                    element.setAttribute('fill',         this.attributes['fill']);
                    element.setAttribute('stroke',       this.attributes['stroke']);
                    element.setAttribute('stroke-width', this.attributes['stroke-width']);

                    element.setAttribute('cx', x);
                    element.setAttribute('cy', y);

                    this.container.querySelector('svg').appendChild(element);

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
                    var element = document.createElementNS($.XMLNS, 'ellipse');

                    element.setAttribute('id',           (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                    element.setAttribute('fill',         this.attributes['fill']);
                    element.setAttribute('stroke',       this.attributes['stroke']);
                    element.setAttribute('stroke-width', this.attributes['stroke-width']);

                    element.setAttribute('cx', x);
                    element.setAttribute('cy', y);

                    this.container.querySelector('svg').appendChild(element);

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
                    var element = document.createElementNS($.XMLNS, 'line');

                    element.setAttribute('id',              (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                    element.setAttribute('fill',            'none');
                    element.setAttribute('stroke',          this.attributes['stroke']);
                    element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                    element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                    this.container.querySelector('svg').appendChild(element);

                    this.points.x1 = x;
                    this.points.y1 = y;

                    break;
                case $.MouseEvents.MOVE :
                    var element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                    element.setAttribute('stroke-linecap',  this.attributes['stroke-linecap']);

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
         * This method moves path.
         * @param {SVGElement} element This argument is the SVGElement that is target of movement.
         * @param {number} x This argument is the amount of horizontal movement.
         * @param {number} y This argument is the amount of vertical movement.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.movePath = function(element, x, y) {
            var minX = Number.MAX_VALUE;
            var minY = Number.MAX_VALUE;

            var maxX = Number.MIN_VALUE;
            var maxY = Number.MIN_VALUE;

            var points = element.getAttribute('d').split(', ');

            for (var i = 0, len = points.length; i < len; i++) {
                var point = points[i].split(' ');

                var pointX = parseFloat(point[0].slice(1));
                var pointY = parseFloat(point[1]);

                if (pointX < minX) {minX = pointX;}
                if (pointY < minY) {minY = pointY;}
                if (pointX > maxX) {maxX = pointX;}
                if (pointY > maxY) {maxY = pointY;}
            }

            var cx = ((maxX - minX) / 2) + minX;
            var cy = ((maxY - minY) / 2) + minY;

            var tx = x - cx;
            var ty = y - cy;

            for (var i = 0, len = points.length; i < len; i++) {
                var point = points[i].split(' ');

                var x = parseFloat(point[0].slice(1)) + tx;
                var y = parseFloat(point[1])          + ty;

                if (i === 0) {
                    element.setAttribute('d', ('M' + x + ' ' + y));
                } else {
                    element.setAttribute('d', (element.getAttribute('d') + ', L' + x + ' ' + y));
                }
            }

            return this;
        };

        /**
         * This method moves rectangle.
         * @param {SVGElement} element This argument is the SVGElement that is target of movement.
         * @param {number} x This argument is the amount of horizontal movement.
         * @param {number} y This argument is the amount of vertical movement.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.moveRectangle = function(element, x, y) {
            var width  = parseFloat(element.getAttribute('width'));
            var height = parseFloat(element.getAttribute('height'));

            element.setAttribute('x', (x - width  / 2));
            element.setAttribute('y', (y - height / 2));

            return this;
        };

        /**
         * This method moves ellipse.
         * @param {SVGElement} element This argument is the SVGElement that is target of movement.
         * @param {number} x This argument is the amount of horizontal movement.
         * @param {number} y This argument is the amount of vertical movement.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.moveEllipse = function(element, x, y) {
            element.setAttribute('cx', x);
            element.setAttribute('cy', y);

            return this;
        };

        /**
         * This method moves line.
         * @param {SVGElement} element This argument is the SVGElement that is target of movement.
         * @param {number} x This argument is the amount of horizontal movement.
         * @param {number} y This argument is the amount of vertical movement.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.moveLine = function(element, x, y) {
            var x1 = parseFloat(element.getAttribute('x1'));
            var x2 = parseFloat(element.getAttribute('x2'));
            var y1 = parseFloat(element.getAttribute('y1'));
            var y2 = parseFloat(element.getAttribute('y2'));

            var cx = (Math.abs(x2 - x1) / 2) + Math.min(x2, x1);
            var cy = (Math.abs(y2 - y1) / 2) + Math.min(y2, y1);

            var dx = x - cx;
            var dy = y - cy;

            var newX1 = x1 + dx;;
            var newX2 = x2 + dx;
            var newY1 = y1 + dy;
            var newY2 = y2 + dy;

            element.setAttribute('x1', newX1);
            element.setAttribute('x2', newX2);
            element.setAttribute('y1', newY1);
            element.setAttribute('y2', newY2);

            return this;
        };

        /**
         * This method clears the all of drawn element.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.clear = function() {
            var width  = parseInt(this.container.style.width);
            var height = parseInt(this.container.style.height);

            this.container.innerHTML = '<svg width="' + width + '" height="' + height + '" xmlns="' + $.XMLNS + '" xmlns:xlink="' + $.XLINK + '"></svg>';

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

        /** This method gets stroke width.
         * @return {number} This is returned as stroke width.
         */
        Drawer.prototype.getStrokeWidth = function() {
            return this.attributes['stroke-width'];
        };

        /**
         * This method sets stroke width.
         * @param {number} strokeWidth This argument is number for stroke width.
         * @return {Drawer} This is returned for method chain.
         */
        Drawer.prototype.setStrokeWidth = function(strokeWidth) {
            var w = parseFloat(strokeWidth);

            if (w >= 0) {
                this.attributes['stroke-width'] = w;
            }

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

        /**
         * This static class defines strings for drawer.
         */
        function Type() {
        }

        Type.PATH      = 'path';
        Type.RECTANGLE = 'rectangle';
        Type.SQUARE    = 'square';
        Type.CIRCLE    = 'circle';
        Type.ELLIPSE   = 'ellipse';
        Type.LINE      = 'line';

        Drawer.Type = Type;

        // Export
        $.Drawer = Drawer;

    })(ArtSVG);

    (function($) {

        /**
         * This class defines properties and methods for history.
         * @param {HTMLElement} container This argument is the instance of HTMLElement for wrapping SVGElement.
         * @constructor
         */
        function History(container) {
            this.container = document.body;

            if (container instanceof HTMLElement) {
                this.container = container;
            }

            this.histories = [this.container.innerHTML];
            this.pointer   = 0;
        };

        /**
         * This method updates stack for history.
         * @return {History} This is returned for method chain.
         */
        History.prototype.updateHistory = function() {
            this.histories[++this.pointer] = this.container.innerHTML;

            if (this.pointer < (this.histories.length - 1)) {
                this.histories = this.histories.slice(0, (this.pointer + 1));
            }

            return this;
        };

        /**
         * This method executes undo.
         * @return {boolean} If undo is executed, this value is true. Otherwise, this value is false.
         */
        History.prototype.undo = function() {
            if (this.pointer > 0) {
                this.container.innerHTML = this.histories[--this.pointer];
                return true;
            }

            return false;
        };

        /**
         * This method executes redo.
         * @return {boolean} If redo is executed, this value is true. Otherwise, this value is false.
         */
        History.prototype.redo = function() {
            if (this.pointer < (this.histories.length - 1)) {
                this.container.innerHTML = this.histories[++this.pointer];
                return true;
            }

            return false;
        };

        // Export
        $.History = History;

    })(ArtSVG);

    // Export
    global.ArtSVG = ArtSVG;

})(window);

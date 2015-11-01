(function(global) {
    'use strict';

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
            'fill'            : new Color(0, 0, 0, 1).toString(),
            'stroke'          : new Color(0, 0, 0, 1).toString(),
            'stroke-width'    : 1,
            'stroke-linecap'  : 'butt',
            'stroke-linejoin' : 'miter'
        };

        this.font = {
            'font-family' : 'Arial',
            'font-size'   : '16px',
            'font-style'  : 'normal',
            'font-weight' : 'normal'
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
            case Drawer.Type.TEXT :
                this.drawText(event);
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
        if (element instanceof SVGPathElement) {
            this.movePath(element, x, y);
        } else if (element instanceof SVGRectElement) {
            this.moveRectangle(element, x, y);
        } else if ((element instanceof SVGCircleElement) || (element instanceof SVGEllipseElement)) {
            this.moveEllipse(element, x, y);
        } else if (element instanceof SVGLineElement) {
            this.moveLine(element, x, y);
        } else if (element instanceof SVGTextElement) {
            this.moveText(element, x, y);
        } else if (element instanceof SVGImageElement) {
            this.moveImage(element, x, y);
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

        var element = null;

        var x = Drawer.getOffsetX(event, this.container);
        var y = Drawer.getOffsetY(event, this.container);

        switch (event.type) {
            case Mocks.ArtSVG.MouseEvents.START :
                element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'path');

                element.setAttribute('id',              (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                element.setAttribute('fill',            'none');
                element.setAttribute('stroke',          this.attributes['stroke']);
                element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                element.setAttribute('stroke-linecap',  this.attributes['stroke-linecap']);
                element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                element.setAttribute('d', ('M' + x + ' ' + y));

                this.container.querySelector('svg').appendChild(element);

                break;
            case Mocks.ArtSVG.MouseEvents.MOVE :
                element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                element.setAttribute('d', (element.getAttribute('d') + ', L' + x + ' ' + y));

                break;
            case Mocks.ArtSVG.MouseEvents.END :
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

        var element = null;

        var x = Drawer.getOffsetX(event, this.container);
        var y = Drawer.getOffsetY(event, this.container);

        switch (event.type) {
            case Mocks.ArtSVG.MouseEvents.START :
                element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'rect');

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
            case Mocks.ArtSVG.MouseEvents.MOVE :
                element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

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
            case Mocks.ArtSVG.MouseEvents.END :
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

        var element = null;

        var x = Drawer.getOffsetX(event, this.container);
        var y = Drawer.getOffsetY(event, this.container);

        switch (event.type) {
            case Mocks.ArtSVG.MouseEvents.START :
                element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'rect');

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
            case Mocks.ArtSVG.MouseEvents.MOVE :
                element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

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
            case Mocks.ArtSVG.MouseEvents.END :
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

        var element = null;

        var x = Drawer.getOffsetX(event, this.container);
        var y = Drawer.getOffsetY(event, this.container);

        switch (event.type) {
            case Mocks.ArtSVG.MouseEvents.START :
                element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'circle');

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
            case Mocks.ArtSVG.MouseEvents.MOVE :
                var x1 = this.points.x1;
                var y1 = this.points.y1;

                var startX = Math.min(x, x1);
                var startY = Math.min(y, y1);
                var endX   = Math.max(x, x1);
                var endY   = Math.max(y, y1);
                var r      = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
                // var r      = Math.sqrt(Math.pow((endX - startX), 2), Math.pow(Math.abs(endY - startY), 2));

                element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                element.setAttribute('r', r);

                break;
            case Mocks.ArtSVG.MouseEvents.END :
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

        var element = null;

        var x = Drawer.getOffsetX(event, this.container);
        var y = Drawer.getOffsetY(event, this.container);

        switch (event.type) {
            case Mocks.ArtSVG.MouseEvents.START :
                element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'ellipse');

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
            case Mocks.ArtSVG.MouseEvents.MOVE :
                var x1 = this.points.x1;
                var y1 = this.points.y1;

                var startX = Math.min(x, x1);
                var startY = Math.min(y, y1);
                var endX   = Math.max(x, x1);
                var endY   = Math.max(y, y1);
                var rx     = Math.abs(endX - startX);
                var ry     = Math.abs(endY - startY);

                element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                element.setAttribute('rx', rx);
                element.setAttribute('ry', ry);

                break;
            case Mocks.ArtSVG.MouseEvents.END :
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

        var element = null;

        var x = Drawer.getOffsetX(event, this.container);
        var y = Drawer.getOffsetY(event, this.container);

        switch (event.type) {
            case Mocks.ArtSVG.MouseEvents.START :
                element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'line');

                element.setAttribute('id',              (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
                element.setAttribute('fill',            'none');
                element.setAttribute('stroke',          this.attributes['stroke']);
                element.setAttribute('stroke-width',    this.attributes['stroke-width']);
                element.setAttribute('stroke-linejoin', this.attributes['stroke-linejoin']);

                this.container.querySelector('svg').appendChild(element);

                this.points.x1 = x;
                this.points.y1 = y;

                break;
            case Mocks.ArtSVG.MouseEvents.MOVE :
                var x1 = this.points.x1;
                var y1 = this.points.y1;

                element = document.getElementById(Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects);

                element.setAttribute('stroke-linecap',  this.attributes['stroke-linecap']);

                element.setAttribute('x1', x1);
                element.setAttribute('y1', y1);
                element.setAttribute('x2', x);
                element.setAttribute('y2', y);

                break;
            case Mocks.ArtSVG.MouseEvents.END :
                this.numberOfObjects++;
                this.clearPoints();

                break;
            default :
                break;
        }

        return this;
    };

    /**
     * This method draws text.
     * @param {Event} event This argument is event object.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.drawText = function(event) {
        if (event.type !== Mocks.ArtSVG.MouseEvents.START) {
            return this;
        }

        var element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'text');

        element.setAttribute('id',     (Drawer.ELEMENT_ID_PREFIX + this.numberOfObjects));
        element.setAttribute('fill',   this.attributes['fill']);
        element.setAttribute('stroke', this.attributes['stroke']);

        element.setAttribute('x', Drawer.getOffsetX(event, this.container));
        element.setAttribute('y', Drawer.getOffsetY(event, this.container));

        for (var prop in this.font) {
            element['style'][prop] = this.font[prop];
        }

        var textbox = document.createElement('input');

        textbox.setAttribute('type', 'text');

        textbox.style.position = 'absolute';
        textbox.style.top      = (event.pageY - 12) + 'px';
        textbox.style.left     = (event.pageX - 8)  + 'px';
        textbox.style.zIndex   = '2';

        textbox.style.cursor  = 'text';
        textbox.style.opacity = '0';

        textbox.oninput = function() {
            element.textContent = this.value;
        };

        this.container.querySelector('svg').appendChild(element);
        this.container.appendChild(textbox);

        this.numberOfObjects++;

        return this;
    };

    /**
     * This method draws image.
     * @param {string} href This argument is one of path, Data URL, object URL.
     * @param {number} pointX This argument is horizontal coordinate.
     * @param {number} pointY This argument is vertical coordinate.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.drawImage = function(href, pointX, pointY) {
        var x = parseFloat(pointX);
        var y = parseFloat(pointY);

        if (isNaN(x)) {x = 0;}
        if (isNaN(y)) {y = 0;}

        var image = new Image();
        var self  = this;

        image.src = href;

        image.onload = function() {
            var element = document.createElementNS(Mocks.ArtSVG.XMLNS, 'image');

            element.setAttributeNS(Mocks.ArtSVG.XLINK, 'xlink:href', String(href));

            element.setAttributeNS(null, 'id',     (Drawer.ELEMENT_ID_PREFIX + self.numberOfObjects));
            element.setAttributeNS(null, 'x',      x);
            element.setAttributeNS(null, 'y',      y);
            element.setAttributeNS(null, 'width',  this.width);
            element.setAttributeNS(null, 'height', this.height);

            self.container.querySelector('svg').appendChild(element);

            self.numberOfObjects++;
        };

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
        var points = element.getAttribute('d').split(', ');

        var searchRect = function(points) {
            var minX = Number.MAX_VALUE;
            var minY = Number.MAX_VALUE;

            var maxX = Number.MIN_VALUE;
            var maxY = Number.MIN_VALUE;

            for (var i = 0, len = points.length; i < len; i++) {
                var point = points[i].split(' ');

                var pointX = parseFloat(point[0].slice(1));
                var pointY = parseFloat(point[1]);

                if (pointX < minX) {minX = pointX;}
                if (pointY < minY) {minY = pointY;}
                if (pointX > maxX) {maxX = pointX;}
                if (pointY > maxY) {maxY = pointY;}
            }

            return {minX : minX, minY : minY, maxX : maxX, maxY : maxY};
        };

        var rect = searchRect(points);

        var cx = ((rect.maxX - rect.minX) / 2) + rect.minX;
        var cy = ((rect.maxY - rect.minY) / 2) + rect.minY;

        var tx = x - cx;
        var ty = y - cy;

        for (var i = 0, len = points.length; i < len; i++) {
            var point = points[i].split(' ');

            var dx = parseFloat(point[0].slice(1)) + tx;
            var dy = parseFloat(point[1])          + ty;

            if (i === 0) {
                element.setAttribute('d', ('M' + dx + ' ' + dy));
            } else {
                element.setAttribute('d', (element.getAttribute('d') + ', L' + dx + ' ' + dy));
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

        var newX1 = x1 + dx;
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
     * This method moves text.
     * @param {SVGElement} element This argument is the SVGElement that is target of movement.
     * @param {number} x This argument is the amount of horizontal movement.
     * @param {number} y This argument is the amount of vertical movement.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.moveText = function(element, x, y) {
        element.setAttribute('x', (x - 10));
        element.setAttribute('y', (y + 10));

        return this;
    };

    /**
     * This method moves image.
     * @param {SVGElement} element This argument is the SVGElement that is target of movement.
     * @param {number} x This argument is the amount of horizontal movement.
     * @param {number} y This argument is the amount of vertical movement.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.moveImage = function(element, x, y) {
        var width  = parseFloat(element.getAttributeNS(null, 'width'));
        var height = parseFloat(element.getAttributeNS(null, 'height'));

        element.setAttributeNS(null, 'x', (x - width  / 2));
        element.setAttributeNS(null, 'y', (y - height / 2));

        return this;
    };

    /**
     * This method clears the all of drawn element.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.clear = function() {
        this.container.querySelector('svg').innerHTML = '';

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
     * This method gets stroke-linecap.
     * @return {string} This is returned as stroke-linecap.
     */
    Drawer.prototype.getStrokeLinecap = function() {
        return this.attributes['stroke-linecap'];
    };

    /**
     * This method sets stroke-linecap.
     * @param {string} strokeLinecap This argument is one of 'butt', 'round', 'square'.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.setStrokeLinecap = function(strokeLinecap) {
        if (String(strokeLinecap).toUpperCase() in Drawer.StrokeLinecap) {
            this.attributes['stroke-linecap'] = strokeLinecap.toLowerCase();
        }

        return this;
    };

    /**
     * This method gets stroke-linejoin.
     * @return {string} This is returned as stroke-linejoin.
     */
    Drawer.prototype.getStrokeLinejoin = function() {
        return this.attributes['stroke-linejoin'];
    };

    /**
     * This method sets stroke-linejoin.
     * @param {string} strokeLinejoin This argument is one of 'miter', 'round', 'bevel'.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.setStrokeLinejoin = function(strokeLinejoin) {
        if (String(strokeLinejoin).toUpperCase() in Drawer.StrokeLinejoin) {
            this.attributes['stroke-linejoin'] = strokeLinejoin.toLowerCase();
        }

        return this;
    };

    /**
     * This method gets font-family.
     * @return {string} This is returned as font-family.
     */
    Drawer.prototype.getFontFamily = function() {
        return this.font['font-family'];
    };

    /**
     * This method sets font-family.
     * @param {string} fontFamily This argument is string for font-family.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.setFontFamily = function(fontFamily) {
        this.font['font-family'] = String(fontFamily);
        return this;
    };

    /**
     * This method gets font-size.
     * @return {string} This is returned as font-size.
     */
    Drawer.prototype.getFontSize = function() {
        return this.font['font-size'];
    };

    /**
     * This method sets font-size.
     * @param {string} fontSize This argument is string for font-size.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.setFontSize = function(fontSize) {
        this.font['font-size'] = String(fontSize);
        return this;
    };

    /**
     * This method gets font-style.
     * @return {string} This is returned as font-style.
     */
    Drawer.prototype.getFontStyle = function() {
        return this.font['font-style'];
    };

    /**
     * This method sets font-style.
     * @param {string} fontStyle This argument is string for font-style.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.setFontStyle = function(fontStyle) {
        if (String(fontStyle).toUpperCase() in Drawer.FontStyle) {
            this.font['font-style'] = fontStyle.toLowerCase();
        }

        return this;
    };

    /**
     * This method gets font-weight.
     * @return {string} This is returned as font-weight.
     */
    Drawer.prototype.getFontWeight = function() {
        return this.font['font-weight'];
    };

    /**
     * This method sets font-weight.
     * @param {string} fontWeight This argument is string for font-weight.
     * @return {Drawer} This is returned for method chain.
     */
    Drawer.prototype.setFontWeight = function(fontWeight) {
        this.font['font-weight'] = String(fontWeight);
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
    Type.TEXT      = 'text';

    Drawer.Type = Type;

    /**
     * This static class defines strings for stroke-linecap.
     */
    function StrokeLinecap() {
    }

    StrokeLinecap.BUTT   = 'butt';
    StrokeLinecap.ROUND  = 'round';
    StrokeLinecap.SQUARE = 'square';

    Drawer.StrokeLinecap = StrokeLinecap;

    /**
     * This static class defines strings for stroke-linejoin.
     */
    function StrokeLinejoin() {
    }

    StrokeLinejoin.MITER = 'miter';
    StrokeLinejoin.ROUND = 'round';
    StrokeLinejoin.BEVEL = 'bevel';

    Drawer.StrokeLinejoin = StrokeLinejoin;

    /**
     * This static class defines strings for font-style
     */
    function FontStyle() {
    }

    FontStyle.NORMAL  = 'normal';
    FontStyle.ITALIC  = 'italic';
    FontStyle.OBLIQUE = 'oblique';

    Drawer.FontStyle = FontStyle;

    // Export
    global.Drawer = Drawer;

})(window);

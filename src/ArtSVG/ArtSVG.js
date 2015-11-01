(function(global) {
    'use strict';

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

        this.drawer  = new Mocks.ArtSVG.Drawer(this.container);
        this.history = new Mocks.ArtSVG.History(this.svg);

        this.mode = Mocks.ArtSVG.Mode.SELECT;

        this.drawerType = Mocks.ArtSVG.Drawer.Type.PATH;

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
                case Mocks.ArtSVG.MouseEvents.START :
                    self.selectedElements[0] = event.target;

                    break;
                case Mocks.ArtSVG.MouseEvents.MOVE :
                    var x = Mocks.ArtSVG.Drawer.getOffsetX(event, self.container);
                    var y = Mocks.ArtSVG.Drawer.getOffsetY(event, self.container);

                    for (var i = 0, len = self.selectedElements.length; i < len; i++) {
                        self.drawer.move(self.selectedElements[i], x, y);
                    }

                    break;
                case Mocks.ArtSVG.MouseEvents.END :
                    self.history.updateHistory();

                    break;
                default :
                    break;
            }
        };

        this.svg.addEventListener(Mocks.ArtSVG.MouseEvents.START, function(event) {
            if (isDown) {
                return;
            }

            isDown = true;

            if (self.mode === Mocks.ArtSVG.Mode.SELECT) {
                _select(event);
            } else {
                self.drawer.draw(event, self.drawerType);
            }
        }, true);

        this.svg.addEventListener(Mocks.ArtSVG.MouseEvents.MOVE, function(event) {
            if (!isDown) {
                return;
            }

            // for Touch Panel
            event.preventDefault();

            if (self.mode === Mocks.ArtSVG.Mode.SELECT) {
                _select(event);
            } else {
                self.drawer.draw(event, self.drawerType);
            }
        }, true);

        global.addEventListener(Mocks.ArtSVG.MouseEvents.END, function(event) {
            if (!isDown) {
                return;
            }

            isDown = false;

            if (self.mode === Mocks.ArtSVG.Mode.SELECT) {
                _select(event);
            } else {
                self.drawer.draw(event, self.drawerType);

                if (self.drawerType !== Mocks.ArtSVG.Drawer.Type.TEXT) {
                    self.history.updateHistory();
                }
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
        if (String(mode).toUpperCase() in Mocks.ArtSVG.Mode) {
            this.mode = String(mode).toLowerCase();
        }

        var textboxes = this.container.querySelectorAll('[type="text"]');

        if (textboxes) {
            for (var i = 0, len = textboxes.length; i < len; i++) {
                this.container.removeChild(textboxes[i]);
            }
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
        if (this.drawerType === Mocks.ArtSVG.Drawer.Type.TEXT) {
            this.history.updateHistory();
        }

        if (String(drawerType).toUpperCase() in Mocks.ArtSVG.Drawer.Type) {
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
     * This method draws image.
     * @param {string} href This argument is one of path, Data URL, object URL.
     * @param {number} x This argument is horizontal coordinate.
     * @param {number} y This argument is vertical coordinate.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.drawImage = function(href, x, y) {
        this.drawer.drawImage(href, x, y);
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

    /**
     * This method gets stroke-linecap.
     * @return {string} This is returned as stroke-linecap.
     */
    ArtSVG.prototype.getStrokeLinecap = function() {
        return this.drawer.getStrokeLinecap();
    };

    /**
     * This method sets stroke-linecap.
     * @param {string} strokeLinecap This argument is one of 'butt', 'round', 'square'.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setStrokeLinecap = function(strokeLinecap) {
        this.drawer.setStrokeLinecap(strokeLinecap);
        return this;
    };

    /**
     * This method gets stroke-linejoin.
     * @return {string} This is returned as stroke-linejoin.
     */
    ArtSVG.prototype.getStrokeLinejoin = function() {
        return this.drawer.getStrokeLinejoin();
    };

    /**
     * This method sets stroke-linejoin.
     * @param {string} strokeLinejoin This argument is one of 'miter', 'round', 'bevel'.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setStrokeLinejoin = function(strokeLinejoin) {
        this.drawer.setStrokeLinejoin(strokeLinejoin);
        return this;
    };

    /**
     * This method gets font-family.
     * @return {string} This is returned as font-family.
     */
    ArtSVG.prototype.getFontFamily = function() {
        return this.drawer.getFontFamily();
    };

    /**
     * This method sets font-family.
     * @param {string} fontFamily This argument is string for font-family.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setFontFamily = function(fontFamily) {
        this.drawer.setFontFamily(fontFamily);
        return this;
    };

    /**
     * This method gets font-size.
     * @return {string} This is returned as font-size.
     */
    ArtSVG.prototype.getFontSize = function() {
        return this.drawer.getFontSize();
    };

    /**
     * This method sets font-size.
     * @param {string} fontSize This argument is string for font-size.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setFontSize = function(fontSize) {
        this.drawer.setFontSize(fontSize);
        return this;
    };

    /**
     * This method gets font-style.
     * @return {string} This is returned as font-style.
     */
    ArtSVG.prototype.getFontStyle = function() {
        return this.drawer.getFontStyle();
    };

    /**
     * This method sets font-style.
     * @param {string} fontStyle This argument is one of 'normal', 'italic', 'oblique'.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setFontStyle = function(fontStyle) {
        this.drawer.setFontStyle(fontStyle);

        return this;
    };

    /**
     * This method gets font-weight.
     * @return {string} This is returned as font-weight.
     */
    ArtSVG.prototype.getFontWeight = function() {
        return this.drawer.getFontWeight();
    };

    /**
     * This method sets font-weight.
     * @param {string} fontWeight This argument is string for font-weight.
     * @return {ArtSVG} This is returned for method chain.
     */
    ArtSVG.prototype.setFontWeight = function(fontWeight) {
        this.drawer.setFontWeight(fontWeight);
        return this;
    };

    // Export
    global.ArtSVG = ArtSVG;

})(window);

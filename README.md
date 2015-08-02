ArtSVG
=========
  
[![Build Status](https://travis-ci.org/Korilakkuma/ArtSVG.svg?branch=master)](https://travis-ci.org/Korilakkuma/ArtSVG)
  
HTML5 SVG Library
  
## Overview
  
This library enables to create vector image (SVG) authoring application like Illustrator.  
In concrete, this library may be useful to implement the following features.
  
* Draw (Pen, Figure, Text ...etc)
* Styles (Color, Line Width, Text Styles ...etc)
  
## Demo
  
* [Art SVG](https://korilakkuma.github.io/ArtSVG/)
  
## Usage
  
The 1st, ArtSVG class is required.
  
    <script type="text/javascript" src="ArtSVG.js"></script>
  
or,
  
    <script type="text/javascript" src="ArtSVG.min.js"></script>
  
Next, the instance of ArtSVG must be created.  
ArtSVG constructor requires 4 arguments.  
  
1. HTMLElement (that is parent node of SVGElement)
1. SVGElement
1. SVG Width
1. SVG Height
  
for example,
  
    var svg       = document.querySelector('svg');
    var container = svg.parentNode;
    var width     = 600;  // px
    var height    = 600;  // px
  
    // Create the instance of ArtSVG
    var artSVG = new ArtSVG(container, svg, width, height);
  
## API
  
### Mode
  
This library has the following modes.
  
    console.log(ArtSVG.Mode.SELECT);  // for selecting SVGElement
    console.log(ArtSVG.Mode.DRAW);    // for drawing SVGElement
  
    // Getter
    var mode = artSVG.getMode();  // -> ArtSVG.Mode.SELECT is the default mode

    // Setter
    artSVG.setMode(ArtSVG.Mode.DRAW);  // -> change mode to ArtSVG.Mode.DRAW
  
### Drawing
  
    // Change mode
    artSVG.setMode(ArtSVG.Mode.DRAW);

    // Select Drawer
    artSVG.setDrawerType(Drawer.Type.PATH);       // Draw Path
    artSVG.setDrawerType(Drawer.Type.RECTANGLE);  // Draw Rectangle
    artSVG.setDrawerType(Drawer.Type.SQUARE);     // Draw Square
    artSVG.setDrawerType(Drawer.Type.CIRCLE);     // Draw Circle
    artSVG.setDrawerType(Drawer.Type.ELLIPSE);    // Draw Ellipse
    artSVG.setDrawerType(Drawer.Type.LINE);       // Draw Line
    artSVG.setDrawerType(Drawer.Type.TEXT);       // Draw Text
  
#### Image
  
    document.querySelector('[type="file"]').addEventListener('change', function(event) {
        var file = event.currentTarget.files[0];

        if (!(file instanceof File)) {
            window.alert('Please upload file.');
        } else if (file.type.indexOf('image') === -1) {
            window.alert('Please upload image file.');
        } else {
            var reader = new FileReader();

            reader.onload = function() {
                artSVG.drawImage(reader.result, 0, 0);
            };

            reader.readAsDataURL(file);
        }
    }, false);
  
### Edit
  
#### Undo
  
    var result = artSVG.undo();

    if (!result) {
        // Cannot Undo
    }
  
#### Redo
  
    var result = artSVG.redo();

    if (!result) {
        // Cannot Redo
    }
  
#### Clear
  
    artSVG.clear();
  
### Styles
  
#### Fill style / Stroke style
  
It is required that color string (hex, rgb, hsl, rgba, hsla ...etc) is designated for fill style and stroke style.
  
    artSVG.setFill('rgba(0, 0, 255, 1.0)');    // Fill style
    artSVG.setStroke('rgba(255, 0, 0, 1.0)');  // Stroke style
  
#### Stroke width
  
    var strokeWidth = 3;  // This value is greater than 0

    artSVG.setStrokeWidth(strokeWidth);
  
#### Line cap
  
    var lineCap = 'round';  // one of 'butt', 'round', 'square'

    artSVG.setStrokeLinecap(lineCap);
  
#### Line join
  
    var lineJoin = 'round';  // one of 'miter', 'round', 'bevel'

    artSVG.setStrokeLinejoin(lineJoin);
  
#### Text style
  
##### font-family
  
    artSVG.setFontFamily('Helvetica');
  
##### font-size
  
    artSVG.setFontSize('16px');
  
##### font-style
  
    artSVG.setFontStyle('italic');
  
##### font-weight
  
    artSVG.setFontWeight('bold');
  

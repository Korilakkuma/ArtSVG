describe('Drawer TEST', function() {

    describe('Drawer.prototype.setStrokeLinecap', function() {

        var container = document.createElement('div');
        var drawer    = new Drawer(container);

        afterEach(function() {
            drawer.setStrokeLinecap(Mocks.ArtSVG.Drawer.StrokeLinecap.BUTT);
        });

        // Positive

        it('should return "butt"', function() {
            drawer.setStrokeLinecap(Mocks.ArtSVG.Drawer.StrokeLinecap.BUTT);
            expect(drawer.getStrokeLinecap()).toEqual('butt');
        });

        it('should return "round"', function() {
            drawer.setStrokeLinecap(Mocks.ArtSVG.Drawer.StrokeLinecap.ROUND);
            expect(drawer.getStrokeLinecap()).toEqual('round');
        });

        it('should return "square"', function() {
            drawer.setStrokeLinecap(Mocks.ArtSVG.Drawer.StrokeLinecap.SQUARE);
            expect(drawer.getStrokeLinecap()).toEqual('square');
        });

        // Negative

        it('should return "butt"', function() {
            drawer.setStrokeLinecap('dummy');
            expect(drawer.getStrokeLinecap()).toEqual('butt');
        });

    });

});

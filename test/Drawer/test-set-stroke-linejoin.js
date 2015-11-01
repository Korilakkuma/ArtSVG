describe('Drawer TEST', function() {

    describe('Drawer.prototype.setStrokeLinejoin', function() {

        var container = document.createElement('div');
        var drawer    = new Drawer(container);

        afterEach(function() {
            drawer.setStrokeLinejoin(Mocks.ArtSVG.Drawer.StrokeLinejoin.MITER);
        });

        // Positive

        it('should return "miter"', function() {
            drawer.setStrokeLinejoin(Mocks.ArtSVG.Drawer.StrokeLinejoin.MITER);
            expect(drawer.getStrokeLinejoin()).toEqual('miter');
        });

        it('should return "round"', function() {
            drawer.setStrokeLinejoin(Mocks.ArtSVG.Drawer.StrokeLinejoin.ROUND);
            expect(drawer.getStrokeLinejoin()).toEqual('round');
        });

        it('should return "bevel"', function() {
            drawer.setStrokeLinejoin(Mocks.ArtSVG.Drawer.StrokeLinejoin.BEVEL);
            expect(drawer.getStrokeLinejoin()).toEqual('bevel');
        });

        // Negative

        it('should return "miter"', function() {
            drawer.setStrokeLinejoin('dummy');
            expect(drawer.getStrokeLinejoin()).toEqual('miter');
        });

    });

});

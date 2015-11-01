describe('ArtSVG TEST', function() {

    describe('ArtSVG.prototype.setDrawerType', function() {

        var container = document.createElement('div');
        var svg       = document.createElement('svg');

        container.appendChild(svg);

        var artSVG = new ArtSVG(container, svg, 800, 600, {});

        afterEach(function() {
            artSVG.setDrawerType(Mocks.ArtSVG.Drawer.Type.PATH);
        });

        // Positive

        it('should return "path"', function() {
            expect(artSVG.setDrawerType(Mocks.ArtSVG.Drawer.Type.PATH).getDrawerType()).toEqual('path');
        });

        it('should return "rectangle"', function() {
            expect(artSVG.setDrawerType(Mocks.ArtSVG.Drawer.Type.RECTANGLE).getDrawerType()).toEqual('rectangle');
        });

        it('should return "square"', function() {
            expect(artSVG.setDrawerType(Mocks.ArtSVG.Drawer.Type.SQUARE).getDrawerType()).toEqual('square');
        });

        it('should return "circle"', function() {
            expect(artSVG.setDrawerType(Mocks.ArtSVG.Drawer.Type.CIRCLE).getDrawerType()).toEqual('circle');
        });

        it('should return "line"', function() {
            expect(artSVG.setDrawerType(Mocks.ArtSVG.Drawer.Type.LINE).getDrawerType()).toEqual('line');
        });

        it('should return "text"', function() {
            expect(artSVG.setDrawerType(Mocks.ArtSVG.Drawer.Type.TEXT).getDrawerType()).toEqual('text');
        });

        // Negative

        it('should return "path"', function() {
            expect(artSVG.setDrawerType('dummy').getDrawerType()).toEqual('path');
        });

    });

});

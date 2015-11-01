describe('ArtSVG TEST', function() {

    describe('ArtSVG.prototype.setMode', function() {

        var container = document.createElement('div');
        var svg       = document.createElement('svg');

        container.appendChild(svg);

        var artSVG = new ArtSVG(container, svg, 800, 600, {});

        afterEach(function() {
            artSVG.setMode(Mocks.ArtSVG.Mode.SELECT);
        });

        // Positive

        it('should return "select"', function() {
            expect(artSVG.setMode(Mocks.ArtSVG.Mode.SELECT).getMode()).toEqual('select');
        });

        it('should return "draw"', function() {
            expect(artSVG.setMode(Mocks.ArtSVG.Mode.DRAW).getMode()).toEqual('draw');
        });

        // Negative

        it('should return "select"', function() {
            expect(artSVG.setMode('dummy').getMode()).toEqual('select');
        });

    });

});

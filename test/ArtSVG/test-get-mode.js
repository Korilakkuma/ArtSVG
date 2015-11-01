describe('ArtSVG TEST', function() {

    describe('ArtSVG.prototype.getMode', function() {

        it('should return "select"', function() {
            var container = document.createElement('div');
            var svg       = document.createElement('svg');

            container.appendChild(svg);

            var artSVG = new ArtSVG(container, svg, 800, 600, {});

            expect(artSVG.getMode()).toEqual('select');
        });

    });

});

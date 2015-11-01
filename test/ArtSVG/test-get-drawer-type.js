describe('ArtSVG TEST', function() {

    describe('ArtSVG.prototype.getDrawerType', function() {

        it('should return "path"', function() {
            var container = document.createElement('div');
            var svg       = document.createElement('svg');

            container.appendChild(svg);

            var artSVG = new ArtSVG(container, svg, 800, 600, {});

            expect(artSVG.getDrawerType()).toEqual('path');
        });

    });

});

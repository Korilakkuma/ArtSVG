describe('ArtSVG TEST', function() {

    describe('ArtSVG.prototype.getContainerWidth', function() {

        it('should return 800', function() {
            var container = document.createElement('div');
            var svg       = document.createElement('svg');

            container.appendChild(svg);

            var artSVG = new ArtSVG(container, svg, 800.5, 600, {});

            expect(artSVG.getContainerWidth()).toEqual(800);
        });

    });

});

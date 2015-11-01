describe('ArtSVG TEST', function() {

    describe('ArtSVG.prototype.getContainerHeight', function() {

        it('should return 600', function() {
            var container = document.createElement('div');
            var svg    = document.createElement('svg');

            container.appendChild(svg);

            var artSVG = new ArtSVG(container, svg, 800, 600.5, {});

            expect(artSVG.getContainerHeight()).toEqual(600);
        });

    });

});

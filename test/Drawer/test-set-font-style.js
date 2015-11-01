describe('Drawer TEST', function() {

    describe('Drawer.prototype.setFontStyle', function() {

        var container = document.createElement('div');
        var drawer    = new Drawer(container);

        afterEach(function() {
            drawer.setFontStyle(Mocks.ArtSVG.Drawer.FontStyle.NORMAL);
        });

        // Positive

        it('should return "normal"', function() {
            drawer.setFontStyle(Mocks.ArtSVG.Drawer.FontStyle.NORMAL);
            expect(drawer.getFontStyle()).toEqual('normal');
        });

        it('should return "italic"', function() {
            drawer.setFontStyle(Mocks.ArtSVG.Drawer.FontStyle.ITALIC);
            expect(drawer.getFontStyle()).toEqual('italic');
        });

        it('should return "oblique"', function() {
            drawer.setFontStyle(Mocks.ArtSVG.Drawer.FontStyle.OBLIQUE);
            expect(drawer.getFontStyle()).toEqual('oblique');
        });

        // Negative

        it('should return "normal"', function() {
            drawer.setFontStyle('dummy');
            expect(drawer.getFontStyle()).toEqual('normal');
        });

    });

});

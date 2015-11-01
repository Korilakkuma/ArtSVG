describe('Drawer TEST', function() {

    describe('Drawer.prototype.setFontWeight', function() {

        it('should return "bold"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            drawer.setFontWeight('bold');

            expect(drawer.getFontWeight()).toEqual('bold');
        });

    });

});

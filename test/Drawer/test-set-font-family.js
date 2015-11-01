describe('Drawer TEST', function() {

    describe('Drawer.prototype.setFontFamily', function() {

        it('should return "Helvetica"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            drawer.setFontFamily('Helvetica');

            expect(drawer.getFontFamily()).toEqual('Helvetica');
        });

    });

});

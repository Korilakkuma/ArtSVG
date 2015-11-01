describe('Drawer TEST', function() {

    describe('Drawer.prototype.setFontSize', function() {

        it('should return "32px"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            drawer.setFontSize('32px');

            expect(drawer.getFontSize()).toEqual('32px');
        });

    });

});

describe('Drawer TEST', function() {

    describe('Drawer.prototype.getFontStyle', function() {

        it('should return "normal"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getFontStyle()).toEqual('normal');
        });

    });

});

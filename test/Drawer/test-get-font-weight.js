describe('Drawer TEST', function() {

    describe('Drawer.prototype.getFontWeight', function() {

        it('should return "normal"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getFontWeight()).toEqual('normal');
        });

    });

});

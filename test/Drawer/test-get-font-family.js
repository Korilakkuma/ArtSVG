describe('Drawer TEST', function() {

    describe('Drawer.prototype.getFontFamily', function() {

        it('should return "Arial"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getFontFamily()).toEqual('Arial');
        });

    });

});

describe('Drawer TEST', function() {

    describe('Drawer.prototype.getFontSize', function() {

        it('should return "16px"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getFontSize()).toEqual('16px');
        });

    });

});

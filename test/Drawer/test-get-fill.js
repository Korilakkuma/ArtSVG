describe('Drawer TEST', function() {

    describe('Drawer.prototype.getFill', function() {

        it('should return "rgba(0, 0, 0, 1)"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getFill()).toEqual('rgba(0, 0, 0, 1)');
        });

    });

});

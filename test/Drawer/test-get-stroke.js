describe('Drawer TEST', function() {

    describe('Drawer.prototype.getStroke', function() {

        it('should return "rgba(0, 0, 0, 1)"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getStroke()).toEqual('rgba(0, 0, 0, 1)');
        });

    });

});

describe('Drawer TEST', function() {

    describe('Drawer.prototype.setStroke', function() {

        it('should return "#ffffff"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            drawer.setStroke('#ffffff');

            expect(drawer.getStroke()).toEqual('#ffffff');
        });

    });

});

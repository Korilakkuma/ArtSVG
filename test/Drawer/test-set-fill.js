describe('Drawer TEST', function() {

    describe('Drawer.prototype.setFill', function() {

        it('should return "#ffffff"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            drawer.setFill('#ffffff');

            expect(drawer.getFill()).toEqual('#ffffff');
        });

    });

});

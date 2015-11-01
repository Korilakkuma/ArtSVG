describe('Drawer TEST', function() {

    describe('Drawer.prototype.getStrokeLinejoin', function() {

        it('should return "miter"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getStrokeLinejoin()).toEqual('miter');
        });

    });

});

describe('Drawer TEST', function() {

    describe('Drawer.prototype.getStrokeWidth', function() {

        it('should return 1', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getStrokeWidth()).toEqual(1);
        });

    });

});

describe('Drawer TEST', function() {

    describe('Drawer.prototype.setStrokeWidth', function() {

        var container = document.createElement('div');
        var drawer    = new Drawer(container);

        afterEach(function() {
            drawer.setStrokeWidth(1);
        });

        // Positive

        it('should return 1.5', function() {
            drawer.setStrokeWidth(1.5);
            expect(drawer.getStrokeWidth()).toEqual(1.5);
        });

        it('should return 0', function() {
            drawer.setStrokeWidth(0);
            expect(drawer.getStrokeWidth()).toEqual(0);
        });

        // Negative

        it('should return 1', function() {
            drawer.setStrokeWidth(-1.5);
            expect(drawer.getStrokeWidth()).toEqual(1);
        });

    });

});

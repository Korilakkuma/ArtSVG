describe('Drawer TEST', function() {

    describe('Drawer.prototype.getStrokeLinecap', function() {

        it('should return "butt"', function() {
            var container = document.createElement('div');
            var drawer    = new Drawer(container);

            expect(drawer.getStrokeLinecap()).toEqual('butt');
        });

    });

});

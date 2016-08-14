(function(app) {
    app.AppComponent =
        ng.core.Component({
            selector: 'my-app',
            template: '<my-info></my-info><my-game></my-game>',
            directives: [
                app.InfoComponent,
                app.GameComponent
            ]
        })
        .Class({
            constructor: function() {}
        });
})(window.app || (window.app = {}));

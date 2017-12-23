(function(app) {
    document.addEventListener('DOMContentLoaded', function() {
        ng.core.enableProdMode();
        ng.platformBrowserDynamic.bootstrap(app.AppComponent);
    });
})(window.app || (window.app = {}));

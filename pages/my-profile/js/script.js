function onFrame() {
    if (kindle.actionArr.length > 0) {
        kindle.doAction(kindle.actionArr.shift());
    }
    if (kindle.actionArr.length > 0) requestAnimationFrame(onFrame);
}

function wrapFunction(func, scope) {
    return function() {
        func.apply(scope, arguments);
    };
}
// =================Application Start=================
kindle = new Kindle();
if (kindle.ctx) {
    kindle.putToCenter();
    kindle.drawPad();
    kindle.drawScreen();
    kindle.drawButtons();
    kindle.drawLogo();
    kindle.placeDivs();
    kindle.showCanvasBackground();
    kindle.screen.showScreenLock();
}

window.onresize = function() {
    if (kindle && kindle.ctx) {
        kindle.putToCenter();
        kindle.placeDivs();
    }
};

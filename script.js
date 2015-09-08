var CONSTANTS = {
    lineLenghtDrawnPerFrame: 20
};

function Kindle() {
    this.actionArr = [];

    this.canvas = document.getElementById('kindleCanvas');
    this.canvas.width = this.CANVAS_WIDTH;
    this.canvas.height = this.CANVAS_HEIGHT;
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasBound = this.canvas.getBoundingClientRect();
}

Kindle.prototype = {
    LOGO_FONT_SIZE: 70,
    SCREEN_FONT_SIZE: 14,
    CANVAS_WIDTH: 585,
    CANVAS_HEIGHT: 820,
    PAD_WIDTH: 575,
    PAD_HEIGHT: 810,
    PAD_RADIUS: 40,
    SCREEN_WIDTH: 460,
    SCREEN_HEIGHT: 615,
    KEY_DOT_RADIUS: 4,
    KEY_LINE_HEIGHT: 160,
    addAction: addAction,
    drawLine: drawLine,
    drawCurve: drawCurve,
    drawRect: drawRect,
    drawRoundRect: drawRoundRect
};

Kindle.prototype.doAction = function(action) {
    var ctx = this.canvasContext;
    switch (action.type) {
        case 'drawLine':
            ctx.moveTo(action.start.x, action.start.y);
            ctx.lineTo(action.end.x, action.end.y);
            ctx.stroke();
            break;
        case 'drawCurve':
            ctx.moveTo(action.start.x, action.start.y);
            ctx.quadraticCurveTo(action.control.x, action.control.y, action.end.x, action.end.y);
            ctx.stroke();
            break;
        case 'circleFill':
            ctx.beginPath();
            ctx.arc(action.x, action.y, action.r, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'appendDiv':
            document.body.appendChild(action.element);
            break;
        default:
            break;
    }
};

Kindle.prototype.drawPad = function() {
    this.padX = (this.CANVAS_WIDTH - this.PAD_WIDTH) / 2;
    this.padY = (this.CANVAS_HEIGHT - this.PAD_HEIGHT) / 2;

    this.drawRoundRect(this.padX, this.padY, this.PAD_WIDTH, this.PAD_HEIGHT, this.PAD_RADIUS);
};

Kindle.prototype.drawScreen = function() {
    this.screenX = (this.CANVAS_WIDTH - this.SCREEN_WIDTH) / 2;
    this.screenY = (this.CANVAS_HEIGHT - this.SCREEN_HEIGHT) * .4;
    this.drawRect(this.screenX, this.screenY, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

    this.screenDiv = document.createElement('div');
    screenDiv.className = 'screenDiv';
    screenDiv.style.width = this.SCREEN_WIDTH + 'px';
    screenDiv.style.height = this.SCREEN_HEIGHT + 'px';
    screenDiv.style.left = this.canvasBound.left + this.screenX + 'px';
    screenDiv.style.top = this.canvasBound.top + this.screenY + 'px';
    screenDiv.style.fontSize = this.SCREEN_FONT_SIZE + 'px';

    this.addAction({
        type: 'appendDiv',
        element: screenDiv
    });
};

Kindle.prototype.drawKeys = function() {
    var leftDot = {
        type: 'circleFill',
        x: this.padX + (this.PAD_WIDTH - this.SCREEN_WIDTH) / 4,
        y: this.padY + this.PAD_HEIGHT / 3,
        r: this.KEY_DOT_RADIUS
    };

    var rightDot = {
        type: 'circleFill',
        x: this.padX + this.PAD_WIDTH - (this.PAD_WIDTH - this.SCREEN_WIDTH) / 4,
        y: this.padY + this.PAD_HEIGHT / 3,
        r: this.KEY_DOT_RADIUS
    };

    var lineStartY = this.padY + this.PAD_HEIGHT / 2;
    var lineEndY = this.padY + this.PAD_HEIGHT / 2 + this.KEY_LINE_HEIGHT;

    this.addAction(leftDot);
    this.drawLine(leftDot.x, lineStartY, leftDot.x, lineEndY);

    this.addAction(rightDot);
    this.drawLine(rightDot.x, lineStartY, rightDot.x, lineEndY);
};

Kindle.prototype.drawLogo = function() {

};

function drawLine(x0, y0, x1, y1) {
    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    var steps = d / CONSTANTS.lineLenghtDrawnPerFrame;
    if (steps < 1) steps = 1;

    var curStartX = x0;
    var curStartY = y0;

    var curEndX;
    var curEndY;

    for (var i = 1; i < steps; i++) {
        curEndX = x0 + (x1 - x0) * i / steps;
        curEndY = y0 + (y1 - y0) * i / steps;

        this.addAction({
            type: 'drawLine',
            start: {
                x: curStartX,
                y: curStartY
            },
            end: {
                x: curEndX,
                y: curEndY
            }
        });

        curStartX = curEndX;
        curStartY = curEndY;
    }

    this.addAction({
        type: 'drawLine',
        start: {
            x: curStartX,
            y: curStartY
        },
        end: {
            x: x1,
            y: y1
        }
    });
}

function drawCurve(startX, startY, controlX, controlY, endX, endY) {
    this.addAction({
        type: 'drawCurve',
        start: {
            x: startX,
            y: startY
        },
        control: {
            x: controlX,
            y: controlY
        },
        end: {
            x: endX,
            y: endY
        }
    });
}

function drawRect(x, y, w, h) {
    this.drawLine(x, y, x + w, y);
    this.drawLine(x + w, y, x + w, y + h);
    this.drawLine(x + w, y + h, x, y + h);
    this.drawLine(x, y + h, x, y);
}

function drawRoundRect(x, y, w, h, r) {
    this.canvasContext.moveTo(x + r, y);
    this.drawLine(x + r, y, x + w - r, y);
    this.drawCurve(x + w - r, y, x + w, y, x + w, y + r);
    this.drawLine(x + w, y + r, x + w, y + h - r);
    this.drawCurve(x + w, y + h - r, x + w, y + h, x + w - r, y + h);
    this.drawLine(x + w - r, y + h, x + r, y + h);
    this.drawCurve(x + r, y + h, x, y + h, x, y + h - r);
    this.drawLine(x, y + h - r, x, y + r);
    this.drawCurve(x, y + r, x, y, x + r, y);
}

function addAction(action) {
    if (this.actionArr.length == 0) {
        requestAnimationFrame(onFrame);
    }
    this.actionArr.push(action);
}

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

var kindle = new Kindle();
kindle.drawPad();
kindle.drawScreen();
kindle.drawKeys();
kindle.drawLogo();

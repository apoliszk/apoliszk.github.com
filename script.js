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
    LOGO_FONT_SIZE: 60,
    SCREEN_FONT_SIZE: 14,
    CANVAS_WIDTH: 585,
    CANVAS_HEIGHT: 820,
    PAD_WIDTH: 575,
    PAD_HEIGHT: 810,
    PAD_RADIUS: 40,
    SCREEN_WIDTH: 460,
    SCREEN_HEIGHT: 615,
    KEY_DOT_RADIUS: 5,
    KEY_LINE_WIDTH: 2,
    KEY_LINE_HEIGHT: 162,
    KEY_COLOR: '#999',
    LOGO_COLOR: '#999',
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
            if (action.width || action.color) {
                ctx.save();
                if (action.width) {
                    ctx.lineWidth = action.width;
                }
                if (action.color) {
                    ctx.strokeStyle = action.color;
                }
            }
            ctx.moveTo(action.start.x, action.start.y);
            ctx.lineTo(action.end.x, action.end.y);
            ctx.stroke();
            if (action.width || action.color) {
                ctx.restore();
            }
            break;
        case 'drawCurve':
            ctx.moveTo(action.start.x, action.start.y);
            ctx.quadraticCurveTo(action.control.x, action.control.y, action.end.x, action.end.y);
            ctx.stroke();
            break;
        case 'arc':
            ctx.save();
            ctx.fillStyle = action.color;
            ctx.beginPath();
            ctx.arc(action.x, action.y, action.r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
            break;
        case 'drawText':
            ctx.save();
            ctx.font = action.font;
            ctx.fillStyle = action.color;
            ctx.fillText(action.text, action.x, action.y);
            ctx.restore();
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
    this.screenDiv.className = 'screenDiv';
    this.screenDiv.style.width = this.SCREEN_WIDTH + 'px';
    this.screenDiv.style.height = this.SCREEN_HEIGHT + 'px';
    this.screenDiv.style.left = this.canvasBound.left + this.screenX + 'px';
    this.screenDiv.style.top = this.canvasBound.top + this.screenY + 'px';
    this.screenDiv.style.fontSize = this.SCREEN_FONT_SIZE + 'px';

    this.addAction({
        type: 'appendDiv',
        element: this.screenDiv
    });
};

Kindle.prototype.drawKeys = function() {
    var leftDot = {
        type: 'arc',
        x: this.padX + (this.PAD_WIDTH - this.SCREEN_WIDTH) / 4,
        y: this.padY + this.PAD_HEIGHT / 3,
        r: this.KEY_DOT_RADIUS,
        color: this.KEY_COLOR
    };

    var rightDot = {
        type: 'arc',
        x: this.padX + this.PAD_WIDTH - (this.PAD_WIDTH - this.SCREEN_WIDTH) / 4,
        y: this.padY + this.PAD_HEIGHT / 3,
        r: this.KEY_DOT_RADIUS,
        color: this.KEY_COLOR
    };

    var lineStartY = this.padY + this.PAD_HEIGHT / 2;
    var lineEndY = this.padY + this.PAD_HEIGHT / 2 + this.KEY_LINE_HEIGHT;

    this.addAction(leftDot);
    this.drawLine(leftDot.x, lineStartY, leftDot.x, lineEndY, this.KEY_LINE_WIDTH, this.KEY_COLOR);

    this.addAction(rightDot);
    this.drawLine(rightDot.x, lineStartY, rightDot.x, lineEndY, this.KEY_LINE_WIDTH, this.KEY_COLOR);
};

Kindle.prototype.drawLogo = function() {
    var logo = 'kindle';
    var font = this.LOGO_FONT_SIZE + 'px Verdana';
    this.canvasContext.save();
    this.canvasContext.font = font;
    var textWidth = this.canvasContext.measureText(logo).width;
    this.canvasContext.restore();
    this.addAction({
        type: 'drawText',
        text: logo,
        x: (this.CANVAS_WIDTH - textWidth) / 2,
        y: this.screenY + this.SCREEN_HEIGHT + (this.PAD_HEIGHT - (this.screenY + this.SCREEN_HEIGHT + this.LOGO_FONT_SIZE)) / 2 + this.LOGO_FONT_SIZE,
        color: this.LOGO_COLOR,
        font: font
    });
};

function drawLine(x0, y0, x1, y1, w, color) {
    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    var steps = d / CONSTANTS.lineLenghtDrawnPerFrame;
    if (steps < 1) steps = 1;

    var curStartX = x0;
    var curStartY = y0;

    var curEndX;
    var curEndY;

    var action;

    for (var i = 1; i < steps + 1; i++) {
        curEndX = x0 + (x1 - x0) * i / steps;
        curEndY = y0 + (y1 - y0) * i / steps;

        if (i >= steps) {
            curEndX = x1;
            curEndY = y1;
        } else {
            curEndX = x0 + (x1 - x0) * i / steps;
            curEndY = y0 + (y1 - y0) * i / steps;
        }
        action = {
            type: 'drawLine',
            start: {
                x: curStartX,
                y: curStartY
            },
            end: {
                x: curEndX,
                y: curEndY
            }
        };
        if (w) {
            action.width = w;
        }
        if (color) {
            action.color = color;
        }
        this.addAction(action);

        curStartX = curEndX;
        curStartY = curEndY;
    }
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

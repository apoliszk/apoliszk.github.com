var CONSTANTS = {
    lineLenghtDrawnPerFrame: 20
};

function Kindle() {
    this.actionArr = [];

    this.canvas = document.getElementById('kindleCanvas');
    this.canvas.width = this.CANVAS_WIDTH;
    this.canvas.height = this.CANVAS_HEIGHT;
    this.canvasContext = this.canvas.getContext('2d');
}

Kindle.prototype = {
    LOGO_FONT_SIZE: 60,
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

Kindle.prototype.createButtonDiv = function(x, y, w, h) {
    var div = document.createElement('div');
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.style.width = w + 'px';
    div.style.height = h + 'px';
    div.className = 'button';
    return div;
};

Kindle.prototype.canvasPostionToGlobalPosition = function(x, y) {
    var canvasBound = this.canvas.getBoundingClientRect();
    return {
        x: canvasBound.left + document.body.scrollLeft + x,
        y: canvasBound.top + document.body.scrollTop + y
    };
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
        case 'showDiv':
            action.element.style.opacity = 1;
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

    var globalPosition = this.canvasPostionToGlobalPosition(this.screenX, this.screenY);
    this.screenDiv = document.createElement('div');
    this.screenDiv.style.position = 'absolute';
    this.screenDiv.style.opacity = 0;
    this.screenDiv.style.left = globalPosition.x + 'px';
    this.screenDiv.style.top = globalPosition.y + 'px';
    this.screenDiv.style.width = this.SCREEN_WIDTH + 'px';
    this.screenDiv.style.height = this.SCREEN_HEIGHT + 'px';
    this.screenDiv.style.background = 'url(screen_lock.gif) center no-repeat';
    this.screenDiv.style.transition = 'opacity 1s ease-in-out';
    document.body.appendChild(this.screenDiv);
};

Kindle.prototype.drawKeys = function() {
    var buttonRadius = this.KEY_DOT_RADIUS * 3;
    var buttonWidth = buttonRadius * 2;

    var leftDot = {
        type: 'arc',
        x: this.padX + (this.PAD_WIDTH - this.SCREEN_WIDTH) / 4,
        y: this.padY + this.PAD_HEIGHT / 3,
        r: this.KEY_DOT_RADIUS,
        color: this.KEY_COLOR
    };
    var leftDotCenterGlobalPosition = this.canvasPostionToGlobalPosition(leftDot.x, leftDot.y);
    this.leftDotDiv = this.createButtonDiv(leftDotCenterGlobalPosition.x - buttonRadius, leftDotCenterGlobalPosition.y - buttonRadius, buttonWidth, buttonWidth);
    this.leftDotDiv.style.borderRadius = buttonRadius + 'px';
    document.body.appendChild(this.leftDotDiv);

    var rightDot = {
        type: 'arc',
        x: this.padX + this.PAD_WIDTH - (this.PAD_WIDTH - this.SCREEN_WIDTH) / 4,
        y: this.padY + this.PAD_HEIGHT / 3,
        r: this.KEY_DOT_RADIUS,
        color: this.KEY_COLOR
    };
    var rightDotCenterGlobalPosition = this.canvasPostionToGlobalPosition(rightDot.x, rightDot.y);
    this.rightDotDiv = this.createButtonDiv(rightDotCenterGlobalPosition.x - buttonRadius, rightDotCenterGlobalPosition.y - buttonRadius, buttonWidth, buttonWidth);
    this.rightDotDiv.style.borderRadius = buttonRadius + 'px';
    document.body.appendChild(this.rightDotDiv);

    var lineStartY = this.padY + this.PAD_HEIGHT / 2;
    var lineEndY = this.padY + this.PAD_HEIGHT / 2 + this.KEY_LINE_HEIGHT;

    this.addAction(leftDot);
    this.drawLine(leftDot.x, lineStartY, leftDot.x, lineEndY, this.KEY_LINE_WIDTH, this.KEY_COLOR);
    var leftLineCenterGlobalPosition = this.canvasPostionToGlobalPosition(leftDot.x, lineStartY);
    this.leftLineDiv = this.createButtonDiv(leftLineCenterGlobalPosition.x - buttonRadius, leftLineCenterGlobalPosition.y, buttonWidth, lineEndY - lineStartY);
    this.leftLineDiv.style.borderRadius = buttonRadius + 'px';
    document.body.appendChild(this.leftLineDiv);

    this.addAction(rightDot);
    this.drawLine(rightDot.x, lineStartY, rightDot.x, lineEndY, this.KEY_LINE_WIDTH, this.KEY_COLOR);
    var rightLineCenterGlobalPosition = this.canvasPostionToGlobalPosition(rightDot.x, lineStartY);
    this.rightLineDiv = this.createButtonDiv(rightLineCenterGlobalPosition.x - buttonRadius, rightLineCenterGlobalPosition.y, buttonWidth, lineEndY - lineStartY);
    this.rightLineDiv.style.borderRadius = buttonRadius + 'px';
    document.body.appendChild(this.rightLineDiv);
};

Kindle.prototype.drawLogo = function() {
    var logo = 'kindle';
    var font = this.LOGO_FONT_SIZE + 'px Arial';
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

Kindle.prototype.showScreenDiv = function() {
    this.addAction({
        type: 'showDiv',
        element: this.screenDiv
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

var kindle = new Kindle();
kindle.drawPad();
kindle.drawScreen();
kindle.drawKeys();
kindle.drawLogo();

kindle.showScreenDiv();

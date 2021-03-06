function Kindle() {
    this.actionArr = [];

    this.canvasBackgroundDiv = document.getElementById('canvasBackgroundDiv');
    this.canvasBackgroundDiv.style.position = 'absolute';
    this.canvasBackgroundDiv.style.borderRadius = Kindle.PAD_BACKGROUND_RADIUS + 'px';
    this.canvasBackgroundDiv.style.background = '#000';
    this.canvasBackgroundDiv.style.width = Kindle.PAD_WIDTH + 'px';
    this.canvasBackgroundDiv.style.height = Kindle.PAD_HEIGHT + 'px';
    this.canvasBackgroundDiv.style.opacity = 0;

    this.canvas = document.getElementById('kindleCanvas');
    this.canvas.style.position = 'absolute';
    this.canvas.width = Kindle.CANVAS_WIDTH;
    this.canvas.height = Kindle.CANVAS_HEIGHT;
    this.ctx = this.canvas.getContext('2d');
}

Kindle.LINE_LENGTH_DRAWN_PER_FRAME = 20;

Kindle.CANVAS_WIDTH = 585;
Kindle.CANVAS_HEIGHT = 820;

Kindle.PAD_WIDTH = 575;
Kindle.PAD_HEIGHT = 810;
Kindle.PAD_RADIUS = 40;
Kindle.PAD_BACKGROUND_RADIUS = 30;

Kindle.SCREEN_WIDTH = 460;
Kindle.SCREEN_HEIGHT = 615;

Kindle.KEY_COLOR = '#666';
Kindle.KEY_DOT_RADIUS = 3;
Kindle.KEY_LINE_WIDTH = 2;
Kindle.KEY_LINE_HEIGHT = 162;
Kindle.BUTTON_RADIUS = 15;
Kindle.BUTTON_WIDTH = 30;

Kindle.LOGO_COLOR = '#666';
Kindle.LOGO_FONT_SIZE = 60;

Kindle.prototype.addAction = function(action) {
    if (this.actionArr.length === 0) {
        requestAnimationFrame(onFrame);
    }
    this.actionArr.push(action);
};

Kindle.prototype.canvasPostionToGlobalPosition = function(x, y) {
    var canvasBound = this.canvas.getBoundingClientRect();
    return {
        x: canvasBound.left + document.body.scrollLeft + x,
        y: canvasBound.top + document.body.scrollTop + y
    };
};

Kindle.prototype.createButtonDiv = function(w, h) {
    var div = document.createElement('div');
    div.style.width = w + 'px';
    div.style.height = h + 'px';
    div.style.borderRadius = Kindle.BUTTON_RADIUS + 'px';
    div.style.position = 'absolute';
    div.className = 'button';
    div.addEventListener('click', wrapFunction(this.mouseClickHandler, this));
    return div;
};

Kindle.prototype.doAction = function(action) {
    switch (action.type) {
        case 'drawLine':
            if (action.width || action.color) {
                this.ctx.save();
                if (action.width) {
                    this.ctx.lineWidth = action.width;
                }
                if (action.color) {
                    this.ctx.strokeStyle = action.color;
                }
            }
            this.ctx.moveTo(action.start.x, action.start.y);
            this.ctx.lineTo(action.end.x, action.end.y);
            this.ctx.stroke();
            if (action.width || action.color) {
                this.ctx.restore();
            }
            break;
        case 'drawCurve':
            this.ctx.moveTo(action.start.x, action.start.y);
            this.ctx.quadraticCurveTo(action.control.x, action.control.y, action.end.x, action.end.y);
            this.ctx.stroke();
            break;
        case 'arc':
            this.ctx.save();
            this.ctx.fillStyle = action.color;
            this.ctx.beginPath();
            this.ctx.arc(action.x, action.y, action.r, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            break;
        case 'drawText':
            this.ctx.save();
            this.ctx.font = action.font;
            this.ctx.fillStyle = action.color;
            this.ctx.fillText(action.text, action.x, action.y);
            this.ctx.restore();
            break;
        case 'showDiv':
            if (action.prop === 'opacity') {
                if (action.element.style.opacity != 1) {
                    if (action.element.style.transitionProperty === 'opacity') {
                        action.element.transitionEnd = false;
                    }
                    action.element.style.opacity = 1;
                }
            } else if (action.prop === 'visibility') {
                action.element.style.visibility = 'visible';
            }
            break;
        case 'hideDiv':
            if (action.prop === 'opacity') {
                if (action.element.style.opacity != 0) {
                    if (action.element.style.transitionProperty === 'opacity') {
                        action.element.transitionEnd = false;
                    }
                    action.element.style.opacity = 0;
                }
            } else if (action.prop === 'visibility') {
                action.element.style.visibility = 'hidden';
            }
            break;
        default:
            break;
    }
};

Kindle.prototype.drawButtons = function() {
    var leftDot = {
        type: 'arc',
        x: this.padX + (Kindle.PAD_WIDTH - Kindle.SCREEN_WIDTH) / 4,
        y: this.padY + Kindle.PAD_HEIGHT / 3,
        r: Kindle.KEY_DOT_RADIUS,
        color: Kindle.KEY_COLOR
    };
    this.leftDotCenterX = leftDot.x;
    this.leftDotCenterY = leftDot.y;
    this.leftDotDiv = this.createButtonDiv(Kindle.BUTTON_WIDTH, Kindle.BUTTON_WIDTH);
    document.body.appendChild(this.leftDotDiv);

    var rightDot = {
        type: 'arc',
        x: this.padX + Kindle.PAD_WIDTH - (Kindle.PAD_WIDTH - Kindle.SCREEN_WIDTH) / 4,
        y: this.padY + Kindle.PAD_HEIGHT / 3,
        r: Kindle.KEY_DOT_RADIUS,
        color: Kindle.KEY_COLOR
    };
    this.rightDotCenterX = rightDot.x;
    this.rightDotCenterY = rightDot.y;
    this.rightDotDiv = this.createButtonDiv(Kindle.BUTTON_WIDTH, Kindle.BUTTON_WIDTH);
    document.body.appendChild(this.rightDotDiv);

    var lineStartY = this.padY + Kindle.PAD_HEIGHT / 2;
    var lineEndY = this.padY + Kindle.PAD_HEIGHT / 2 + Kindle.KEY_LINE_HEIGHT;

    this.addAction(leftDot);
    this.drawLine(leftDot.x, lineStartY, leftDot.x, lineEndY, Kindle.KEY_LINE_WIDTH, Kindle.KEY_COLOR);
    this.leftLineCenterX = leftDot.x;
    this.leftLineY = lineStartY;
    this.leftLineDiv = this.createButtonDiv(Kindle.BUTTON_WIDTH, lineEndY - lineStartY);
    document.body.appendChild(this.leftLineDiv);

    this.addAction(rightDot);
    this.drawLine(rightDot.x, lineStartY, rightDot.x, lineEndY, Kindle.KEY_LINE_WIDTH, Kindle.KEY_COLOR);
    this.rightLineCenterX = rightDot.x;
    this.rightLineY = lineStartY;
    this.rightLineDiv = this.createButtonDiv(Kindle.BUTTON_WIDTH, lineEndY - lineStartY);
    document.body.appendChild(this.rightLineDiv);
};

Kindle.prototype.drawCurve = function(startX, startY, controlX, controlY, endX, endY) {
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
};

Kindle.prototype.drawLine = function(x0, y0, x1, y1, w, color) {
    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    var steps = d / Kindle.LINE_LENGTH_DRAWN_PER_FRAME;
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
};

Kindle.prototype.drawLogo = function() {
    var logo = 'kindle';
    var font = Kindle.LOGO_FONT_SIZE + 'px Arial';
    this.ctx.save();
    this.ctx.font = font;
    var textWidth = this.ctx.measureText(logo).width;
    this.ctx.restore();
    this.addAction({
        type: 'drawText',
        text: logo,
        x: (Kindle.CANVAS_WIDTH - textWidth) / 2,
        y: this.screenY + Kindle.SCREEN_HEIGHT + (Kindle.PAD_HEIGHT - (this.screenY + Kindle.SCREEN_HEIGHT + Kindle.LOGO_FONT_SIZE)) / 2 + Kindle.LOGO_FONT_SIZE,
        color: Kindle.LOGO_COLOR,
        font: font
    });
};

Kindle.prototype.drawPad = function() {
    this.padX = (Kindle.CANVAS_WIDTH - Kindle.PAD_WIDTH) / 2;
    this.padY = (Kindle.CANVAS_HEIGHT - Kindle.PAD_HEIGHT) / 2;
    this.drawRoundRect(this.padX, this.padY, Kindle.PAD_WIDTH, Kindle.PAD_HEIGHT, Kindle.PAD_RADIUS);
};

Kindle.prototype.drawRect = function(x, y, w, h) {
    this.drawLine(x, y, x + w, y);
    this.drawLine(x + w, y, x + w, y + h);
    this.drawLine(x + w, y + h, x, y + h);
    this.drawLine(x, y + h, x, y);
};

Kindle.prototype.drawRoundRect = function(x, y, w, h, r) {
    this.drawLine(x + r, y, x + w - r, y);
    this.drawCurve(x + w - r, y, x + w, y, x + w, y + r);
    this.drawLine(x + w, y + r, x + w, y + h - r);
    this.drawCurve(x + w, y + h - r, x + w, y + h, x + w - r, y + h);
    this.drawLine(x + w - r, y + h, x + r, y + h);
    this.drawCurve(x + r, y + h, x, y + h, x, y + h - r);
    this.drawLine(x, y + h - r, x, y + r);
    this.drawCurve(x, y + r, x, y, x + r, y);
};

Kindle.prototype.drawScreen = function() {
    this.screenX = (Kindle.CANVAS_WIDTH - Kindle.SCREEN_WIDTH) / 2;
    this.screenY = (Kindle.CANVAS_HEIGHT - Kindle.SCREEN_HEIGHT) * .4;
    this.drawRect(this.screenX, this.screenY, Kindle.SCREEN_WIDTH, Kindle.SCREEN_HEIGHT);

    this.initScreenDiv();
};

Kindle.prototype.initScreenDiv = function() {
    var div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = Kindle.SCREEN_WIDTH - 2 + 'px';
    div.style.height = Kindle.SCREEN_HEIGHT - 2 + 'px';
    div.addEventListener('click', wrapFunction(this.mouseClickHandler, this));
    document.body.appendChild(div);

    this.screen = new KindleScreen(this, div);
};

Kindle.prototype.mouseClickHandler = function(e) {
    var target = e.target;
    if (target === this.leftDotDiv || target === this.rightDotDiv) {
        this.screen.handleUserInteract(KindleScreen.ACTION_TYPE.PRE_PAGE);
    } else if (target === this.leftLineDiv || target === this.rightLineDiv) {
        this.screen.handleUserInteract(KindleScreen.ACTION_TYPE.NEXT_PAGE);
    } else if (e.currentTarget === this.screen.rootDiv) {
        var mouseX = e.clientX + document.body.scrollLeft;
        if (mouseX > this.canvasPostionToGlobalPosition(this.screenX, 0).x + Kindle.SCREEN_WIDTH / 3) {
            this.screen.handleUserInteract(KindleScreen.ACTION_TYPE.NEXT_PAGE);
        } else {
            this.screen.handleUserInteract(KindleScreen.ACTION_TYPE.PRE_PAGE);
        }
    }
};

Kindle.prototype.placeDivs = function() {
    var globalPosition;
    if (this.screen && this.screen.rootDiv) {
        globalPosition = this.canvasPostionToGlobalPosition(this.screenX, this.screenY);
        this.screen.rootDiv.style.left = globalPosition.x + 1 + 'px';
        this.screen.rootDiv.style.top = globalPosition.y + 1 + 'px';
    }
    if (this.leftDotDiv) {
        globalPosition = this.canvasPostionToGlobalPosition(this.leftDotCenterX - Kindle.BUTTON_RADIUS, this.leftDotCenterY - Kindle.BUTTON_RADIUS);
        this.leftDotDiv.style.left = globalPosition.x + 'px';
        this.leftDotDiv.style.top = globalPosition.y + 'px';
    }
    if (this.rightDotDiv) {
        globalPosition = this.canvasPostionToGlobalPosition(this.rightDotCenterX - Kindle.BUTTON_RADIUS, this.rightDotCenterY - Kindle.BUTTON_RADIUS);
        this.rightDotDiv.style.left = globalPosition.x + 'px';
        this.rightDotDiv.style.top = globalPosition.y + 'px';
    }
    if (this.leftLineDiv) {
        globalPosition = this.canvasPostionToGlobalPosition(this.leftLineCenterX - Kindle.BUTTON_RADIUS, this.leftLineY);
        this.leftLineDiv.style.left = globalPosition.x + 'px';
        this.leftLineDiv.style.top = globalPosition.y + 'px';
    }
    if (this.rightLineDiv) {
        globalPosition = this.canvasPostionToGlobalPosition(this.rightLineCenterX - Kindle.BUTTON_RADIUS, this.rightLineY);
        this.rightLineDiv.style.left = globalPosition.x + 'px';
        this.rightLineDiv.style.top = globalPosition.y + 'px';
    }
};

Kindle.prototype.putToCenter = function() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;

    if (w < Kindle.CANVAS_WIDTH) w = Kindle.CANVAS_WIDTH;
    if (h < Kindle.CANVAS_HEIGHT) h = Kindle.CANVAS_HEIGHT;

    var x = (w - Kindle.CANVAS_WIDTH) / 2;
    var y = (h - Kindle.CANVAS_HEIGHT) / 2;

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    this.canvas.style.left = x + 'px';
    this.canvas.style.top = y + 'px';

    x = (w - Kindle.PAD_WIDTH) / 2;
    y = (h - Kindle.PAD_HEIGHT) / 2;

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    this.canvasBackgroundDiv.style.left = x + 'px';
    this.canvasBackgroundDiv.style.top = y + 'px';
};

Kindle.prototype.showCanvasBackground = function() {
    this.canvasBackgroundDiv.style.transition = 'opacity 1s ease-in-out';
    this.addAction({
        type: 'showDiv',
        prop: 'opacity',
        element: this.canvasBackgroundDiv
    });
};

var CONSTANTS = {
    lineLenghtDrawnPerFrame: 20
};

function PasswordPad() {
    this.actionArr = [];

    this.keys = [];

    this.canvas = document.getElementById('pwdPadCanvas');
    this.canvas.width = this.CANVAS_WIDTH;
    this.canvas.height = this.CANVAS_HEIGHT;
    this.canvasContext = this.canvas.getContext('2d');

    this.canvasBound = this.canvas.getBoundingClientRect();
    this.msgDiv = document.getElementById('pwdPadMsgDiv');
    this.msgDiv.style.fontSize = this.MSG_FONT_SIZE + 'px';
    this.msgDiv.style.left = this.HORIZONTAL_PAD_PADDING + this.CANVAS_PADDING + this.canvasBound.left + 'px';
    this.msgDiv.style.top = this.PAD_PADDING_TOP + this.CANVAS_PADDING - this.MSG_FONT_SIZE * 2 + this.canvasBound.top + 'px';

    this.canvas.addEventListener('mousedown', wrapFunction(this.mouseDownHandler, this));
    this.canvas.addEventListener('mouseup', wrapFunction(this.mouseUpHandler, this));
}

PasswordPad.prototype = {
    MSG_FONT_SIZE: 14,
    NUM_PAD_FONT_SIZE: 70,
    SCREEN_FONT_SIZE: 70,
    CANVAS_WIDTH: 440,
    CANVAS_HEIGHT: 710,
    CANVAS_PADDING: 5,
    HORIZONTAL_PAD_PADDING: 40,
    PAD_PADDING_TOP: 45,
    SCREEN_HEIGHT: 100,
    KEY_WIDTH: 100,
    KEY_HEIGHT: 100,
    addAction: addAction,
    drawLine: drawLine,
    drawRect: drawRect
};
PasswordPad.prototype.drawKey = function(x, y, w, h, num) {
    this.drawRect(x, y, w, h);
    var fontSize = this.NUM_PAD_FONT_SIZE;

    var keyDiv = document.createElement('div');
    keyDiv.className = 'keyDiv';
    keyDiv.style.width = w - 2 + 'px';
    keyDiv.style.height = h - 2 + 'px';
    keyDiv.style.left = this.canvasBound.left + 1 + x + 'px';
    keyDiv.style.top = this.canvasBound.top + 1 + y + 'px';
    keyDiv.style.fontSize = this.NUM_PAD_FONT_SIZE + 'px';
    keyDiv.style.lineHeight = h - 2 + 'px';
    keyDiv.innerHTML = num;

    this.addAction({
        type: 'appendDiv',
        element: keyDiv
    });
};
PasswordPad.prototype.doAction = function(action) {
    switch (action.type) {
        case 'drawLine':
            this.canvasContext.moveTo(action.start.x, action.start.y);
            this.canvasContext.lineTo(action.end.x, action.end.y);
            this.canvasContext.stroke();
            break;
        case 'appendDiv':
            document.body.appendChild(action.element);
            break;
        case 'msg':
            if (action.act == 'append')
                this.msgDiv.innerHTML += action.letter;
            else if (action.act == 'clear')
                this.msgDiv.innerHTML = '';
            break;
        default:
            break;
    }
};
PasswordPad.prototype.showStringOnMsgDiv = function(str) {
    this.addAction({
        type: 'msg',
        act: 'clear'
    });
    for (var i = 0, len = str.length; i < len; i++) {
        this.addAction({
            type: 'msg',
            act: 'append',
            letter: str.charAt(i)
        });
    }
};
PasswordPad.prototype.drawPad = function() {
    this.drawRect(this.CANVAS_PADDING,
        this.CANVAS_PADDING,
        this.CANVAS_WIDTH - this.CANVAS_PADDING * 2,
        this.CANVAS_HEIGHT - this.CANVAS_PADDING * 2);
};
PasswordPad.prototype.drawScreen = function() {
    var x = this.CANVAS_PADDING + this.HORIZONTAL_PAD_PADDING;
    var y = this.CANVAS_PADDING + this.PAD_PADDING_TOP;
    var w = this.CANVAS_WIDTH - (this.CANVAS_PADDING + this.HORIZONTAL_PAD_PADDING) * 2;
    var h = this.SCREEN_HEIGHT;
    this.drawRect(x, y, w, h);

    var screenDiv = document.createElement('div');
    screenDiv.className = 'screenDiv';
    screenDiv.style.width = w + 'px';
    screenDiv.style.height = h + 'px';
    screenDiv.style.left = this.canvasBound.left + x + 'px';
    screenDiv.style.top = this.canvasBound.top + y + 'px';
    screenDiv.style.fontSize = this.SCREEN_FONT_SIZE + 'px';
    screenDiv.style.lineHeight = h + 'px';

    this.addAction({
        type: 'appendDiv',
        element: screenDiv
    });
};
PasswordPad.prototype.drawKeys = function() {
    var left = this.CANVAS_PADDING + this.HORIZONTAL_PAD_PADDING;
    var leftWidth = this.CANVAS_WIDTH - left * 2;
    var gap = (leftWidth - this.KEY_WIDTH * 3) / 2;
    var leftHeight = this.CANVAS_HEIGHT - this.CANVAS_PADDING * 2 - this.PAD_PADDING_TOP - this.SCREEN_HEIGHT;
    var top = this.CANVAS_PADDING + this.PAD_PADDING_TOP + this.SCREEN_HEIGHT + (leftHeight - this.KEY_HEIGHT * 4 - gap * 3) / 2;

    var x;
    var y;
    for (var i = 0; i < 9; i++) {
        x = left + (i % 3) * (this.KEY_WIDTH + gap);
        y = top + parseInt(i / 3) * (this.KEY_HEIGHT + gap);
        this.drawKey(x, y, this.KEY_WIDTH, this.KEY_HEIGHT, 9 - i);
    }

    x -= this.KEY_WIDTH + gap;
    y += this.KEY_HEIGHT + gap;
    this.drawKey(x, y, this.KEY_WIDTH, this.KEY_HEIGHT, 9 - i);
};
PasswordPad.prototype.mouseDownHandler = function() {

};
PasswordPad.prototype.mouseUpHandler = function() {

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

function drawRect(x, y, w, h) {
    this.drawLine(x, y, x + w, y);
    this.drawLine(x + w, y, x + w, y + h);
    this.drawLine(x + w, y + h, x, y + h);
    this.drawLine(x, y + h, x, y);
}

function addAction(action) {
    if (this.actionArr.length == 0) {
        requestAnimationFrame(onFrame);
    }
    this.actionArr.push(action);
}

function onFrame() {
    if (pwdPad.actionArr.length > 0) {
        pwdPad.doAction(pwdPad.actionArr.shift());
    }
    if (pwdPad.actionArr.length > 0) requestAnimationFrame(onFrame);
}

function wrapFunction(func, scope) {
    return function() {
        func.apply(scope, arguments);
    };
}

var pwdPad = new PasswordPad();
pwdPad.drawPad();
pwdPad.drawScreen();
pwdPad.drawKeys();
pwdPad.showStringOnMsgDiv('Enter the password', true);

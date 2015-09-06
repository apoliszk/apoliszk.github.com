var MSG_FONT_SIZE = 14;
var CANVAS_FONT_SIZE = 70;

var CANVAS_WIDTH = 440;
var CANVAS_HEIGHT = 710;
var CANVAS_PADDING = 5;

var MAX_LINE_LENGTH_PRE_FRAME = 40;

function drawLine(x0, y0, x1, y1) {
    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    var steps = d / MAX_LINE_LENGTH_PRE_FRAME;
    if (steps < 1) steps = 1;

    var curStartX = x0;
    var curStartY = y0;

    var curEndX;
    var curEndY;

    for (var i = 1; i < steps; i++) {
        curEndX = x0 + (x1 - x0) * i / steps;
        curEndY = y0 + (y1 - y0) * i / steps;

        addActionToArr({
            type: 'line',
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

    addActionToArr({
        type: 'line',
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

function drawRect(x, y, w, h, txt) {
    drawLine(x, y, x + w, y);
    drawLine(x + w, y, x + w, y + h);
    drawLine(x + w, y + h, x, y + h);
    drawLine(x, y + h, x, y);

    if (txt) {
        var txtWidth = ctx.measureText(txt).width;
        addActionToArr({
            type: 'text',
            txt: txt,
            x: x + (w - txtWidth) / 2,
            y: y + (h - CANVAS_FONT_SIZE) / 2 + CANVAS_FONT_SIZE * .8
        });
    }
}

function addStringToActionArr(str, clear) {
    if (clear) {
        addActionToArr({
            type: 'letter',
            act: 'clear'
        });
    }
    for (var i = 0, len = str.length; i < len; i++) {
        addActionToArr({
            type: 'letter',
            act: 'append',
            letter: str.charAt(i)
        });
    }
}

function addActionToArr(action) {
    if (actionArr.length == 0) {
        requestAnimationFrame(onFrame);
    }
    actionArr.push(action);
}

function onFrame() {
    if (actionArr.length > 0) {
        var action = actionArr.shift();

        switch (action.type) {
            case 'letter':
                if (action.act == 'append')
                    screenMsgDiv.innerHTML += action.letter;
                else if (action.act == 'clear')
                    screenMsgDiv.innerHTML = '';
                break;
            case 'line':
                ctx.moveTo(action.start.x, action.start.y);
                ctx.lineTo(action.end.x, action.end.y);
                ctx.stroke();
                break;
            case 'text':
                ctx.fillText(action.txt, action.x, action.y);
                break;
        }
    }
    if (actionArr.length > 0) requestAnimationFrame(onFrame);
}

var actionArr = [];
var canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var canvasBound = canvas.getBoundingClientRect();
var ctx = ctx = canvas.getContext('2d');
ctx.font = CANVAS_FONT_SIZE + 'px Arial';

var screenMsgDiv = document.getElementById('screenMsg');
screenMsgDiv.style.fontSize = MSG_FONT_SIZE + 'px';
screenMsgDiv.style.left = 45 + canvasBound.left + 'px';
screenMsgDiv.style.top = 50 - MSG_FONT_SIZE * 2 + canvasBound.top + 'px';

drawRect(CANVAS_PADDING, CANVAS_PADDING, CANVAS_WIDTH - CANVAS_PADDING * 2, CANVAS_HEIGHT - CANVAS_PADDING * 2);

drawRect(45, 50, 350, 100);

drawRect(45, 190, 100, 100, '9');
drawRect(170, 190, 100, 100, '8');
drawRect(295, 190, 100, 100, '7');

drawRect(45, 315, 100, 100, '6');
drawRect(170, 315, 100, 100, '5');
drawRect(295, 315, 100, 100, '4');

drawRect(45, 440, 100, 100, '3');
drawRect(170, 440, 100, 100, '2');
drawRect(295, 440, 100, 100, '1');

drawRect(170, 565, 100, 100, '0');

addStringToActionArr('Enter the password to get in ...', true);

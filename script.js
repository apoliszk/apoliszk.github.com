function fuzz(x, f) {
    return x + Math.random() * f - f / 2;
}

// estimate the movement of the arm
// x0: start
// x1: end
// t: step from 0 to 1
function handDrawMovement(x0, x1, t) {
    return x0 + (x0 - x1) * (15 * Math.pow(t, 4) - 6 * Math.pow(t, 5) - 10 * Math.pow(t, 3));
}

// inspired by this paper
// http://iwi.eldoc.ub.rug.nl/FILES/root/2008/ProcCAGVIMeraj/2008ProcCAGVIMeraj.pdf
function handDrawLine(x0, y0, x1, y1) {
    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));

    var steps = d / 40;
    if (steps < 1) steps = 1;

    var curStartX = x0;
    var curStartY = y0;

    var curEndX;
    var curEndY;

    // fuzzyness
    var f = 4.0;
    for (var i = 1; i <= steps; i++) {
        var t1 = i / steps;
        var t0 = t1 - 1 / steps;

        curEndX = handDrawMovement(x0, x1, t1);
        curEndY = handDrawMovement(y0, y1, t1);

        addActionToDrawArr({
            start: {
                x: curStartX,
                y: curStartY
            },
            control: {
                x: fuzz(handDrawMovement(x0, x1, t0), f),
                y: fuzz(handDrawMovement(y0, y1, t0), f)
            },
            end: {
                x: curEndX,
                y: curEndY
            }
        });

        curStartX = curEndX;
        curStartY = curEndY;
    }
}

function addActionToDrawArr(action) {
    if (drawArr.length == 0) {
        requestAnimationFrame(onFrame);
    }
    drawArr.push(action);
}

function addStringToLetterArr(str) {
    if (letterArr.length == 0) {
        requestAnimationFrame(onFrame);
    }
    for (var i = 0, len = str.length; i < len; i++) {
        letterArr.push(str.charAt(i));
    }
}

function onFrame() {
    if (letterArr.length > 0) {
        var letter = letterArr.shift();
        headerInfo.innerHTML += letter;
    } else if (drawArr.length > 0) {
        var action = drawArr.shift();
        ctx.moveTo(action.start.x, action.start.y);
        ctx.quadraticCurveTo(action.control.x, action.control.y, action.end.x, action.end.y);
        ctx.stroke();
    }
    if (letterArr.length > 0 || drawArr.length > 0) requestAnimationFrame(onFrame);
}

function drawRect(x, y, w, h) {
    handDrawLine(x, y, x + w, y);
    handDrawLine(x + w, y, x + w, y + h);
    handDrawLine(x + w, y + h, x, y + h);
    handDrawLine(x, y + h, x, y);
}

var drawArr = [];
var letterArr = [];

var headerInfo = document.getElementById('headerInfo');
var canvasDiv = document.getElementById('canvasDiv');

var canvas = document.getElementById('canvas');
canvas.width = 440;
canvas.height = 710;

var ctx = canvas.getContext('2d');
ctx.lineWidth = 2;
ctx.lineCap = "butt";

addStringToLetterArr('Enter the password to get in...');

drawRect(5, 5, 430, 695);

drawRect(45, 50, 350, 100);

drawRect(45, 190, 100, 100);
drawRect(170, 190, 100, 100);
drawRect(295, 190, 100, 100);

drawRect(45, 315, 100, 100);
drawRect(170, 315, 100, 100);
drawRect(295, 315, 100, 100);

drawRect(45, 440, 100, 100);
drawRect(170, 440, 100, 100);
drawRect(295, 440, 100, 100);

drawRect(170, 565, 100, 100);

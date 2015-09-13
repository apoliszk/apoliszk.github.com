// =================Class KindleScreen Begin=================
function KindleScreen(kindle, rootDiv) {
    this.kindle = kindle;
    this.rootDiv = rootDiv;

    this.pwdPanelDiv = this.createScreenPwdPanelDiv();
    this.screenLockDiv = this.createScreenLockDiv();
    this.pageMaskDiv = this.createPageMaskDiv();
    this.pageTopDiv = this.createPageDiv();
    this.pageBottomDiv = this.createPageDiv();

    rootDiv.appendChild(this.pageBottomDiv);
    rootDiv.appendChild(this.pageTopDiv);
    rootDiv.appendChild(this.pageMaskDiv);
    rootDiv.appendChild(this.screenLockDiv);
    rootDiv.appendChild(this.pwdPanelDiv);

    this.curPageIndex = 0;
    this.pageData = [{
        src: 'pages/basic.html'
    }, {
        src: 'pages/education.html'
    }, {
        src: 'pages/skills.html'
    }, {
        src: 'pages/work in hillstone.html'
    }, {
        src: 'pages/work in zhongying.html'
    }, {
        src: 'pages/thanks.html'
    }];
    this.curPageDiv = this.pageTopDiv;
    this.idlePageDiv = this.pageBottomDiv;
    this.loadCurPage();
}

KindleScreen.ACTION_TYPE = {
    NEXT_PAGE: 'NEXT_PAGE',
    PRE_PAGE: 'PRE_PAGE',
    PWD_ENTER: 'PWD_ENTER',
    PWD_CANCEL: 'PWD_CANCEL',
    LOCK: 'LOCK'
};

KindleScreen.SCREEN_LOCK_TIME = 90000;

KindleScreen.STATUS = {
    LOCKED: 'LOCKED',
    PASSWORD: 'PASSWORD',
    VIEW_PAGES: 'VIEW_PAGES'
};

KindleScreen.prototype.clearPwdInput = function(e) {
    this.pwdPanel.screen.innerHTML = '';
    this.pwdPanel.pwd = '';
};

KindleScreen.prototype.createDivForScreen = function() {
    var div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.position = 'absolute';
    div.style.left = '0px';
    div.style.top = '0px';
    return div;
};

KindleScreen.prototype.createPageDiv = function() {
    var div = this.createDivForScreen();
    div.style.opacity = 0;
    div.style.transition = 'opacity 1s ease-in-out';
    div.addEventListener('transitionend', wrapFunction(this.elementTrasitionEndHandler, this));

    var iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    div.appendChild(iframe);

    return div;
};

KindleScreen.prototype.createPageMaskDiv = function() {
    var div = this.createDivForScreen();
    div.style.background = '#rgba(0, 0, 0, 0)';
    return div;
};

KindleScreen.prototype.createScreenLockDiv = function() {
    var div = this.createDivForScreen();
    div.style.opacity = 0;
    div.style.background = 'url(screen_lock.gif) center no-repeat';
    div.style.transition = 'opacity 1s ease-in-out';
    div.addEventListener('transitionend', wrapFunction(this.elementTrasitionEndHandler, this));
    return div;
};

KindleScreen.prototype.createScreenPwdPanelDiv = function() {
    this.pwdPanel = {};

    var PANEL_WIDTH = Kindle.SCREEN_WIDTH * .7;
    var PANEL_HEIGHT = Kindle.SCREEN_HEIGHT * .5;
    var PANEL_BORDER_RADIUS = 8;
    var PANEL_BACKGROUND = '#fff';
    var FONT_SIZE = 20;
    var MAIN_BORDER = '2px solid #000';
    var SUB_BORDER = '1px solid #000';
    var HEADER_HORIZONTAL_PADDING = 10;
    var HEADER_HEIGHT = 8 * 2 + FONT_SIZE;

    var CONTENT_PADDING = 15;
    var SCREEN_HEIGHT = HEADER_HEIGHT;
    var SCREEN_PADDING = 8;

    var BUTTON_GAP = 4;
    var BUTTON_BORDER_RADIUS = 4;
    var BUTTON_BORDER_WIDTH = 1;
    var BUTTON_BORDER = BUTTON_BORDER_WIDTH + 'px solid #000';
    var BUTTON_BORDER_BOTTOM_WIDTH = 3;
    var BUTTON_BOTTOM_BORDER = BUTTON_BORDER_BOTTOM_WIDTH + 'px solid #000';
    var BUTTON_WIDTH = (PANEL_WIDTH - CONTENT_PADDING * 2 - BUTTON_GAP * 2 - BUTTON_BORDER_WIDTH * 6) / 3;
    var BUTTON_HEIGHT = (PANEL_HEIGHT - HEADER_HEIGHT - CONTENT_PADDING * 3 - SCREEN_HEIGHT - BUTTON_GAP * 3 - BUTTON_BORDER_WIDTH * 4 - BUTTON_BORDER_BOTTOM_WIDTH * 4) / 4;

    var div = this.createDivForScreen();

    div.style.visibility = 'hidden';
    div.style.background = 'rgba(0, 0, 0, 0)';

    var panel = document.createElement('div');
    panel.style.fontSize = FONT_SIZE + 'px';
    panel.style.position = 'relative';
    panel.style.width = PANEL_WIDTH + 'px';
    panel.style.height = PANEL_HEIGHT + 'px';
    panel.style.border = MAIN_BORDER;
    panel.style.borderRadius = PANEL_BORDER_RADIUS + 'px';
    panel.style.background = PANEL_BACKGROUND;
    panel.style.left = (Kindle.SCREEN_WIDTH - PANEL_WIDTH) / 2 + 'px';
    panel.style.top = (Kindle.SCREEN_HEIGHT - PANEL_HEIGHT) / 2 + 'px';
    div.appendChild(panel);

    var panelHeader = document.createElement('div');

    this.pwdPanel.closeBtn = document.createElement('div');
    this.pwdPanel.closeBtn.innerHTML = '×';
    this.pwdPanel.closeBtn.className = 'button';
    this.pwdPanel.closeBtn.style.width = HEADER_HEIGHT + 'px';
    this.pwdPanel.closeBtn.style.lineHeight = HEADER_HEIGHT + 'px';
    this.pwdPanel.closeBtn.style.textAlign = 'center';
    this.pwdPanel.closeBtn.style.float = 'right';
    this.pwdPanel.closeBtn.addEventListener('click', wrapFunction(this.pwdPanelMouseClickHandler, this));
    panelHeader.appendChild(this.pwdPanel.closeBtn);

    this.pwdPanel.title = document.createElement('div');
    this.pwdPanel.title.style.paddingLeft = HEADER_HORIZONTAL_PADDING + 'px';
    this.pwdPanel.title.style.borderBottom = MAIN_BORDER;
    this.pwdPanel.title.style.lineHeight = HEADER_HEIGHT + 'px';
    panelHeader.appendChild(this.pwdPanel.title);

    var panelContent = document.createElement('div');

    this.pwdPanel.screen = document.createElement('div');
    this.pwdPanel.screen.style.margin = CONTENT_PADDING + 'px';
    this.pwdPanel.screen.style.border = SUB_BORDER;
    this.pwdPanel.screen.style.height = SCREEN_HEIGHT + 'px';
    this.pwdPanel.screen.style.lineHeight = SCREEN_HEIGHT + 'px';
    this.pwdPanel.screen.style.padding = '0px ' + SCREEN_PADDING + 'px';
    this.pwdPanel.screen.style.marginBottom = CONTENT_PADDING + 'px';
    panelContent.appendChild(this.pwdPanel.screen);

    var btnArr = [{
        label: '1',
        id: 'btn1'
    }, {
        label: '2',
        id: 'btn2'
    }, {
        label: '3',
        id: 'btn3'
    }, {
        label: '4',
        id: 'btn4'
    }, {
        label: '5',
        id: 'btn5'
    }, {
        label: '6',
        id: 'btn6'
    }, {
        label: '7',
        id: 'btn7'
    }, {
        label: '8',
        id: 'btn8'
    }, {
        label: '9',
        id: 'btn9'
    }, {
        label: '◁',
        id: 'btnDel'
    }, {
        label: '0',
        id: 'btn0'
    }, {
        label: '确定',
        id: 'btnOk'
    }];

    for (var i = 0, len = btnArr.length; i < len; i++) {
        var btn = document.createElement('div');
        btn.className = 'button';
        btn.style.float = 'left';
        btn.style.border = BUTTON_BORDER;
        btn.style.borderBottom = BUTTON_BOTTOM_BORDER;
        btn.style.borderRadius = BUTTON_BORDER_RADIUS + 'px';
        btn.style.width = BUTTON_WIDTH + 'px';
        btn.style.height = BUTTON_HEIGHT + 'px';
        if (i % 3 < 2) {
            btn.style.marginRight = BUTTON_GAP + 'px';
        }
        if (i % 3 == 0) {
            btn.style.clear = 'left';
            btn.style.marginLeft = CONTENT_PADDING + 'px';
        }
        btn.style.marginBottom = BUTTON_GAP + 'px';
        btn.style.lineHeight = BUTTON_HEIGHT + 'px';
        btn.style.textAlign = 'center';
        btn.addEventListener('click', wrapFunction(this.pwdPanelMouseClickHandler, this));
        btn.innerHTML = btnArr[i].label;
        this.pwdPanel[btnArr[i].id] = btn;
        panelContent.appendChild(btn);
    }

    panel.appendChild(panelHeader);
    panel.appendChild(panelContent);

    this.resetPwdPanel();

    return div;
};

KindleScreen.prototype.elementTrasitionEndHandler = function(e) {
    e.target.transitionEnd = true;
    if (e.target === this.curPageDiv) {
        this.loadNextPageInAdvance();
    }
};

KindleScreen.prototype.handleUserInteract = function(type) {
    if (!this.skipHandleUserInteract()) {
        if (this.currentStatus === KindleScreen.STATUS.LOCKED) {
            this.showPasswordPanel();
        } else if (this.currentStatus === KindleScreen.STATUS.PASSWORD) {
            if (type === KindleScreen.ACTION_TYPE.PWD_ENTER) {
                /* TODO
                 * Github个人主页只能放静态页面
                 * 实际应该去后台校验密码是否正确，并且iframe请求页面时应该做合法性检查
                 * 目前象征性的做一下检查，防人力不防程序员
                 */
                if (this.pwdPanel.pwd == '908330') {
                    this.hidePasswordPanel();
                    this.hideScreenLock();
                    this.showPage();
                } else {
                    this.pwdPanel.title.innerHTML = '密码错误';
                    this.clearPwdInput();
                }
            } else if (type === KindleScreen.ACTION_TYPE.PWD_CANCEL) {
                this.hidePasswordPanel();
            }
        } else if (this.currentStatus === KindleScreen.STATUS.VIEW_PAGES) {
            if (type === KindleScreen.ACTION_TYPE.NEXT_PAGE) {
                this.showNextPage();
            } else if (type === KindleScreen.ACTION_TYPE.PRE_PAGE) {
                this.showPrePage();
            } else if (type === KindleScreen.ACTION_TYPE.LOCK) {
                this.showScreenLock();
            }
        }
    }
    if (this.currentStatus === KindleScreen.STATUS.VIEW_PAGES) {
        if (this.lockScreenTimeoutId) {
            clearTimeout(this.lockScreenTimeoutId);
            this.lockScreenTimeoutId = 0;
        }
        this.lockScreenTimeoutId = setTimeout(wrapFunction(this.showScreenLock, this), KindleScreen.SCREEN_LOCK_TIME);
    }
};

KindleScreen.prototype.hidePasswordPanel = function() {
    this.kindle.addAction({
        type: 'hideDiv',
        prop: 'visibility',
        element: this.pwdPanelDiv
    });
    this.currentStatus = KindleScreen.STATUS.LOCKED;
};

KindleScreen.prototype.hideScreenLock = function() {
    this.kindle.addAction({
        type: 'hideDiv',
        prop: 'opacity',
        element: this.screenLockDiv
    });
    this.currentStatus = KindleScreen.STATUS.VIEW_PAGES;
};

KindleScreen.prototype.loadCurPage = function() {
    console.log('loadCurPage ' + this.pageData[this.curPageIndex].src);
    this.curPageDiv.children[0].src = this.pageData[this.curPageIndex].src;
};

KindleScreen.prototype.loadNextPageInAdvance = function() {
    if (this.curPageIndex < this.pageData.length - 1) {
        console.log('loadNextPageInAdvance ' + this.pageData[this.curPageIndex + 1].src);
        this.idlePageDiv.children[0].src = this.pageData[this.curPageIndex + 1].src;
    }
};

KindleScreen.prototype.pwdPanelMouseClickHandler = function(e) {
    if (e.target === this.pwdPanel.closeBtn) {
        this.handleUserInteract(KindleScreen.ACTION_TYPE.PWD_CANCEL);
    } else if (e.target === this.pwdPanel.btnOk) {
        this.handleUserInteract(KindleScreen.ACTION_TYPE.PWD_ENTER);
    } else if (e.target === this.pwdPanel.btnDel) {
        var text = this.pwdPanel.screen.innerHTML;
        if (text.length > 0) {
            this.pwdPanel.screen.innerHTML = text.substring(0, text.length - 1);
            var pwd = this.pwdPanel.pwd;
            this.pwdPanel.pwd = pwd.substring(0, pwd.length - 1);
        }
    } else {
        var text = this.pwdPanel.screen.innerHTML;
        if (text.length < 14) {
            this.pwdPanel.screen.innerHTML = text + '●';
            this.pwdPanel.pwd += e.target.innerHTML;
        }
    }
    e.stopPropagation();
};

KindleScreen.prototype.resetPwdPanel = function(e) {
    this.pwdPanel.title.innerHTML = '输入密码';
    this.clearPwdInput();
};

KindleScreen.prototype.showNextPage = function() {
    if (this.curPageIndex < this.pageData.length - 1) {
        this.curPageIndex++;
        this.swapIdleAndCurrentPage();
        this.showPage();
    }
};

KindleScreen.prototype.showPrePage = function() {
    if (this.curPageIndex > 0) {
        this.curPageIndex--;
        this.swapIdleAndCurrentPage();
        this.showPage();
    }
};

KindleScreen.prototype.showPage = function() {
    this.loadCurPage();
    this.kindle.addAction({
        type: 'showDiv',
        prop: 'opacity',
        element: this.curPageDiv
    });
    this.kindle.addAction({
        type: 'hideDiv',
        prop: 'opacity',
        element: this.idlePageDiv
    });
    this.currentStatus = KindleScreen.STATUS.VIEW_PAGES;
};

KindleScreen.prototype.showPasswordPanel = function() {
    this.resetPwdPanel();
    this.kindle.addAction({
        type: 'showDiv',
        prop: 'visibility',
        element: this.pwdPanelDiv
    });
    this.currentStatus = KindleScreen.STATUS.PASSWORD;
};

KindleScreen.prototype.showScreenLock = function() {
    this.kindle.addAction({
        type: 'showDiv',
        prop: 'opacity',
        element: this.screenLockDiv
    });
    this.currentStatus = KindleScreen.STATUS.LOCKED;
};

KindleScreen.prototype.skipHandleUserInteract = function() {
    if (this.kindle.actionArr.length > 0) {
        console.log('has action, skip handle user interaction');
        return true;
    }
    if (this.screenLockDiv.transitionEnd === false || this.pageTopDiv.transitionEnd === false || this.pageBottomDiv.transition === false) {
        console.log('has transition, skip handle user interaction');
        return true;
    }
    return false;
};

KindleScreen.prototype.swapIdleAndCurrentPage = function() {
    var temp = this.curPageDiv;
    this.curPageDiv = this.idlePageDiv;
    this.idlePageDiv = temp;
};
// =================Class KindleScreen End=================

// =================Class Kindle Begin=================
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
    }
    // =================Class Kindle End=================

// =================Global Function Begin=================
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
// =================Global Function End=================

// =================Application Start=================
window.onload = function() {
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
};

window.onresize = function() {
    if (kindle && kindle.ctx) {
        kindle.putToCenter();
        kindle.placeDivs();
    }
};

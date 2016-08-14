function KindleScreen(kindle, rootDiv) {
    this.kindle = kindle;
    this.rootDiv = rootDiv;

    this.pwdPanelDiv = this.createScreenPwdPanelDiv();
    this.screenLockDiv = this.createScreenLockDiv();
    this.pageMaskDiv = this.createPageMaskDiv();
    this.prePageDiv = this.createPageDiv();
    this.curPageDiv = this.createPageDiv();
    this.nextPageDiv = this.createPageDiv();

    rootDiv.appendChild(this.prePageDiv);
    rootDiv.appendChild(this.curPageDiv);
    rootDiv.appendChild(this.nextPageDiv);
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
    this.loadCurPage();
    this.loadNextPageInAdvance();
}

KindleScreen.ACTION_TYPE = {
    NEXT_PAGE: 'NEXT_PAGE',
    PRE_PAGE: 'PRE_PAGE',
    PWD_ENTER: 'PWD_ENTER',
    PWD_CANCEL: 'PWD_CANCEL',
    LOCK: 'LOCK'
};

KindleScreen.SCREEN_LOCK_TIME = 49000;

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

    div.iframe = document.createElement('iframe');
    div.iframe.width = '100%';
    div.iframe.height = '100%';
    div.iframe.frameBorder = '0';
    div.iframe.scrolling = 'no';
    div.iframe.onload = wrapFunction(this.iframeLoadComplete, this);
    div.appendChild(div.iframe);

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
        this.loadPrePageInAdvance();
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
                if (this.pwdPanel.pwd == '0908') {
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
    if (this.curPageDiv.index !== this.curPageIndex) {
        console.log('loadCurPage ' + this.pageData[this.curPageIndex].src);
        this.loadIframePage(this.curPageDiv, this.curPageIndex);
    }
};

KindleScreen.prototype.loadNextPageInAdvance = function() {
    if (this.curPageIndex < this.pageData.length - 1) {
        if (this.nextPageDiv.index !== this.curPageIndex + 1) {
            console.log('loadNextPageInAdvance ' + this.pageData[this.curPageIndex + 1].src);
            this.loadIframePage(this.nextPageDiv, this.curPageIndex + 1);
        }
    }
};

KindleScreen.prototype.loadPrePageInAdvance = function() {
    if (this.curPageIndex > 0) {
        if (this.prePageDiv.index !== this.curPageIndex - 1) {
            console.log('loadPrePageInAdvance ' + this.pageData[this.curPageIndex - 1].src);
            this.loadIframePage(this.prePageDiv, this.curPageIndex - 1);
        }
    }
};

KindleScreen.prototype.loadIframePage = function(frameDiv, index) {
    frameDiv.index = index;
    // remove iframe后再设置src，这样不会产生history。否则浏览器点击后退按钮，程序会出bug
    var iframe = frameDiv.iframe;
    frameDiv.removeChild(iframe);
    iframe.loading = true;
    iframe.src = this.pageData[index].src;
    frameDiv.appendChild(iframe);
};

KindleScreen.prototype.iframeLoadComplete = function(e) {
    if (e.target.src) {
        console.log('iframeLoadComplete ' + e.target.src);
        e.target.loading = false;
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
        var temp = this.curPageDiv;
        this.curPageDiv = this.nextPageDiv;
        this.nextPageDiv = this.prePageDiv;
        this.prePageDiv = temp;
        this.showPage();
    }
};

KindleScreen.prototype.showPrePage = function() {
    if (this.curPageIndex > 0) {
        this.curPageIndex--;
        var temp = this.curPageDiv;
        this.curPageDiv = this.prePageDiv;
        this.prePageDiv = this.nextPageDiv;
        this.nextPageDiv = temp;
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
        element: this.prePageDiv
    });
    this.kindle.addAction({
        type: 'hideDiv',
        prop: 'opacity',
        element: this.nextPageDiv
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
    if (this.screenLockDiv.transitionEnd === false || this.curPageDiv.transitionEnd === false || this.prePageDiv.transitionEnd === false || this.nextPageDiv.transition === false) {
        console.log('has transition, skip handle user interaction');
        return true;
    }
    if (this.curPageDiv.iframe.loading === true || this.prePageDiv.iframe.loading === true || this.nextPageDiv.iframe.loading === true) {
        console.log('iframe is loading, skip handle user interaction');
        return true;
    }
    return false;
};

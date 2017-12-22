webpackJsonp([1,4],{

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20)();
// imports


// module
exports.push([module.i, ":host {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    height: 100%;\r\n    overflow: hidden;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n}\r\n\r\nmy-img-canvas {\r\n    width: 100%;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex-positive: 1;\r\n            flex-grow: 1;\r\n    -ms-flex-negative: 1;\r\n        flex-shrink: 1;\r\n    -ms-flex-preferred-size: 0;\r\n        flex-basis: 0;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20)();
// imports


// module
exports.push([module.i, ":host {\r\n    padding: 0 1em;\r\n    /*margin-bottom: 1em;*/\r\n    box-shadow: 0 2px 8px;\r\n    color: #444;\r\n    position: relative;\r\n}\r\n\r\nh4 {\r\n    color: #888;\r\n}\r\n\r\nlabel {\r\n    color: #888;\r\n    box-shadow: 1px 1px 3px;\r\n    padding: .5em;\r\n    position: absolute;\r\n    text-align: center;\r\n    right: 1em;\r\n    bottom: 1em;\r\n    cursor: pointer;\r\n}\r\n\r\nlabel img {\r\n    width: 1.4em;\r\n    height: 1.4em;\r\n    vertical-align: sub;\r\n}\r\n\r\nlabel:hover {\r\n    background: #eee;\r\n}\r\n\r\nlabel:active {\r\n    box-shadow: 0 0 0;\r\n}\r\n\r\nlabel input {\r\n    display: none;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20)();
// imports


// module
exports.push([module.i, "canvas {\r\n    display: block;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 135:
/***/ (function(module, exports) {

module.exports = "<my-header (onSelectImage)=\"onSelectImage()\"></my-header>\r\n<my-img-canvas></my-img-canvas>"

/***/ }),

/***/ 136:
/***/ (function(module, exports) {

module.exports = "<h1>{{title}}</h1>\r\n<h4>{{subTitle}}</h4>\r\n<label>\r\n    <img src=\"assets/switch.png\" alt=\"Switch Image\">\r\n    Switch Image\r\n    <input type=\"file\" #fileInput accept=\"image/gif,image/jpg,image/jpeg,image/png,image/bmp\" (change)=\"readImage(fileInput)\">\r\n</label>"

/***/ }),

/***/ 137:
/***/ (function(module, exports) {

module.exports = "<canvas #canvas></canvas>"

/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(68);


/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FileService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var FileService = (function () {
    function FileService() {
        this.imageData = 'assets/default.png';
    }
    FileService.prototype.readFile = function (imageFile) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var fileReader = new FileReader();
            fileReader.onload = function () {
                resolve(fileReader.result);
            };
            fileReader.readAsDataURL(imageFile);
        }).then(function (data) { _this.imageData = data; });
    };
    FileService.prototype.loadImage = function (containerWidth, containerHeight) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var img = document.createElement('img');
            img.onload = function () {
                resolve(img);
            };
            img.src = _this.imageData;
        }).then(function (img) {
            var maxW = Math.min(Math.floor(containerWidth * .9), img.width);
            var maxH = Math.min(Math.floor(containerHeight * .9), img.height);
            var scale = Math.min(maxW / img.width, maxH / img.height);
            var drawWidth = Math.floor(img.width * scale);
            var drawHeight = Math.floor(img.height * scale);
            var imgCanvas = document.createElement('canvas');
            imgCanvas.width = drawWidth;
            imgCanvas.height = drawHeight;
            var imgContext = imgCanvas.getContext('2d');
            imgContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, drawWidth, drawHeight);
            return imgCanvas;
        });
    };
    return FileService;
}());
FileService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])()
], FileService);

//# sourceMappingURL=file.service.js.map

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_debounceTime__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_debounceTime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_debounceTime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__file_service__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_part_service__ = __webpack_require__(76);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImgCanvasComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ImgCanvasComponent = (function () {
    function ImgCanvasComponent(fileService, imgPartService) {
        this.fileService = fileService;
        this.imgPartService = imgPartService;
        this.resizeSubject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
        this._isDirty = false;
    }
    Object.defineProperty(ImgCanvasComponent.prototype, "imgParts", {
        get: function () {
            return this._imgParts;
        },
        set: function (value) {
            this._imgParts = value;
            this._isDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    ImgCanvasComponent.prototype.imgChangeHandler = function () {
        this.fadeOutOldImg();
    };
    ImgCanvasComponent.prototype.fadeInNewImg = function () {
        var _this = this;
        this.loadImg().then(function () {
            _this.imgParts = _this.imgPartService.fadeInParts(_this.makeParts());
        });
    };
    ImgCanvasComponent.prototype.fadeOutOldImg = function () {
        this.imgParts = this.imgPartService.fadeOutParts(this.imgParts);
    };
    ImgCanvasComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.canvas = this.canvasRef.nativeElement;
        this.context = this.canvas.getContext('2d');
        this.shadowCanvas = document.createElement('canvas');
        this.shadowContext = this.shadowCanvas.getContext('2d');
        this.resetCanvasSize();
        this.fadeInNewImg();
        this.startAnimation();
        this.resizeSubject.debounceTime(300).subscribe(function () {
            _this.resetCanvasSize();
            _this.fadeInNewImg();
        });
    };
    ImgCanvasComponent.prototype.startAnimation = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            if (_this.isDirty()) {
                _this.draw();
            }
            _this.startAnimation();
        });
    };
    ImgCanvasComponent.prototype.isDirty = function () {
        if (!this.imgParts)
            return false;
        var result = false;
        if (this._isDirty) {
            this._isDirty = false;
            result = true;
        }
        if (this.imgPartService.animateParts(this.imgParts)) {
            result = true;
        }
        return result;
    };
    ImgCanvasComponent.prototype.onResize = function (event) {
        this.resizeSubject.next('resize');
    };
    ImgCanvasComponent.prototype.onMouseMove = function (event) {
        var rect = this.canvas.getBoundingClientRect();
        this.imgPartService.setMousePosition(event.clientX - rect.left, event.clientY - rect.top);
    };
    ImgCanvasComponent.prototype.resetCanvasSize = function () {
        this.shadowCanvas.width = this.canvas.width = Math.floor(this.canvas.parentElement.clientWidth);
        this.shadowCanvas.height = this.canvas.height = Math.floor(this.canvas.parentElement.clientHeight);
    };
    ImgCanvasComponent.prototype.makeParts = function () {
        var offsetX = (this.canvas.width - this.imgCanvas.width) >> 1;
        var offsetY = (this.canvas.height - this.imgCanvas.height) >> 1;
        return this.imgPartService.makeParts(this.imgCanvas.width, this.imgCanvas.height, offsetX, offsetY);
    };
    ImgCanvasComponent.prototype.loadImg = function () {
        var _this = this;
        return this.fileService.loadImage(this.canvas.width, this.canvas.height).then(function (imgCanvas) {
            _this.imgCanvas = imgCanvas;
        });
    };
    ImgCanvasComponent.prototype.draw = function () {
        this.shadowContext.fillStyle = '#fff';
        this.shadowContext.fillRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
        var partsAllDead = true;
        for (var i = 0; i < this.imgParts.length; i++) {
            var part = this.imgParts[i];
            if (this.imgPartService.isPartAlive(part)) {
                partsAllDead = false;
                if (this.imgPartService.isInsideCanvas(part, this.canvas)) {
                    this.shadowContext.drawImage(this.imgCanvas, part.offsetX, part.offsetY, part.width, part.height, part.canvasOffsetX, part.canvasOffsetY, part.width, part.height);
                }
            }
        }
        if (partsAllDead) {
            this.fadeInNewImg();
        }
        this.context.drawImage(this.shadowCanvas, 0, 0);
    };
    return ImgCanvasComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* ViewChild */])('canvas'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* ElementRef */]) === "function" && _a || Object)
], ImgCanvasComponent.prototype, "canvasRef", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* HostListener */])('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImgCanvasComponent.prototype, "onResize", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* HostListener */])('window:mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImgCanvasComponent.prototype, "onMouseMove", null);
ImgCanvasComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'my-img-canvas',
        template: __webpack_require__(137),
        styles: [__webpack_require__(133)],
        providers: [__WEBPACK_IMPORTED_MODULE_4__img_part_service__["a" /* ImgPartService */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__file_service__["a" /* FileService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__file_service__["a" /* FileService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__img_part_service__["a" /* ImgPartService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__img_part_service__["a" /* ImgPartService */]) === "function" && _c || Object])
], ImgCanvasComponent);

var _a, _b, _c;
//# sourceMappingURL=img-canvas.component.js.map

/***/ }),

/***/ 67:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 67;


/***/ }),

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment_prod__ = __webpack_require__(77);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment_prod__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 73:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__img_canvas_component__ = __webpack_require__(49);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent.prototype.onSelectImage = function () {
        this.canvas.imgChangeHandler();
    };
    return AppComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__img_canvas_component__["a" /* ImgCanvasComponent */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__img_canvas_component__["a" /* ImgCanvasComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__img_canvas_component__["a" /* ImgCanvasComponent */]) === "function" && _a || Object)
], AppComponent.prototype, "canvas", void 0);
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(135),
        styles: [__webpack_require__(131)]
    })
], AppComponent);

var _a;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 74:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__header_component__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__img_canvas_component__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__file_service__ = __webpack_require__(29);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_3__header_component__["a" /* HeaderComponent */],
            __WEBPACK_IMPORTED_MODULE_4__img_canvas_component__["a" /* ImgCanvasComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_5__file_service__["a" /* FileService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 75:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_service__ = __webpack_require__(29);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HeaderComponent = (function () {
    function HeaderComponent(fileService) {
        this.fileService = fileService;
        this.title = 'Blast the image';
        this.subTitle = 'Roll over the image bellow to see the effect';
        this.onSelectImage = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* EventEmitter */]();
    }
    HeaderComponent.prototype.readImage = function (fileInput) {
        var _this = this;
        this.fileService.readFile(fileInput.files[0]).then(function () { _this.onSelectImage.emit(); });
    };
    return HeaderComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_1" /* Output */])(),
    __metadata("design:type", Object)
], HeaderComponent.prototype, "onSelectImage", void 0);
HeaderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'my-header',
        template: __webpack_require__(136),
        styles: [__webpack_require__(132)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__file_service__["a" /* FileService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__file_service__["a" /* FileService */]) === "function" && _a || Object])
], HeaderComponent);

var _a;
//# sourceMappingURL=header.component.js.map

/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImgPartService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var PART_WIDTH = 10;
var PART_HEIGHT = 10;
var FADEIN_DURATION = 12;
var FADEOUT_DURATION = 36;
var MOUSE_EFFECT_RADIUS = 100;
var BACK_TO_ORIGIN_FRACTION = .9;
var MOVE_TO_MOUSE_FRACTION = 1;
var ImgPartService = (function () {
    function ImgPartService() {
    }
    ImgPartService.prototype.setMousePosition = function (x, y) {
        this.mouseX = Math.round(x);
        this.mouseY = Math.round(y);
    };
    ImgPartService.prototype.makeParts = function (w, h, offsetX, offsetY) {
        var parts = [];
        var columns = Math.ceil(w / PART_WIDTH);
        var rows = Math.ceil(h / PART_HEIGHT);
        for (var i = 0; i < rows; i++) {
            var y = i * PART_HEIGHT;
            for (var j = 0; j < columns; j++) {
                var x = j * PART_WIDTH;
                var canvasX = x + offsetX;
                var canvasY = y + offsetY;
                parts.push({
                    offsetX: x,
                    offsetY: y,
                    width: PART_WIDTH,
                    height: PART_HEIGHT,
                    canvasOffsetX: canvasX,
                    canvasOffsetY: canvasY,
                    canvasOriginOffsetX: canvasX,
                    canvasOriginOffsetY: canvasY,
                    vx: 0,
                    vy: 0
                });
            }
        }
        return parts;
    };
    ImgPartService.prototype.fadeOutParts = function (parts) {
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            part.life = Math.floor(Math.random() * FADEOUT_DURATION);
            part.vx = Math.floor((Math.random() - .5) * 50);
            part.vy = Math.floor((Math.random() - .5) * 30);
            part.canvasOriginOffsetX = part.canvasOriginOffsetX + part.vx / 4 * FADEOUT_DURATION;
            part.canvasOriginOffsetY = 1000;
        }
        return parts;
    };
    ImgPartService.prototype.fadeInParts = function (parts) {
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            part.birth = Math.floor(Math.random() * FADEIN_DURATION);
            part.canvasOffsetY = 1000;
            part.vx = Math.floor((Math.random() - .5) * 100);
        }
        return parts;
    };
    ImgPartService.prototype.animateParts = function (parts) {
        var changed = false;
        for (var i = 0; i < parts.length; i++) {
            if (this.animatePart(parts[i]))
                changed = true;
        }
        return changed;
    };
    ImgPartService.prototype.animatePart = function (part) {
        var animated = false;
        // fadein
        if (part.birth != undefined && part.birth > 0) {
            part.birth--;
            if (part.birth <= 0) {
                animated = true;
            }
        }
        // fadeout
        if (part.life != undefined && part.life > 0) {
            part.life--;
            if (part.life <= 0) {
                animated = true;
            }
        }
        // move
        if (this.movePart(part))
            animated = true;
        return animated;
    };
    ImgPartService.prototype.movePart = function (part) {
        var animated = false;
        var fraction;
        if (this.mouseX != undefined && this.distant(part.canvasOffsetX, part.canvasOffsetY, this.mouseX, this.mouseY) < MOUSE_EFFECT_RADIUS) {
            // move to target
            fraction = 1;
            var distantToMouse = this.distant(part.canvasOffsetX, part.canvasOffsetY, this.mouseX, this.mouseY);
            if (distantToMouse == 0)
                return false;
            part.vx += (this.mouseX - part.canvasOffsetX) / distantToMouse;
            part.vy += (this.mouseY - part.canvasOffsetY) / distantToMouse;
            part.vx *= fraction;
            part.vy *= fraction;
            part.canvasOffsetX += part.vx;
            part.canvasOffsetY += part.vy;
            return true;
        }
        else {
            // move to orgin
            fraction = .9;
            var distantToOrigin = this.distant(part.canvasOffsetX, part.canvasOffsetY, part.canvasOriginOffsetX, part.canvasOriginOffsetY);
            if (distantToOrigin == 0) {
                return false;
            }
            else if (distantToOrigin < 1) {
                part.canvasOffsetX = part.canvasOriginOffsetX;
                part.canvasOffsetY = part.canvasOriginOffsetY;
                return true;
            }
            part.vx += (part.canvasOriginOffsetX - part.canvasOffsetX) / distantToOrigin;
            part.vy += (part.canvasOriginOffsetY - part.canvasOffsetY) / distantToOrigin;
            part.vx *= fraction;
            part.vy *= fraction;
            part.canvasOffsetX += part.vx;
            part.canvasOffsetY += part.vy;
            return true;
        }
    };
    ImgPartService.prototype.distant = function (x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    };
    ImgPartService.prototype.isPartAlive = function (part) {
        var isBorn = part.birth == undefined || part.birth <= 0;
        var isDead = part.life != undefined && part.life <= 0;
        return isBorn && !isDead;
    };
    ImgPartService.prototype.isInsideCanvas = function (part, canvas) {
        return part.canvasOffsetX > 0 && part.canvasOffsetX < canvas.width
            && part.canvasOffsetY > 0 && part.canvasOffsetY < canvas.height;
    };
    return ImgPartService;
}());
ImgPartService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])()
], ImgPartService);

//# sourceMappingURL=img-part.service.js.map

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: true
};
//# sourceMappingURL=environment.prod.js.map

/***/ })

},[168]);
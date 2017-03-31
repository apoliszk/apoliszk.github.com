(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Calculator = (function () {
    function Calculator(config) {
        this.config = config;
        var taxConfig = config.tax;
        for (var i = 0; i < taxConfig.length; i++) {
            var adjust = 0;
            var curConf = taxConfig[i];
            for (var j = i + 1; j < taxConfig.length; j++) {
                adjust += (taxConfig[j].max - taxConfig[j].min) * (curConf.ratio - taxConfig[j].ratio);
            }
            curConf.adjust = adjust;
        }
        for (var i = 0; i < taxConfig.length; i++) {
            var curConf = taxConfig[i];
            curConf.minInsuranceAndTaxAfter = this.caculateInsuranceAndTaxAfter(curConf.min);
        }
    }
    Calculator.prototype.caculateInsuranceAndTaxAfter = function (total) {
        var sumPersonalRatio = this.getSum(this.config.personal.ratio);
        var sumPersonalExtra = this.getSum(this.config.personal.extra);
        var insuranceAfter = total * (1 - sumPersonalRatio) - sumPersonalExtra;
        var taxConfig = this.config.tax;
        var tax = 0;
        for (var i = 0; i < taxConfig.length; i++) {
            var curConf = taxConfig[i];
            if (insuranceAfter >= curConf.min) {
                tax = insuranceAfter * curConf.ratio - curConf.adjust;
                break;
            }
        }
        return parseFloat((insuranceAfter - tax).toFixed(2));
    };
    Calculator.prototype.getDetail = function (total) {
        var sumPersonalRatio = this.getSum(this.config.personal.ratio);
        var sumPersonalExtra = this.getSum(this.config.personal.extra);
        var insuranceAfter = total * (1 - sumPersonalRatio) - sumPersonalExtra;
        var taxConfig = this.config.tax;
        var tax = 0;
        for (var i = 0; i < taxConfig.length; i++) {
            var curConf = taxConfig[i];
            if (insuranceAfter >= curConf.min) {
                tax = insuranceAfter * curConf.ratio - curConf.adjust;
                break;
            }
        }
        var str = '明细<br>';
        str += '<br>个人缴纳<br>';
        str += '&nbsp;&nbsp;缴税￥' + tax + '<br>';
        for (var i = 0; i < this.config.personal.ratio.length; i++) {
            var item = this.config.personal.ratio[i];
            str += '&nbsp;&nbsp;' + item.type + '【' + (item.value * 100) + '%】' + '￥' + (total * item.value) + '<br>';
        }
        str += '<br>公司缴纳<br>';
        for (var i = 0; i < this.config.company.ratio.length; i++) {
            var item = this.config.company.ratio[i];
            str += '&nbsp;&nbsp;' + item.type + '【' + (item.value * 100) + '%】' + '￥' + (total * item.value) + '<br>';
        }
        return str;
    };
    Calculator.prototype.getSum = function (arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i].value;
        }
        return sum;
    };
    Calculator.prototype.caculateInsuranceAndTaxBefore = function (total) {
        var taxConfig = this.config.tax;
        var beforeTax = total;
        for (var i = 0; i < taxConfig.length; i++) {
            var curConf = taxConfig[i];
            if (total >= curConf.minInsuranceAndTaxAfter) {
                beforeTax = (total - curConf.adjust) / (1 - curConf.ratio);
                break;
            }
        }
        var sumPersonalRatio = this.getSum(this.config.personal.ratio);
        var sumPersonalExtra = this.getSum(this.config.personal.extra);
        return parseFloat(((beforeTax + sumPersonalExtra) / (1 - sumPersonalRatio)).toFixed(2));
    };
    return Calculator;
}());
exports.Calculator = Calculator;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calculator_1 = require("./calculator");
var calc = new calculator_1.Calculator({
    personal: {
        ratio: [{
                type: '社会保险',
                value: .08
            }, {
                type: '医疗保险',
                value: .02
            }, {
                type: '失业保险',
                value: .005
            }, {
                type: '住房公积金',
                value: .12
            }],
        extra: []
    },
    company: {
        ratio: [{
                type: '社会保险',
                value: .2
            }, {
                type: '医疗保险',
                value: .08
            }, {
                type: '失业保险',
                value: .015
            }, {
                type: '生育保险',
                value: .005
            }, {
                type: '住房公积金',
                value: .12
            }],
        extra: []
    },
    tax: [
        { min: 83500, max: Number.MAX_VALUE, ratio: .45 },
        { min: 58500, max: 83500, ratio: .35 },
        { min: 38500, max: 58500, ratio: .30 },
        { min: 12500, max: 38500, ratio: .25 },
        { min: 9000, max: 12500, ratio: .2 },
        { min: 5000, max: 9000, ratio: .1 },
        { min: 3500, max: 5000, ratio: .03 },
        { min: 0, max: 3500, ratio: 0 }
    ]
});
var serverSentenceIndex = 0;
var serverSentences = [
    '请选择计算类型<br>输入“1”税前计算税后<br>输入“2”税后计算税前',
    '请输入金额',
    '您的$type工资为￥$amount'
];
var clientInfo;
var screen = document.querySelector('.screen');
var clientInput = document.querySelector('#clientInput');
var clientSend = document.querySelector('#clientSend');
var clientReset = document.querySelector('#clientReset');
clientInput.addEventListener('keydown', function (e) {
    var key = e.key;
    if (key.toLocaleLowerCase() == 'enter')
        clientPlay();
    if (key.toLocaleLowerCase() != 'backspace' && isNaN(parseFloat(key)))
        e.preventDefault();
});
clientReset.addEventListener('click', resetGame);
clientSend.addEventListener('click', clientPlay);
function resetGame() {
    serverSentenceIndex = 0;
    clientInfo = [];
    screen.innerHTML = '';
    serverPlay();
}
function serverPlay() {
    var serverSentence = serverSentences[serverSentenceIndex++];
    var type;
    var amount;
    if (serverSentence.indexOf('$') > 0) {
        if (clientInfo[0] == 1) {
            type = '税后';
            amount = calc.caculateInsuranceAndTaxAfter(clientInfo[1]);
        }
        else {
            type = '税前';
            amount = calc.caculateInsuranceAndTaxBefore(clientInfo[1]);
        }
        serverSentence = serverSentence.replace('$type', type);
        serverSentence = serverSentence.replace('$amount', amount + '');
    }
    var html = "<div class=\"chat server\"><p>" + serverSentence + "</p></div>";
    screen.innerHTML += html;
    if (serverSentenceIndex >= serverSentences.length) {
        var detail = void 0;
        if (type == '税前') {
            detail = calc.getDetail(amount);
        }
        else {
            detail = calc.getDetail(clientInfo[1]);
        }
        showServerSentence(detail);
        showServerSentence('点击重置按钮重新查询');
    }
}
function showServerSentence(serverSentence) {
    var html = "<div class=\"chat server\"><p>" + serverSentence + "</p></div>";
    screen.innerHTML += html;
}
function clientPlay() {
    var input = clientInput.value;
    if (input == '' || serverSentenceIndex >= serverSentences.length)
        return;
    var html = "<div class=\"chat client\"><p>" + input + "</p></div>";
    screen.innerHTML += html;
    clientInfo.push(parseFloat(input));
    serverPlay();
    clientInput.value = '';
}
resetGame();
},{"./calculator":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9jYWxjdWxhdG9yLnRzIiwidHMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFDSSxvQkFBb0IsTUFBcUI7UUFBckIsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUNyQyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzVDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0YsQ0FBQztZQUNELE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzVCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN4QyxJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyw0QkFBNEIs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bnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgY2xhc3MgQ2FsY3VsYXRvciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogQ29uZmlndXJhdGlvbikge1xyXG4gICAgICAgIGxldCB0YXhDb25maWcgPSBjb25maWcudGF4O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGF4Q29uZmlnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBhZGp1c3QgPSAwO1xyXG4gICAgICAgICAgICBsZXQgY3VyQ29uZiA9IHRheENvbmZpZ1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGF4Q29uZmlnLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBhZGp1c3QgKz0gKHRheENvbmZpZ1tqXS5tYXggLSB0YXhDb25maWdbal0ubWluKSAqIChjdXJDb25mLnJhdGlvIC0gdGF4Q29uZmlnW2pdLnJhdGlvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXJDb25mLmFkanVzdCA9IGFkanVzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXhDb25maWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGN1ckNvbmYgPSB0YXhDb25maWdbaV07XHJcbiAgICAgICAgICAgIGN1ckNvbmYubWluSW5zdXJhbmNlQW5kVGF4QWZ0ZXIgPSB0aGlzLmNhY3VsYXRlSW5zdXJhbmNlQW5kVGF4QWZ0ZXIoY3VyQ29uZi5taW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYWN1bGF0ZUluc3VyYW5jZUFuZFRheEFmdGVyKHRvdGFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBzdW1QZXJzb25hbFJhdGlvID0gdGhpcy5nZXRTdW0odGhpcy5jb25maWcucGVyc29uYWwucmF0aW8pO1xyXG4gICAgICAgIGxldCBzdW1QZXJzb25hbEV4dHJhID0gdGhpcy5nZXRTdW0odGhpcy5jb25maWcucGVyc29uYWwuZXh0cmEpO1xyXG4gICAgICAgIGxldCBpbnN1cmFuY2VBZnRlciA9IHRvdGFsICogKDEgLSBzdW1QZXJzb25hbFJhdGlvKSAtIHN1bVBlcnNvbmFsRXh0cmE7XHJcblxyXG4gICAgICAgIGxldCB0YXhDb25maWcgPSB0aGlzLmNvbmZpZy50YXg7XHJcbiAgICAgICAgbGV0IHRheCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXhDb25maWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGN1ckNvbmYgPSB0YXhDb25maWdbaV07XHJcbiAgICAgICAgICAgIGlmIChpbnN1cmFuY2VBZnRlciA+PSBjdXJDb25mLm1pbikge1xyXG4gICAgICAgICAgICAgICAgdGF4ID0gaW5zdXJhbmNlQWZ0ZXIgKiBjdXJDb25mLnJhdGlvIC0gY3VyQ29uZi5hZGp1c3Q7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCgoaW5zdXJhbmNlQWZ0ZXIgLSB0YXgpLnRvRml4ZWQoMikpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERldGFpbCh0b3RhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHN1bVBlcnNvbmFsUmF0aW8gPSB0aGlzLmdldFN1bSh0aGlzLmNvbmZpZy5wZXJzb25hbC5yYXRpbyk7XHJcbiAgICAgICAgbGV0IHN1bVBlcnNvbmFsRXh0cmEgPSB0aGlzLmdldFN1bSh0aGlzLmNvbmZpZy5wZXJzb25hbC5leHRyYSk7XHJcbiAgICAgICAgbGV0IGluc3VyYW5jZUFmdGVyID0gdG90YWwgKiAoMSAtIHN1bVBlcnNvbmFsUmF0aW8pIC0gc3VtUGVyc29uYWxFeHRyYTtcclxuXHJcbiAgICAgICAgbGV0IHRheENvbmZpZyA9IHRoaXMuY29uZmlnLnRheDtcclxuICAgICAgICBsZXQgdGF4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRheENvbmZpZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY3VyQ29uZiA9IHRheENvbmZpZ1tpXTtcclxuICAgICAgICAgICAgaWYgKGluc3VyYW5jZUFmdGVyID49IGN1ckNvbmYubWluKSB7XHJcbiAgICAgICAgICAgICAgICB0YXggPSBpbnN1cmFuY2VBZnRlciAqIGN1ckNvbmYucmF0aW8gLSBjdXJDb25mLmFkanVzdDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBzdHIgPSAn5piO57uGPGJyPic7XHJcbiAgICAgICAgc3RyICs9ICc8YnI+5Liq5Lq657y057qzPGJyPic7XHJcbiAgICAgICAgc3RyICs9ICcmbmJzcDsmbmJzcDvnvLTnqI7vv6UnICsgdGF4ICsgJzxicj4nO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb25maWcucGVyc29uYWwucmF0aW8ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmNvbmZpZy5wZXJzb25hbC5yYXRpb1tpXTtcclxuICAgICAgICAgICAgc3RyICs9ICcmbmJzcDsmbmJzcDsnICsgaXRlbS50eXBlICsgJ+OAkCcgKyAoaXRlbS52YWx1ZSAqIDEwMCkgKyAnJeOAkScgKyAn77+lJyArICh0b3RhbCAqIGl0ZW0udmFsdWUpICsgJzxicj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdHIgKz0gJzxicj7lhazlj7jnvLTnurM8YnI+JztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29uZmlnLmNvbXBhbnkucmF0aW8ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmNvbmZpZy5jb21wYW55LnJhdGlvW2ldO1xyXG4gICAgICAgICAgICBzdHIgKz0gJyZuYnNwOyZuYnNwOycgKyBpdGVtLnR5cGUgKyAn44CQJyArIChpdGVtLnZhbHVlICogMTAwKSArICcl44CRJyArICfvv6UnICsgKHRvdGFsICogaXRlbS52YWx1ZSkgKyAnPGJyPic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3VtKGFycjogQXJyYXk8eyB0eXBlOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIgfT4pOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN1bSArPSBhcnJbaV0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9XHJcblxyXG4gICAgY2FjdWxhdGVJbnN1cmFuY2VBbmRUYXhCZWZvcmUodG90YWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHRheENvbmZpZyA9IHRoaXMuY29uZmlnLnRheDtcclxuICAgICAgICBsZXQgYmVmb3JlVGF4ID0gdG90YWw7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXhDb25maWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGN1ckNvbmYgPSB0YXhDb25maWdbaV07XHJcbiAgICAgICAgICAgIGlmICh0b3RhbCA+PSBjdXJDb25mLm1pbkluc3VyYW5jZUFuZFRheEFmdGVyKSB7XHJcbiAgICAgICAgICAgICAgICBiZWZvcmVUYXggPSAodG90YWwgLSBjdXJDb25mLmFkanVzdCkgLyAoMSAtIGN1ckNvbmYucmF0aW8pXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc3VtUGVyc29uYWxSYXRpbyA9IHRoaXMuZ2V0U3VtKHRoaXMuY29uZmlnLnBlcnNvbmFsLnJhdGlvKTtcclxuICAgICAgICBsZXQgc3VtUGVyc29uYWxFeHRyYSA9IHRoaXMuZ2V0U3VtKHRoaXMuY29uZmlnLnBlcnNvbmFsLmV4dHJhKTtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCgoKGJlZm9yZVRheCArIHN1bVBlcnNvbmFsRXh0cmEpIC8gKDEgLSBzdW1QZXJzb25hbFJhdGlvKSkudG9GaXhlZCgyKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlndXJhdGlvbiB7XHJcbiAgICBwZXJzb25hbDoge1xyXG4gICAgICAgIHJhdGlvOiBBcnJheTx7IHR5cGU6IHN0cmluZywgdmFsdWU6IG51bWJlciB9PixcclxuICAgICAgICBleHRyYTogQXJyYXk8eyB0eXBlOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIgfT4sXHJcbiAgICB9LFxyXG4gICAgY29tcGFueToge1xyXG4gICAgICAgIHJhdGlvOiBBcnJheTx7IHR5cGU6IHN0cmluZywgdmFsdWU6IG51bWJlciB9PixcclxuICAgICAgICBleHRyYTogQXJyYXk8eyB0eXBlOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIgfT5cclxuICAgIH0sXHJcbiAgICB0YXg6IEFycmF5PHsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyLCByYXRpbzogbnVtYmVyLCBhZGp1c3Q/OiBudW1iZXIsIG1pbkluc3VyYW5jZUFuZFRheEFmdGVyPzogbnVtYmVyIH0+XHJcbn0iLCJpbXBvcnQgeyBDYWxjdWxhdG9yLCBDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9jYWxjdWxhdG9yJztcclxuXHJcbmxldCBjYWxjID0gbmV3IENhbGN1bGF0b3Ioe1xyXG4gICAgcGVyc29uYWw6IHtcclxuICAgICAgICByYXRpbzogW3tcclxuICAgICAgICAgICAgdHlwZTogJ+ekvuS8muS/nemZqScsXHJcbiAgICAgICAgICAgIHZhbHVlOiAuMDhcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICfljLvnlpfkv53pmaknLFxyXG4gICAgICAgICAgICB2YWx1ZTogLjAyXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiAn5aSx5Lia5L+d6ZmpJyxcclxuICAgICAgICAgICAgdmFsdWU6IC4wMDVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICfkvY/miL/lhaznp6/ph5EnLFxyXG4gICAgICAgICAgICB2YWx1ZTogLjEyXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgZXh0cmE6IFtdXHJcbiAgICB9LFxyXG4gICAgY29tcGFueToge1xyXG4gICAgICAgIHJhdGlvOiBbe1xyXG4gICAgICAgICAgICB0eXBlOiAn56S+5Lya5L+d6ZmpJyxcclxuICAgICAgICAgICAgdmFsdWU6IC4yXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiAn5Yy755aX5L+d6ZmpJyxcclxuICAgICAgICAgICAgdmFsdWU6IC4wOFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdHlwZTogJ+WkseS4muS/nemZqScsXHJcbiAgICAgICAgICAgIHZhbHVlOiAuMDE1XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0eXBlOiAn55Sf6IKy5L+d6ZmpJyxcclxuICAgICAgICAgICAgdmFsdWU6IC4wMDVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHR5cGU6ICfkvY/miL/lhaznp6/ph5EnLFxyXG4gICAgICAgICAgICB2YWx1ZTogLjEyXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgZXh0cmE6IFtdXHJcbiAgICB9LFxyXG4gICAgdGF4OiBbXHJcbiAgICAgICAgeyBtaW46IDgzNTAwLCBtYXg6IE51bWJlci5NQVhfVkFMVUUsIHJhdGlvOiAuNDUgfSxcclxuICAgICAgICB7IG1pbjogNTg1MDAsIG1heDogODM1MDAsIHJhdGlvOiAuMzUgfSxcclxuICAgICAgICB7IG1pbjogMzg1MDAsIG1heDogNTg1MDAsIHJhdGlvOiAuMzAgfSxcclxuICAgICAgICB7IG1pbjogMTI1MDAsIG1heDogMzg1MDAsIHJhdGlvOiAuMjUgfSxcclxuICAgICAgICB7IG1pbjogOTAwMCwgbWF4OiAxMjUwMCwgcmF0aW86IC4yIH0sXHJcbiAgICAgICAgeyBtaW46IDUwMDAsIG1heDogOTAwMCwgcmF0aW86IC4xIH0sXHJcbiAgICAgICAgeyBtaW46IDM1MDAsIG1heDogNTAwMCwgcmF0aW86IC4wMyB9LFxyXG4gICAgICAgIHsgbWluOiAwLCBtYXg6IDM1MDAsIHJhdGlvOiAwIH1cclxuICAgIF1cclxufSk7XHJcblxyXG5sZXQgc2VydmVyU2VudGVuY2VJbmRleCA9IDA7XHJcblxyXG5sZXQgc2VydmVyU2VudGVuY2VzID0gW1xyXG4gICAgJ+ivt+mAieaLqeiuoeeul+exu+Weizxicj7ovpPlhaXigJwx4oCd56iO5YmN6K6h566X56iO5ZCOPGJyPui+k+WFpeKAnDLigJ3nqI7lkI7orqHnrpfnqI7liY0nLFxyXG4gICAgJ+ivt+i+k+WFpemHkeminScsXHJcbiAgICAn5oKo55qEJHR5cGXlt6XotYTkuLrvv6UkYW1vdW50J1xyXG5dO1xyXG5cclxubGV0IGNsaWVudEluZm86IEFycmF5PG51bWJlcj47XHJcblxyXG5sZXQgc2NyZWVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjcmVlbicpO1xyXG5sZXQgY2xpZW50SW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2xpZW50SW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5sZXQgY2xpZW50U2VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjbGllbnRTZW5kJyk7XHJcbmxldCBjbGllbnRSZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjbGllbnRSZXNldCcpO1xyXG5cclxuY2xpZW50SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICB2YXIga2V5ID0gZS5rZXk7XHJcbiAgICBpZiAoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ2VudGVyJykgY2xpZW50UGxheSgpO1xyXG4gICAgaWYgKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpICE9ICdiYWNrc3BhY2UnICYmIGlzTmFOKHBhcnNlRmxvYXQoa2V5KSkpIGUucHJldmVudERlZmF1bHQoKTtcclxufSk7XHJcbmNsaWVudFJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzZXRHYW1lKTtcclxuY2xpZW50U2VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWVudFBsYXkpO1xyXG5cclxuZnVuY3Rpb24gcmVzZXRHYW1lKCk6IHZvaWQge1xyXG4gICAgc2VydmVyU2VudGVuY2VJbmRleCA9IDA7XHJcbiAgICBjbGllbnRJbmZvID0gW107XHJcbiAgICBzY3JlZW4uaW5uZXJIVE1MID0gJyc7XHJcbiAgICBzZXJ2ZXJQbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlcnZlclBsYXkoKSB7XHJcbiAgICBsZXQgc2VydmVyU2VudGVuY2UgPSBzZXJ2ZXJTZW50ZW5jZXNbc2VydmVyU2VudGVuY2VJbmRleCsrXTtcclxuICAgIGxldCB0eXBlOiBzdHJpbmc7XHJcbiAgICBsZXQgYW1vdW50OiBudW1iZXI7XHJcbiAgICBpZiAoc2VydmVyU2VudGVuY2UuaW5kZXhPZignJCcpID4gMCkge1xyXG4gICAgICAgIGlmIChjbGllbnRJbmZvWzBdID09IDEpIHsgLy8g6K6h566X56iO5ZCOXHJcbiAgICAgICAgICAgIHR5cGUgPSAn56iO5ZCOJztcclxuICAgICAgICAgICAgYW1vdW50ID0gY2FsYy5jYWN1bGF0ZUluc3VyYW5jZUFuZFRheEFmdGVyKGNsaWVudEluZm9bMV0pO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIOiuoeeul+eojuWJjVxyXG4gICAgICAgICAgICB0eXBlID0gJ+eojuWJjSc7XHJcbiAgICAgICAgICAgIGFtb3VudCA9IGNhbGMuY2FjdWxhdGVJbnN1cmFuY2VBbmRUYXhCZWZvcmUoY2xpZW50SW5mb1sxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlcnZlclNlbnRlbmNlID0gc2VydmVyU2VudGVuY2UucmVwbGFjZSgnJHR5cGUnLCB0eXBlKTtcclxuICAgICAgICBzZXJ2ZXJTZW50ZW5jZSA9IHNlcnZlclNlbnRlbmNlLnJlcGxhY2UoJyRhbW91bnQnLCBhbW91bnQgKyAnJyk7XHJcbiAgICB9XHJcbiAgICBsZXQgaHRtbCA9IGA8ZGl2IGNsYXNzPVwiY2hhdCBzZXJ2ZXJcIj48cD4ke3NlcnZlclNlbnRlbmNlfTwvcD48L2Rpdj5gO1xyXG4gICAgc2NyZWVuLmlubmVySFRNTCArPSBodG1sO1xyXG5cclxuICAgIGlmIChzZXJ2ZXJTZW50ZW5jZUluZGV4ID49IHNlcnZlclNlbnRlbmNlcy5sZW5ndGgpIHtcclxuICAgICAgICBsZXQgZGV0YWlsOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ+eojuWJjScpIHtcclxuICAgICAgICAgICAgZGV0YWlsID0gY2FsYy5nZXREZXRhaWwoYW1vdW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZXRhaWwgPSBjYWxjLmdldERldGFpbChjbGllbnRJbmZvWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2hvd1NlcnZlclNlbnRlbmNlKGRldGFpbCk7XHJcbiAgICAgICAgc2hvd1NlcnZlclNlbnRlbmNlKCfngrnlh7vph43nva7mjInpkq7ph43mlrDmn6Xor6InKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd1NlcnZlclNlbnRlbmNlKHNlcnZlclNlbnRlbmNlOiBzdHJpbmcpIHtcclxuICAgIGxldCBodG1sID0gYDxkaXYgY2xhc3M9XCJjaGF0IHNlcnZlclwiPjxwPiR7c2VydmVyU2VudGVuY2V9PC9wPjwvZGl2PmA7XHJcbiAgICBzY3JlZW4uaW5uZXJIVE1MICs9IGh0bWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsaWVudFBsYXkoKSB7XHJcbiAgICBsZXQgaW5wdXQgPSBjbGllbnRJbnB1dC52YWx1ZTtcclxuICAgIGlmIChpbnB1dCA9PSAnJyB8fCBzZXJ2ZXJTZW50ZW5jZUluZGV4ID49IHNlcnZlclNlbnRlbmNlcy5sZW5ndGgpIHJldHVybjtcclxuICAgIGxldCBodG1sID0gYDxkaXYgY2xhc3M9XCJjaGF0IGNsaWVudFwiPjxwPiR7aW5wdXR9PC9wPjwvZGl2PmA7XHJcbiAgICBzY3JlZW4uaW5uZXJIVE1MICs9IGh0bWw7XHJcblxyXG4gICAgY2xpZW50SW5mby5wdXNoKHBhcnNlRmxvYXQoaW5wdXQpKTtcclxuICAgIHNlcnZlclBsYXkoKTtcclxuICAgIGNsaWVudElucHV0LnZhbHVlID0gJyc7XHJcbn1cclxuXHJcbnJlc2V0R2FtZSgpOyJdfQ==
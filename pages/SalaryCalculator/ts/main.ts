import { Calculator, Configuration } from './calculator';

let calc = new Calculator({
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

let serverSentenceIndex = 0;

let serverSentences = [
    '请选择计算类型<br>输入“1”税前计算税后<br>输入“2”税后计算税前',
    '请输入金额',
    '您的$type工资为￥$amount'
];

let clientInfo: Array<number>;

let screen = document.querySelector('.screen');
let clientInput: HTMLInputElement = document.querySelector('#clientInput') as HTMLInputElement;
let clientSend = document.querySelector('#clientSend');
let clientReset = document.querySelector('#clientReset');

clientInput.addEventListener('keydown', function (e: KeyboardEvent): void {
    var key = e.key;
    if (key.toLocaleLowerCase() == 'enter') clientPlay();
    if (key.toLocaleLowerCase() != 'backspace' && isNaN(parseFloat(key))) e.preventDefault();
});
clientReset.addEventListener('click', resetGame);
clientSend.addEventListener('click', clientPlay);

function resetGame(): void {
    serverSentenceIndex = 0;
    clientInfo = [];
    screen.innerHTML = '';
    serverPlay();
}

function serverPlay() {
    let serverSentence = serverSentences[serverSentenceIndex++];
    let type: string;
    let amount: number;
    if (serverSentence.indexOf('$') > 0) {
        if (clientInfo[0] == 1) { // 计算税后
            type = '税后';
            amount = calc.caculateInsuranceAndTaxAfter(clientInfo[1]);
        } else { // 计算税前
            type = '税前';
            amount = calc.caculateInsuranceAndTaxBefore(clientInfo[1]);
        }
        serverSentence = serverSentence.replace('$type', type);
        serverSentence = serverSentence.replace('$amount', amount + '');
    }
    let html = `<div class="chat server"><p>${serverSentence}</p></div>`;
    screen.innerHTML += html;

    if (serverSentenceIndex >= serverSentences.length) {
        let detail: string;
        if (type == '税前') {
            detail = calc.getDetail(amount);
        } else {
            detail = calc.getDetail(clientInfo[1]);
        }
        showServerSentence(detail);
        showServerSentence('点击重置按钮重新查询');
    }
}

function showServerSentence(serverSentence: string) {
    let html = `<div class="chat server"><p>${serverSentence}</p></div>`;
    screen.innerHTML += html;
}

function clientPlay() {
    let input = clientInput.value;
    if (input == '' || serverSentenceIndex >= serverSentences.length) return;
    let html = `<div class="chat client"><p>${input}</p></div>`;
    screen.innerHTML += html;

    clientInfo.push(parseFloat(input));
    serverPlay();
    clientInput.value = '';
}

resetGame();
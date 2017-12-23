export class Calculator {
    constructor(private config: Configuration) {
        let taxConfig = config.tax;
        for (let i = 0; i < taxConfig.length; i++) {
            let adjust = 0;
            let curConf = taxConfig[i];
            for (let j = i + 1; j < taxConfig.length; j++) {
                adjust += (taxConfig[j].max - taxConfig[j].min) * (curConf.ratio - taxConfig[j].ratio);
            }
            curConf.adjust = adjust;
        }
        for (let i = 0; i < taxConfig.length; i++) {
            let curConf = taxConfig[i];
            curConf.minInsuranceAndTaxAfter = this.caculateInsuranceAndTaxAfter(curConf.min);
        }
    }

    caculateInsuranceAndTaxAfter(total: number): number {
        let sumPersonalRatio = this.getSum(this.config.personal.ratio);
        let sumPersonalExtra = this.getSum(this.config.personal.extra);
        let insuranceAfter = total * (1 - sumPersonalRatio) - sumPersonalExtra;

        let taxConfig = this.config.tax;
        let tax = 0;
        for (let i = 0; i < taxConfig.length; i++) {
            let curConf = taxConfig[i];
            if (insuranceAfter >= curConf.min) {
                tax = insuranceAfter * curConf.ratio - curConf.adjust;
                break;
            }
        }
        return parseFloat((insuranceAfter - tax).toFixed(2));
    }

    getDetail(total: number) {
        let sumPersonalRatio = this.getSum(this.config.personal.ratio);
        let sumPersonalExtra = this.getSum(this.config.personal.extra);
        let insuranceAfter = total * (1 - sumPersonalRatio) - sumPersonalExtra;

        let taxConfig = this.config.tax;
        let tax = 0;
        for (let i = 0; i < taxConfig.length; i++) {
            let curConf = taxConfig[i];
            if (insuranceAfter >= curConf.min) {
                tax = insuranceAfter * curConf.ratio - curConf.adjust;
                break;
            }
        }
        let str = '明细<br>';
        str += '<br>个人缴纳<br>';
        str += '&nbsp;&nbsp;缴税￥' + parseFloat(tax.toFixed(2)) + '<br>';
        for (let i = 0; i < this.config.personal.ratio.length; i++) {
            let item = this.config.personal.ratio[i];
            str += '&nbsp;&nbsp;' + item.type + '【' + (item.value * 100) + '%】' + '￥' + parseFloat((total * item.value).toFixed(2)) + '<br>';
        }
        str += '<br>公司缴纳<br>';
        for (let i = 0; i < this.config.company.ratio.length; i++) {
            let item = this.config.company.ratio[i];
            str += '&nbsp;&nbsp;' + item.type + '【' + (item.value * 100) + '%】' + '￥' + parseFloat((total * item.value).toFixed(2)) + '<br>';
        }
        return str;
    }

    getSum(arr: Array<{ type: string, value: number }>): number {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i].value;
        }
        return sum;
    }

    caculateInsuranceAndTaxBefore(total: number): number {
        let taxConfig = this.config.tax;
        let beforeTax = total;
        for (let i = 0; i < taxConfig.length; i++) {
            let curConf = taxConfig[i];
            if (total >= curConf.minInsuranceAndTaxAfter) {
                beforeTax = (total - curConf.adjust) / (1 - curConf.ratio)
                break;
            }
        }
        let sumPersonalRatio = this.getSum(this.config.personal.ratio);
        let sumPersonalExtra = this.getSum(this.config.personal.extra);
        return parseFloat(((beforeTax + sumPersonalExtra) / (1 - sumPersonalRatio)).toFixed(2));
    }
}

export interface Configuration {
    personal: {
        ratio: Array<{ type: string, value: number }>,
        extra: Array<{ type: string, value: number }>,
    },
    company: {
        ratio: Array<{ type: string, value: number }>,
        extra: Array<{ type: string, value: number }>
    },
    tax: Array<{ min: number, max: number, ratio: number, adjust?: number, minInsuranceAndTaxAfter?: number }>
}
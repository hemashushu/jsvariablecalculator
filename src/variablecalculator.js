const fs = require('fs');
const path = require('path');
const jison = require("jison");

const { IllegalArgumentException } = require('jsexception');

// https://zaa.ch/jison/docs/

const bnfFilePath= path.join(__dirname, 'calculator_variable.jison');
const bnf = fs.readFileSync(bnfFilePath, 'utf-8');
const parser = new jison.Parser(bnf);

const factorial = (n) => {
    let r = 1;
    for (let i = 1; i <= n; i++) {
        r = r * i;
    }
    return r;
};

parser.yy.functions = {
    fact: factorial, // 阶乘

    log10: Math.log10,
    log2: Math.log2,
    ln: Math.log,
    log: (base, n) => { return Math.log(n) / Math.log(base); },
    abs: Math.abs,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    round: Math.round,
    trunc: Math.trunc,
    ceil: Math.ceil,
    floor: Math.floor,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan
};

parser.yy.setContextObject = (contextObject) => {
    parser.yy.contextObject = contextObject;
};

parser.yy.getVariable = (name) => {
    let value = parser.yy.contextObject[name];
    if (value === undefined) {
        return NaN;
    }else {
        return value;
    }
};

/**
 * 支持变量的算式求值模块
 *
 * 功能在模块 [JSInlineCalculator](https://github.com/hemashushu/jsinlinecalculator)
 * 的基础之上增加了：支持传入变量的功能，比如有如下算术表达式：
 *
 * `(a * b) / (a + b)`
 *
 * 程序可以通过上下文对象传入变量 `a` 和 `b` 的值，比如：
 * {
 *    a: 3,
 *    b: 4
 * }
 *
 * 算式的计算结果将是：(3*4)/(3+4) = 1.714
 *
 * 变量的名字必须是**小写**的字母和数字组成，其中第一个必须是字母。正则式为 `[a-z][a-z0-9_]*`。
 */
class VariableCalculator {

    /**
     * 计算算式的值
     *
     * @param {*} arithmeticalExpression
     * @param {*} contextObject 包含变量的值的上下文对象。如：
     *     {a: 10, b: 20}
     * @returns 返回结算的结果，即一个数字，如果出错则
     *     抛出 IllegalArgumentException 异常。
     */
    static evaluate(arithmeticalExpression, contextObject = {}) {

        parser.yy.setContextObject(contextObject);

        try {
            return parser.parse(arithmeticalExpression);
        } catch (e) {
            // 这里可能会抛出表达式语法错误的异常
            throw new IllegalArgumentException('Arithmetical expression syntax error.');
        }

    }
}

module.exports = VariableCalculator;
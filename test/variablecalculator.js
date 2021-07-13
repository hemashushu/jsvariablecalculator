const assert = require('assert/strict');

const { IllegalArgumentException } = require('jsexception');

const { VariableCalculator } = require('../index');

describe('VariableCalculator Test', () => {
    it('Test basic arithmetic', () => {
        let r1 = VariableCalculator.evaluate('1 + 2 * 3');
        assert.equal(r1, 7);

        let r2 = VariableCalculator.evaluate('-2 + 3');
        assert.equal(r2, 1);

        let r3 = VariableCalculator.evaluate('1.5 * 2');
        assert.equal(r3, 3);

        let r4 = VariableCalculator.evaluate('(1 + 2) * (3+4)');
        assert.equal(r4, 21);

        let r5 = VariableCalculator.evaluate('2^10 + 2^4');
        assert.equal(r5, 1024 + 16);

        let r6 = VariableCalculator.evaluate('4!');
        assert.equal(r6, 24);
    });

    it('Test functions', ()=>{
        let r1 = VariableCalculator.evaluate('sqrt(4) + sqrt(9)');
        assert.equal(r1, 2 + 3);

        let r2 = VariableCalculator.evaluate(`cbrt(8) + cbrt(27)`);
        assert.equal(r2, 2 + 3);

        let r3 = VariableCalculator.evaluate('abs(-123) + abs(456)');
        assert.equal(r3, 123 + 456);

        let r4 = VariableCalculator.evaluate('round(3.14) + round(2.718)');
        assert.equal(r4, 3 + 3);

        let r5 = VariableCalculator.evaluate('trunc(3.14) + trunc(2.718)');
        assert.equal(r5, 3 + 2);

        let r6 = VariableCalculator.evaluate('ceil(4.1) + ceil(4.9)');
        assert.equal(r6, 10);

        let r7 = VariableCalculator.evaluate('floor(4.1) + floor(4.9)');
        assert.equal(r7, 8);

        let r8 = VariableCalculator.evaluate('log10(100) + log2(1024) + ln(E)');
        assert.equal(r8, 2 + 10 + 1);

        let r9 = VariableCalculator.evaluate('log(10,1000)');
        assert(3 - r9 < 0.01);
    });


    it('Test bitwise operators', ()=>{
        let r1 = VariableCalculator.evaluate('3 | 5'); //'0b0011 | 0b0101'
        assert.equal(r1, 0b0011 | 0b0101);

        let r2 = VariableCalculator.evaluate('3 & 5'); //'0b0011 & 0b0101'
        assert.equal(r2, 0b0011 & 0b0101);

        let r3 = VariableCalculator.evaluate('~3'); //'~0b0011' // 按 32bit 整数计算
        assert.equal(r3, ~0b0011);

        let r4 = VariableCalculator.evaluate('3 << 2'); //'0b0011 << 2'
        assert.equal(r4, 0b0011 << 2);

        let r5 = VariableCalculator.evaluate('5 >> 2'); //'0b0101 >> 2'
        assert.equal(r5, 0b0101 >> 2);

        let r6 = VariableCalculator.evaluate('0b1010 xor 0b1100');
        assert.equal(r6, 0b0110);

        let r7 = VariableCalculator.evaluate('0b1010 xnor 0b1100'); // 按 32bit 整数计算
        assert.equal(r7, ~0b0110);
    });

    it('Test circular functions', () => {
        let r1 = VariableCalculator.evaluate('2 * PI * 3');
        assert((2 * Math.PI * 3) - r1 < 0.01);

        let r2 = VariableCalculator.evaluate('sin(PI/2) + cos(0)');
        assert(2 - r2 < 0.01);

        let r3 = VariableCalculator.evaluate('tan(PI/4)');
        assert(1 - r3 < 0.01);

        let r4 = VariableCalculator.evaluate('asin(1) + acos(1) + atan(1)');
        assert((Math.PI / 2 + 0 + Math.PI / 4) - r4 < 0.01);
    });

    it('Test binary and hex and long number', ()=>{
        let r1 = VariableCalculator.evaluate('0b1000');
        assert.equal(r1, 8);

        let r2 = VariableCalculator.evaluate('0xa');
        assert.equal(r2, 10);

        let r3 = VariableCalculator.evaluate('0b1000 + 0xa');
        assert.equal(r3, 18);

        let r4 = VariableCalculator.evaluate('123_456');
        assert.equal(r4, 123456);

        let r5 = VariableCalculator.evaluate('12_00 + 0b10_00 + 0x00_0a');
        assert.equal(r5, 1218);
    });

    it('Test invalid express', () => {
        try {
            VariableCalculator.evaluate('foo bar');
        } catch (e) {
            assert(e instanceof IllegalArgumentException)
        }
    });

    it('Test variable', () => {
        let r1 = VariableCalculator.evaluate('a',
            { a: 123 });

        assert.equal(r1, 123);

        let r2 = VariableCalculator.evaluate('1 + a * 3 + b',
            { a: 2, b: 5 });

        assert.equal(r2, 12);

        let r3 = VariableCalculator.evaluate('log2(m) + ln(E) + n',
            { m: 1024, n: 8 });

        assert.equal(r3, 19);
    });

    it('Test non-exists variable', () => {
        let r1 = VariableCalculator.evaluate('c',
            { a: 123 });

        assert(isNaN(r1));
    });

});
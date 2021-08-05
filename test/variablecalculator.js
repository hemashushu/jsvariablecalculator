const assert = require('assert/strict');

const { IllegalArgumentException } = require('jsexception');

const { VariableCalculator: calculator } = require('../index');

describe('VariableCalculator Test', () => {

    it('Test basic arithmetic', () => {
        let r1 = calculator.evaluate('1 + 2 * 3');
        assert.equal(r1, 7);

        let r2 = calculator.evaluate('-2 + 3');
        assert.equal(r2, 1);

        let r3 = calculator.evaluate('1.5 * 2');
        assert.equal(r3, 3);

        let r4 = calculator.evaluate('(1 + 2) * (3+4)');
        assert.equal(r4, 21);

        let r5 = calculator.evaluate('2^10 + 2^4');
        assert.equal(r5, 1024 + 16);
    });

    it('Test basic comparison', () => {
        let r1 = calculator.evaluate('1 == 2');
        assert.equal(r1, 0);

        let r2 = calculator.evaluate('1 != 2');
        assert.equal(r2, 1);

        let r3 = calculator.evaluate('2 == 2');
        assert.equal(r3, 1);

        let r4 = calculator.evaluate('2 != 2');
        assert.equal(r4, 0);

        let r5 = calculator.evaluate('1 > 2');
        assert.equal(r5, 0);

        let r6 = calculator.evaluate('1 >= 2');
        assert.equal(r6, 0);

        let r7 = calculator.evaluate('3 > 2');
        assert.equal(r7, 1);

        let r8 = calculator.evaluate('3 >= 2');
        assert.equal(r8, 1);

        let r9 = calculator.evaluate('2 >= 2');
        assert.equal(r9, 1);

        let r10 = calculator.evaluate('1 < 2');
        assert.equal(r10, 1);

        let r11 = calculator.evaluate('1 <= 2');
        assert.equal(r11, 1);

        let r12 = calculator.evaluate('3 < 2');
        assert.equal(r12, 0);

        let r13 = calculator.evaluate('3 <= 2');
        assert.equal(r13, 0);

        let r14 = calculator.evaluate('2 <= 2');
        assert.equal(r14, 1);

        let r15 = calculator.evaluate('1 + 2 < 3 * 4');
        assert.equal(r15, 1);
    });

    it('Test logic', () => {
        let r1 = calculator.evaluate('1 && 1');
        assert.equal(r1, 1);

        let r2 = calculator.evaluate('1 && 0');
        assert.equal(r2, 0);

        let r3 = calculator.evaluate('0 && 0');
        assert.equal(r3, 0);

        let r4 = calculator.evaluate('1 || 1');
        assert.equal(r4, 1);

        let r5 = calculator.evaluate('1 || 0');
        assert.equal(r5, 1);

        let r6 = calculator.evaluate('0 || 0');
        assert.equal(r6, 0);

        let r7 = calculator.evaluate('!0');
        assert.equal(r7, 1);

        let r8 = calculator.evaluate('!1');
        assert.equal(r8, 0);

        let r9 = calculator.evaluate('!1 || 1 && 0');
        assert.equal(r9, 0);
    });

    it('Test functions', () => {
        let r1 = calculator.evaluate('sqrt(4) + sqrt(9)');
        assert.equal(r1, 2 + 3);

        let r2 = calculator.evaluate(`cbrt(8) + cbrt(27)`);
        assert.equal(r2, 2 + 3);

        let r3 = calculator.evaluate('abs(-123) + abs(456)');
        assert.equal(r3, 123 + 456);

        let r4 = calculator.evaluate('round(3.14) + round(2.718)');
        assert.equal(r4, 3 + 3);

        let r5 = calculator.evaluate('trunc(3.14) + trunc(2.718)');
        assert.equal(r5, 3 + 2);

        let r6 = calculator.evaluate('ceil(4.1) + ceil(4.9)');
        assert.equal(r6, 10);

        let r7 = calculator.evaluate('floor(4.1) + floor(4.9)');
        assert.equal(r7, 8);

        let r8 = calculator.evaluate('log10(100) + log2(1024) + ln(E)');
        assert.equal(r8, 2 + 10 + 1);

        let r9 = calculator.evaluate('log(10,1000)');
        assert(3 - r9 < 0.01);

        let r10 = calculator.evaluate('fact(4)');
        assert.equal(r10, 24);
    });

    it('Test bitwise operators', () => {
        let r1 = calculator.evaluate('3 | 5'); //'0b0011 | 0b0101'
        assert.equal(r1, 0b0011 | 0b0101);

        let r2 = calculator.evaluate('3 & 5'); //'0b0011 & 0b0101'
        assert.equal(r2, 0b0011 & 0b0101);

        let r3 = calculator.evaluate('~3'); //'~0b0011', 按 32bit 整数计算
        assert.equal(r3, ~0b0011);

        let r4 = calculator.evaluate('3 << 2'); //'0b0011 << 2'
        assert.equal(r4, 0b0011 << 2);

        let r5 = calculator.evaluate('5 >> 2'); //'0b0101 >> 2'
        assert.equal(r5, 0b0101 >> 2);

        let r5b = calculator.evaluate('-5 >> 2');
        assert.equal(r5b, -5 >> 2);

        let r5c = calculator.evaluate('-5 >>> 2');
        assert.equal(r5c, -5 >>> 2);

        let r6 = calculator.evaluate('0b1010 xor 0b1100');
        assert.equal(r6, 0b0110);

        let r7 = calculator.evaluate('0b1010 xnor 0b1100'); // 按 32bit 整数计算
        assert.equal(r7, ~0b0110);
    });

    it('Test circular functions', () => {
        let r1 = calculator.evaluate('2 * PI * 3');
        assert((2 * Math.PI * 3) - r1 < 0.01);

        let r2 = calculator.evaluate('sin(PI/2) + cos(0)');
        assert(2 - r2 < 0.01);

        let r3 = calculator.evaluate('tan(PI/4)');
        assert(1 - r3 < 0.01);

        let r4 = calculator.evaluate('asin(1) + acos(1) + atan(1)');
        assert((Math.PI / 2 + 0 + Math.PI / 4) - r4 < 0.01);
    });

    it('Test binary and hex and long number', () => {
        let r1 = calculator.evaluate('0b1000');
        assert.equal(r1, 8);

        let r2 = calculator.evaluate('0xa');
        assert.equal(r2, 10);

        let r3 = calculator.evaluate('0b1000 + 0xa');
        assert.equal(r3, 18);

        let r4 = calculator.evaluate('123_456');
        assert.equal(r4, 123456);

        let r5 = calculator.evaluate('12_00 + 0b10_00 + 0x00_0a');
        assert.equal(r5, 1218);
    });

    it('Test invalid express', () => {
        try {
            calculator.evaluate('foo bar');
        } catch (e) {
            assert(e instanceof IllegalArgumentException)
        }
    });

    // ************************************ //
    // 以上的文本跟 calculator.jison 完全相同 //
    // ************************************ //

    it('Test variable', () => {
        let r1 = calculator.evaluate('a',
            { a: 123 });

        assert.equal(r1, 123);

        let r2 = calculator.evaluate('1 + a * 3 + b',
            { a: 2, b: 5 });

        assert.equal(r2, 12);

        let r3 = calculator.evaluate('log2(m) + ln(E) + n',
            { m: 1024, n: 8 });

        assert.equal(r3, 19);
    });

    it('Test non-exists variable', () => {
        let r1 = calculator.evaluate('c',
            { a: 123 });

        assert(isNaN(r1));
    });
});
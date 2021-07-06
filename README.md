# JSVariableCalculator

A simple arithmetic evaluator with variable support.

一个支持变量的算式求值模块。

## 功能

在基本算式求值模块 [JSInlineCalculator](https://github.com/hemashushu/jsinlinecalculator) 的基础之上增加了：支持传入变量的功能，比如有如下算术表达式：

`(a * b) / (a + b)`

程序可以通过上下文对象传入变量 `a` 和 `b` 的值，比如：

```
{
   a: 3,
   b: 4
}
```

算式的计算结果将是：(3*4)/(3+4) = 1.714

变量的名字必须是**小写**的字母和数字组成，其中第一个必须是字母。正则式为 `[a-z][a-z0-9_]*`。
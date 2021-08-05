
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
[0-9_]+("."[0-9_]+)?\b  return 'NUMBER'
0b[01_]+                return 'NUMBER'
0x[0-9a-f_]+            return 'NUMBER'
"("                     return '('
")"                     return ')'

"^"                     return '^'    // 幂，不是位运算 xor
"%"                     return '%'    // 余
"*"                     return '*'
"/"                     return '/'
"+"                     return '+'
"-"                     return '-'

"&&"                    return '&&'   // 逻辑 AND
"||"                    return '||'   // 逻辑 OR

">>>"                   return '>>>'  // 位运算逻辑右移动
"<<"                    return '<<'   // 位运算左移
">>"                    return '>>'   // 位运算算术右移动
"xor"                   return 'xor'  // 位运算 XOR
"xnor"                  return 'xnor' // 位运算 XNOR
"&"                     return '&'    // 位运算 AND
"|"                     return '|'    // 位运算 OR
"~"                     return '~'    // 位运算 NOT

"=="                    return '=='   // 比较运算 ==
"!="                    return '!='   // 比较运算 ==
"<="                    return '<='   // 比较运算 <=
">="                    return '>='   // 比较运算 >=
"<"                     return '<'    // 比较运算 <
">"                     return '>'    // 比较运算 >

"!"                     return '!'    // 逻辑 NOT，不是阶乘

","                     return ','    // 参数间分隔符
"PI"                    return 'PI'
"E"                     return 'E'
[a-z][a-z0-9_]*\b       return 'SYMBOL'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

/* operator associations and precedence */
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

%left '||'
%left '&&'
%left '|'
%left 'xor' 'xnor'
%left '&'
%left '==' '!='
%left '<' '<=' '>' '>='
%left '<<' '>>' '>>>'
%left '+' '-'
%left '*' '/' '%'
%right '^'             // '^' 是幂，不是位运算 xor
%right '~' '!' UMINUS  // '!' 是逻辑 NOT，不是阶乘

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

e
    : e '==' e
        {$$ = ($1 === $3) ? 1 : 0;}
    | e '!=' e
        {$$ = ($1 !== $3) ? 1 : 0;}
    | e '>' e
        {$$ = ($1 > $3) ? 1 : 0;}
    | e '>=' e
        {$$ = ($1 >= $3) ? 1 : 0;}
    | e '<' e
        {$$ = ($1 < $3) ? 1 : 0;}
    | e '<=' e
        {$$ = ($1 <= $3) ? 1 : 0;}

    | e '&&' e
        {$$ = ($1 && $3) ? 1 : 0;}
    | e '||' e
        {$$ = ($1 || $3) ? 1 : 0;}
    | '!' e
        {$$ = $2 ? 0 : 1;}

    | e '|' e
        {$$ = $1 | $3;}
    | e '&' e
        {$$ = $1 & $3;}
    | e 'xor' e
        {$$ = $1 ^ $3;}
    | e 'xnor' e
        {$$ = ~($1 ^ $3);}
    | e '<<' e
        {$$ = $1 << $3;}
    | e '>>' e
        {$$ = $1 >> $3;}
    | e '>>>' e
        {$$ = $1 >>> $3;}
    | '~' e
        {$$ = ~ $2;}

    | e '+' e
        {$$ = $1 + $3;}
    | e '-' e
        {$$ = $1 - $3;}
    | e '*' e
        {$$ = $1 * $3;}
    | e '/' e
        {$$ = $1 / $3;}
    | e '%' e
        {$$ = $1 % $3;}
    | e '^' e
        {$$ = Math.pow($1, $3);}

    // ************************************ //
    // 以上的文本跟 calculator.jison 完全相同 //
    // ************************************ //

    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext.replace(/_/g, ''));}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | SYMBOL
        {$$ = yy.getVariable($1); }
    | SYMBOL '(' e ')'
        {$$ = yy.functions[$1]($3); }
    | SYMBOL '(' e ',' e ')'
        {$$ = yy.functions[$1]($3, $5); }
    ;


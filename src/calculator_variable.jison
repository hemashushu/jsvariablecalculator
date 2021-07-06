
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"("                   return '('
")"                   return ')'

"~"                   return '~' // 位运算取反
"!"                   return '!'
"^"                   return '^'
"%"                   return '%' // 余
"*"                   return '*'
"/"                   return '/'
"+"                   return '+'
"-"                   return '-'

"<<"                  return '<<' // 位运算左移
">>"                  return '>>' // 位运算算术右移动
"&"                   return '&'  // 位运算 AND
"|"                   return '|'  // 位运算 OR

","                   return ',' // 参数间分隔符
"PI"                  return 'PI'
"E"                   return 'E'
[a-z][a-z0-9_]*\b     return 'SYMBOL'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '|'
%left '&'
%left '<<' '>>'
%left '+' '-'
%left '*' '/'
%left '%'
%left '^'
%right '!'
%left '~'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

e
    : e '|' e
        {$$ = $1 | $3;}
    | e '&' e
        {$$ = $1 & $3;}
    | e '<<' e
        {$$ = $1 << $3;}
    | e '>>' e
        {$$ = $1 >> $3;}
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
    | e '!'
        {$$ = yy.functions.factorial($1);}
    | '~' e
        {$$ = ~ $2;}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
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


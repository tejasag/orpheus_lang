const { Lexer, keywords } = require("./lexer.js");

class Parser {
    constructor(lexer){
        this.lexer = lexer;

        this.currentToken = "eof";
        this.peekToken = "eof";

        this.nextToken();
        this.nextToken();
    }

    nextToken() {
        this.currentToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }

    parseProgram() {
        let statements = [];
        while (this.currentToken != "eof"){
            let stmt = this.parseStatement();
            if (stmt != null) statements.push(stmt);
            this.nextToken();
        }
        return statements;
    }

    parseStatement() {
        switch (this.currentToken) {
            case "let":
                return this.parseLetStmt();
            default:
                return this.parseExprStmt();
        }
    }

    parseLetStmt() {
        // let a = !true;
        this.nextToken();

        if(!this.currentToken.startsWith("ident:")) {
            throw new Error(`Expected value after "let" to be an identifier`);
        }

        let ident = this.currentToken.split(":")[1];

        this.nextToken();
        if(this.currentToken != "assignment"){
            throw new Error(`Expected assignment operator after identifier`);
        }

        this.nextToken();
        let expr = this.parseExpr();
        return { ident, expr, statementType: "let" };
    }

    parseExprStmt() {
        const expr = this.parseExpr();
        if (expr != null) {
            if (this.peekToken === "semicolon"){
                this.nextToken();
            }
            // let statements, statementType = "let";
            expr["statementType"] = "expression";
        }
        return expr;
    }

    parseExpr() {
        let expr;
        // prefix expr: !true, -3, !false, +4,
        // infix expr: 3+4, 5-6

        // prefix expressions
        switch ( this.currentToken ) {
            case "plus":
            case "minus":
            case "bang":
                expr = this.parsePrefixExpr();
                break; 
            default:
                if(!isNaN(this.currentToken)) 
                    expr =  { expr: this.currentToken, expressionType: "literal" };
                else if(this.currentToken.startsWith("ident:")) {
                    expr = { expr: this.currentToken, expressionType: "identifier" };
                }
        }

        // infix expressions 3 + 3, 4-4
        while (this.peekToken != "semicolon") {
            switch (this.peekToken) {
                case "plus":
                case "minus":
                case "nteq":
                case "equals":
                case "gt":
                case "gteq":
                case "lt":
                case "lteq":
                    this.nextToken();
                    expr = this.parseInfixExpr(expr);
                default:
                    // if there is no prefix. only infix.
                    return expr;
            }
        }

        return expr;
    }

    parsePrefixExpr() {
        // { prefix: "minus",
        //   expression: {
        //        -4
        //        prefix: "minus",
        //        expression: {
        //              expr: 4,
        //              expressionType: "literal"
        //        }
        //        expressionType: "prefix",
        //      },
        //    expressionType: "prefix",
        //  }
        let prefix;
        switch (this.currentToken) {
            case "bang":
               prefix = "not" 
               break;
            case "minus":
                prefix = "minus";
                break;
            case "plus":
                prefix = "plus";
                break;
        }

        this.nextToken();
        const expr = this.parseExpr();
        return { prefix, expr, expressionType: "prefix" };
    }

    parseInfixExpr(left) {
        // 5 + 7
        let infix;
        switch (this.currentToken) {
            case "plus":
                infix = "add";
                break;
            case "minus":
                infix = "sub";
                break;
            case "equals":
                infix = "equals";
                break;
            case "nteq":
                infix = "notequals";
                break;
            case "lt":
                infix = "lessthan";
                break;
            case "gt":
                infix = "greaterthan";
                break;
            case "lteq":
                infix = "lessthaneq";
                break;
            case "gteq":
                infix = "greaterthaneq";
                break;
            default:
                return null;
        }

        this.nextToken();
        // 3+20/5
        const right = this.parseExpr();
        return { left, right, infix, expressionType: "infix" };
    }
}

module.exports = { Parser };

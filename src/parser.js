const { Lexer } = require("./lexer.js");
const { Eval } = require("./eval.js");

class Parser {
  constructor(lexer) {
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
    while (this.currentToken != "eof") {
      let stmt = this.parseStatement();
      if (stmt != null) statements.push(stmt);
      this.nextToken();
    }
    return statements;
  }

  parseStatement() {
    switch (this.currentToken) {
      // case "let": ....
      default:
        return this.parseExprStmt();
    }
  }

  parseExprStmt() {
    const expr = this.parseExpr();
    if (expr != null) {
      if (this.peekToken === "semicolon") {
        this.nextToken();
      }
      expr["statementType"] = "expression";
      return expr;
    }
  }

  parseExpr() {
    //prefix !true !false -2
    let expr;
    switch (this.currentToken) {
      case "plus":
      case "minus":
      case "bang":
        expr = this.parsePrefixExpr();
        break;
      default:
        if (!isNaN(this.currentToken))
          expr = { expr: this.currentToken, expressionType: "literal" };
        else if (typeof this.currentToken === "boolean")
          expr = { expr: this.currentToken, expressionType: "literal" };
        else expr = null;
    }

    // infix 2+2 -2+4 true==!false
    while (this.peekToken != "semicolon") {
      switch (this.peekToken) {
        case "plus":
        case "minus":
        case "nteq":
        case "eq":
        case "gt":
        case "gteq":
        case "lt":
        case "lteq":
          this.nextToken();
          expr = this.parseInfixExpr(expr);
        default:
          return expr;
      }
    }

    return expr;
  }

  parsePrefixExpr() {
    let prefix;
    switch (this.currentToken) {
      case "bang":
        prefix = "not";
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
    let infix;
    switch (this.currentToken) {
      case "plus":
        infix = "add";
        break;
      case "minus":
        infix = "subtract";
        break;
      case "equal":
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
    const right = this.parseExpr();
    return { infix, left, right, expressionType: "infix" };
  }
}

module.exports = { Parser };

let par = new Parser(new Lexer("100 < 4+4")).parseProgram();
let ev = new Eval();
console.log(ev.eval(par));

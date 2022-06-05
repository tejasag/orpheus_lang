const { Lexer } = require("./lexer.js");
const { Parser } = require("./parser.js");

class Eval {
    constructor() { 
        this.variables = {};
    }

    eval(program) {
        let result = null;
        for (const statement of program) {
            result = this.evalStatement(statement);
        }
        return result;
    }

    evalStatement(statement) {
        switch (statement.statementType) {
            case "let":
                return this.evalLetStatement(statement);
            case "expression":
                return this.evalExprStatement(statement);
            default:
                null;
        }
    }

    evalLetStatement(statement) {
        let expr = this.evalExprStatement(statement.expr);
        this.variables[statement.ident] = expr;
        return;
    }

    evalExprStatement(statement) {
        switch (statement.expressionType) {
            case "literal":
                return statement.expr;
            case "identifier":
                // ident:a
                let ident = statement.expr.split(":")[1];
                if (Object.keys(this.variables).includes(ident)) {
                    return this.variables[ident]
                } else {
                    return;
                }
            // -(-4)
            case "prefix":
                let right = this.evalExprStatement(statement.expr);
                return this.evalPrefixStatement(right, statement.prefix);
            case "infix":
                // 4 + 5
                let leftExpr = this.evalExprStatement(statement.left);
                let rightExpr = this.evalExprStatement(statement.right);
                return this.evalInfixStatement(leftExpr, rightExpr, statement.infix);
        }
    }

    evalPrefixStatement(right, prefix) {
        // !<boolean>
        // +-<number>
        switch (prefix) {
            case "not":
                if(typeof right != "boolean")
                    throw new Error(`Expected boolean value with prefix`);
                return !right;
            case "minus":
            case "plus":
                return this.evalNumPrefixStatement(right, prefix);
        }
    }

    evalNumPrefixStatement(right, prefix) {
        if (isNaN(right)) {
            throw new Error(`Expected number value with prefix`);
        }
        switch (prefix) {
            case "plus":
                return right;
            case "minus":
                return -1 * right;
        }
    }

    evalInfixStatement(left, right, infix) {
       if(isNaN(left) || isNaN(right)) throw new Error(`Expected both values to be number with infix`); 

    switch (infix) {
        case "add":
            return left + right;
        case "sub":
            return left - right;
        case "equals":
            return left === right;
        case "notequals":
            return left != right;
        case "greaterthan":
            return left > right;
        case "greaterthaneq":
            return left >= right;
        case "lessthan":
            return left < right;
        case "lessthaneq":
            return left <= right;
    }
}
}

module.exports = { Eval };

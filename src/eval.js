class Eval {
  eval(program) {
    let result = null;
    for (const statement of program) {
      result = this.evalStatement(statement);
    }
    return result;
  }

  evalStatement(statement) {
    switch (statement.statementType) {
      case "expression":
        return this.evalExpression(statement);
        break;
      default:
        return null;
    }
  }

  evalExpression(statement) {
    switch (statement.expressionType) {
      case "literal":
        return statement.expr;
      case "prefix":
        let right = this.evalExpression(statement.expr);
        return this.evalPrefixExpr(statement.prefix, right);
      case "infix":
        let leftExpr = this.evalExpression(statement.left);
        let rightExpr = this.evalExpression(statement.right);
        return this.evalInfixExpr(statement.infix, leftExpr, rightExpr);
    }
  }

  evalPrefixExpr(prefix, expr) {
    switch (prefix) {
      case "not":
        return this.evalNotPrefixExpr(prefix, expr);
      case "minus":
      case "plus":
        return this.evalNumPrefixExpr(prefix, expr);
    }
  }

  evalNotPrefixExpr(prefix, expr) {
    if (typeof expr != "boolean")
      throw new Error(
        `Expected "boolean" with the prefix "${prefix}". Found ${expr}.`
      );
    return !expr;
  }

  evalNumPrefixExpr(prefix, expr) {
    if (typeof expr != "number")
      throw new Error(
        `Expected "number" with the prefix "${prefix}". Found ${expr}.`
      );

    switch (prefix) {
      case "plus":
        return expr;
      case "minus":
        return -1 * expr;
    }
  }

  evalInfixExpr(infix, left, right) {
    if (isNaN(left) || isNaN(right))
      throw new Error(
        `Type mismatch. Expected both values to be "number" with the infix "${infix}".  Found ${left}${infix}${right}`
      );
    left = parseInt(left);
    right = parseInt(right);

    switch (infix) {
      case "add":
        return left + right;
      case "subtract":
        return left - right;
      case "equals":
        return left === right;
      case "notequals":
        return left != right;
      case "lessthan":
        return left < right;
      case "lessthaneq":
        return left <= right;
      case "greaterthan":
        return left > right;
      case "greaterthaneq":
        return left >= right;
    }
  }
}

module.exports = { Eval };

const keywords = { false: false, true: true };
const eof = "\u0000";

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.ch = input[0];
    this.readPos = 1;

    this.input = this.input.replaceAll(/[\r\t\n" "]/g, "");
  }

  readChar() {
    if (this.readPos >= this.input.length) {
      this.ch = eof;
    } else {
      this.ch = this.input[this.readPos];
    }
    this.position = this.readPos;
    this.readPos++;
  }

  peekChar() {
    if (this.readPos > this.input.length) {
      return eof;
    } else {
      return this.input[this.readPos];
    }
  }

  nextToken() {
    let token;
    switch (this.ch) {
      case ";":
        token = "semicolon";
        break;
      case "=":
        if (this.peekChar() == "=") {
          this.readChar();
          token = "equal";
        } else token = "assign";
        break;
      case ">":
        if (this.peekChar() == "=") {
          this.readChar();
          token = "gteq";
        } else token = "gt";
        break;
      case "<":
        if (this.peekChar() == "=") {
          this.readChar();
          token = "lteq";
        } else token = "lt";
        break;
      case "!":
        if (this.peekChar() == "=") {
          this.readChar();
          token = "nteq";
        } else token = "bang";
        break;
      case "+":
        token = "plus";
        break;
      case "-":
        token = "minus";
        break;
      case eof:
        token = "eof";
        break;
      default:
        if (!isNaN(this.ch)) {
          return this.readNumber();
        } else if (this.isLetter(this.ch)) {
          let ident = this.readIdentifier();
          if (Object.keys(keywords).indexOf(ident) != -1) {
            return keywords[ident];
          } else "illegal";
        } else "illegal";
    }

    this.readChar();
    return token;
  }

  readNumber() {
    let position = this.position;
    while (!isNaN(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  readIdentifier() {
    let position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  isLetter(str) {
    return str.match(/[a-z]/gi);
  }
}

module.exports = { Lexer };

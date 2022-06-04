const keywords = { true: true, false: false };
const eof = "\u0000";

class Lexer {
    constructor(input){
        this.input = input;
        this.position = 0;
        this.readPosition = 1;
        // current char
        this.ch = this.input[this.position];
    }

    // 1 > 3;
    // switches to the next character
    readChar() {
        if (this.readPosition >= this.input.length)
            this.ch = eof;
        else
            this.ch = this.input[this.readPosition];
        this.position = this.readPosition;
        this.readPosition++;
    }

    // returns the next character
    peekChar() {
        if(this.readPosition >= this.input.length)
            return eof;
        else
            return this.input[this.readPosition]
    }

    nextToken() {
        while(this.ch === " " || this.ch === "\n" || this.ch === "\r" || this.ch === "\t") {
            this.readChar();
        }
        let token;
        switch(this.ch){
            case ";":
                token = "semicolon";
                break;
            case "=":
                if(this.peekChar() === "="){
                    token = "equals";
                    this.readChar();
                } else {
                    token = "asignment";
                }
                break;
            case ">":
                if(this.peekChar() === "="){
                    token = "gteq";
                    this.readChar();
                } else {
                    token = "gt";
                }
                break;
            case "<":
                if (this.peekChar() === "="){
                    token = "lteq";
                    this.readChar();
                } else {
                    token = "lt";
                }
                break;
            case "+":
                token = "plus";
                break;
            case "-":
                token = "minus";
                break;
            case "!":
                if (this.peekChar() === "="){
                    token = "noteq";
                    this.readChar();
                } else {
                    token = "bang";
                }
                break;
            case eof:
                token = "eof";
                break;
            default:
                if(!isNaN(this.ch)){
                    return this.isNumber();
                } else if (this.ch.match(/[a-z]/gi)) {
                    let string = this.readWord();
                    if(Object.keys(keywords).includes(string)) {
                        return keywords[string];
                    }
                }
        }

        this.readChar();
        return token;
    }

    // 345678 + 14
    isNumber() {
        let position = this.position;
        while(!isNaN(this.ch)){
            this.readChar();
        }
        let finalPosition = this.position;
        return this.input.substring(position, finalPosition);
    }

    readWord() {
        let position = this.position;
        while(this.ch.match(/[a-z]/gi)) {
            this.readChar();
        }
        let finalPosition = this.position;
        return this.input.substring(position, finalPosition);
    }
}

module.exports = { Lexer, keywords };

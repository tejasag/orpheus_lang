const { Eval } = require("./eval.js");
const { Parser } = require("./parser.js");
const { Lexer } = require("./lexer.js");

const prompt = require("prompt-sync")();

console.log("Welcome to orpheus lang!");

let eval = new Eval();
let statement;

while(statement != "quit") {
    statement = prompt(">>> ");
    if (statement === "quit" || statement === null ) {
        console.log("BYEEEE!!");
        break;
    }
    if(statement === "") continue;
    let par = new Parser(new Lexer(statement)).parseProgram();
    console.log(eval.eval(par));
}

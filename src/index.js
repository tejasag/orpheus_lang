const {Eval} = require("./eval.js");
const {Lexer} = require("./lexer.js");
const {Parser} = require("./parser.js");

const prompt = require("prompt-sync")();

console.log("Welcome to orpheus lang! enter your command :)");
let eval = new Eval();
let statement;

while(statement != "quit")  {
    statement = prompt(">>> ");
    if(statement === "quit"){
        console.log("BYEEEEEEE!");
        break;
    }
    statement = statement;
    let par = new Parser(new Lexer(statement)).parseProgram();
    let evaluated= eval.eval(par);
    console.log(evaluated);
}


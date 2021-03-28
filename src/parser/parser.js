const antlr4 = require("antlr4");
const PythonLexer = require("../lang/PythonLexer.js");
const PythonParser = require("../lang/PythonParser.js");
const Visitor = require("../lang/Visitor.js");

// Parser File 
class Parser {

    parse(input) {
        const chars = new antlr4.InputStream(input);
        const lexer = new PythonLexer(chars);

        lexer.strictMode = false; // do not use js strictMode

        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new PythonParser(tokens);

        parser.buildParseTrees = true;
        var tree = parser.prog();

        var visitor = new Visitor();
        const program = visitor.visit(tree);

        return program;
    }
}

module.exports = Parser;
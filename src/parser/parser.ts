/* tslint:disable:max-classes-per-file */
// import * as es from 'estree'
const util = require('util')
import * as ast from './ast'
import { Context, ErrorSeverity, ErrorType, SourceError } from '../types'
import { stripIndent } from '../utils/formatters'
import {
  ANTLRInputStream,
  CommonTokenStream
  // ParserRuleContext
} from 'antlr4ts'
// import { CalcLexer } from '../lang/CalcLexer'
// import { ExpressionContext } from '../lang/Python3Lexer'
import { Python3Parser } from '../lang/Python3Parser'
import { Python3Lexer } from '../lang/Python3Lexer'
import { Python3Visitor } from '../lang/Python3Visitor'
// import { Single_inputContext } from '../lang/Python3Parser'
import { File_inputContext } from '../lang/Python3Parser'
// import { Eval_inputContext } from '../lang/Python3Parser'
// import { DecoratorContext } from '../lang/Python3Parser'
// import { DecoratorsContext } from '../lang/Python3Parser'
// import { DecoratedContext } from '../lang/Python3Parser'
// import { FuncdefContext } from '../lang/Python3Parser'
// import { ParametersContext } from '../lang/Python3Parser'
// import { TypedargslistContext } from '../lang/Python3Parser'
// import { TfpdefContext } from '../lang/Python3Parser'
// import { VarargslistContext } from '../lang/Python3Parser'
// import { VfpdefContext } from '../lang/Python3Parser'
// import { StmtContext } from '../lang/Python3Parser'
import { Simple_stmtContext } from '../lang/Python3Parser'
// import { Small_stmtContext } from '../lang/Python3Parser'
import { Expr_stmtContext } from '../lang/Python3Parser'
// import { Testlist_star_exprContext } from '../lang/Python3Parser'
// import { AugassignContext } from '../lang/Python3Parser'
// import { Del_stmtContext } from '../lang/Python3Parser'
// import { Pass_stmtContext } from '../lang/Python3Parser'
// import { Flow_stmtContext } from '../lang/Python3Parser'
// import { Break_stmtContext } from '../lang/Python3Parser'
// import { Continue_stmtContext } from '../lang/Python3Parser'
// import { Return_stmtContext } from '../lang/Python3Parser'
// import { Yield_stmtContext } from '../lang/Python3Parser'
// import { Raise_stmtContext } from '../lang/Python3Parser'
// import { Import_stmtContext } from '../lang/Python3Parser'
// import { Import_nameContext } from '../lang/Python3Parser'
// import { Import_fromContext } from '../lang/Python3Parser'
// import { Import_as_nameContext } from '../lang/Python3Parser'
// import { Dotted_as_nameContext } from '../lang/Python3Parser'
// import { Import_as_namesContext } from '../lang/Python3Parser'
// import { Dotted_as_namesContext } from '../lang/Python3Parser'
// import { Dotted_nameContext } from '../lang/Python3Parser'
// import { Global_stmtContext } from '../lang/Python3Parser'
// import { Nonlocal_stmtContext } from '../lang/Python3Parser'
// import { Assert_stmtContext } from '../lang/Python3Parser'
// import { Compound_stmtContext } from '../lang/Python3Parser'
// import { If_stmtContext } from '../lang/Python3Parser'
// import { While_stmtContext } from '../lang/Python3Parser'
// import { For_stmtContext } from '../lang/Python3Parser'
// import { Try_stmtContext } from '../lang/Python3Parser'
// import { With_stmtContext } from '../lang/Python3Parser'
// import { With_itemContext } from '../lang/Python3Parser'
// import { Except_clauseContext } from '../lang/Python3Parser'
// import { SuiteContext } from '../lang/Python3Parser'
// import { TestContext } from '../lang/Python3Parser'
// import { Test_nocondContext } from '../lang/Python3Parser'
// import { LambdefContext } from '../lang/Python3Parser'
// import { Lambdef_nocondContext } from '../lang/Python3Parser'
import { Or_testContext } from '../lang/Python3Parser'
import { And_testContext } from '../lang/Python3Parser'
import { Not_testContext } from '../lang/Python3Parser'
import { ComparisonContext } from '../lang/Python3Parser'
// import { Comp_opContext } from '../lang/Python3Parser'
// import { Star_exprContext } from '../lang/Python3Parser'
import { ExprContext } from '../lang/Python3Parser'
import { Xor_exprContext } from '../lang/Python3Parser'
import { And_exprContext } from '../lang/Python3Parser'
import { Shift_exprContext } from '../lang/Python3Parser'
import { Arith_exprContext } from '../lang/Python3Parser'
import { TermContext } from '../lang/Python3Parser'
import { FactorContext } from '../lang/Python3Parser'
// import { PowerContext } from '../lang/Python3Parser'
// import { AtomContext } from '../lang/Python3Parser'
// import { Testlist_compContext } from '../lang/Python3Parser'
// import { TrailerContext } from '../lang/Python3Parser'
// import { SubscriptlistContext } from '../lang/Python3Parser'
// import { SubscriptContext } from '../lang/Python3Parser'
// import { SliceopContext } from '../lang/Python3Parser'
// import { ExprlistContext } from '../lang/Python3Parser'
// import { TestlistContext } from '../lang/Python3Parser'
// import { DictorsetmakerContext } from '../lang/Python3Parser'
// import { ClassdefContext } from '../lang/Python3Parser'
// import { ArglistContext } from '../lang/Python3Parser'
// import { ArgumentContext } from '../lang/Python3Parser'
// import { Comp_iterContext } from '../lang/Python3Parser'
// import { Comp_forContext } from '../lang/Python3Parser'
// import { Comp_ifContext } from '../lang/Python3Parser'
// import { Yield_exprContext } from '../lang/Python3Parser'
// import { Yield_argContext } from '../lang/Python3Parser'
// import { StrContext } from '../lang/Python3Parser'
import { NumberContext } from '../lang/Python3Parser'
// import { IntegerContext } from '../lang/Python3Parser'
//import { readFileSync } from 'fs'
// import { ParseTree } from 'antlr4ts/tree/ParseTree'
// import { RuleNode } from 'antlr4ts/tree/RuleNode'
// import {
//   AdditionContext,
//   CalcParser,
//   DivisionContext,
//   ExpressionContext,
//   MultiplicationContext,
//   NumberContext,
//   ParenthesesContext,
//   PowerContext,
//   StartContext,
//   SubtractionContext
// } from '../lang/CalcParser'
// import { CalcVisitor } from '../lang/CalcVisitor'
// import { ErrorNode } from 'antlr4ts/tree/ErrorNode'
// import { ParseTree } from 'antlr4ts/tree/ParseTree'
// import { RuleNode } from 'antlr4ts/tree/RuleNode'
// import { TerminalNode } from 'antlr4ts/tree/TerminalNode'
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'

export class DisallowedConstructError implements SourceError {
  public type = ErrorType.SYNTAX
  public severity = ErrorSeverity.ERROR
  public nodeType: string

  constructor(public node: ast.Node) {
    this.nodeType = this.formatNodeType(this.node.type)
  }

  get location() {
    return this.node.loc!
  }

  public explain() {
    return `${this.nodeType} are not allowed`
  }

  public elaborate() {
    return stripIndent`
      You are trying to use ${this.nodeType}, which is not allowed (yet).
    `
  }

  /**
   * Converts estree node.type into english
   * e.g. ThisExpression -> 'this' expressions
   *      Property -> Properties
   *      EmptyStatement -> Empty Statements
   */
  private formatNodeType(nodeType: string) {
    switch (nodeType) {
      case 'ThisExpression':
        return "'this' expressions"
      case 'Property':
        return 'Properties'
      default: {
        const words = nodeType.split(/(?=[A-Z])/)
        return words.map((word, i) => (i === 0 ? word : word.toLowerCase())).join(' ') + 's'
      }
    }
  }
}

export class FatalSyntaxError implements SourceError {
  public type = ErrorType.SYNTAX
  public severity = ErrorSeverity.ERROR
  public constructor(public location: ast.SourceLocation, public message: string) {}

  public explain() {
    return this.message
  }

  public elaborate() {
    return 'There is a syntax error in your program'
  }
}

export class MissingSemicolonError implements SourceError {
  public type = ErrorType.SYNTAX
  public severity = ErrorSeverity.ERROR
  public constructor(public location: ast.SourceLocation) {}

  public explain() {
    return 'Missing semicolon at the end of statement'
  }

  public elaborate() {
    return 'Every statement must be terminated by a semicolon.'
  }
}

export class TrailingCommaError implements SourceError {
  public type: ErrorType.SYNTAX
  public severity: ErrorSeverity.WARNING
  public constructor(public location: ast.SourceLocation) {}

  public explain() {
    return 'Trailing comma'
  }

  public elaborate() {
    return 'Please remove the trailing comma'
  }
}

class PythonProgramGenerator
  extends AbstractParseTreeVisitor<ast.Program>
  implements Python3Visitor<ast.Program> {
  defaultResult(): ast.Program {
    // throw new Error("Method not implemented")
    return (undefined as unknown) as ast.Program
  }
  visitFile_input(ctx: File_inputContext): ast.Program {
    console.log('visitFile_input')
    const stmt_list = []
    const generator = new PythonStatementGenerator()
    for (let i = 0; i < ctx.stmt().length; i++) {
      stmt_list.push(generator.visit(ctx.stmt(i)))
    }
    return { type: 'Program', sourceType: 'script', body: stmt_list }
  }
}

class PythonStatementGenerator
  extends AbstractParseTreeVisitor<ast.Statement>
  implements Python3Visitor<ast.Statement> {
  defaultResult(): ast.Statement {
    // throw new Error("Method not implemented")
    return (undefined as unknown) as ast.Statement
  }
  visitSimple_stmt(tree: Simple_stmtContext): ast.Statement {
    let stmts = tree.small_stmt().map(stmt => this.visit(stmt))
    return { type: 'BlockStatement', body: stmts }
  }

  visitExpr_stmt(tree: Expr_stmtContext): ast.Statement {
    let test_list_star_expr = tree.testlist_star_expr()
    if (test_list_star_expr.length !== 1) {
      throw new FatalSyntaxError(
        {
          start: { line: tree._start.line, column: tree._start.charPositionInLine },
          end: { line: tree._stop!.line, column: tree._stop!.charPositionInLine }
        },
        'Multiple aug expressions not supported'
      )
    } // TODO : HANDLE OTHER CASES
    let expr = test_list_star_expr[0]
    const generator = new PythonExpressionGenerator()
    return { type: 'ExpressionStatement', expression: generator.visit(expr) }
  }
}

class PythonExpressionGenerator
  extends AbstractParseTreeVisitor<ast.Expression>
  implements Python3Visitor<ast.Expression> {
  defaultResult(): ast.Expression {
    // throw new Error("Method not implemented")
    return (undefined as unknown) as ast.Expression
  }

  visitNumber(tree: NumberContext): ast.Expression {
    return {
      type: 'Literal',
      value: parseInt(tree.text),
      raw: tree.text
    }
  }

  // Visit a parse tree produced by Python3Parser#or_test.
  visitOr_test(ctx: Or_testContext): ast.Expression {
    console.log('visitOr_test')
    const length = ctx.childCount
    let value = this.visit(ctx.and_test(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.OR(i - 1) !== undefined) {
        value = {
          type: 'BinaryExpression',
          operator: 'or',
          left: value,
          right: this.visit(ctx.and_test(i))
        }
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#and_test.
  visitAnd_test(ctx: And_testContext): ast.Expression {
    console.log('visitAnd_test')
    const length = ctx.childCount
    let value = this.visit(ctx.not_test(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.AND(i - 1) !== undefined) {
        value = {
          type: 'BinaryExpression',
          operator: 'and',
          left: value,
          right: this.visit(ctx.not_test(i))
        }
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#not_test.
  visitNot_test(ctx: Not_testContext): ast.Expression {
    console.log('visitNot_test')
    if (ctx.NOT() !== undefined) {
      return {
        type: 'UnaryExpression',
        operator: 'not',
        prefix: true,
        argument: this.visit(ctx.not_test()!)
      }
    } else {
      return this.visit(ctx.comparison()!)
    }
  }

  // Visit a parse tree produced by Python3Parser#comparison.
  visitComparison(ctx: ComparisonContext): ast.Expression {
    console.log('visitComparison')
    const length = ctx.childCount
    let value = this.visit(ctx.star_expr(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.comp_op(i - 1).text === '<') {
        value = {
          type: 'BinaryExpression',
          operator: '<',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === '>') {
        value = {
          type: 'BinaryExpression',
          operator: '>',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === '==') {
        value = {
          type: 'BinaryExpression',
          operator: '==',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === '>=') {
        value = {
          type: 'BinaryExpression',
          operator: '>=',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === '<=') {
        value = {
          type: 'BinaryExpression',
          operator: '<=',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === '<>') {
        value = {
          type: 'BinaryExpression',
          operator: '!=',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === '!=') {
        value = {
          type: 'BinaryExpression',
          operator: '!=',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === 'in') {
        value = {
          type: 'BinaryExpression',
          operator: 'in',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === 'not in') {
        value = {
          type: 'BinaryExpression',
          operator: 'not in',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === 'is') {
        value = {
          type: 'BinaryExpression',
          operator: 'is',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      } else if (ctx.comp_op(i - 1).text === 'is not') {
        value = {
          type: 'BinaryExpression',
          operator: 'is not',
          left: value,
          right: this.visit(ctx.star_expr(i))
        }
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#expr.
  visitExpr(ctx: ExprContext): ast.Expression {
    console.log('visitExpr')
    const length = ctx.childCount
    let value = this.visit(ctx.xor_expr(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.getChild(i * 2 - 1).text === '|') {
        value = {
          type: 'BinaryExpression',
          operator: '|',
          left: value,
          right: this.visit(ctx.xor_expr(i))
        }
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#xor_expr.
  visitXor_expr(ctx: Xor_exprContext): ast.Expression {
    console.log('visitXor_expr')
    const length = ctx.childCount
    let value = this.visit(ctx.and_expr(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.getChild(i * 2 - 1).text === '^') {
        value = {
          type: 'BinaryExpression',
          operator: '^',
          left: value,
          right: this.visit(ctx.and_expr(i))
        }
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#and_expr.
  visitAnd_expr(ctx: And_exprContext): ast.Expression {
    console.log('visitAnd_expr')
    const length = ctx.childCount
    let value = this.visit(ctx.shift_expr(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.getChild(i * 2 - 1).text === '&') {
        value = {
          type: 'BinaryExpression',
          operator: '&',
          left: value,
          right: this.visit(ctx.shift_expr(i))
        }
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#shift_expr.
  visitShift_expr(ctx: Shift_exprContext): ast.Expression {
    console.log('visitShift_expr')
    const length = ctx.childCount
    let value = this.visit(ctx.arith_expr(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.getChild(i * 2 - 1).text === '<<') {
        value = {
          type: 'BinaryExpression',
          operator: '<<',
          left: value,
          right: this.visit(ctx.arith_expr(i))
        }
      } else if (ctx.getChild(i * 2 - 1).text === '>>') {
        value = {
          type: 'BinaryExpression',
          operator: '>>',
          left: value,
          right: this.visit(ctx.arith_expr(i))
        }
      }
    }
    return value
  }

  visitArith_expr(tree: Arith_exprContext): ast.Expression {
    const length = tree.childCount
    let value = this.visit(tree.term(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (tree.getChild(i * 2 - 1).text === '+') {
        value = {
          type: 'BinaryExpression',
          operator: '+',
          left: value,
          right: this.visit(tree.term(i))
        }
      } else if (tree.getChild(i * 2 - 1).text === '-') {
        value = {
          type: 'BinaryExpression',
          operator: '-',
          left: value,
          right: this.visit(tree.term(i))
        }
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#term.
  visitTerm(ctx: TermContext): ast.Expression {
    console.log('visitTerm')
    const length = ctx.childCount
    let value = this.visit(ctx.factor(0))
    for (let i = 1; i * 2 < length; i = i + 1) {
      if (ctx.getChild(i * 2 - 1).text === '*') {
        value = {
          type: 'BinaryExpression',
          operator: '*',
          left: value,
          right: this.visit(ctx.factor(i))
        }
      } else if (ctx.getChild(i * 2 - 1).text === '/') {
        value = {
          type: 'BinaryExpression',
          operator: '/',
          left: value,
          right: this.visit(ctx.factor(i))
        }
      } else if (ctx.getChild(i * 2 - 1).text === '%') {
        value = {
          type: 'BinaryExpression',
          operator: '%',
          left: value,
          right: this.visit(ctx.factor(i))
        }
      } else if (ctx.getChild(i * 2 - 1).text === '//') {
        value = {
          type: 'BinaryExpression',
          operator: '//',
          left: value,
          right: this.visit(ctx.factor(i))
        }
      } else if (ctx.getChild(i * 2 - 1).text === '@') {
        throw new FatalSyntaxError(
          {
            start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
            end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
          },
          '@ operator expressions not supported'
        )
      }
    }
    return value
  }

  // Visit a parse tree produced by Python3Parser#factor.
  visitFactor(ctx: FactorContext): ast.Expression {
    console.log('visitFactor')
    if (ctx.ADD() !== undefined) {
      return {
        type: 'UnaryExpression',
        operator: '+',
        prefix: true,
        argument: this.visit(ctx.factor()!)
      }
    } else if (ctx.MINUS() !== undefined) {
      return {
        type: 'UnaryExpression',
        operator: '-',
        prefix: true,
        argument: this.visit(ctx.factor()!)
      }
    } else if (ctx.NOT_OP() !== undefined) {
      return {
        type: 'UnaryExpression',
        operator: '~',
        prefix: true,
        argument: this.visit(ctx.factor()!)
      }
    } else {
      return this.visit(ctx.power()!)
    }
  }

  // Visit a parse tree produced by Python3Parser#power.
  // visitPower(ctx: PowerContext): ast.Expression {
  //   console.log('visitPower')
  //   let atom = this.visit(ctx.atom())
  //   const trailer_list = []
  //   if (ctx.trailer().length > 0) {
  //     for (let i = 0; i < ctx.trailer().length; i++) {
  //       trailer_list.push(this.visit(ctx.trailer(i)))
  //     }
  //   }
  //   if (trailer_list.length !== 0) {
  //     atom = { type: 'Trailer', base: atom, trailer: trailer_list }
  //     //Property return a dict, arglist and subscriptlist return a list
  //   }
  //   if (ctx.factor() !== undefined) {
  //     atom = {
  //       type: 'BinaryExpression',
  //       operator: '**',
  //       left: atom,
  //       right: this.visit(ctx.factor())
  //     }
  //   }
  //   return atom
  // }

  // Visit a parse tree produced by Python3Parser#atom.
  // visitAtom(ctx: AtomContext): ast.Expression {
  //   console.log('visitAtom')
  //   if (ctx.TRUE() !== undefined) {
  //     return { type: 'Literal', value: true }
  //   } else if (ctx.FALSE() !== undefined) {
  //     return { type: 'Literal', value: false }
  //   } else if (ctx.NONE() !== undefined) {
  //     return { type: 'Literal', value: null }
  //   } else if (ctx.number() !== undefined) {
  //     return this.visit(ctx.number()!)
  //   } else if (ctx.NAME() !== undefined) {
  //     return { type: 'Identifier', name: ctx.NAME()!.text }
  //   } else if (ctx.str().length > 0) {
  //     let value = ''
  //     for (let i = 0; i < ctx.str().length; i++) {
  //       value = value + ctx.str(i).text
  //     }
  //     return { type: 'Literal', value: value }
  //   } else if (ctx.OPEN_PAREN() !== undefined) {
  //     if (ctx.yield_expr() !== undefined) {
  //       return this.visit(ctx.yield_expr()!)
  //     } else if (ctx.testlist_comp() !== undefined) {
  //       return {
  //         type: 'SequenceExpression',
  //         expressions: this.visit(ctx.testlist_comp()!)
  //       }
  //     } else {
  //       return { type: 'SequenceExpression', expressions: new Array<ast.Expression>() }
  //     }
  //   } else if (ctx.OPEN_BRACK() !== undefined) {
  //     if (ctx.testlist_comp() !== undefined) {
  //       return this.visit(ctx.testlist_comp())
  //     } else {
  //       return { type: 'List', element: [], comp_for: null }
  //     }
  //   } else if (ctx.OPEN_BRACE() !== undefined) {
  //     if (ctx.dictorsetmaker() !== undefined) {
  //       return this.visit(ctx.dictorsetmaker())
  //     } else {
  //       return { type: 'ArrayExpression', elements: new Array<ast.Expression>() }
  //     }
  //   } else {
  //     throw new FatalSyntaxError(
  //       {
  //         start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
  //         end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
  //       },
  //       'Atom: Not defined'
  //     )
  //   }
  // }

  // //   // Visit a parse tree produced by Python3Parser#testlist_comp.
  // visitTestlist_comp(ctx: Testlist_compContext): ast.Expression {
  //   console.log('visitTestlist_comp')
  //   if (ctx.comp_for() !== undefined) {
  //     throw new FatalSyntaxError(
  //       {
  //         start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
  //         end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
  //       },
  //       'comp_for: Not defined'
  //     )
  //     //TODO implement comp_for
  //     //[i for i in range(4)]
  //     // return {
  //     //   type: 'List',
  //     //   element: this.visit(ctx.test(0)),
  //     //   comp_for: this.visit(ctx.comp_for())
  //     // }
  //   } else {
  //     //[1,2,3]
  //     const element = []
  //     for (let i = 0; i < ctx.test().length; i++) {
  //       element.push(this.visit(ctx.test(i)))
  //     }
  //     return {
  //       type: 'ArrayExpression',
  //       elements: element
  //     }
  //   }
  // }

  // // Visit a parse tree produced by Python3Parser#str.
  // visitStr(ctx: StrContext): ast.Expression {
  //   console.log('visitStr')
  //   //TODO: Support r String
  //   let value = null
  //   if (ctx.STRING_LITERAL() !== undefined) {
  //     value = ctx.STRING_LITERAL()!.text
  //   } else {
  //     value = ctx.BYTES_LITERAL()!.text
  //   }
  //   if (value.startsWith('"')) {
  //     value = value.replace(/^"+|"+$/g, '')
  //   } else if (value.startsWith("'")) {
  //     value = value.replace(/^'+|'+$/g, '')
  //   }
  //   return { type: 'Literal', value: value }
  // }
}

// class PythonExpressionGenerator2 implements Python3Visitor<ast.Expression> {

//   // Visit a parse tree produced by Python3Parser#decorator.
//   visitDecorator(ctx: DecoratorContext): ast.Expression {
//     console.log('visitDecorator')
//     if (ctx.arglist() !== undefined) {
//       return {
//         type: 'Decorator',
//         name: this.visit(ctx.dotted_name()),
//         arglist: this.visit(ctx.arglist())
//       }
//     } else {
//       return {
//         type: 'Decorator',
//         name: this.visit(ctx.dotted_name()),
//         arglist: []
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#decorators.
//   visitDecorators(ctx: DecoratorsContext): ast.Expression {
//     console.log('visitDecorators')
//     const decorators = []
//     for (let i = 0; i < ctx.decorator().length; i++) {
//       decorators.push(this.visit(ctx.decorator(i)))
//     }
//     return decorators
//   }

//   // Visit a parse tree produced by Python3Parser#decorated.
//   visitDecorated(ctx: DecoratedContext): ast.Expression {
//     console.log('visitDecorated')
//     if (ctx.funcdef() !== undefined) {
//       return {
//         type: 'Decorated',
//         decorators: this.visit(ctx.decorators()),
//         function: this.visit(ctx.funcdef())
//       }
//     } else {
//       return {
//         type: 'Decorated',
//         decorators: this.visit(ctx.decorators()),
//         function: this.visit(ctx.classdef())
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#funcdef.
//   visitFuncdef(ctx: FuncdefContext): ast.Expression {
//     console.log('visitFuncdef')
//     return {
//       type: 'FunctionDef',
//       name: ctx.NAME().text,
//       parameters: this.visit(ctx.parameters()),
//       body: this.visit(ctx.suite())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#parameters.
//   visitParameters(ctx: ParametersContext): ast.Expression {
//     console.log('visitParameters')
//     if (ctx.typedargslist() !== undefined) {
//       return this.visit(ctx.typedargslist())
//     } else {
//       return []
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#typedargslist.
//   visitTypedargslist(ctx: TypedargslistContext): ast.Expression {
//     console.log('visitTypedargslist')
//     // TODO: support *args, **kwargs
//     const length = ctx.childCount
//     const returnlist = []
//     const comma = []
//     let current = -1
//     if (ctx.STAR() === undefined && ctx.POWER() === undefined) {
//       for (let i = 0; i < length; i++) {
//         if (ctx.getChild(i).text === ',') {
//           comma.push(i)
//         }
//       }
//       comma.push(length)
//       for (let i = 0; i < comma.length; i++) {
//         if (comma[i] - current === 2) {
//           returnlist.push({
//             type: 'Parameter',
//             name: this.visit(ctx.getChild(comma[i] - 1)),
//             default: null
//           })
//           current = current + 2
//           console.log(this.visit(ctx.getChild(comma[i] - 1)))
//         } else {
//           returnlist.push({
//             type: 'Parameter',
//             name: this.visit(ctx.getChild(comma[i] - 3)),
//             default: this.visit(ctx.getChild(comma[i] - 1))
//           })
//           current = current + 4
//         }
//       }
//     } else {
//       throw '*args and **kwargs have not been implemented!'
//     }
//     return returnlist
//   }

//   // Visit a parse tree produced by Python3Parser#tfpdef.
//   visitTfpdef(ctx: TfpdefContext): ast.Expression {
//     console.log('visitTfpdef')
//     return ctx.NAME().text
//   }

//   // Visit a parse tree produced by Python3Parser#varargslist.
//   visitVarargslist(ctx: VarargslistContext): ast.Expression {
//     console.log('visitVarargslist')
//     // TODO: support *args, **kwargs
//     const length = ctx.childCount
//     const returnlist = []
//     const comma = []
//     let current = -1
//     if (ctx.STAR() === undefined && ctx.POWER() === undefined) {
//       for (let i = 0; i < length; i++) {
//         if (ctx.getChild(i).text === ',') {
//           comma.push(i)
//         }
//       }
//       comma.push(length)
//       for (let i = 0; i < comma.length; i++) {
//         if (comma[i] - current === 2) {
//           returnlist.push({
//             type: 'VarArgument',
//             name: this.visit(ctx.getChild(comma[i] - 1)),
//             default: null
//           })
//           current = current + 2
//           console.log(this.visit(ctx.getChild(comma[i] - 1)))
//         } else {
//           returnlist.push({
//             type: 'VarArgument',
//             name: this.visit(ctx.getChild(comma[i] - 3)),
//             default: this.visit(ctx.getChild(comma[i] - 1))
//           })
//           current = current + 4
//         }
//       }
//     } else {
//       throw '*args and **kwargs have not been implemented!'
//     }
//     return returnlist
//   }

//   // Visit a parse tree produced by Python3Parser#vfpdef.
//   visitVfpdef(ctx: VfpdefContext): ast.Expression {
//     console.log('visitVfpdef')
//     return ctx.NAME().text
//   }

//   // Visit a parse tree produced by Python3Parser#stmt.
//   visitStmt(ctx: StmtContext): ast.Expression {
//     console.log('visitStmt')
//     if (ctx.simple_stmt() !== undefined) {
//       return {
//         type: 'SimpleStatement',
//         value: this.visit(ctx.simple_stmt())
//       }
//     } else {
//       return {
//         type: 'CompoundStatement',
//         value: this.visit(ctx.compound_stmt())
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#simple_stmt.
//   visitSimple_stmt(ctx: Simple_stmtContext): ast.Expression {
//     console.log('visitSimple_stmt')
//     const stmt_list = []
//     for (let i = 0; i < ctx.small_stmt().length; i++) {
//       stmt_list.push(this.visit(ctx.small_stmt(i)))
//     }
//     return stmt_list
//   }

//   // Visit a parse tree produced by Python3Parser#small_stmt.
//   visitSmall_stmt(ctx: Small_stmtContext): ast.Expression {
//     console.log('visitSmall_stmt')
//     if (ctx.expr_stmt() !== undefined) {
//       return this.visit(ctx.expr_stmt())
//     } else if (ctx.del_stmt() !== undefined) {
//       return this.visit(ctx.del_stmt())
//     } else if (ctx.pass_stmt() !== undefined) {
//       return this.visit(ctx.pass_stmt())
//     } else if (ctx.flow_stmt() !== undefined) {
//       return this.visit(ctx.flow_stmt())
//     } else if (ctx.import_stmt() !== undefined) {
//       return this.visit(ctx.import_stmt())
//     } else if (ctx.global_stmt() !== undefined) {
//       return this.visit(ctx.global_stmt())
//     } else if (ctx.nonlocal_stmt() !== undefined) {
//       return this.visit(ctx.nonlocal_stmt())
//     } else if (ctx.assert_stmt() !== undefined) {
//       return this.visit(ctx.assert_stmt())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#expr_stmt.
//   visitExpr_stmt(ctx: Expr_stmtContext): ast.Expression {
//     console.log('visitExpr_stmt')
//     if (ctx.augassign() !== undefined) {
//       return {
//         type: 'AugAssign',
//         left: this.visit(ctx.testlist_star_expr(0)),
//         right: this.visit(ctx.getChild(2))
//       }
//     } else {
//       const length = ctx.childCount
//       let right = this.visit(ctx.getChild(length - 1))
//       for (let i = length; i > 1; i = i - 2) {
//         const temp_left = this.visit(ctx.getChild(i - 3))
//         right = {
//           type: 'Assignment',
//           left: temp_left,
//           right: right
//         }
//       }
//       return right
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#testlist_star_expr.
//   visitTestlist_star_expr(ctx: Testlist_star_exprContext): ast.Expression {
//     console.log('visitTestlist_star_expr')
//     const length = ctx.childCount
//     if (length === 1) {
//       if (ctx.test() !== undefined) {
//         return this.visit(ctx.test(0))
//       } else {
//         return this.visit(ctx.star_expr(0))
//       }
//     } else {
//       const valuelist = [this.visit(ctx.getChild(0))]
//       for (let i = 1; i < length; i++) {
//         if (ctx.getChild(i).text !== ',') {
//           valuelist.push(this.visit(ctx.getChild(i)))
//         }
//       }
//       return { type: 'TestListStarExpression', value: valuelist }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#augassign.
//   visitAugassign(ctx: AugassignContext): ast.Expression {
//     console.log('visitAugassign')
//     return this.visit(ctx.getChild(0).text)
//   }

//   // Visit a parse tree produced by Python3Parser#del_stmt.
//   visitDel_stmt(ctx: Del_stmtContext): ast.Expression {
//     console.log('visitSivisitDel_stmt')
//     return { type: 'DeleteStatement', deleted: this.visit(ctx.exprlist()) }
//   }

//   // Visit a parse tree produced by Python3Parser#pass_stmt.
//   visitPass_stmt(ctx: Pass_stmtContext): ast.Expression {
//     console.log('visitPass_stmt')
//     return { type: 'PassStatement' }
//   }

//   // Visit a parse tree produced by Python3Parser#flow_stmt.
//   visitFlow_stmt(ctx: Flow_stmtContext): ast.Expression {
//     console.log('visitFlow_stmt')
//     if (ctx.break_stmt() !== undefined) {
//       return this.visit(ctx.break_stmt())
//     } else if (ctx.continue_stmt() !== undefined) {
//       return this.visit(ctx.continue_stmt())
//     } else if (ctx.return_stmt() !== undefined) {
//       return this.visit(ctx.return_stmt())
//     } else if (ctx.raise_stmt() !== undefined) {
//       return this.visit(ctx.raise_stmt())
//     } else if (ctx.yield_stmt() !== undefined) {
//       return this.visit(ctx.yield_stmt())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#break_stmt.
//   visitBreak_stmt(ctx: Break_stmtContext): ast.Expression {
//     console.log('visitBreak_stmt')
//     return { type: 'BreakStatement' }
//   }

//   // Visit a parse tree produced by Python3Parser#continue_stmt.
//   visitContinue_stmt(ctx: Continue_stmtContext): ast.Expression {
//     console.log('visitContinue_stmt')
//     return { type: 'ContinueStatement' }
//   }

//   // Visit a parse tree produced by Python3Parser#return_stmt.
//   visitReturn_stmt(ctx: Return_stmtContext): ast.Expression {
//     console.log('visitReturn_stmt')
//     if (ctx.testlist() !== undefined) {
//       return {
//         type: 'ReturnStatement',
//         returned: this.visit(ctx.testlist())
//       }
//     } else {
//       return {
//         type: 'ReturnStatement',
//         returned: []
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#yield_stmt.
//   visitYield_stmt(ctx: Yield_stmtContext): ast.Expression {
//     console.log('visitYield_stmt')
//     return this.visit(ctx.yield_expr())
//   }

//   // Visit a parse tree produced by Python3Parser#raise_stmt.
//   visitRaise_stmt(ctx: Raise_stmtContext): ast.Expression {
//     console.log('visitRaise_stmt')
//     if (ctx.test() !== undefined) {
//       return { type: 'RaiseStatement', info: this.visit(ctx.test(0)) }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#import_stmt.
//   visitImport_stmt(ctx: Import_stmtContext): ast.Expression {
//     console.log('visitImport_stmt')
//     if (ctx.import_name() !== undefined) {
//       return this.visit(ctx.import_name())
//     } else {
//       return this.visit(ctx.import_from())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#import_name.
//   visitImport_name(ctx: Import_nameContext): ast.Expression {
//     console.log('visitImport_name')
//     return {
//       type: 'ImportName',
//       imported: this.visit(ctx.dotted_as_names())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#import_from.
//   visitImport_from(ctx: Import_fromContext): ast.Expression {
//     console.log('visitImport_from')
//     return {
//       type: 'FromImport',
//       file: this.visit(ctx.dotted_name()),
//       imported: this.visit(ctx.import_as_names())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#import_as_name.
//   visitImport_as_name(ctx: Import_as_nameContext): ast.Expression {
//     console.log('visitImport_as_name')
//     if (ctx.AS() !== undefined) {
//       return {
//         type: 'Imported',
//         name: ctx.NAME(0).text,
//         alias: ctx.NAME(1).text
//       }
//     } else {
//       return {
//         type: 'Imported',
//         name: ctx.NAME(0).text,
//         alias: null
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#dotted_as_name.
//   visitDotted_as_name(ctx: Dotted_as_nameContext): ast.Expression {
//     console.log('visitDotted_as_name')
//     if (ctx.NAME() !== undefined) {
//       return {
//         type: 'Imported',
//         name: this.visit(ctx.dotted_name()),
//         alias: ctx.NAME().text
//       }
//     } else {
//       return {
//         type: 'Imported',
//         name: this.visit(ctx.dotted_name()),
//         alias: null
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#import_as_namast.
//   visitImport_as_names(ctx: Import_as_namesContext): ast.Expression {
//     console.log('visitImport_as_names')
//     const returnlist = []
//     for (let i = 0; i < ctx.import_as_name().length; i++) {
//       returnlist.push(this.visit(ctx.import_as_name(i)))
//     }
//     return returnlist
//   }

//   // Visit a parse tree produced by Python3Parser#dotted_as_namast.
//   visitDotted_as_names(ctx: Dotted_as_namesContext): ast.Expression {
//     console.log('visitDotted_as_names')
//     const returnlist = []
//     for (let i = 0; i < ctx.dotted_as_name().length; i++) {
//       returnlist.push(this.visit(ctx.dotted_as_name(i)))
//     }
//     return returnlist
//   }

//   // Visit a parse tree produced by Python3Parser#dotted_name.
//   visitDotted_name(ctx: Dotted_nameContext): ast.Expression {
//     console.log('visitDotted_name')
//     let str = ''
//     for (let i = 0; i < ctx.childCount; i++) {
//       str = str + ctx.getChild(i).text
//     }
//     return str
//   }

//   // Visit a parse tree produced by Python3Parser#global_stmt.
//   visitGlobal_stmt(ctx: Global_stmtContext): ast.Expression {
//     console.log('visitGlobal_stmt')
//     const globallist = []
//     for (let i = 0; i < ctx.NAME().length; i++) {
//       globallist.push(this.visit(ctx.NAME(i)))
//     }
//     return { type: 'GlobalStatement', globallist: globallist }
//   }

//   // Visit a parse tree produced by Python3Parser#nonlocal_stmt.
//   visitNonlocal_stmt(ctx: Nonlocal_stmtContext): ast.Expression {
//     console.log('visitNonlocal_stmt')
//     const nonlocallist = []
//     for (let i = 0; i < ctx.NAME().length; i++) {
//       nonlocallist.push(this.visit(ctx.NAME(i)))
//     }
//     return { type: 'NonlocalStatement', nonlocallist: nonlocallist }
//   }

//   // Visit a parse tree produced by Python3Parser#assert_stmt.
//   visitAssert_stmt(ctx: Assert_stmtContext): ast.Expression {
//     console.log('visitAssert_stmt')
//     returnlist = []
//     for (let i = 0; i < ctx.test().length; i++) {
//       returnlist.push(this.visit(ctx.test(i)))
//     }
//     return returnlist
//   }

//   // Visit a parse tree produced by Python3Parser#compound_stmt.
//   visitCompound_stmt(ctx: Compound_stmtContext): ast.Expression {
//     console.log('visitCompound_stmt')
//     if (ctx.if_stmt() !== undefined) {
//       return this.visit(ctx.if_stmt())
//     } else if (ctx.while_stmt() !== undefined) {
//       return this.visit(ctx.while_stmt())
//     } else if (ctx.for_stmt() !== undefined) {
//       return this.visit(ctx.for_stmt())
//     } else if (ctx.try_stmt() !== undefined) {
//       return this.visit(ctx.try_stmt())
//     } else if (ctx.with_stmt() !== undefined) {
//       return this.visit(ctx.with_stmt())
//     } else if (ctx.funcdef() !== undefined) {
//       return this.visit(ctx.funcdef())
//     } else if (ctx.classdef() !== undefined) {
//       return this.visit(ctx.classdef())
//     } else if (ctx.decorated() !== undefined) {
//       return this.visit(ctx.decorated())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#if_stmt.
//   visitIf_stmt(ctx: If_stmtContext): ast.Expression {
//     console.log('visitIf_stmt')
//     let right = null
//     const suite_length = ctx.suite().length
//     const test_length = ctx.test().length
//     if (ctx.ELSE() !== undefined) {
//       right = this.visit(ctx.suite(suite_length - 1))
//     }
//     for (let i = test_length - 1; i >= 0; i--) {
//       right = {
//         type: 'ConditionalExpression',
//         judge: this.visit(ctx.test(i)),
//         judge_true: this.visit(ctx.suite(i)),
//         judge_false: right
//       }
//     }
//     return right
//   }

//   // Visit a parse tree produced by Python3Parser#while_stmt.
//   visitWhile_stmt(ctx: While_stmtContext): ast.Expression {
//     console.log('visitWhile_stmt')
//     if (ctx.suite().length > 1) {
//       return {
//         type: 'WhileStatement',
//         condition: this.visit(ctx.test()),
//         body: this.visit(ctx.suite(0)),
//         else: this.visit(ctx.suite(1))
//       }
//     } else {
//       return {
//         type: 'WhileStatement',
//         condition: this.visit(ctx.test()),
//         body: this.visit(ctx.suite(0)),
//         else: []
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#for_stmt.
//   visitFor_stmt(ctx: For_stmtContext): ast.Expression {
//     console.log('visitFor_stmt')
//     if (ctx.suite().length > 1) {
//       return {
//         type: 'ForStatement',
//         iter: this.visit(ctx.exprlist()),
//         iterated: this.visit(ctx.testlist()),
//         body: this.visit(ctx.suite(0)),
//         else: this.visit(ctx.suite(1))
//       }
//     } else {
//       return {
//         type: 'ForStatement',
//         iter: this.visit(ctx.exprlist()),
//         iterated: this.visit(ctx.testlist()),
//         body: this.visit(ctx.suite(0)),
//         else: []
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#try_stmt.
//   visitTry_stmt(ctx: Try_stmtContext): ast.Expression {
//     console.log('visitTry_stmt')
//     let trybody = null
//     const exceptbody = []
//     let elsebody = null
//     let finallybody = null
//     for (let i = 0; i < ctx.childCount; i++) {
//       if (ctx.getChild(i).text === ':') {
//         if (ctx.getChild(i - 1).text === 'try') {
//           trybody = this.visit(ctx.getChild(i + 1))
//         } else if (ctx.getChild(i - 1).text === 'else') {
//           elsebody = this.visit(ctx.getChild(i + 1))
//         } else if (ctx.getChild(i - 1).text === 'finally') {
//           finallybody = this.visit(ctx.getChild(i + 1))
//         } else {
//           exceptbody.push({
//             condition: this.visit(ctx.getChild(i - 1)),
//             body: this.visit(ctx.getChild(i + 1))
//           })
//         }
//       }
//     }
//     return {
//       type: 'TryStatement',
//       exceptlist: exceptbody,
//       else: elsebody,
//       finally: finallybody
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#with_stmt.
//   visitWith_stmt(ctx: With_stmtContext): ast.Expression {
//     console.log('visitWith_stmt')
//     const withlist = []
//     for (let i = 0; i < ctx.with_item().length; i++) {
//       withlist.push(this.visit(ctx.with_item(i)))
//     }
//     return {
//       type: 'WithStatement',
//       items: withlist,
//       body: this.visit(ctx.suite())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#with_item.
//   visitWith_item(ctx: With_itemContext): ast.Expression {
//     console.log('visitWith_item')
//     if (ctx.expr() !== undefined) {
//       return {
//         type: 'WithItem',
//         test: this.visit(ctx.test()),
//         alias: this.visit(ctx.expr())
//       }
//     } else {
//       return {
//         type: 'WithItem',
//         test: this.visit(ctx.test()),
//         alias: null
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#except_clause.
//   visitExcept_clause(ctx: Except_clauseContext): ast.Expression {
//     console.log('visitExcept_clause')
//     if (ctx.test() !== undefined) {
//       return { type: 'Except', test: this.visit(ctx.test()) }
//     } else {
//       return { type: 'Except', test: null }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#suite.
//   visitSuite(ctx: SuiteContext): ast.Expression {
//     console.log('visitSuite')
//     if (ctx.simple_stmt() !== undefined) {
//       return this.visit(ctx.simple_stmt())
//     } else {
//       const stmtlist = []
//       for (let i = 0; i < ctx.stmt().length; i++) {
//         stmtlist.push(this.visit(ctx.stmt(i)))
//       }
//       return stmtlist
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#test.
//   visitTest(ctx: TestContext): ast.Expression {
//     console.log('visitTest')
//     if (ctx.IF() !== undefined) {
//       return {
//         type: 'ConditionalExpression',
//         judge: this.visit(ctx.or_test(1)),
//         judge_true: this.visit(ctx.or_test(0)),
//         judge_false: this.visit(ctx.test())
//       }
//     } else if (ctx.lambdef() !== undefined) {
//       return this.visit(ctx.lambdef())
//     } else {
//       return this.visit(ctx.or_test(0))
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#test_nocond.
//   visitTest_nocond(ctx: Test_nocondContext): ast.Expression {
//     console.log('visitTest_nocond')
//     if (ctx.or_test() !== undefined) {
//       return this.visit(ctx.or_test())
//     } else {
//       return this.visit(ctx.lambdef_nocond())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#lambdef.
//   visitLambdef(ctx: LambdefContext): ast.Expression {
//     console.log('visitLambdef')
//     if (ctx.varargslist() !== undefined) {
//       return {
//         type: 'LambdaDef',
//         arguments: this.visit(ctx.varargslist()),
//         body: this.visit(ctx.test())
//       }
//     } else {
//       return {
//         type: 'LambdaDef',
//         arguments: [],
//         body: this.visit(ctx.test())
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#lambdef_nocond.
//   visitLambdef_nocond(ctx: Lambdef_nocondContext): ast.Expression {
//     console.log('visitLambdef_nocond')
//     if (ctx.varargslist() !== undefined) {
//       return {
//         type: 'LambdaDef',
//         arguments: this.visit(ctx.varargslist()),
//         body: this.visit(ctx.test_nocond())
//       }
//     } else {
//       return {
//         type: 'LambdaDef',
//         arguments: [],
//         body: this.visit(ctx.test_nocond())
//       }
//     }
//   }

// Visit a parse tree produced by Python3Parser#comp_op.
// visitComp_op(ctx: Comp_opContext): ast.Expression {
//   console.log('visitComp_op')
//   const length = ctx.childCount
//   if (length === 1) {
//     if (ctx.getChild(0).text === '<') {
//       return '<'
//     } else if (ctx.getChild(0).text === '>') {
//       return '>'
//     } else if (ctx.getChild(0).text === '==') {
//       return '=='
//     } else if (ctx.getChild(0).text === '>=') {
//       return '>='
//     } else if (ctx.getChild(0).text === '<=') {
//       return '<='
//     } else if (ctx.getChild(0).text === '<>') {
//       return '<>'
//     } else if (ctx.getChild(0).text === '!=') {
//       return '!='
//     } else if (ctx.getChild(0).text === 'is') {
//       return 'is'
//     } else if (ctx.getChild(0).text === 'in') {
//       return 'in'
//     }
//   } else {
//     if (ctx.getChild(0).text === 'not') {
//       return 'not in'
//     }
//   }
//   return 'is not'
// }

//   // Visit a parse tree produced by Python3Parser#star_expr.
//   visitStar_expr(ctx: Star_exprContext): ast.Expression {
//     console.log('visitStar_expr')
//     if (ctx.STAR() !== undefined) {
//       return { type: 'StarExpression', value: this.visit(ctx.expr()) }
//     }
//     return this.visit(ctx.expr())
//   }

//   // Visit a parse tree produced by Python3Parser#trailer.
//   visitTrailer(ctx: TrailerContext): ast.Expression {
//     console.log('visitTrailer')
//     if (ctx.OPEN_PAREN() !== undefined) {
//       return { type: 'ArgList', value: this.visit(ctx.arglist()) }
//     } else if (ctx.OPEN_BRACK() !== undefined) {
//       return {
//         type: 'SubscriptList',
//         value: this.visit(ctx.subscriptlist())
//       }
//     } else {
//       return {
//         type: 'Property',
//         value: ctx.NAME().text
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#subscriptlist.
//   visitSubscriptlist(ctx: SubscriptlistContext): ast.Expression {
//     console.log('visitSubscriptlist')
//     const subscriptlist = []
//     for (let i = 0; i < ctx.subscript().length; i++) {
//       subscriptlist.push(this.visit(ctx.subscript(i)))
//     }
//     return subscriptlist
//   }

//   // Visit a parse tree produced by Python3Parser#subscript.
//   visitSubscript(ctx: SubscriptContext): ast.Expression {
//     console.log('visitSubscript')
//     if (ctx.COLON() !== undefined) {
//       if (ctx.getChild(0).text === ':') {
//         if (ctx.test().length === 1) {
//           if (ctx.sliceop() !== undefined) {
//             return {
//               type: 'SubscriptExpression',
//               start: null,
//               end: this.visit(ctx.test(0)),
//               sep: this.visit(ctx.sliceop())
//             }
//           } else {
//             return {
//               type: 'SubscriptExpression',
//               start: null,
//               end: this.visit(ctx.test(0)),
//               sep: false
//             }
//           }
//         } else {
//           if (ctx.sliceop() !== undefined) {
//             return {
//               type: 'SubscriptExpression',
//               start: null,
//               end: null,
//               sep: this.visit(ctx.sliceop())
//             }
//           } else {
//             return {
//               type: 'SubscriptExpression',
//               start: null,
//               end: null,
//               sep: false
//             }
//           }
//         }
//       } else {
//         if (ctx.test().length === 2) {
//           if (ctx.sliceop() !== undefined) {
//             return {
//               type: 'SubscriptExpression',
//               start: this.visit(ctx.test(0)),
//               end: this.visit(ctx.test(1)),
//               sep: this.visit(ctx.sliceop())
//             }
//           } else {
//             return {
//               type: 'SubscriptExpression',
//               start: this.visit(ctx.test(0)),
//               end: this.visit(ctx.test(1)),
//               sep: false
//             }
//           }
//         } else {
//           if (ctx.sliceop() !== undefined) {
//             return {
//               type: 'SubscriptExpression',
//               start: this.visit(ctx.test(0)),
//               end: null,
//               sep: this.visit(ctx.sliceop())
//             }
//           } else {
//             return {
//               type: 'SubscriptExpression',
//               start: this.visit(ctx.test(0)),
//               end: null,
//               sep: false
//             }
//           }
//         }
//       }
//     } else {
//       return this.visit(ctx.test(0))
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#sliceop.
//   visitSliceop(ctx: SliceopContext): ast.Expression {
//     console.log('visitSliceop')
//     if (ctx.test() !== undefined) {
//       return this.visit(ctx.test())
//     } else {
//       return false
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#exprlist.
//   visitExprlist(ctx: ExprlistContext): ast.Expression {
//     console.log('visitExprlist')
//     const exprlist = []
//     for (let i = 0; i < ctx.star_expr().length; i++) {
//       exprlist.push(this.visit(ctx.star_expr(i)))
//     }
//     return exprlist
//   }

//   // Visit a parse tree produced by Python3Parser#testlist.
//   visitTestlist(ctx: TestlistContext): ast.Expression {
//     console.log('visitTestlist')
//     const testlist = []
//     for (let i = 0; i < ctx.test().length; i++) {
//       testlist.push(this.visit(ctx.test(i)))
//     }
//     return testlist
//   }

//   // Visit a parse tree produced by Python3Parser#dictorsetmaker.
//   visitDictorsetmaker(ctx: DictorsetmakerContext): ast.Expression {
//     console.log('visitDictorsetmaker')
//     if (ctx.COLON().length === 0) {
//       if (ctx.comp_for() !== undefined) {
//         //[i for i in range(4)]
//         return {
//           type: 'Set',
//           element: this.visit(ctx.test(0)),
//           comp_for: this.visit(ctx.comp_for())
//         }
//       } else {
//         //[1,2,3]
//         const element = []
//         for (let i = 0; i < ctx.test().length; i++) {
//           element.push(this.visit(ctx.test(i)))
//         }
//         return {
//           type: 'Set',
//           element: element,
//           comp_for: null
//         }
//       }
//     } else {
//       if (ctx.comp_for() !== undefined) {
//         //[i for i in range(4)]
//         return {
//           type: 'Dict',
//           body: [
//             {
//               key: this.visit(ctx.test(0)),
//               value: {
//                 type: 'List',
//                 element: this.visit(ctx.test(1)),
//                 comp_for: this.visit(ctx.comp_for())
//               }
//             }
//           ]
//         }
//       } else {
//         const kv = []
//         const length = ctx.COLON().length
//         for (let i = 0; i < length; i++) {
//           kv.push({
//             key: this.visit(ctx.test(2 * i)),
//             value: this.visit(ctx.test(2 * i + 1))
//           })
//         }
//         return { type: 'Dict', body: kv }
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#classdef.
//   visitClassdef(ctx: ClassdefContext): ast.Expression {
//     console.log('visitClassdef')
//     if (ctx.arglist() !== undefined) {
//       return {
//         type: 'ClassDefinition',
//         arglist: this.visit(ctx.arglist()),
//         body: this.visit(ctx.suite())
//       }
//     } else {
//       return {
//         type: 'ClassDefinition',
//         arglist: [],
//         body: this.visit(ctx.suite())
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#arglist.
//   visitArglist(ctx: ArglistContext): ast.Expression {
//     console.log('visitArglist')
//     const arglist = []
//     //TODO: implement *args and **kwargs
//     if (ctx.test().length === 0) {
//       for (let i = 0; i < ctx.argument().length; i++) {
//         arglist.push(this.visit(ctx.argument(i)))
//       }
//     } else {
//       throw '*args and **kwargs have not been implemented!'
//     }
//     return arglist
//   }

//   // Visit a parse tree produced by Python3Parser#argument.
//   visitArgument(ctx: ArgumentContext): ast.Expression {
//     console.log('visitArgument')
//     if (ctx.childCount === 3) {
//       return {
//         type: 'Argument',
//         key: this.visit(ctx.test(0)),
//         value: this.visit(ctx.test(1))
//       }
//     } else {
//       if (ctx.comp_for() !== undefined) {
//         // TODO: Support test comp_for argument
//       } else {
//         return {
//           type: 'Argument',
//           key: null,
//           value: this.visit(ctx.test(0))
//         }
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#comp_iter.
//   visitComp_iter(ctx: Comp_iterContext): ast.Expression {
//     console.log('visitComp_iter')
//     if (ctx.comp_for() !== undefined) {
//       return this.visit(ctx.comp_for())
//     } else {
//       return this.visit(ctx.comp_if())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#comp_for.
//   visitComp_for(ctx: Comp_forContext): ast.Expression {
//     console.log('visitComp_for')
//     if (ctx.comp_iter() !== undefined) {
//       return {
//         type: 'CompFor',
//         iter: this.visit(ctx.exprlist()),
//         iterated: this.visit(ctx.or_test()),
//         comp_iter: this.visit(ctx.comp_iter())
//       }
//     } else {
//       return {
//         type: 'CompFor',
//         iter: this.visit(ctx.exprlist()),
//         iterated: this.visit(ctx.or_test()),
//         comp_iter: null
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#comp_if.
//   visitComp_if(ctx: Comp_ifContext): ast.Expression {
//     console.log('visitComp_if')
//     if (ctx.comp_iter() !== undefined) {
//       return {
//         type: 'CompIf',
//         condition: this.visit(ctx.test_nocond()),
//         comp_iter: this.visit(ctx.comp_iter())
//       }
//     } else {
//       return {
//         type: 'CompIf',
//         condition: this.visit(ctx.test_nocond()),
//         comp_iter: null
//       }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#yield_expr.
//   visitYield_expr(ctx: Yield_exprContext): ast.Expression {
//     console.log('visitYield_expr')
//     if (ctx.yield_arg() !== undefined) {
//       return { type: 'YieldStatement', arg: this.visit(ctx.yield_arg()) }
//     } else {
//       return { type: 'YieldStatement', arg: [] }
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#yield_arg.
//   visitYield_arg(ctx: Yield_argContext): ast.Expression {
//     console.log('visitYield_arg')
//     if (ctx.FROM() !== undefined) {
//       return [this.visit(ctx.test())]
//     } else {
//       return this.visit(ctx.testlist())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#number.
//   visitNumber(ctx: NumberContext): ast.Expression {
//     console.log('visitNumber')
//     let value = 0
//     if (ctx.FLOAT_NUMBER() !== undefined) {
//       value = parseFloat(ctx.FLOAT_NUMBER().text)
//       return { type: 'Float', value: value }
//     } else if (ctx.IMAG_NUMBER() !== undefined) {
//       value = ctx.IMAG_NUMBER().text
//       return { type: 'Imag', value: value }
//     } else {
//       return this.visit(ctx.integer())
//     }
//   }

//   // Visit a parse tree produced by Python3Parser#integer.
//   visitInteger(ctx: IntegerContext): ast.Expression {
//     console.log('visitInteger')
//     let value = 0
//     if (ctx.DECIMAL_INTEGER() !== undefined) {
//       value = ctx.DECIMAL_INTEGER().text
//     } else if (ctx.OCT_INTEGER() !== undefined) {
//       value = ctx.OCT_INTEGER().text
//     } else if (ctx.HEX_INTEGER() !== undefined) {
//       value = ctx.HEX_INTEGER().text
//     } else {
//       value = ctx.BIN_INTEGER().text
//     }
//     return { type: 'Integer', value: Number(value) }
//   }

//   visit(tree: File_inputContext): ast.Program {
//     return tree.accept(this)
//   }
// }

// function convertSimpleStatementContext(simplStmt:)

// function convertStatementContext(stmt: StmtContext) : ast.Statement {
//   let simpleStmt = stmt.simple_stmt()
//   if (simple_stmt !== undefined){
//     return convertStatementContext
//   }
// }

// function convertFileInputContext(ls: File_inputContext): ast.Statement[] {
//   let statements = ls.stmt()
//   return statements.map(convertStatementContext)
// }

// function convertExpression(expression: File_inputContext): ast.Expression {
//   const generator = new PythonExpressionGenerator()
//   return generator.visit(expression)
// }

function convertSource(expression: File_inputContext): ast.Program {
  const generator = new PythonProgramGenerator()
  return generator.visit(expression)
}

export function parse(source: string, context: Context) {
  let program: ast.Program | undefined
  // source = readFileSync('src/parser/input.py', 'utf-8')
  if (context.variant === 'python') {
    const inputStream = new ANTLRInputStream(source)
    const lexer = new Python3Lexer(inputStream)
    const tokenStream = new CommonTokenStream(lexer)
    const parser = new Python3Parser(tokenStream)
    parser.buildParseTree = true
    const tree = parser.file_input()
    program = convertSource(tree)
    console.log(util.inspect(program, { showHidden: false, depth: null }))
    /*const visitor = new PythonExpressionGenerator()
    console.log('Visitor')
    const result = visitor.visit(tree)
    console.log('Final Result')
    console.log(JSON.stringify(result))*/
    return program
  } else {
    return undefined
  }
}
/* try {
      const tree = parser.file_input()
      program = convertSource(tree)
    } catch (error) {
      if (error instanceof FatalSyntaxError) {
        context.errors.push(error)
      } else {
        throw error
      }
    }
    const hasErrors = context.errors.find(m => m.severity === ErrorSeverity.ERROR)
    if (program && !hasErrors) {
      return program
    } else {
      return undefined
    }*/

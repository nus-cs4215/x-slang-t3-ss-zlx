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
import { File_inputContext } from '../lang/Python3Parser'
import { FuncdefContext } from '../lang/Python3Parser'
import { ParametersContext } from '../lang/Python3Parser'
import { TypedargslistContext } from '../lang/Python3Parser'
import { TfpdefContext } from '../lang/Python3Parser'
import { VarargslistContext } from '../lang/Python3Parser'
import { VfpdefContext } from '../lang/Python3Parser'
import { Simple_stmtContext } from '../lang/Python3Parser'
import { StmtContext } from '../lang/Python3Parser'
import { Small_stmtContext } from '../lang/Python3Parser'
import { Expr_stmtContext } from '../lang/Python3Parser'
import { Testlist_star_exprContext } from '../lang/Python3Parser'
import { Del_stmtContext } from '../lang/Python3Parser'
import { Pass_stmtContext } from '../lang/Python3Parser'
import { Flow_stmtContext } from '../lang/Python3Parser'
import { Break_stmtContext } from '../lang/Python3Parser'
import { Continue_stmtContext } from '../lang/Python3Parser'
import { Return_stmtContext } from '../lang/Python3Parser'
import { Yield_stmtContext } from '../lang/Python3Parser'
import { Raise_stmtContext } from '../lang/Python3Parser'
import { Import_stmtContext } from '../lang/Python3Parser'
import { Import_nameContext } from '../lang/Python3Parser'
import { Import_fromContext } from '../lang/Python3Parser'
import { Import_as_nameContext } from '../lang/Python3Parser'
import { Dotted_as_nameContext } from '../lang/Python3Parser'
import { Import_as_namesContext } from '../lang/Python3Parser'
import { Dotted_as_namesContext } from '../lang/Python3Parser'
import { Dotted_nameContext } from '../lang/Python3Parser'
import { Global_stmtContext } from '../lang/Python3Parser'
import { Nonlocal_stmtContext } from '../lang/Python3Parser'
import { Assert_stmtContext } from '../lang/Python3Parser'
import { Compound_stmtContext } from '../lang/Python3Parser'
import { If_stmtContext } from '../lang/Python3Parser'
import { While_stmtContext } from '../lang/Python3Parser'
import { For_stmtContext } from '../lang/Python3Parser'
import { Try_stmtContext } from '../lang/Python3Parser'
import { With_stmtContext } from '../lang/Python3Parser'
import { With_itemContext } from '../lang/Python3Parser'
import { SuiteContext } from '../lang/Python3Parser'
import { TestContext } from '../lang/Python3Parser'
import { Test_nocondContext } from '../lang/Python3Parser'
import { LambdefContext } from '../lang/Python3Parser'
import { Lambdef_nocondContext } from '../lang/Python3Parser'
import { Or_testContext } from '../lang/Python3Parser'
import { And_testContext } from '../lang/Python3Parser'
import { Not_testContext } from '../lang/Python3Parser'
import { ComparisonContext } from '../lang/Python3Parser'
import { Star_exprContext } from '../lang/Python3Parser'
import { ExprContext } from '../lang/Python3Parser'
import { Xor_exprContext } from '../lang/Python3Parser'
import { And_exprContext } from '../lang/Python3Parser'
import { Shift_exprContext } from '../lang/Python3Parser'
import { Arith_exprContext } from '../lang/Python3Parser'
import { TermContext } from '../lang/Python3Parser'
import { FactorContext } from '../lang/Python3Parser'
import { PowerContext } from '../lang/Python3Parser'
import { AtomContext } from '../lang/Python3Parser'
import { Testlist_compContext } from '../lang/Python3Parser'
import { TrailerContext } from '../lang/Python3Parser'
import { SubscriptlistContext } from '../lang/Python3Parser'
import { SubscriptContext } from '../lang/Python3Parser'
import { SliceopContext } from '../lang/Python3Parser'
import { ExprlistContext } from '../lang/Python3Parser'
import { TestlistContext } from '../lang/Python3Parser'
import { DictorsetmakerContext } from '../lang/Python3Parser'
import { ClassdefContext } from '../lang/Python3Parser'
import { ArglistContext } from '../lang/Python3Parser'
import { ArgumentContext } from '../lang/Python3Parser'
// import { Comp_iterContext } from '../lang/Python3Parser'
// import { Comp_forContext } from '../lang/Python3Parser'
// import { Comp_ifContext } from '../lang/Python3Parser'
import { Yield_exprContext } from '../lang/Python3Parser'
import { Yield_argContext } from '../lang/Python3Parser'
import { NumberContext } from '../lang/Python3Parser'
import { IntegerContext } from '../lang/Python3Parser'
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
import { readFileSync } from 'fs'

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
    console.log('visitSimple_stmt')
    const stmts = []
    for (let i = 0; i < tree.small_stmt().length; i++) {
      stmts.push(this.visit(tree.small_stmt(i)))
    }
    return { type: 'BlockStatement', body: stmts }
  }

  // Visit a parse tree produced by Python3Parser#compound_stmt.
  visitCompound_stmt(ctx: Compound_stmtContext): ast.Statement {
    console.log('visitCompound_stmt')
    if (ctx.if_stmt() !== undefined) {
      return this.visit(ctx.if_stmt()!)
    } else if (ctx.while_stmt() !== undefined) {
      return this.visit(ctx.while_stmt()!)
    } else if (ctx.for_stmt() !== undefined) {
      return this.visit(ctx.for_stmt()!)
    } else if (ctx.try_stmt() !== undefined) {
      return this.visit(ctx.try_stmt()!)
    } else if (ctx.with_stmt() !== undefined) {
      return this.visit(ctx.with_stmt()!)
    } else if (ctx.funcdef() !== undefined) {
      return this.visit(ctx.funcdef()!)
    } else if (ctx.classdef() !== undefined) {
      return this.visit(ctx.classdef()!)
    } else {
      throw new FatalSyntaxError(
        {
          start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
          end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
        },
        'Decorator: Not Implemented'
      ) // TODO: Implememnt Decorator
      // return this.visit(ctx.decorated()!)
    }
  }

  visitSmall_stmt(ctx: Small_stmtContext): ast.Statement {
    console.log('visitSmall_stmt')
    if (ctx.expr_stmt() !== undefined) {
      const generator = new PythonExpressionGenerator()
      return { type: 'ExpressionStatement', expression: generator.visit(ctx.expr_stmt()!) }
    } else if (ctx.del_stmt() !== undefined) {
      return this.visit(ctx.del_stmt()!)
    } else if (ctx.pass_stmt() !== undefined) {
      return this.visit(ctx.pass_stmt()!)
    } else if (ctx.flow_stmt() !== undefined) {
      return this.visit(ctx.flow_stmt()!)
    } else if (ctx.import_stmt() !== undefined) {
      return this.visit(ctx.import_stmt()!)
    } else if (ctx.global_stmt() !== undefined) {
      return this.visit(ctx.global_stmt()!)
    } else if (ctx.nonlocal_stmt() !== undefined) {
      return this.visit(ctx.nonlocal_stmt()!)
    } else {
      return this.visit(ctx.assert_stmt()!)
    }
  }

  visitStmt(ctx: StmtContext): ast.Statement {
    console.log('visitStmt')
    if (ctx.simple_stmt() !== undefined) {
      return this.visit(ctx.simple_stmt()!)
    } else {
      return this.visit(ctx.compound_stmt()!)
    }
  }

  // Visit a parse tree produced by Python3Parser#del_stmt.
  visitDel_stmt(ctx: Del_stmtContext): ast.Statement {
    console.log('visitSivisitDel_stmt')
    const generator = new PythonExpressionListGenerator()
    return { type: 'DeleteStatement', elements: generator.visit(ctx.exprlist()) } // PELgenerator's exprlist implemented as returned an Array
  }

  // Visit a parse tree produced by Python3Parser#pass_stmt.
  visitPass_stmt(ctx: Pass_stmtContext): ast.Statement {
    console.log('visitPass_stmt')
    return { type: 'PassStatement' }
  }

  // Visit a parse tree produced by Python3Parser#flow_stmt.
  visitFlow_stmt(ctx: Flow_stmtContext): ast.Statement {
    console.log('visitFlow_stmt')
    if (ctx.break_stmt() !== undefined) {
      return this.visit(ctx.break_stmt()!)
    } else if (ctx.continue_stmt() !== undefined) {
      return this.visit(ctx.continue_stmt()!)
    } else if (ctx.return_stmt() !== undefined) {
      return this.visit(ctx.return_stmt()!)
    } else if (ctx.raise_stmt() !== undefined) {
      return this.visit(ctx.raise_stmt()!)
    } else {
      return this.visit(ctx.yield_stmt()!)
    }
  }

  // Visit a parse tree produced by Python3Parser#import_stmt.
  visitImport_stmt(ctx: Import_stmtContext): ast.Statement {
    console.log('visitImport_stmt')
    const generator = new PythonExpressionGenerator()
    if (ctx.import_name() !== undefined) {
      return { type: 'ImportStatement', expression: generator.visit(ctx.import_name()!) }
    } else {
      return { type: 'ImportStatement', expression: generator.visit(ctx.import_from()!) }
    }
  }

  // Visit a parse tree produced by Python3Parser#break_stmt.
  visitBreak_stmt(ctx: Break_stmtContext): ast.Statement {
    console.log('visitBreak_stmt')
    return { type: 'BreakStatement' }
  }

  // Visit a parse tree produced by Python3Parser#continue_stmt.
  visitContinue_stmt(ctx: Continue_stmtContext): ast.Statement {
    console.log('visitContinue_stmt')
    return { type: 'ContinueStatement' }
  }

  // Visit a parse tree produced by Python3Parser#return_stmt.
  visitReturn_stmt(ctx: Return_stmtContext): ast.Statement {
    console.log('visitReturn_stmt')
    const generator = new PythonExpressionListGenerator()
    if (ctx.testlist() !== undefined) {
      return {
        type: 'ReturnPythonStatement',
        argument: generator.visit(ctx.testlist()!)
      }
    } else {
      return {
        type: 'ReturnPythonStatement',
        argument: null
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#global_stmt.
  visitGlobal_stmt(ctx: Global_stmtContext): ast.Statement {
    console.log('visitGlobal_stmt')
    const generator = new PythonExpressionGenerator()
    const globallist = []
    for (let i = 0; i < ctx.NAME().length; i++) {
      globallist.push(generator.visit(ctx.NAME(i)))
    }
    return { type: 'GlobalStatement', globallist: globallist }
  }

  // Visit a parse tree produced by Python3Parser#nonlocal_stmt.
  visitNonlocal_stmt(ctx: Nonlocal_stmtContext): ast.Statement {
    console.log('visitNonlocal_stmt')
    const generator = new PythonExpressionGenerator()
    const nonlocallist = []
    for (let i = 0; i < ctx.NAME().length; i++) {
      nonlocallist.push(generator.visit(ctx.NAME(i)))
    }
    return { type: 'NonlocalStatement', nonlocallist: nonlocallist }
  }

  // Visit a parse tree produced by Python3Parser#if_stmt.
  visitIf_stmt(ctx: If_stmtContext): ast.Statement {
    console.log('visitIf_stmt')
    let right: ast.Statement
    const suite_length = ctx.suite().length
    const test_length = ctx.test().length
    if (ctx.ELSE() !== undefined) {
      right = this.visit(ctx.suite(suite_length - 1))
    } else {
      right = { type: 'EmptyStatement' }
    }
    const generator = new PythonExpressionGenerator()
    for (let i = test_length - 1; i >= 0; i--) {
      right = {
        type: 'IfStatement',
        test: generator.visit(ctx.test(i)),
        consequent: this.visit(ctx.suite(i)),
        alternate: right
      }
    }
    return right
  }

  // Visit a parse tree produced by Python3Parser#while_stmt.
  visitWhile_stmt(ctx: While_stmtContext): ast.Statement {
    console.log('visitWhile_stmt')
    const generator = new PythonExpressionGenerator()
    if (ctx.suite().length > 1) {
      return {
        type: 'WhilePythonStatement',
        test: generator.visit(ctx.test()),
        body: this.visit(ctx.suite(0)),
        els: this.visit(ctx.suite(1))
      }
    } else {
      return {
        type: 'WhilePythonStatement',
        test: generator.visit(ctx.test()),
        body: this.visit(ctx.suite(0)),
        els: null
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#for_stmt.
  visitFor_stmt(ctx: For_stmtContext): ast.Statement {
    console.log('visitFor_stmt')
    const generator = new PythonExpressionGenerator()
    const listgenerator = new PythonExpressionListGenerator()
    if (ctx.suite().length > 1) {
      return {
        type: 'ForPythonStatement',
        iter: generator.visit(ctx.exprlist()), // This is PEGenerator's exprlist, not in PELGenerator's. So it haven't been implemented.
        iterated: listgenerator.visit(ctx.testlist()), //
        body: this.visit(ctx.suite(0)),
        els: this.visit(ctx.suite(1))
      }
    } else {
      return {
        type: 'ForPythonStatement',
        iter: generator.visit(ctx.exprlist()),
        iterated: listgenerator.visit(ctx.testlist()),
        body: this.visit(ctx.suite(0)),
        els: null
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#assert_stmt.
  visitAssert_stmt(ctx: Assert_stmtContext): ast.Statement {
    console.log('visitAssert_stmt')
    const generator = new PythonExpressionGenerator()
    return { type: 'AssertStatement', expression: generator.visit(ctx.test(0)) }
  }

  // Visit a parse tree produced by Python3Parser#funcdef.
  visitFuncdef(ctx: FuncdefContext): ast.Statement {
    console.log('visitFuncdef')
    const generator = new PythonExpressionGenerator()
    return {
      type: 'FunctionPythonDeclaration',
      id: { type: 'Identifier', name: ctx.NAME().text },
      params: generator.visit(ctx.parameters()),
      body: this.visit(ctx.suite())
    }
  }

  // Visit a parse tree produced by Python3Parser#classdef.
  visitClassdef(ctx: ClassdefContext): ast.Statement {
    console.log('visitClassdef')
    const generator = new PythonExpressionListGenerator()
    if (ctx.arglist() !== undefined) {
      return {
        type: 'ClassPythonDeclaration',
        id: { type: 'Identifier', name: ctx.NAME().text },
        arglist: generator.visit(ctx.arglist()!),
        body: this.visit(ctx.suite())
      }
    } else {
      return {
        type: 'ClassPythonDeclaration',
        id: { type: 'Identifier', name: ctx.NAME().text },
        arglist: new Array<ast.Expression>(),
        body: this.visit(ctx.suite())
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#try_stmt.
  visitTry_stmt(ctx: Try_stmtContext): ast.Statement {
    console.log('visitTry_stmt')
    const trybody = this.visit(ctx.getChild(2))
    const exceptbody = this.visit(ctx.getChild(5))
    let elsebody = null
    let finallybody = null
    for (let i = 0; i < ctx.childCount; i++) {
      if (ctx.getChild(i).text === ':') {
      } else if (ctx.getChild(i - 1).text === 'else') {
        elsebody = this.visit(ctx.getChild(i + 1))
      } else if (ctx.getChild(i - 1).text === 'finally') {
        finallybody = this.visit(ctx.getChild(i + 1))
      }
    }
    // exceptbody.push({
    //   condition: this.visit(ctx.getChild(i - 1)),
    //   body: this.visit(ctx.getChild(i + 1))
    // })

    return {
      type: 'TryPythonStatement',
      trybody: trybody,
      exceptbody: exceptbody,
      elsebody: elsebody,
      finallybody: finallybody
    }
  }

  // Visit a parse tree produced by Python3Parser#raise_stmt.
  visitRaise_stmt(ctx: Raise_stmtContext): ast.Statement {
    const generator = new PythonExpressionGenerator()
    console.log('visitRaise_stmt')
    if (ctx.test() !== undefined) {
      return { type: 'RaiseStatement', info: generator.visit(ctx.test(0)) }
    } else {
      return { type: 'RaiseStatement', info: null }
    }
  }

  // Visit a parse tree produced by Python3Parser#yield_stmt.
  visitYield_stmt(ctx: Yield_stmtContext): ast.Statement {
    console.log('visitYield_stmt')
    const generator = new PythonExpressionGenerator()
    return { type: 'YieldStatement', expression: generator.visit(ctx.yield_expr()) }
  }

  // Visit a parse tree produced by Python3Parser#with_stmt.
  visitWith_stmt(ctx: With_stmtContext): ast.Statement {
    console.log('visitWith_stmt')
    const generator = new PythonExpressionGenerator()
    return {
      type: 'WithStatement',
      object: generator.visit(ctx.with_item(0)),
      body: this.visit(ctx.suite())
    }
  }

  // Visit a parse tree produced by Python3Parser#suite.
  visitSuite(ctx: SuiteContext): ast.Statement {
    console.log('visitSuite')
    if (ctx.simple_stmt() !== undefined) {
      return this.visit(ctx.simple_stmt()!)
    } else {
      const stmtlist = []
      for (let i = 0; i < ctx.stmt().length; i++) {
        stmtlist.push(this.visit(ctx.stmt(i)))
      }
      return { type: 'BlockStatement', body: stmtlist }
    }
  }
}

class PythonExpressionGenerator
  extends AbstractParseTreeVisitor<ast.Expression>
  implements Python3Visitor<ast.Expression> {
  defaultResult(): ast.Expression {
    // throw new Error("Method not implemented")
    return (undefined as unknown) as ast.Expression
  }

  // Visit a parse tree produced by Python3Parser#expr_stmt.
  visitExpr_stmt(ctx: Expr_stmtContext): ast.Expression {
    console.log('visitExpr_stmt')
    if (ctx.augassign() !== undefined) {
      if (ctx.augassign()!.text === '+=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '+=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '-=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '-=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '*=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '*=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '/=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '/=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '%=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '%=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '&=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '&=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '|=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '|=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '^=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '^=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '<<=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '<<=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '>>=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '>>=',
          right: this.visit(ctx.getChild(2))
        }
      } else if (ctx.augassign()!.text === '**=') {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '**=',
          right: this.visit(ctx.getChild(2))
        }
      } else {
        return {
          type: 'AssignmentExpression',
          left: this.visit(ctx.testlist_star_expr(0)),
          operator: '//=',
          right: this.visit(ctx.getChild(2))
        }
      }
    } else {
      const length = ctx.childCount
      let right = this.visit(ctx.getChild(length - 1))
      for (let i = length; i > 1; i = i - 2) {
        const temp_left = this.visit(ctx.getChild(i - 3))
        right = {
          type: 'AssignmentExpression',
          operator: '=',
          left: temp_left,
          right: right
        }
      }
      return right
    }
  }

  // Visit a parse tree produced by Python3Parser#testlist_star_expr.
  visitTestlist_star_expr(ctx: Testlist_star_exprContext): ast.Expression {
    console.log('visitTestlist_star_expr')
    const length = ctx.childCount
    if (length === 1) {
      if (ctx.test() !== undefined) {
        return this.visit(ctx.test(0))
      } else {
        return this.visit(ctx.star_expr(0))
      }
    } else {
      throw new FatalSyntaxError(
        {
          start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
          end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
        },
        'SubPython do not support expressions like a, b = b, a'
      ) // TODO: support a, b = b, a
      // const valuelist = [this.visit(ctx.getChild(0))]
      // for (let i = 1; i < length; i++) {
      //   if (ctx.getChild(i).text !== ',') {
      //     valuelist.push(this.visit(ctx.getChild(i)))
      //   }
      // }
      // return { type: 'TestListStarExpression', value: valuelist }
    }
  }

  // Visit a parse tree produced by Python3Parser#test.
  visitTest(ctx: TestContext): ast.Expression {
    console.log('visitTest')
    if (ctx.IF() !== undefined) {
      return {
        type: 'ConditionalExpression', // consequent if test else alternate
        test: this.visit(ctx.or_test(1)),
        consequent: this.visit(ctx.or_test(0)),
        alternate: this.visit(ctx.test()!)
      }
    } else if (ctx.lambdef() !== undefined) {
      return this.visit(ctx.lambdef()!)
    } else {
      return this.visit(ctx.or_test(0))
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
  visitPower(ctx: PowerContext): ast.Expression {
    console.log('visitPower')
    let atom = this.visit(ctx.atom())
    const trailer_list = []
    if (ctx.trailer().length > 0) {
      for (let i = 0; i < ctx.trailer().length; i++) {
        trailer_list.push(this.visit(ctx.trailer(i)))
      }
    }
    if (trailer_list.length !== 0) {
      atom = { type: 'TrailerExpression', base: atom, trailer: trailer_list }
      //Property: return a dict. arglist and subscriptlist: return a list
    }
    if (ctx.factor() !== undefined) {
      atom = {
        type: 'BinaryExpression',
        operator: '**',
        left: atom,
        right: this.visit(ctx.factor()!)
      }
    }
    return atom
  }

  // Visit a parse tree produced by Python3Parser#atom.
  visitAtom(ctx: AtomContext): ast.Expression {
    console.log('visitAtom')
    if (ctx.TRUE() !== undefined) {
      return { type: 'Literal', value: true, raw: ctx.text }
    } else if (ctx.FALSE() !== undefined) {
      return { type: 'Literal', value: false, raw: ctx.text }
    } else if (ctx.NONE() !== undefined) {
      return { type: 'Literal', value: null, raw: ctx.text }
    } else if (ctx.number() !== undefined) {
      return this.visit(ctx.number()!)
    } else if (ctx.NAME() !== undefined) {
      return { type: 'Identifier', name: ctx.NAME()!.text }
    } else if (ctx.str().length > 0) {
      let value = ''
      for (let i = 0; i < ctx.str().length; i++) {
        let temp = ctx.str(i).text
        if (temp.startsWith('"')) {
          temp = temp.replace(/^"+|"+$/g, '')
        } else if (temp.startsWith("'")) {
          temp = temp.replace(/^'+|'+$/g, '')
        }
        value = value + temp
      }
      return { type: 'Literal', value: value, raw: ctx.text }
    } else if (ctx.OPEN_PAREN() !== undefined) {
      if (ctx.yield_expr() !== undefined) {
        return this.visit(ctx.yield_expr()!)
      } else if (ctx.testlist_comp() !== undefined) {
        const generator = new PythonExpressionListGenerator()
        return { type: 'SequenceExpression', expressions: generator.visit(ctx.testlist_comp()!) }
      } else {
        return { type: 'SequenceExpression', expressions: new Array<ast.Expression>() }
      }
    } else if (ctx.OPEN_BRACK() !== undefined) {
      if (ctx.testlist_comp() !== undefined) {
        const generator = new PythonExpressionListGenerator()
        return { type: 'ArrayExpression', elements: generator.visit(ctx.testlist_comp()!) }
      } else {
        return { type: 'ArrayExpression', elements: new Array<ast.Expression>() }
      }
    } else if (ctx.OPEN_BRACE() !== undefined) {
      if (ctx.dictorsetmaker() !== undefined) {
        return this.visit(ctx.dictorsetmaker()!)
      } else {
        return { type: 'DictExpression', elements: new Array<ast.Expression>() }
      }
    } else {
      throw new FatalSyntaxError(
        {
          start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
          end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
        },
        'Atom: Not defined'
      )
    }
  }

  // Visit a parse tree produced by Python3Parser#number.
  visitNumber(ctx: NumberContext): ast.Expression {
    console.log('visitNumber')
    let value = 0
    if (ctx.FLOAT_NUMBER() !== undefined) {
      value = parseFloat(ctx.FLOAT_NUMBER()!.text)
      return { type: 'Literal', value: value, raw: ctx.text }
    } else if (ctx.IMAG_NUMBER() !== undefined) {
      return { type: 'Literal', value: ctx.IMAG_NUMBER()!.text, raw: ctx.text }
    } else {
      return this.visit(ctx.integer()!)
    }
  }

  // Visit a parse tree produced by Python3Parser#integer.
  visitInteger(ctx: IntegerContext): ast.Expression {
    console.log('visitInteger')
    let value = ''
    if (ctx.DECIMAL_INTEGER() !== undefined) {
      value = ctx.DECIMAL_INTEGER()!.text
    } else if (ctx.OCT_INTEGER() !== undefined) {
      value = ctx.OCT_INTEGER()!.text
    } else if (ctx.HEX_INTEGER() !== undefined) {
      value = ctx.HEX_INTEGER()!.text
    } else {
      value = ctx.BIN_INTEGER()!.text
    }
    return { type: 'Literal', value: Number(value) }
  }

  // Visit a parse tree produced by Python3Parser#trailer.
  visitTrailer(ctx: TrailerContext): ast.Expression {
    console.log('visitTrailer')
    if (ctx.OPEN_PAREN() !== undefined) {
      if (ctx.arglist() !== undefined) {
        const generator = new PythonExpressionListGenerator()
        return { type: 'ArgListExpression', body: generator.visit(ctx.arglist()!) }
      } else {
        return { type: 'ArgListExpression', body: new Array<ast.Expression>() }
      }
    } else if (ctx.OPEN_BRACK() !== undefined) {
      const generator = new PythonExpressionListGenerator()
      return {
        type: 'SubscriptListExpression',
        body: generator.visit(ctx.subscriptlist()!)
      }
    } else {
      return {
        type: 'Identifier',
        name: ctx.NAME()!.text
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#subscript.
  visitSubscript(ctx: SubscriptContext): ast.Expression {
    console.log('visitSubscript')
    if (ctx.COLON() !== undefined) {
      if (ctx.getChild(0).text === ':') {
        if (ctx.test().length === 1) {
          if (ctx.sliceop() !== undefined) {
            return {
              type: 'SubscriptExpression',
              start: null,
              end: this.visit(ctx.test(0)),
              sep: this.visit(ctx.sliceop()!)
            }
          } else {
            return {
              type: 'SubscriptExpression',
              start: null,
              end: this.visit(ctx.test(0)),
              sep: null
            }
          }
        } else {
          if (ctx.sliceop() !== undefined) {
            return {
              type: 'SubscriptExpression',
              start: null,
              end: null,
              sep: this.visit(ctx.sliceop()!)
            }
          } else {
            return {
              type: 'SubscriptExpression',
              start: null,
              end: null,
              sep: null
            }
          }
        }
      } else {
        if (ctx.test().length === 2) {
          if (ctx.sliceop() !== undefined) {
            return {
              type: 'SubscriptExpression',
              start: this.visit(ctx.test(0)),
              end: this.visit(ctx.test(1)),
              sep: this.visit(ctx.sliceop()!)
            }
          } else {
            return {
              type: 'SubscriptExpression',
              start: this.visit(ctx.test(0)),
              end: this.visit(ctx.test(1)),
              sep: null
            }
          }
        } else {
          if (ctx.sliceop() !== undefined) {
            return {
              type: 'SubscriptExpression',
              start: this.visit(ctx.test(0)),
              end: null,
              sep: this.visit(ctx.sliceop()!)
            }
          } else {
            return {
              type: 'SubscriptExpression',
              start: this.visit(ctx.test(0)),
              end: null,
              sep: null
            }
          }
        }
      }
    } else {
      return this.visit(ctx.test(0))
    }
  }

  // Visit a parse tree produced by Python3Parser#sliceop.
  visitSliceop(ctx: SliceopContext): ast.Expression {
    console.log('visitSliceop')
    if (ctx.test() !== undefined) {
      return this.visit(ctx.test()!)
    } else {
      return { type: 'Literal', value: 1 }
    }
  }

  // Visit a parse tree produced by Python3Parser#parameters.
  visitParameters(ctx: ParametersContext): ast.Expression {
    console.log('visitParameters')
    const generator = new PythonExpressionListGenerator()
    if (ctx.typedargslist() !== undefined) {
      return { type: 'ParameterExpression', expressions: generator.visit(ctx.typedargslist()!) }
    } else {
      return { type: 'ParameterExpression', expressions: new Array<ast.Expression>() }
    }
  }

  // Visit a parse tree produced by Python3Parser#argument.
  visitArgument(ctx: ArgumentContext): ast.Expression {
    console.log('visitArgument')
    if (ctx.childCount === 3) {
      return {
        type: 'ArgumentExpression',
        key: this.visit(ctx.test(0)),
        value: this.visit(ctx.test(1))
      }
    } else {
      if (ctx.comp_for() !== undefined) {
        // TODO: Support test comp_for argument
        throw new FatalSyntaxError(
          {
            start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
            end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
          },
          'comp_for: Not implememnted'
        )
      } else {
        return {
          type: 'ArgumentExpression',
          key: null,
          value: this.visit(ctx.test(0))
        }
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#star_expr.
  visitStar_expr(ctx: Star_exprContext): ast.Expression {
    console.log('visitStar_expr')
    if (ctx.STAR() !== undefined) {
      throw new FatalSyntaxError(
        {
          start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
          end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
        },
        'star expression: Not implememnted'
      )
    }
    return this.visit(ctx.expr())
  }

  // Visit a parse tree produced by Python3Parser#dictorsetmaker.
  visitDictorsetmaker(ctx: DictorsetmakerContext): ast.Expression {
    console.log('visitDictorsetmaker')
    if (ctx.COLON().length === 0) {
      if (ctx.comp_for() !== undefined) {
        //[i for i in range(4)]
        // return {
        //   type: 'Set',
        //   element: this.visit(ctx.test(0)),
        //   comp_for: this.visit(ctx.comp_for())
        // }
        throw new FatalSyntaxError(
          {
            start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
            end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
          },
          'comp_for: Not implememnted'
        )
      } else {
        //[1,2,3]
        const element = new Array<ast.Expression>()
        for (let i = 0; i < ctx.test().length; i++) {
          element.push(this.visit(ctx.test(i)))
        }
        return {
          type: 'SetExpression',
          elements: element
        }
      }
    } else {
      if (ctx.comp_for() !== undefined) {
        //[i for i in range(4)]
        // return {
        //   type: 'DictExpression',
        //   elements: [
        //     {
        //       key: this.visit(ctx.test(0)),
        //       value: {
        //         type: 'ArrayExpression',
        //         element: this.visit(ctx.test(1)),
        //         comp_for: this.visit(ctx.comp_for())
        //       }
        //     }
        //   ]
        // }
        throw new FatalSyntaxError(
          {
            start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
            end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
          },
          'comp_for: Not implememnted'
        )
      } else {
        const kv = new Array<ast.Expression>()
        const length = ctx.COLON().length
        for (let i = 0; i < length; i++) {
          kv.push({
            type: 'KeyValueExpression',
            key: this.visit(ctx.test(2 * i)),
            value: this.visit(ctx.test(2 * i + 1))
          })
        }
        return { type: 'DictExpression', elements: kv }
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#import_name.
  visitImport_name(ctx: Import_nameContext): ast.Expression {
    console.log('visitImport_name')
    const generator = new PythonExpressionListGenerator()
    return {
      type: 'ImportFromExpression',
      from: null,
      imported: generator.visit(ctx.dotted_as_names())
    }
  }

  // Visit a parse tree produced by Python3Parser#import_from.
  visitImport_from(ctx: Import_fromContext): ast.Expression {
    console.log('visitImport_from')
    const generator = new PythonExpressionListGenerator()
    return {
      type: 'ImportFromExpression',
      from: this.visit(ctx.dotted_name()!),
      imported: generator.visit(ctx.import_as_names()!)
    }
  }

  // Visit a parse tree produced by Python3Parser#import_as_name.
  visitImport_as_name(ctx: Import_as_nameContext): ast.Expression {
    console.log('visitImport_as_name')
    if (ctx.AS() !== undefined) {
      return {
        type: 'ImportedElementExpression',
        name: { type: 'Literal', value: ctx.NAME(0).text },
        alias: { type: 'Literal', value: ctx.NAME(1).text }
      }
    } else {
      return {
        type: 'ImportedElementExpression',
        name: { type: 'Literal', value: ctx.NAME(0).text },
        alias: null
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#dotted_as_name.
  visitDotted_as_name(ctx: Dotted_as_nameContext): ast.Expression {
    console.log('visitDotted_as_name')
    if (ctx.NAME() !== undefined) {
      return {
        type: 'ImportedElementExpression',
        name: this.visit(ctx.dotted_name()),
        alias: { type: 'Literal', value: ctx.NAME()!.text }
      }
    } else {
      return {
        type: 'ImportedElementExpression',
        name: this.visit(ctx.dotted_name()),
        alias: null
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#dotted_name.
  visitDotted_name(ctx: Dotted_nameContext): ast.Expression {
    console.log('visitDotted_name')
    return { type: 'Literal', value: ctx.text }
  }

  // Visit a parse tree produced by Python3Parser#yield_expr.
  visitYield_expr(ctx: Yield_exprContext): ast.Expression {
    console.log('visitYield_expr')
    const generator = new PythonExpressionListGenerator()
    if (ctx.yield_arg() !== undefined) {
      return {
        type: 'YieldExpression',
        argument: generator.visit(ctx.yield_arg()!),
        delegate: true
      } // I dont know what delegate stands for
    } else {
      return { type: 'YieldExpression', argument: null, delegate: true }
    }
  }

  // Visit a parse tree produced by Python3Parser#tfpdef.
  visitTfpdef(ctx: TfpdefContext): ast.Expression {
    console.log('visitTfpdef')
    return { type: 'Literal', value: ctx.NAME().text }
  }

  // Visit a parse tree produced by Python3Parser#tfpdef.
  visitVfpdef(ctx: VfpdefContext): ast.Expression {
    console.log('visitVfpdef')
    return { type: 'Literal', value: ctx.NAME().text }
  }

  // Visit a parse tree produced by Python3Parser#with_item.
  visitWith_item(ctx: With_itemContext): ast.Expression {
    console.log('visitWith_item')
    if (ctx.expr() !== undefined) {
      return {
        type: 'WithItemExpression',
        object: this.visit(ctx.test()),
        alias: this.visit(ctx.expr()!)
      }
    } else {
      return {
        type: 'WithItemExpression',
        object: this.visit(ctx.test()),
        alias: null
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#test_nocond.
  visitTest_nocond(ctx: Test_nocondContext): ast.Expression {
    console.log('visitTest_nocond')
    if (ctx.or_test() !== undefined) {
      return this.visit(ctx.or_test()!)
    } else {
      return this.visit(ctx.lambdef_nocond()!)
    }
  }

  // Visit a parse tree produced by Python3Parser#lambdef.
  visitLambdef(ctx: LambdefContext): ast.Expression {
    console.log('visitLambdef')
    const generator = new PythonExpressionListGenerator()
    if (ctx.varargslist() !== undefined) {
      return {
        type: 'LambdaDefExpression',
        arguments: generator.visit(ctx.varargslist()!),
        body: this.visit(ctx.test())
      }
    } else {
      return {
        type: 'LambdaDefExpression',
        arguments: null,
        body: this.visit(ctx.test())
      }
    }
  }

  // Visit a parse tree produced by Python3Parser#lambdef_nocond.
  visitLambdef_nocond(ctx: Lambdef_nocondContext): ast.Expression {
    console.log('visitLambdef_nocond')
    const generator = new PythonExpressionListGenerator()
    if (ctx.varargslist() !== undefined) {
      return {
        type: 'LambdaDefExpression',
        arguments: generator.visit(ctx.varargslist()!),
        body: this.visit(ctx.test_nocond())
      }
    } else {
      return {
        type: 'LambdaDefExpression',
        arguments: null,
        body: this.visit(ctx.test_nocond())
      }
    }
  }
}

class PythonExpressionListGenerator
  extends AbstractParseTreeVisitor<ast.Expression[]>
  implements Python3Visitor<ast.Expression[]> {
  defaultResult(): ast.Expression[] {
    // throw new Error("Method not implemented")
    return (undefined as unknown) as ast.Expression[]
  }

  // Visit a parse tree produced by Python3Parser#testlist_comp.
  visitTestlist_comp(ctx: Testlist_compContext): ast.Expression[] {
    console.log('visitTestlist_comp')
    if (ctx.comp_for() !== undefined) {
      throw new FatalSyntaxError(
        {
          start: { line: ctx._start.line, column: ctx._start.charPositionInLine },
          end: { line: ctx._stop!.line, column: ctx._stop!.charPositionInLine }
        },
        'comp_for: Not implememnted'
      )
      //TODO implement comp_for
      //[i for i in range(4)]
      // return {
      //   type: 'List',
      //   element: this.visit(ctx.test(0)),
      //   comp_for: this.visit(ctx.comp_for())
      // }
    } else {
      //[1,2,3]
      const element = []
      const generator = new PythonExpressionGenerator()
      for (let i = 0; i < ctx.test().length; i++) {
        element.push(generator.visit(ctx.test(i)))
      }
      return element
    }
  }

  // Visit a parse tree produced by Python3Parser#subscriptlist.
  visitSubscriptlist(ctx: SubscriptlistContext): ast.Expression[] {
    console.log('visitSubscriptlist')
    const subscriptlist = []
    const generator = new PythonExpressionGenerator()
    for (let i = 0; i < ctx.subscript().length; i++) {
      subscriptlist.push(generator.visit(ctx.subscript(i)))
    }
    return subscriptlist
  }

  // Visit a parse tree produced by Python3Parser#exprlist.
  visitExprlist(ctx: ExprlistContext): ast.Expression[] {
    console.log('visitExprlist')
    const exprlist = []
    const generator = new PythonExpressionGenerator()
    for (let i = 0; i < ctx.star_expr().length; i++) {
      exprlist.push(generator.visit(ctx.star_expr(i)))
    }
    return exprlist
  }

  // Visit a parse tree produced by Python3Parser#typedargslist.
  visitTypedargslist(ctx: TypedargslistContext): ast.Expression[] {
    console.log('visitTypedargslist')
    // TODO: support *args, **kwargs
    const length = ctx.childCount
    const returnlist = new Array<ast.Expression>()
    const comma = []
    let current = -1
    const generator = new PythonExpressionGenerator()
    if (ctx.STAR() === undefined && ctx.POWER() === undefined) {
      for (let i = 0; i < length; i++) {
        if (ctx.getChild(i).text === ',') {
          comma.push(i)
        }
      }
      comma.push(length)
      for (let i = 0; i < comma.length; i++) {
        if (comma[i] - current === 2) {
          returnlist.push({
            type: 'TypedargslistExpression',
            name: generator.visit(ctx.getChild(comma[i] - 1)),
            default: null
          })
          current = current + 2
        } else {
          returnlist.push({
            type: 'TypedargslistExpression',
            name: generator.visit(ctx.getChild(comma[i] - 3)),
            default: generator.visit(ctx.getChild(comma[i] - 1))
          })
          current = current + 4
        }
      }
      return returnlist
    } else {
      throw '*args and **kwargs have not been implemented!'
    }
  }

  // Visit a parse tree produced by Python3Parser#varargslist.
  visitVarargslist(ctx: VarargslistContext): ast.Expression[] {
    console.log('visitVarargslist')
    // TODO: support *args, **kwargs
    const length = ctx.childCount
    const returnlist = new Array<ast.Expression>()
    const comma = []
    let current = -1
    const generator = new PythonExpressionGenerator()
    if (ctx.STAR() === undefined && ctx.POWER() === undefined) {
      for (let i = 0; i < length; i++) {
        if (ctx.getChild(i).text === ',') {
          comma.push(i)
        }
      }
      comma.push(length)
      for (let i = 0; i < comma.length; i++) {
        if (comma[i] - current === 2) {
          returnlist.push({
            type: 'TypedargslistExpression',
            name: generator.visit(ctx.getChild(comma[i] - 1)),
            default: null
          })
          current = current + 2
          console.log(generator.visit(ctx.getChild(comma[i] - 1)))
        } else {
          returnlist.push({
            type: 'TypedargslistExpression',
            name: generator.visit(ctx.getChild(comma[i] - 3)),
            default: generator.visit(ctx.getChild(comma[i] - 1))
          })
          current = current + 4
        }
      }
      return returnlist
    } else {
      throw '*args and **kwargs have not been implemented!'
    }
  }

  // Visit a parse tree produced by Python3Parser#arglist.
  visitArglist(ctx: ArglistContext): ast.Expression[] {
    console.log('visitArglist')
    const arglist = []
    const generator = new PythonExpressionGenerator()
    //TODO: implement *args and **kwargs
    if (ctx.test().length === 0) {
      for (let i = 0; i < ctx.argument().length; i++) {
        arglist.push(generator.visit(ctx.argument(i)))
      }
      return arglist
    } else {
      throw '*args and **kwargs have not been implemented!'
    }
  }

  // Visit a parse tree produced by Python3Parser#testlist.
  visitTestlist(ctx: TestlistContext): ast.Expression[] {
    console.log('visitTestlist')
    const testlist = []
    const generator = new PythonExpressionGenerator()
    for (let i = 0; i < ctx.test().length; i++) {
      testlist.push(generator.visit(ctx.test(i)))
    }
    return testlist
  }

  // Visit a parse tree produced by Python3Parser#import_as_namast.
  visitImport_as_names(ctx: Import_as_namesContext): ast.Expression[] {
    console.log('visitImport_as_names')
    const returnlist = new Array<ast.Expression>()
    const generator = new PythonExpressionGenerator()
    for (let i = 0; i < ctx.import_as_name().length; i++) {
      returnlist.push(generator.visit(ctx.import_as_name(i)))
    }
    return returnlist
  }

  // Visit a parse tree produced by Python3Parser#dotted_as_namast.
  visitDotted_as_names(ctx: Dotted_as_namesContext): ast.Expression[] {
    console.log('visitDotted_as_names')
    const returnlist = new Array<ast.Expression>()
    const generator = new PythonExpressionGenerator()
    for (let i = 0; i < ctx.dotted_as_name().length; i++) {
      returnlist.push(generator.visit(ctx.dotted_as_name(i)))
    }
    return returnlist
  }

  // Visit a parse tree produced by Python3Parser#yield_arg.
  visitYield_arg(ctx: Yield_argContext): ast.Expression[] {
    console.log('visitYield_arg')
    const result = new Array<ast.Expression>()
    const generator = new PythonExpressionGenerator()
    if (ctx.FROM() !== undefined) {
      result.push(generator.visit(ctx.test()!))
      return result
    } else {
      return this.visit(ctx.testlist()!)
    }
  }
}

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

//   // Visit a parse tree produced by Python3Parser#vfpdef.
//   visitVfpdef(ctx: VfpdefContext): ast.Expression {
//     console.log('visitVfpdef')
//     return ctx.NAME().text
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

function convertSource(expression: File_inputContext): ast.Program {
  const generator = new PythonProgramGenerator()
  return generator.visit(expression)
}

export function parse(source: string, context: Context) {
  let program: ast.Program | undefined
  source = readFileSync('src/parser/input.py', 'utf-8')
  if (context.variant === 'python') {
    const inputStream = new ANTLRInputStream(source)
    const lexer = new Python3Lexer(inputStream)
    console.log(lexer.text)
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

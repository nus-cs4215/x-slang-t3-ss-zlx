// import * as es from 'estree'
import * as ast from '../parser/ast'
import { AllowedDeclarations, BlockExpression, FunctionDeclarationExpression } from '../types'

export const getVariableDecarationName = (decl: ast.VariableDeclaration) =>
  (decl.declarations[0].id as ast.Identifier).name

export const locationDummyNode = (line: number, column: number) =>
  literal('Dummy', { start: { line, column }, end: { line, column } })

export const identifier = (name: string, loc?: ast.SourceLocation | null): ast.Identifier => ({
  type: 'Identifier',
  name,
  loc
})

export const literal = (
  value: string | number | boolean,
  loc?: ast.SourceLocation | null
): ast.Literal => ({
  type: 'Literal',
  value,
  loc
})

export const memberExpression = (
  object: ast.Expression,
  propertyString: string
): ast.MemberExpression => ({
  type: 'MemberExpression',
  object,
  computed: false,
  optional: false,
  property: identifier(propertyString)
})

export const declaration = (
  name: string,
  kind: AllowedDeclarations,
  init: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.VariableDeclaration => ({
  type: 'VariableDeclaration',
  declarations: [
    {
      type: 'VariableDeclarator',
      id: identifier(name),
      init
    }
  ],
  kind,
  loc
})

export const constantDeclaration = (
  name: string,
  init: ast.Expression,
  loc?: ast.SourceLocation | null
) => declaration(name, 'const', init, loc)

export const callExpression = (
  callee: ast.Expression,
  args: ast.Expression[],
  loc?: ast.SourceLocation | null
): ast.CallExpression => ({
  type: 'CallExpression',
  callee,
  arguments: args,
  optional: false,
  loc
})

export const expressionStatement = (expression: ast.Expression): ast.ExpressionStatement => ({
  type: 'ExpressionStatement',
  expression
})

export const blockArrowFunction = (
  params: ast.Identifier[],
  body: ast.Statement[] | ast.BlockStatement,
  loc?: ast.SourceLocation | null
): ast.ArrowFunctionExpression => ({
  type: 'ArrowFunctionExpression',
  expression: false,
  generator: false,
  params,
  body: Array.isArray(body) ? blockStatement(body) : body,
  loc
})

export const functionExpression = (
  params: ast.Identifier[],
  body: ast.Statement[] | ast.BlockStatement,
  loc?: ast.SourceLocation | null
): ast.FunctionExpression => ({
  type: 'FunctionExpression',
  id: null,
  async: false,
  generator: false,
  params,
  body: Array.isArray(body) ? blockStatement(body) : body,
  loc
})

export const blockStatement = (body: ast.Statement[]): ast.BlockStatement => ({
  type: 'BlockStatement',
  body
})

export const program = (body: ast.Statement[]): ast.Program => ({
  type: 'Program',
  sourceType: 'module',
  body
})

export const returnStatement = (
  returned: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.ReturnStatement => ({
  type: 'ReturnStatement',
  argument: returned,
  loc
})

export const returnPythonStatement = (
  returned: ast.Expression[],
  loc?: ast.SourceLocation | null
): ast.ReturnPythonStatement => ({
  type: 'ReturnPythonStatement',
  argument: returned,
  loc
})

export const property = (key: string, value: ast.Expression): ast.Property => ({
  type: 'Property',
  method: false,
  shorthand: false,
  computed: false,
  key: identifier(key),
  value,
  kind: 'init'
})

export const objectExpression = (properties: ast.Property[]): ast.ObjectExpression => ({
  type: 'ObjectExpression',
  properties
})

export const mutateToCallExpression = (
  node: ast.Node,
  callee: ast.Expression,
  args: ast.Expression[]
) => {
  node.type = 'CallExpression'
  node = node as ast.CallExpression
  node.callee = callee
  node.arguments = args
}

export const mutateToAssignmentExpression = (
  node: ast.Node,
  left: ast.Identifier,
  right: ast.Expression
) => {
  node.type = 'AssignmentExpression'
  node = node as ast.AssignmentExpression
  node.left = left
  node.right = right
}

export const mutateToExpressionStatement = (node: ast.Node, expr: ast.Expression) => {
  node.type = 'ExpressionStatement'
  node = node as ast.ExpressionStatement
  node.expression = expr
}

export const mutateToReturnStatement = (node: ast.Node, expr: ast.Expression) => {
  node.type = 'ReturnStatement'
  node = node as ast.ReturnStatement
  node.argument = expr
}

export const mutateToMemberExpression = (
  node: ast.Node,
  obj: ast.Expression,
  prop: ast.Expression
) => {
  node.type = 'MemberExpression'
  node = node as ast.MemberExpression
  node.object = obj
  node.property = prop
  node.computed = false
}

export const logicalExpression = (
  operator: ast.LogicalOperator,
  left: ast.Expression,
  right: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.LogicalExpression => ({
  type: 'LogicalExpression',
  operator,
  left,
  right,
  loc
})

export const conditionalExpression = (
  judge: ast.Expression,
  judge_true: ast.Expression,
  judge_false: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.ConditionalExpression => ({
  type: 'ConditionalExpression',
  test: judge,
  consequent: judge_true,
  alternate: judge_false,
  loc
})

export const arrayExpression = (elements: ast.Expression[]): ast.ArrayExpression => ({
  type: 'ArrayExpression',
  elements
})

export const subscriptListExpression = (
  body: ast.Expression[],
  loc: ast.SourceLocation | null
): ast.SubscriptListExpression => ({
  type: 'SubscriptListExpression',
  body,
  loc
})

export const assignmentExpression = (
  left: ast.Identifier,
  right: ast.Expression
): ast.AssignmentExpression => ({
  type: 'AssignmentExpression',
  operator: '=',
  left,
  right
})

export const binaryExpression = (
  operator: ast.BinaryOperator,
  left: ast.Expression,
  right: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.BinaryExpression => ({
  type: 'BinaryExpression',
  operator,
  left,
  right,
  loc
})

export const unaryExpression = (
  operator: ast.UnaryOperator,
  argument: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.UnaryExpression => ({
  type: 'UnaryExpression',
  operator,
  prefix: true,
  argument,
  loc
})

// primitive: undefined is a possible value
export const primitive = (value: any): ast.Expression => {
  return value === undefined ? identifier('undefined') : literal(value)
}

export const functionDeclarationExpression = (
  id: ast.Identifier,
  params: ast.Pattern[],
  body: ast.BlockStatement,
  loc?: ast.SourceLocation | null
): FunctionDeclarationExpression => ({
  type: 'FunctionExpression',
  id,
  params,
  body,
  loc
})

export const functionDeclaration = (
  id: ast.Identifier | null,
  params: ast.Pattern[],
  body: ast.BlockStatement,
  loc?: ast.SourceLocation | null
): ast.FunctionDeclaration => ({
  type: 'FunctionDeclaration',
  id,
  params,
  body,
  loc
})

export const functionPythonDeclaration = (
  id: ast.Identifier,
  params: ast.Expression,
  body: ast.Statement,
  loc?: ast.SourceLocation | null
): ast.FunctionPythonDeclaration => ({
  type: 'FunctionPythonDeclaration',
  id,
  params,
  body,
  loc
})

export const parameterExpression = (
  expressions: ast.Expression[],
  loc?: ast.SourceLocation | null
): ast.ParameterExpression => ({
  type: 'ParameterExpression',
  expressions,
  loc
})

export const typedargslistExpression = (
  name: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.TypedargslistExpression => ({
  type: 'TypedargslistExpression',
  name,
  default: null,
  loc
})

export const trailerExpression = (
  base: ast.Expression,
  trailer: ast.Expression[],
  loc?: ast.SourceLocation | null
): ast.TrailerExpression => ({
  type: 'TrailerExpression',
  base,
  trailer,
  loc
})

export const argListExpression = (
  body: ast.Expression[],
  loc?: ast.SourceLocation | null
): ast.ArgListExpression => ({
  type: 'ArgListExpression',
  body,
  loc
})

export const argumentExpression = (
  key: ast.Expression | null,
  value: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.ArgumentExpression => ({
  type: 'ArgumentExpression',
  key,
  value,
  loc
})

export const blockExpression = (
  body: ast.Statement[],
  loc?: ast.SourceLocation | null
): BlockExpression => ({
  type: 'BlockExpression',
  body,
  loc
})

export const arrowFunctionExpression = (
  params: ast.Pattern[],
  body: ast.Expression | ast.BlockStatement,
  loc?: ast.SourceLocation | null
): ast.ArrowFunctionExpression => ({
  type: 'ArrowFunctionExpression',
  expression: body.type !== 'BlockStatement',
  generator: false,
  params,
  body,
  loc
})

export const variableDeclaration = (
  declarations: ast.VariableDeclarator[],
  loc?: ast.SourceLocation | null
): ast.VariableDeclaration => ({
  type: 'VariableDeclaration',
  kind: 'const',
  declarations,
  loc
})

export const variableDeclarator = (
  id: ast.Pattern,
  init: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.VariableDeclarator => ({
  type: 'VariableDeclarator',
  id,
  init,
  loc
})

export const DictExpression = (elements: ast.Expression[]): ast.DictExpression => ({
  type: 'DictExpression',
  elements
})

export const KeyValueExpression = (
  key: ast.Expression,
  value: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.KeyValueExpression => ({
  type: 'KeyValueExpression',
  key,
  value,
  loc
})

export const ifStatement = (
  test: ast.Expression,
  consequent: ast.BlockStatement,
  alternate: ast.Statement,
  loc?: ast.SourceLocation | null
): ast.IfStatement => ({
  type: 'IfStatement',
  test,
  consequent,
  alternate,
  loc
})

export const whileStatement = (
  body: ast.BlockStatement,
  test: ast.Expression,
  loc?: ast.SourceLocation | null
): ast.WhileStatement => ({
  type: 'WhileStatement',
  test,
  body,
  loc
})

export const whilePythonStatement = (
  test: ast.Expression,
  body: ast.Statement,
  els: ast.Statement,
  loc?: ast.SourceLocation | null
): ast.WhilePythonStatement => ({
  type: 'WhilePythonStatement',
  test,
  body,
  els,
  loc
})

export const forPythonStatement = (
  iter: ast.Expression,
  iterated: ast.Expression[],
  body: ast.Statement,
  els: ast.Statement | null,
  loc?: ast.SourceLocation | null
): ast.ForPythonStatement => ({
  type: 'ForPythonStatement',
  iter,
  iterated,
  body,
  els,
  loc
})

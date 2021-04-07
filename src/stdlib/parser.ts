// import * as es from 'estree'
import * as ast from '../parser/ast'

import { parse as sourceParse } from '../parser/parser'
import { Context, Value } from '../types'
import { oneLine } from '../utils/formatters'
import { vector_to_list } from './list'

class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

function unreachable() {
  // tslint:disable-next-line:no-console
  console.error(oneLine`
    UNREACHABLE CODE REACHED!
    Please file an issue at
    https://github.com/source-academy/js-slang/issues
    if you see this.
  `)
}

// sequences of expressions of length 1
// can be represented by the element itself,
// instead of constructing a sequence

function makeSequenceIfNeeded(exs: ast.Node[]) {
  return exs.length === 1
    ? transform(exs[0])
    : vector_to_list(['sequence', vector_to_list(exs.map(transform))])
}

function makeBlockIfNeeded(exs: ast.Node[]) {
  return hasDeclarationAtToplevel(exs)
    ? vector_to_list(['block', makeSequenceIfNeeded(exs)])
    : makeSequenceIfNeeded(exs)
}

// checks if sequence has declaration at toplevel
// (outside of any block)
function hasDeclarationAtToplevel(exs: ast.Node[]) {
  return exs.reduce(
    (b, ex) => b || ex.type === 'VariableDeclaration' || ex.type === 'FunctionDeclaration',
    false
  )
}

type ASTTransformers = Map<string, (node: ast.Node) => Value>

const transformers: ASTTransformers = new Map([
  [
    'Program',
    (node: ast.Node) => {
      node = node as ast.Program
      return makeSequenceIfNeeded(node.body)
    }
  ],

  [
    'BlockStatement',
    (node: ast.BlockStatement) => {
      return makeBlockIfNeeded(node.body)
    }
  ],

  [
    'ExpressionStatement',
    (node: ast.ExpressionStatement) => {
      return transform(node.expression)
    }
  ],

  [
    'IfStatement',
    (node: ast.IfStatement) => {
      return vector_to_list([
        'conditional_statement',
        transform(node.test),
        transform(node.consequent),
        transform(node.alternate as ast.Statement)
      ])
    }
  ],

  [
    'FunctionDeclaration',
    (node: ast.FunctionDeclaration) => {
      return vector_to_list([
        'function_declaration',
        transform(node.id as ast.Identifier),
        vector_to_list(node.params.map(transform)),
        makeBlockIfNeeded(node.body.body)
      ])
    }
  ],

  [
    'VariableDeclaration',
    (node: ast.VariableDeclaration) => {
      if (node.kind === 'let') {
        return vector_to_list([
          'variable_declaration',
          transform(node.declarations[0].id),
          transform(node.declarations[0].init as ast.Expression)
        ])
      } else if (node.kind === 'const') {
        return vector_to_list([
          'constant_declaration',
          transform(node.declarations[0].id),
          transform(node.declarations[0].init as ast.Expression)
        ])
      } else {
        unreachable()
        throw new ParseError('Invalid declaration kind')
      }
    }
  ],

  [
    'ReturnStatement',
    (node: ast.ReturnStatement) => {
      return vector_to_list(['return_statement', transform(node.argument as ast.Expression)])
    }
  ],

  [
    'CallExpression',
    (node: ast.CallExpression) => {
      return vector_to_list([
        'application',
        transform(node.callee),
        vector_to_list(node.arguments.map(transform))
      ])
    }
  ],

  [
    'UnaryExpression',
    (node: ast.UnaryExpression) => {
      return vector_to_list([
        'unary_operator_combination',
        node.operator === '-' ? '-unary' : node.operator,
        transform(node.argument)
      ])
    }
  ],

  [
    'BinaryExpression',
    (node: ast.BinaryExpression) => {
      return vector_to_list([
        'binary_operator_combination',
        node.operator,
        transform(node.left),
        transform(node.right)
      ])
    }
  ],

  [
    'LogicalExpression',
    (node: ast.LogicalExpression) => {
      return vector_to_list([
        'logical_composition',
        node.operator,
        transform(node.left),
        transform(node.right)
      ])
    }
  ],

  [
    'ConditionalExpression',
    (node: ast.ConditionalExpression) => {
      return vector_to_list([
        'conditional_expression',
        transform(node.test),
        transform(node.consequent),
        transform(node.alternate)
      ])
    }
  ],

  [
    'ArrowFunctionExpression',
    (node: ast.ArrowFunctionExpression) => {
      return vector_to_list([
        'lambda_expression',
        vector_to_list(node.params.map(transform)),
        node.body.type === 'BlockStatement'
          ? // body.body: strip away one layer of block:
            // The body of a function is the statement
            // inside the curly bracast.
            makeBlockIfNeeded(node.body.body)
          : vector_to_list(['return_statement', transform(node.body)])
      ])
    }
  ],

  [
    'Identifier',
    (node: ast.Identifier) => {
      return vector_to_list(['name', node.name])
    }
  ],

  [
    'Literal',
    (node: ast.Literal) => {
      return vector_to_list(['literal', node.value])
    }
  ],

  [
    'ArrayExpression',
    (node: ast.ArrayExpression) => {
      return vector_to_list(['array_expression', vector_to_list(node.elements.map(transform))])
    }
  ],

  [
    'AssignmentExpression',
    (node: ast.AssignmentExpression) => {
      if (node.left.type === 'Identifier') {
        return vector_to_list([
          'assignment',
          transform(node.left as ast.Identifier),
          transform(node.right)
        ])
      } else if (node.left.type === 'MemberExpression') {
        return vector_to_list([
          'object_assignment',
          transform(node.left as ast.Expression),
          transform(node.right)
        ])
      } else {
        unreachable()
        throw new ParseError('Invalid assignment')
      }
    }
  ],

  [
    'ForStatement',
    (node: ast.ForStatement) => {
      return vector_to_list([
        'for_loop',
        transform(node.init as ast.VariableDeclaration | ast.Expression),
        transform(node.test as ast.Expression),
        transform(node.update as ast.Expression),
        transform(node.body)
      ])
    }
  ],

  [
    'WhileStatement',
    (node: ast.WhileStatement) => {
      return vector_to_list(['while_loop', transform(node.test), transform(node.body)])
    }
  ],

  [
    'BreakStatement',
    (node: ast.BreakStatement) => {
      return vector_to_list(['break_statement'])
    }
  ],

  [
    'ContinueStatement',
    (node: ast.ContinueStatement) => {
      return vector_to_list(['continue_statement'])
    }
  ],

  [
    'ObjectExpression',
    (node: ast.ObjectExpression) => {
      return vector_to_list(['object_expression', vector_to_list(node.properties.map(transform))])
    }
  ],

  [
    'MemberExpression',
    (node: ast.MemberExpression) => {
      const key =
        node.property.type === 'Identifier'
          ? vector_to_list(['property', node.property.name])
          : transform(node.property)
      return vector_to_list(['object_access', transform(node.object), key])
    }
  ],

  [
    'Property',
    (node: ast.Property) => {
      if (node.key.type === 'Literal') {
        return [node.key.value, transform(node.value)]
      } else if (node.key.type === 'Identifier') {
        return [vector_to_list(['property', node.key.name]), transform(node.value)]
      } else {
        unreachable()
        throw new ParseError('Invalid property key type')
      }
    }
  ],

  [
    'ImportDeclaration',
    (node: ast.ImportDeclaration) => {
      return vector_to_list([
        'import_declaration',
        vector_to_list(node.specifiers.map(transform)),
        node.source.value
      ])
    }
  ],

  [
    'ImportSpecifier',
    (node: ast.ImportSpecifier) => {
      return vector_to_list(['name', node.imported.name])
    }
  ],

  [
    'ClassDeclaration',
    (node: ast.ClassDeclaration) => {
      return vector_to_list([
        'class_declaration',
        vector_to_list([
          'name',
          node.id === null ? null : node.id.name,
          node.superClass === null || node.superClass === undefined
            ? null
            : transform(node.superClass),
          node.body.body.map(transform)
        ])
      ])
    }
  ],

  [
    'NewExpression',
    (node: ast.NewExpression) => {
      return vector_to_list([
        'new_expression',
        transform(node.callee),
        vector_to_list(node.arguments.map(transform))
      ])
    }
  ],

  [
    'MethodDefinition',
    (node: ast.MethodDefinition) => {
      return vector_to_list([
        'method_definition',
        node.kind,
        transform(node.key),
        transform(node.value)
      ])
    }
  ],

  [
    'FunctionExpression',
    (node: ast.FunctionExpression) => {
      return vector_to_list([
        'lambda_expression',
        vector_to_list(node.params.map(transform)),
        makeBlockIfNeeded(node.body.body)
      ])
    }
  ],

  [
    'ThisExpression',
    (node: ast.ThisExpression) => {
      return vector_to_list(['this_expression'])
    }
  ],

  [
    'Super',
    (node: ast.Super) => {
      return vector_to_list(['super_expression'])
    }
  ],

  [
    'TryStatement',
    (node: ast.TryStatement) => {
      return vector_to_list([
        'try_statement',
        transform(node.block),
        node.handler === null || node.handler === undefined
          ? null
          : vector_to_list(['name', (node.handler.param as ast.Identifier).name]),
        node.handler === null || node.handler === undefined ? null : transform(node.handler.body)
      ])
    }
  ],
  [
    'ThrowStatement',
    (node: ast.ThrowStatement) => {
      return vector_to_list(['throw_statement', transform(node.argument)])
    }
  ]
])

function transform(node: ast.Node) {
  if (transformers.has(node.type)) {
    const transformer = transformers.get(node.type) as (n: ast.Node) => Value
    const transformed = transformer(node)
    // Attach location information
    if (
      transformed !== null &&
      transformed !== undefined &&
      typeof transformed === 'object' &&
      transformed.tag !== undefined
    ) {
      transformed.loc = node.loc
    }
    return transformed
  } else {
    unreachable()
    throw new ParseError('Cannot transform unknown type: ' + node.type)
  }
}

export function parse(x: string, context: Context): Value {
  const program = sourceParse(x, context)
  if (context.errors.length > 0) {
    throw new ParseError(context.errors[0].explain())
  }

  if (program !== undefined) {
    return transform(program)
  } else {
    unreachable()
    throw new ParseError('Invalid parse')
  }
}

// import * as es from 'estree'
import * as ast from '../parser/ast'
import { RuntimeSourceError } from '../errors/runtimeSourceError'
import { ErrorSeverity, ErrorType, Value } from '../types'

const LHS = ' on left hand side of operation'
const RHS = ' on right hand side of operation'

export class TypeError extends RuntimeSourceError {
  public type = ErrorType.RUNTIME
  public severity = ErrorSeverity.ERROR
  public location: ast.SourceLocation

  constructor(node: ast.Node, public side: string, public expected: string, public got: string) {
    super(node)
  }

  public explain() {
    return `Expected ${this.expected}${this.side}, got ${this.got}.`
  }

  public elaborate() {
    return this.explain()
  }
}

// We need to define our own typeof in order for null/array to display properly in error messages
const typeOf = (v: Value) => {
  if (v === null) {
    return 'null'
  } else if (Array.isArray(v)) {
    return 'array'
  } else {
    return typeof v
  }
}

const isNumber = (v: Value) => typeOf(v) === 'number'
// See section 4 of https://2ality.com/2012/12/arrays.html
// v >>> 0 === v checks that v is a valid unsigned 32-bit int
// tslint:disable-next-line:no-bitwise
const isArrayIndex = (v: Value) => isNumber(v) && v >>> 0 === v && v < 2 ** 32 - 1
const isString = (v: Value) => typeOf(v) === 'string'
const isBool = (v: Value) => typeOf(v) === 'boolean'
const isObject = (v: Value) => typeOf(v) === 'object'
const isArray = (v: Value) => typeOf(v) === 'array'

export const checkUnaryExpression = (node: ast.Node, operator: ast.UnaryOperator, value: Value) => {
  if ((operator === '+' || operator === '-') && !isNumber(value)) {
    return new TypeError(node, '', 'number', typeOf(value))
    } else if (operator === 'not' && !isBool(value)) {
      return new TypeError(node, '', 'boolean', typeOf(value))
  } else {
    return undefined
  }
}

export const checkBinaryExpression = (
  node: ast.Node,
  operator: ast.BinaryOperator,
  left: Value,
  right: Value
) => {
  switch (operator) {
    case '-':
    case '*':
    case '/':
    case '//':
    case '%':
    // case 'and':
    case '&':
    // case 'or':
    case '|':
      if (!isNumber(left)) {
        return new TypeError(node, LHS, 'number', typeOf(left))
      } else if (!isNumber(right)) {
        return new TypeError(node, RHS, 'number', typeOf(right))
      } else {
        return
      }
    case '+':
    case '<':
    case '<=':
    case '>':
    case '>=':
    case '!=':
    case '==':
      if (isNumber(left)) {
        return isNumber(right) ? undefined : new TypeError(node, RHS, 'number', typeOf(right))
      } else if (isString(left)) {
        return isString(right) ? undefined : new TypeError(node, RHS, 'string', typeOf(right))
      } else {
        return new TypeError(node, LHS, 'string or number', typeOf(left))
      }
    default:
      return
  }
}

export const checkConditionalExpression = (
  node: ast.Node,
  judge: Value,
  judge_true: Value,
  judge_false: Value
) => {
  return isBool(judge) ? undefined : new TypeError(node, ' as judge', 'boolean', typeOf(judge))
}

export const checkIfStatement = (node: ast.Node, test: Value) => {
  return isBool(test) ? undefined : new TypeError(node, ' as condition', 'boolean', typeOf(test))
}

export const checkMemberAccess = (node: ast.Node, obj: Value, prop: Value) => {
  if (isObject(obj)) {
    return isString(prop) ? undefined : new TypeError(node, ' as prop', 'string', typeOf(prop))
  } else if (isArray(obj)) {
    return isArrayIndex(prop)
      ? undefined
      : isNumber(prop)
      ? new TypeError(node, ' as prop', 'array index', 'other number')
      : new TypeError(node, ' as prop', 'array index', typeOf(prop))
  } else {
    return new TypeError(node, '', 'object or array', typeOf(obj))
  }
}

export const isIdentifier = (node: any): node is ast.Identifier => {
  return (node as ast.Identifier).name !== undefined
}

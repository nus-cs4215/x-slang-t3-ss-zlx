/* tslint:disable:max-classes-per-file */
const util = require('util')
import * as ast from '../parser/ast'
// import * as es from 'estree'
import * as constants from '../constants'
import * as errors from '../errors/errors'
import { RuntimeSourceError } from '../errors/runtimeSourceError'
import { Context, Environment, Frame, Value } from '../types'
// import { constantDeclaration} from '../utils/astCreator'
import { primitive } from '../utils/astCreator'
import {
  evaluateBinaryExpression,
  evaluateConditionalExpression,
  // evaluateConditionalExpression,
  evaluateUnaryExpression
} from '../utils/operators'
import * as rttc from '../utils/rttc'
import Closure from './closure'
// import { constant } from 'lodash'
// import { stat } from 'fs'

class BreakValue {}

class ContinueValue {}

class ReturnValue {
  constructor(public value: Value) {}
}

class TailCallReturnValue {
  constructor(public callee: Closure, public args: Value[], public node: ast.CallExpression) {}
}

class Thunk {
  public value: Value
  public isMemoized: boolean
  constructor(public exp: ast.Node, public env: Environment) {
    this.isMemoized = false
    this.value = null
  }
}

function* forceIt(val: any, context: Context): Value {
  if (val instanceof Thunk) {
    if (val.isMemoized) return val.value

    pushEnvironment(context, val.env)
    const evalRes = yield* actualValue(val.exp, context)
    popEnvironment(context)
    val.value = evalRes
    val.isMemoized = true
    return evalRes
  } else return val
}

export function* actualValue(exp: ast.Node, context: Context): Value {
  const evalResult = yield* evaluate(exp, context)
  const forced = yield* forceIt(evalResult, context)
  return forced
}

const createEnvironment = (
  closure: Closure,
  args: Value[],
  callExpression?: ast.CallExpression
): Environment => {
  const environment: Environment = {
    name: closure.functionName, // TODO: Change this
    tail: closure.environment,
    head: {}
  }
  if (callExpression) {
    environment.callExpression = {
      ...callExpression,
      arguments: args.map(primitive)
    }
  }
  closure.node.params.forEach((param, index) => {
    const ident = param as ast.Identifier
    environment.head[ident.name] = args[index]
  })
  return environment
}

const createBlockEnvironment = (
  context: Context,
  name = 'blockEnvironment',
  head: Frame = {}
): Environment => {
  return {
    name,
    tail: currentEnvironment(context),
    head
  }
}

const handleRuntimeError = (context: Context, error: RuntimeSourceError): never => {
  context.errors.push(error)
  context.runtime.environments = context.runtime.environments.slice(
    -context.numberOfOuterEnvironments
  )
  throw error
}

function getVariable(context: Context, name: string) {
  let environment: Environment | null = context.runtime.environments[0]
  while(environment) {
    if (environment.head.hasOwnProperty(name)) {
      return environment.head[name]
    } else {
      environment = environment.tail
    }
  }
  return handleRuntimeError(context, new errors.UndefinedVariable(name, context.runtime.nodes[0]))
}

function assignVariable(context: Context, name: string, value: Value) {
  let environment: Environment | null = context.runtime.environments[0]
  environment.head[name] = value
  return undefined
}

const DECLARED_BUT_NOT_YET_ASSIGNED = Symbol('Used to implement hoisting')

function declareIdentifier(context: Context, name: string, node: ast.Node) {
  const environment = currentEnvironment(context)
  if (environment.head.hasOwnProperty(name)) {
    const descriptors = Object.getOwnPropertyDescriptors(environment.head)

    return handleRuntimeError(
      context,
      new errors.VariableRedeclaration(node, name, descriptors[name].writable)
    )
  }
  environment.head[name] = DECLARED_BUT_NOT_YET_ASSIGNED
  return environment
}

function declareVariables(context: Context, node: ast.VariableDeclaration) {
  for (const declaration of node.declarations) {
    declareIdentifier(context, (declaration.id as ast.Identifier).name, node)
  }
}

function declareFunctionsAndVariables(context: Context, node: ast.BlockStatement) {
  for (const statement of node.body) {
    switch (statement.type) {
      case 'VariableDeclaration':
        declareVariables(context, statement)
        break
      case 'FunctionDeclaration':
        declareIdentifier(context, (statement.id as ast.Identifier).name, statement)
        break
    }
  }
}

function* visit(context: Context, node: ast.Node) {
  context.runtime.nodes.unshift(node)
  yield context
}

function* leave(context: Context) {
  context.runtime.nodes.shift()
  yield context
}

const currentEnvironment = (context: Context) => context.runtime.environments[0]
const replaceEnvironment = (context: Context, environment: Environment) =>
  (context.runtime.environments[0] = environment)
const popEnvironment = (context: Context) => context.runtime.environments.shift()
const pushEnvironment = (context: Context, environment: Environment) =>
  context.runtime.environments.unshift(environment)

const checkNumberOfArguments = (
  context: Context,
  callee: Closure | Value,
  args: Value[],
  exp: ast.CallExpression
) => {
  if (callee instanceof Closure) {
    if (callee.node.params.length !== args.length) {
      return handleRuntimeError(
        context,
        new errors.InvalidNumberOfArguments(exp, callee.node.params.length, args.length)
      )
    }
  } else {
    if (callee.hasVarArgs === false && callee.length !== args.length) {
      return handleRuntimeError(
        context,
        new errors.InvalidNumberOfArguments(exp, callee.length, args.length)
      )
    }
  }
  return undefined
}

export type Evaluator<T extends ast.Node> = (node: T, context: Context) => IterableIterator<Value>

function* evaluateBlockSatement(context: Context, node: ast.BlockStatement) {
  declareFunctionsAndVariables(context, node)
  let result
  for (const statement of node.body) {
    result = yield* evaluate(statement, context)
    if (
      result instanceof ReturnValue ||
      result instanceof TailCallReturnValue ||
      result instanceof BreakValue ||
      result instanceof ContinueValue
    ) {
      break
    }
  }
  return result
}

/**
 * WARNING: Do not use object literal shorthands, e.g.
 *   {
 *     *Literal(node: es.Literal, ...) {...},
 *     *ThisExpression(node: es.ThisExpression, ..._ {...},
 *     ...
 *   }
 * They do not minify well, raising uncaught syntax errors in production.
 * See: https://github.com/webpack/webpack/issues/7566
 */
// tslint:disable:object-literal-shorthand
// prettier-ignore
export const evaluators: { [nodeType: string]: Evaluator<ast.Node> } = {  

    BlockStatement: function* (node: ast.BlockStatement, context: Context) {
      for (let i=0; i< node.body.length - 1; i++){
        yield * evaluate(node.body[i], context)
      } 
      return yield * evaluate(node.body[node.body.length - 1], context)
    },

    Literal: function*(node: ast.Literal, context: Context) {
        return node.value
    },

    Identifier: function*(node: ast.Identifier, context: Context) {
      return getVariable(context, node.name)
    },

    ExpressionStatement: function*(node: ast.ExpressionStatement, context: Context) {
      return yield* evaluate(node.expression, context)
    },

    ArrayExpression: function*(node: ast.ArrayExpression, context: Context) {
        throw new Error("Array expressions not supported in x-slang");
    },

    // STRETCH GOAL
    // DebuggerStatement: function*(node: es.DebuggerStatement, context: Context) {
    //     yield
    // },

    UnaryExpression: function*(node: ast.UnaryExpression, context: Context) {
        const value = yield* actualValue(node.argument, context)

        const error = rttc.checkUnaryExpression(node, node.operator, value)
        if (error) {
            return handleRuntimeError(context, error)
        }
        return evaluateUnaryExpression(node.operator, value)
    },

    BinaryExpression: function*(node: ast.BinaryExpression, context: Context) {
        const left = yield* evaluate(node.left, context)
        const right = yield* evaluate(node.right, context)
        const error = rttc.checkBinaryExpression(node, node.operator, left, right)
        if (error) {
            return handleRuntimeError(context, error)
        }
        return evaluateBinaryExpression(node.operator, left, right)
    },

    ConditionalExpression: function*(node: ast.ConditionalExpression, context: Context) {
        const test = yield* evaluate(node.test, context)
        const consequent = yield* evaluate(node.consequent, context)
        const alternate = yield* evaluate(node.alternate, context)
        const error = rttc.checkConditionalExpression(node, test, consequent, alternate)
        if (error) {
            return handleRuntimeError(context, error)
        }
        return evaluateConditionalExpression(test, consequent, alternate)
    },

    AssignmentExpression: function*(node: ast.AssignmentExpression, context: Context) {
      const id = node.left as ast.Identifier
      const value = yield* evaluate(node.right, context)
      assignVariable(context, id.name, value)
      return value
    },

    // SequenceExpression: function*(node: ast.SequenceExpression, context: Context) {
    //   let expressions 
    // }

    // WhileStatement: function*(node: ast.WhilePythonStatement, context: Context) {
    //   let value: any // tslint:disable-line
    //   while (
    //     // tslint:disable-next-line
    //     (yield* actualValue(node.test, context)) &&
    //     !(value instanceof ReturnValue) &&
    //     !(value instanceof BreakValue) &&
    //     !(value instanceof TailCallReturnValue)
    //   ) {
    //     value = yield* actualValue(node.body, context)
    //   }
    //   if (value instanceof BreakValue) {
    //     return undefined
    //   }
    //   return value
    // },

    ForStatement: function*(node: ast.ForStatement, context: Context) {
      // Create a new block scope for the loop variables
      throw new Error("For statements not supported in x-slang");
    },

    // STRETCH GOAL
    // ContinueStatement: function*(node: es.ContinueStatement, context: Context) {
    //     throw new Error("Continue statements not supported in x-slang");
    // },

    // STRETCH GOAL
    // BreakStatement: function*(node: es.BreakStatement, context: Context) {
    //     throw new Error("Break statements not supported in x-slang");
    // },

    FunctionDeclaration: function*(node: ast.FunctionPythonDeclaration, context: Context) {
      console.log("REACHED HERE!")
      // const id = node.id as ast.Identifier
      // // tslint:disable-next-line:no-any
      // const closure = new Closure(node, currentEnvironment(context), context)
      // assignVariable(context, id.name, closure)
      // console.log(util.inspect(context, { showHidden: false, depth: null }))
      // return undefined
    },

    // ReturnStatement: function*(node: ast.ReturnPythonStatement, context: Context) {
    //   let returnExpression = node.argument!

    //   // If we have a conditional expression, reduce it until we get something else
    //   while (
    //     returnExpression.type === 'LogicalExpression' ||
    //     returnExpression.type === 'ConditionalExpression'
    //   ) {
    //     if (returnExpression.type === 'LogicalExpression') {
    //       returnExpression = transformLogicalExpression(returnExpression)
    //     }
    //     returnExpression = yield* reduceIf(returnExpression, context)
    //   }
  
    //   // If we are now left with a CallExpression, then we use TCO
    //   if (returnExpression.type === 'CallExpression' && context.variant !== 'lazy') {
    //     const callee = yield* actualValue(returnExpression.callee, context)
    //     const args = yield* getArgs(context, returnExpression)
    //     return new TailCallReturnValue(callee, args, returnExpression)
    //   } else {
    //     return new ReturnValue(yield* evaluate(returnExpression, context))
    //   }
    // },

    // HERE
    CallExpression: function*(node: ast.CallExpression, context: Context) {
      throw new Error("Call expressions not supported in x-slang");
    },

    // STRETCH GOAL
    // Not needed in Python 3, because it is a JS only type of expression
    // FunctionExpression: function*(node: es.FunctionExpression, context: Context) {
    //     throw new Error("Function expressions not supported in x-slang");
    // },

    // STRETCH GOAL 
    // ArrowFunctionExpression: function*(node: es.ArrowFunctionExpression, context: Context) {
    //     throw new Error("Arrow functions expressions not supported in x-slang");
    // },


    // STRETCH GOAL
    // ObjectExpression: function*(node: es.ObjectExpression, context: Context) {
    //     throw new Error("Object expressions not supported in x-slang");
    // },

    // STRETCH GOAL
    // MemberExpression: function*(node: es.MemberExpression, context: Context) {
    //     throw new Error("Member statements not supported in x-slang");
    // },

    // STRETCH GOAL 
    // Can be converted into SelfExpression to be used in Python 3 Classes
    // ThisExpression: function*(node: es.ThisExpression, context: Context) {
    //     return context.runtime.environments[0].thisContext
    // },

    // STRETCH GOAL:
    // ImportDeclaration: function*(node: es.ImportDeclaration, context: Context) {
    //     throw new Error("Import declarations not supported in x-slang");
    // },

    Program: function*(node: ast.BlockStatement, context: Context) {
        context.numberOfOuterEnvironments += 1
        const environment = createBlockEnvironment(context, 'programEnvironment')
        pushEnvironment(context, environment)
        const result = yield* forceIt(yield* evaluateBlockSatement(context, node), context);
        return result;
    }
}
// tslint:enable:object-literal-shorthand

export function* evaluate(node: ast.Node, context: Context) {
  //console.log('1111111111111111111111111111')
  //console.log(context)
  yield* visit(context, node)
  //console.log('2222222222222222222222222222')

  //console.log(context.runtime.nodes)
  const result = yield* evaluators[node.type](node, context)
  yield* leave(context)
  return result
}

export function* apply(
  context: Context,
  fun: Closure | Value,
  args: (Thunk | Value)[],
  node: ast.CallExpression,
  thisContext?: Value
) {
  let result: Value
  let total = 0

  while (!(result instanceof ReturnValue)) {
    if (fun instanceof Closure) {
      checkNumberOfArguments(context, fun, args, node!)
      const environment = createEnvironment(fun, args, node)
      if (result instanceof TailCallReturnValue) {
        replaceEnvironment(context, environment)
      } else {
        pushEnvironment(context, environment)
        total++
      }
      const bodyEnvironment = createBlockEnvironment(context, 'functionBodyEnvironment')
      bodyEnvironment.thisContext = thisContext
      pushEnvironment(context, bodyEnvironment)
      result = yield* evaluateBlockSatement(context, fun.node.body as ast.BlockStatement)
      popEnvironment(context)
      if (result instanceof TailCallReturnValue) {
        fun = result.callee
        node = result.node
        args = result.args
      } else if (!(result instanceof ReturnValue)) {
        // No Return Value, set it as undefined
        result = new ReturnValue(undefined)
      }
    } else if (typeof fun === 'function') {
      checkNumberOfArguments(context, fun, args, node!)
      try {
        const forcedArgs = []

        for (const arg of args) {
          forcedArgs.push(yield* forceIt(arg, context))
        }

        result = fun.apply(thisContext, forcedArgs)
        break
      } catch (e) {
        // Recover from exception
        context.runtime.environments = context.runtime.environments.slice(
          -context.numberOfOuterEnvironments
        )

        const loc = node ? node.loc! : constants.UNKNOWN_LOCATION
        if (!(e instanceof RuntimeSourceError || e instanceof errors.ExceptionError)) {
          // The error could've arisen when the builtin called a source function which errored.
          // If the cause was a source error, we don't want to include the error.
          // However if the error came from the builtin itself, we need to handle it.
          return handleRuntimeError(context, new errors.ExceptionError(e, loc))
        }
        result = undefined
        throw e
      }
    } else {
      return handleRuntimeError(context, new errors.CallingNonFunctionValue(fun, node))
    }
  }
  // Unwraps return value and release stack environment
  if (result instanceof ReturnValue) {
    result = result.value
  }
  for (let i = 1; i <= total; i++) {
    popEnvironment(context)
  }
  return result
}

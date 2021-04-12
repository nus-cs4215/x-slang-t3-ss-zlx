/* tslint:disable:max-classes-per-file */
const util = require('util')
import * as ast from '../parser/ast'
import * as constants from '../constants'
import * as errors from '../errors/errors'
import { RuntimeSourceError } from '../errors/runtimeSourceError'
import { Context, Environment, Frame, Value } from '../types'
// import { constantDeclaration} from '../utils/astCreator'
import { primitive } from '../utils/astCreator'
import {
  evaluateBinaryExpression,
  evaluateConditionalExpression,
  evaluateUnaryExpression
} from '../utils/operators'
import * as rttc from '../utils/rttc'
import Closure from './closure'
// import { update } from 'lodash'
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
  console.log(forced)
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
  if (closure.node.type !== 'FunctionPythonDeclaration') {
    closure.node.params.forEach((param, index) => {
      const ident = param as ast.Identifier
      environment.head[ident.name] = args[index]
    })
  }
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
  while (environment) {
    if (environment.head.hasOwnProperty(name)) {
      return environment.head[name]
    } else {
      environment = environment.tail
    }
  }
  return handleRuntimeError(context, new errors.UndefinedVariable(name, context.runtime.nodes[0]))
}

function assignVariable(context: Context, name: string, value: Value) {
  const environment: Environment | null = context.runtime.environments[0]
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
    if (
      callee.node.type !== 'FunctionPythonDeclaration' &&
      callee.node.params.length !== args.length
    ) {
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

    SequenceExpression: function*(node: ast.SequenceExpression, context: Context) {
      const length = node.expressions.length
      if (length > 1){
        let returnArray = []
        for (let i = 0; i < length -1; i++) {
          returnArray.push(yield * evaluate(node.expressions[i], context))
        }
        return returnArray
      } else {
        return yield * evaluate(node.expressions[0], context)
      }
    },

    ArrayExpression: function*(node: ast.ArrayExpression, context: Context) {
        const elements = node.elements
        const returnArr = []
        for(let i = 0; i < elements.length; i++){
          returnArr.push(yield * evaluate(elements[i], context))
        }
        return returnArr 
    },

    SubscriptListExpression: function*(node: ast.SubscriptListExpression, context: Context) {
      return yield * evaluate(node.body[0], context)
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

    IfStatement: function*(node: ast.IfStatement, context: Context) {
      const test = yield* evaluate(node.test, context)
      const error = rttc.checkIfStatement(node, test)
      if (error) {
        return handleRuntimeError(context, error)
      }
      console.log(test)
      console.log(yield * evaluate(node.consequent, context))
      console.log(yield * evaluate(node.alternate!, context))
      return test ? yield * evaluate(node.consequent, context) : yield * evaluate(node.alternate!, context)
    },

    EmptyStatement: function*(node: ast.EmptyStatement, context: Context){

    },

    AssignmentExpression: function*(node: ast.AssignmentExpression, context: Context) {
      const id = node.left as ast.Identifier
      const value = yield* evaluate(node.right, context)
      assignVariable(context, id.name, value)
      return value
    },

    WhilePythonStatement: function*(node: ast.WhilePythonStatement, context: Context) {
      let value: any // tslint:disable-line
      while (
        // tslint:disable-next-line
        (yield* evaluate(node.test, context)) &&
        !(value instanceof BreakValue)
      ) {
        value = yield* evaluate(node.body, context)
        console.log(value)
      }
      if (value instanceof BreakValue) {
        return undefined
      }
      return value
    },

    ContinueStatement: function*(node: ast.ContinueStatement, context: Context) {
      console.log("Continue!")
      return new ContinueValue()
    },
  
    BreakStatement: function*(node: ast.BreakStatement, context: Context) {
      return new BreakValue()
    },

    KeyValueExpression: function*(node: ast.KeyValueExpression, context: Context){
      const key = yield * evaluate(node.key, context)
      const val = yield * evaluate(node.value, context)
      return [key, val]
    },

    DictExpression: function*(node: ast.DictExpression, context: Context){
      const elements = node.elements
      const returnDict = {}
      for(let i=0; i < elements.length; i++){
        const keyValue = yield * evaluate(elements[i], context)
        returnDict[keyValue[0]] = keyValue[1]
      }
      return returnDict
    },

    ForPythonStatement: function*(node: ast.ForPythonStatement, context: Context) {
      // Create a new block scope for the loop variables
      // let iter = (node.iter as ast.Identifier).name
      // let iterated = getVariable(context, (node.iterated[0] as ast.Identifier).name)
      return "For Loop"
    },

    // STRETCH GOAL
    // ContinueStatement: function*(node: es.ContinueStatement, context: Context) {
    //     throw new Error("Continue statements not supported in x-slang");
    // },

    // STRETCH GOAL
    // BreakStatement: function*(node: es.BreakStatement, context: Context) {
    //     throw new Error("Break statements not supported in x-slang");
    // },

    FunctionPythonDeclaration: function*(node: ast.FunctionPythonDeclaration, context: Context) {
      // console.log("Function")
      const id = node.id as ast.Identifier
      // tslint:disable-next-line:no-any
      const closure = new Closure(node, currentEnvironment(context), context)
      assignVariable(context, id.name, closure)
      // console.log(util.inspect(context, { showHidden: false, depth: null }))
      return undefined
    },

    ParameterExpression: function*(node: ast.ParameterExpression, context: Context) {
      const expressions = node.expressions
      const returnArray = []
      for (let i=0; i < expressions.length -1; i++){
        returnArray.push(yield * evaluate(expressions[i], context))
      }
      return returnArray
    },

    TypedargslistExpression: function*(node: ast.TypedargslistExpression, context: Context) {
      return yield* evaluate(node.name, context)
    },

    ArgListExpression: function*(node: ast.ArgListExpression, context: Context) {
      const body = node.body
      let returnArray = []
      for(let i=0; i < body.length -1; i++){
        console.log(body[i])
        returnArray.push(yield * evaluate(body[i], context))
      }
      return returnArray
    },

    ArgumentExpression: function*(node: ast.ArgumentExpression, context: Context){
      console.log("Argument Expr")
      return yield * evaluate(node.value, context)
    },

    TrailerExpression: function*(node: ast.TrailerExpression, context: Context) {
      const base = node.base as ast.Identifier
      const type = node.trailer[0].type
      const trailer = yield * evaluate(node.trailer[0], context)
      if (type === "SubscriptListExpression") {
        const arr = getVariable(context, base.name)
        return arr[trailer]
      } else if (type === "ArgListExpression") {
        // let funcClosure = getVariable(context, base.name)
        // console.log(util.inspect(funcClosure, { showHidden: false, depth: null }))
        // let funcParams = yield * evaluate(funcClosure.node.params, funcClosure)
        // console.log(util.inspect(funcParams, { showHidden: false, depth: null }))
        let funcArgs = yield * evaluate(node.trailer[0], context)
        console.log(util.inspect(funcArgs, { showHidden: false, depth: null }))
      }
      // Function Call Specific!
      // const funcEnv = getVariable(context, base.name)
      // // const funcParams = yield * evaluate(node.trailer[0], context)
      // const funcArgs = yield * evaluate(node.trailer[0], context)
      // console.log("Environment:")
      // console.log(util.inspect(funcEnv, { showHidden: false, depth: null }))
      // console.log("Params:")
      // // console.log(util.inspect(funcParams, { showHidden: false, depth: null }))
      // console.log("Args:")
      // console.log(util.inspect(funcArgs, { showHidden: false, depth: null }))
    },

    ReturnPythonStatement: function*(node: ast.ReturnPythonStatement, context: Context) {
      const returnExpression = node.argument!
      // let nreturnExpression = returnExpression[0]
      // // If we have a conditional expression, reduce it until we get something else
      // while (nreturnExpression.type === 'ConditionalExpression') {
      //   nreturnExpression = yield* evaluate(nreturnExpression, context)
      // }
      console.log("Return")
      return new ReturnValue(yield* evaluate(returnExpression[0], context))
    },

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
        console.log("Program")
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

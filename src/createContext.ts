// Variable determining chapter of Source is contained in this file.

import { GLOBAL } from './constants'
import { AsyncScheduler } from './schedulers'
import * as misc from './stdlib/misc'
import { Context, CustomBuiltIns, Value, Variant } from './types'
import { stringify } from './utils/stringify'
import { createTypeEnvironment, tForAll, tVar } from './typeChecker/typeChecker'

const createEmptyRuntime = () => ({
  break: false,
  debuggerOn: true,
  isRunning: false,
  environments: [],
  value: undefined,
  nodes: []
})

const createEmptyDebugger = () => ({
  observers: { callbacks: Array<() => void>() },
  status: false,
  state: {
    it: (function* (): any {
      return
    })(),
    scheduler: new AsyncScheduler()
  }
})

const createGlobalEnvironment = () => ({
  tail: null,
  name: 'global',
  head: {}
})

export const createEmptyContext = <T>(
  variant: Variant,
  externalSymbols: string[],
  externalContext?: T,
  moduleParams?: any
): Context<T> => {
  return {
    externalSymbols,
    errors: [],
    externalContext,
    moduleParams,
    runtime: createEmptyRuntime(),
    numberOfOuterEnvironments: 1,
    prelude: null,
    debugger: createEmptyDebugger(),
    executionMethod: 'auto',
    variant,
    typeEnvironment: createTypeEnvironment()
  }
}

export const ensureGlobalEnvironmentExist = (context: Context) => {
  if (!context.runtime) {
    context.runtime = createEmptyRuntime()
  }
  if (!context.runtime.environments) {
    context.runtime.environments = []
  }
  if (context.runtime.environments.length === 0) {
    context.runtime.environments.push(createGlobalEnvironment())
  }
}

export const defineSymbol = (context: Context, name: string, value: Value) => {
  const globalEnvironment = context.runtime.environments[0]
  Object.defineProperty(globalEnvironment.head, name, {
    value,
    writable: false,
    enumerable: true
  })
  const typeEnv = context.typeEnvironment[0]
  // if the global type env doesn't already have the imported symbol,
  // we set it to a type var T that can typecheck with anything.
  if (!typeEnv.declKindMap.has(name)) {
    typeEnv.typeMap.set(name, tForAll(tVar('T1')))
    typeEnv.declKindMap.set(name, 'const')
  }
}

// Defines a builtin in the given context
// If the builtin is a function, wrap it such that its toString hides the implementation
export const defineBuiltin = (context: Context, name: string, value: Value) => {
  if (typeof value === 'function') {
    const funName = name.split('(')[0].trim()
    const repr = `function ${name} {\n\t[implementation hidden]\n}`
    value.toString = () => repr
    value.hasVarArgs = name.includes('...') || name.includes('=')

    defineSymbol(context, funName, value)
  } else {
    defineSymbol(context, name, value)
  }
}

export const importExternalSymbols = (context: Context, externalSymbols: string[]) => {
  ensureGlobalEnvironmentExist(context)

  externalSymbols.forEach(symbol => {
    defineSymbol(context, symbol, GLOBAL[symbol])
  })
}

export const importBuiltins = (context: Context, externalBuiltIns: CustomBuiltIns) => {
  ensureGlobalEnvironmentExist(context)
  const placeholder = Symbol()
  const rawDisplay = (v: Value, s: string) =>
    externalBuiltIns.rawDisplay(v, s, context.externalContext)
  const display = (v: Value, s: any = placeholder) => {
    if (s !== placeholder && typeof s !== 'string') {
      throw new TypeError('display expects the second argument to be a string')
    }
    return rawDisplay(stringify(v), s === placeholder ? undefined : s), v
  }
  if (context.variant === 'python') {
    defineBuiltin(context, 'display(val, prepend = undefined)', display)
    defineBuiltin(context, 'raw_display(str, prepend = undefined)', rawDisplay)
  }
}

/**
 * Imports builtins from standard and external libraries.
 */

const defaultBuiltIns: CustomBuiltIns = {
  rawDisplay: misc.rawDisplay,
  // See issue #5
  prompt: misc.rawDisplay,
  // See issue #11
  alert: misc.rawDisplay,
  visualiseList: (v: Value) => {
    throw new Error('List visualizer is not enabled')
  }
}

const createContext = <T>(
  variant: Variant = 'python',
  externalSymbols: string[] = [],
  externalContext?: T,
  externalBuiltIns: CustomBuiltIns = defaultBuiltIns,
  moduleParams?: any
) => {
  const context = createEmptyContext(variant, externalSymbols, externalContext, moduleParams)
  importBuiltins(context, externalBuiltIns)
  importExternalSymbols(context, externalSymbols)

  return context
}

export default createContext

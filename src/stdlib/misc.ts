import { Context, Value } from '../types'
import { stringify } from '../utils/stringify'

export function print(value: Value, externalContext: any) {
  console.log(value)
  return value
}

export function env(environment: any){
  let returnEnv = {}
  let env = environment.runtime.environments[0]
  while(env.name !== 'global'){
    let funcName = ""
    if(env.name !== "programEnvironment"){
      funcName = env.name.replace('functionEnvironment','');
    } else {
      funcName = "program"
    }
    let funcEnv = {}
    for (const [key, value] of Object.entries(env.head)){
      if(value instanceof Object){
        if(value['type'] === "FunctionPythonDeclaration"){
          funcEnv[key] = "function declaration"
        }
      } else if(key !== "func"){
        funcEnv[key] = value
      }
    }
    returnEnv[funcName] = funcEnv
    env = env.tail
  }
  return returnEnv
}

export function range(start: number, stop: number) {
  let i = start === undefined ? 0 : start
  const arr = []
  for (i; i < stop; i++) {
    arr.push(i)
  }
  return arr
}

/**
 * A function that displays to console.log by default (for a REPL).
 *
 * @param value the value to be represented and displayed.
 * @param externalContext a property of Context that can hold
 *   any information required for external use (optional).
 */

export function rawDisplay(value: Value, str: string, externalContext: any) {
  // tslint:disable-next-line:no-console
  console.log((str === undefined ? '' : str + ' ') + value.toString())
  return value
}

export function error_message(value: Value, str?: string) {
  const output = (str === undefined ? '' : str + ' ') + stringify(value)
  throw new Error(output)
}

export function timed(
  context: Context,
  // tslint:disable-next-line:ban-types
  f: Function,
  externalContext: any,
  displayBuiltin: (value: Value, str: string, externalContext: any) => Value
) {
  return (...args: any[]) => {
    const start = get_time()
    const result = f(...args)
    const diff = get_time() - start
    displayBuiltin('Duration: ' + Math.round(diff) + 'ms', '', externalContext)
    return result
  }
}

export function is_number(v: Value) {
  return typeof v === 'number'
}

export function is_undefined(xs: Value) {
  return typeof xs === 'undefined'
}

export function is_string(xs: Value) {
  return typeof xs === 'string'
}

export function is_boolean(xs: Value) {
  return typeof xs === 'boolean'
}

export function is_object(xs: Value) {
  return typeof xs === 'object' || is_function(xs)
}

export function is_function(xs: Value) {
  return typeof xs === 'function'
}

export function is_NaN(x: Value) {
  return is_number(x) && isNaN(x)
}

export function has_own_property(obj: Value, p: Value) {
  return obj.hasOwnProperty(p)
}

export function is_array(a: Value) {
  return a instanceof Array
}

export function array_length(xs: Value[]) {
  return xs.length
}

/**
 * Source version of parseInt. Both arguments are required.
 *
 * @param str String representation of the integer to be parsed. Required.
 * @param radix Base to parse the given `str`. Required.
 *
 * An error is thrown if `str` is not of type string, or `radix` is not an
 * integer within the range 2, 36 inclusive.
 */
export function parse_int(str: string, radix: number) {
  if (
    typeof str === 'string' &&
    typeof radix === 'number' &&
    Number.isInteger(radix) &&
    2 <= radix &&
    radix <= 36
  ) {
    return parseInt(str, radix)
  } else {
    throw new Error(
      'parse_int expects two arguments a string s, and a positive integer i between 2 and 36, inclusive.'
    )
  }
}

export function get_time() {
  return new Date().getTime()
}

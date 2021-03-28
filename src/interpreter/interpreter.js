const Parser = require("../parser/parser.js");

// Interpreter file
class Interpreter {
  evaluate(component, env) {
    return is_literal(component)
           ? literal_value(component)
           : is_name(component)
           ? lookup_symbol_value(symbol_of_name(component), env)
           : is_application(component)
           ? apply(evaluate( _expression(component), env),
                   list_of_values(arg_expressions(component), env))
           : is_operator_combination(component)
           ? evaluate(operator_combination_to_application(component), env)
           : is_block(component)
           ? eval_block(component, env)
           : error(component, "unknown syntax -- evaluate");
 }
 
   apply(fun, args) {
    if (is_primitive_ (fun)) {
       return apply_primitive_ (fun, args);
    } else if (is_compound_ (fun)) {
       const result = evaluate( _body(fun),
                               extend_environment(
                                    _parameters(fun),
                                   args,
                                    _environment(fun)));
       return is_return_value(result)
              ? return_value_content(result)
              : undefined;
    } else {
       error(fun, "unknown   type -- apply");
    }
 }

   eval_block(component, env) {
    const body = block_body(component);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigned(locals);
    return evaluate(body, extend_environment(locals,
                                             unassigneds, 
                                             env));
}
 
   list_of_values(exps, env) {
     return exps.map(exp => evaluate(exp, env))
 }
 
   list_of_unassigned(symbols) {
     return map(symbol => "*unassigned*", symbols);
 }
 
 //  s from SICP JS 4.1.2
 
   is_tagged_list(component, the_tag) {
     return is_pair(component) && head(component) === the_tag;
 }
 
   is_literal(component) {
    return (component.type == "Literal");
 }
   literal_value(component) {    
    return component.value;
 }
 
   make_literal(value) {
     return {
        type: 'Literal',
        value: Number(value)
    }
 }
 
   is_name(component) {
     return (component.type == "Name");
 }
 
   make_name(symbol) {
     return {
         "type": "Name",
         "symbol": symbol
        };
 }
 
   symbol_of_name(component) {
     return (component.symbol);
 }
 
   is_assignment(component) {
     return is_tagged_list(component, "assignment");
 }
   assignment_symbol(component) {
     return head(tail(head(tail(component))));
 }
   assignment_value_expression(component) {
     return head(tail(tail(component)));
 }
 
   is_declaration(component) {
     return is_constant_declaration(component) ||
            is_tagged_list(component, "variable_declaration") ||
            is_tagged_list(component, " _declaration");
 }
 
   is_constant_declaration(component) {
     return (component.type == "ConstantDeclaration");
 }
 
   is_variable_declaration(component) {
     return is_tagged_list(component, "variable_declaration");
 }
 
   declaration_symbol(component) {
    return symbol_of_name(head(tail(component)));
 }
   declaration_value_expression(component) {
    return head(tail(tail(component)));
 }
 
   make_constant_declaration(name, value_expression) {
     return list("constant_declaration", name, value_expression);
 }
 
   is_lambda_expression(component) {
    return is_tagged_list(component, "lambda_expression");
 }
   lambda_parameter_symbols(component) {
    return map(symbol_of_name, head(tail(component)));
 }
   lambda_body(component) {
    return head(tail(tail(component)));
 }
 
   make_lambda_expression(parameters, body) {
     return list("lambda_expression", parameters, body);
 }
 
   is_function_declaration(component) {	    
     return is_tagged_list(component, " _declaration");
 }
    function_declaration_name(component) {
     return list_ref(component, 1);
 }
    function_declaration_parameters(component) {
     return list_ref(component, 2);
 }
    function_declaration_body(component) {
     return list_ref(component, 3);
 }
    function_decl_to_constant_decl(component) {
     return make_constant_declaration(
                 _declaration_name(component),
                make_lambda_expression(
                     _declaration_parameters(component),
                     _declaration_body(component)));
 }
 
   is_return_statement(component) {
    return is_tagged_list(component, "return_statement");
 }
   return_expression(component) {
    return head(tail(component));
 }
 
   is_conditional(component) {
     return is_tagged_list(component, "conditional_expression") ||
            is_tagged_list(component, "conditional_statement");
 }
   conditional_predicate(component) {
    return list_ref(component, 1);
 }
   conditional_consequent(component) {
    return list_ref(component, 2);
 }
   conditional_alternative(component) {
    return list_ref(component, 3);
 }
 
   is_sequence(stmt) {
    return is_tagged_list(stmt, "sequence");
 }
   sequence_statements(stmt) {   
    return head(tail(stmt));
 }
   first_statement(stmts) {
    return head(stmts);
 }
   rest_statements(stmts) {
    return tail(stmts);
 }
   is_empty_sequence(stmts) {
    return is_null(stmts);
 }
   is_last_statement(stmts) {
    return is_null(tail(stmts));
 }
 
   is_block(component) {
     return is_tagged_list(component, "block");
 }
   block_body(component) {
     return head(tail(component));
 }
   make_block(statement) {
     return list("block", statement);
 }
 
   is_operator_combination(component) {	    
     return is_unary_operator_combination(component) ||
            is_binary_operator_combination(component);
 }
   is_unary_operator_combination(component) {	    
     return (component.type == "UnaryExpression");
 }
   is_binary_operator_combination(component) {	    
     return (component.type == "BinaryExpression");
 }
   operator_symbol(component) {
     return (component.operator);
 }
   first_operand(component) {
     return (component.left);
 }
   second_operand(component) {
     return (component.right);
 }
 
   make_application( _expression, argument_expressions) {
     return {
         "type": "Application", 
         " _expression":  _expression,
         "argument_expressions": argument_expressions
        };
 }
 
   operator_combination_to_application(component) {
     const operator = operator_symbol(component);
     return is_unary_operator_combination(component)
            ? make_application(make_name(operator),[first_operand(component)])
            : make_application(make_name(operator),
                               [first_operand(component),
                                    second_operand(component)]);
 }
 
   is_application(component) {
    return (component.type == "Application");
 }
    _expression(component) {
    return (component. _expression);
 }
   arg_expressions(component) {
    return (component.argument_expressions);
 }
 
   is_while_loop(component) {
     return is_tagged_list(component, "while_loop");
 }
 
   while_loop_predicate(component) {
    return list_ref(component, 1);
 }
 
   while_loop_body(component) {
    return list_ref(component, 2);
 }
 
   make_while_loop(predicate, body) {
     return list("while_loop", predicate, body);
 }
 
 
 //  s from SICP JS 4.1.3
 
   is_truthy(x) {
     return is_boolean(x) 
            ? x
            : error(x, "boolean expected, received");
 }
   is_falsy(x) { return ! is_truthy(x); }
 
   make_ (parameters, body, env) {
     return list("compound_ ",
                 parameters, body, env);
 }
   is_compound_ (f) {
     return is_tagged_list(f, "compound_ ");
 }
    _parameters(f) {
     return list_ref(f, 1);
 }
    _body(f) {
     return list_ref(f, 2);
 }
    _environment(f) {
     return list_ref(f, 3);
 }
 
   make_return_value(content) {
     return list("return_value", content);
 }
   is_return_value(value) {
     return is_tagged_list(value, "return_value");
 }
   return_value_content(value) {
     return head(tail(value));
 }
 
 // ENVIRONMENT API 
 
   enclosing_environment(env) {
     return env.shift();
 }
   first_frame(env) {
     return env[0];
 }
 the_empty_environment = null;
 
   make_frame(symbols, values) {
     return [symbols, values];
 }
   frame_symbols(frame) {    
     return frame[0];
 }
   frame_values(frame) {    
     return frame[1];
 }
 
   extend_environment(symbols, vals, base_env) {
     return symbols.length == vals.length
            ? [make_frame(symbols, vals), base_env]
            : symbols.length < vals.length
            ? error("too many arguments supplied: " + 
                    stringify(symbols) + ", " + 
                    stringify(vals))
            : error("too few arguments supplied: " + 
                    stringify(symbols) + ", " + 
                    stringify(vals));
 }
 
   lookup_symbol_value(symbol, env) {
       function env_loop(env) {
           function scan(symbols, vals) {
             return symbols == null
                    ? env_loop(enclosing_environment(env))
                    : symbol == symbols[0]
                    ? vals[0]
                    : scan(symbols.slice(1), vals.slice(1));
         }
         if (env == the_empty_environment) {
             return [symbol, "unbound name"];
         } else {
             const frame = first_frame(env);
             return scan(frame_symbols(frame),
                         frame_values(frame));
         }
     }
     return env_loop(env);
 }
 
   assign_symbol_value(symbol, val, env) {
       function env_loop(env) {
           function scan(symbols, vals) {
             return is_null(symbols)
                    ? env_loop(enclosing_environment(env))
                    : is_constant_declaration(symbols)
                    ? "Assignment to constant"
                    : symbol == symbols[0] 
                    ? vals.unshift(val)
                    : scan(symbols.slice(1), vals.slice(1));
         } 
         if (env == the_empty_environment) {
             [symbol, "unbound name -- assignment"];
         } else {
             const frame = first_frame(env);
             return scan(frame_symbols(frame),
                         frame_values(frame));
         }
     }
     return env_loop(env);
 }
 
//    assign_constant_value(symbol, val, env) {
//        env_loop(env) {
//            scan(symbols, vals) {
//              return is_null(symbols)
//                     ? env_loop(enclosing_environment(env))
//                     : symbol === head(symbols) 
//                     ? set_head(vals, val)
//                     : scan(tail(symbols), tail(vals));
//          } 
//          if (env === the_empty_environment) {
//              error(symbol, "unbound name -- assignment");
//          } else {
//              const frame = first_frame(env);
//              return scan(frame_symbols(frame),
//                          frame_values(frame));
//          }
//      }
//      return env_loop(env);
//  }
 
//  //  s from SICP JS 4.1.4
 
   is_primitive_ (fun) {
    return (fun.type == "Primitive");
 }
   primitive_implementation(fun) {
    return fun.function;
 }
 
 primitive_functions = [
        // list("head",    head             ),
        // list("tail",    tail             ),
        // list("pair",    pair             ),
        // list("list",    list             ),
        // list("is_null", is_null          ),
        // list("display", display          ),
        // list("error",   error            ),
        // list("math_abs",math_abs         ),
        ["+",        "addition"],
        ["-",        "subtraction"],
        // ["-unary",   x     =>   - x  ],
        ["*",       "multiplication"],
        ["/",       "division"]
        // ,
        // list("%",       (x, y) => x % y  ),
        // list("===",     (x, y) => x === y),
        // list("!==",     (x, y) => x !== y),
        // list("<",       (x, y) => x <   y),
        // list("<=",      (x, y) => x <=  y),
        // list(">",       (x, y) => x >   y),
        // list(">=",      (x, y) => x >=  y),
        // list("!",        x     =>   !   x)
 ];
 primitive_function_symbols =
        primitive_functions.map(funct => funct[0]);

   create_primitive_function(fun) {
     return {
         "type": "Primitive",
         "function": fun
     }
 }
 primitive_function_objects =
        primitive_functions.map(funct => this.create_primitive_function(funct[1]));
 
 primitive_constants = [["undefined", undefined],
                                  ["Infinity",  Infinity],
                                  ["math_PI",   3.141592653589793],
                                  ["math_E",    2.718281828459045],
                                  ["NaN",       NaN]];
 primitive_constant_symbols =
         primitive_constants.map(constant => constant[0]);

 primitive_constant_values =
         primitive_constants.map(constant => constant[1]);
 
   apply_primitive_ (fun, arglist) {
     funct = primitive_implementation(fun);
     return funct == "addition" 
        ? arglist[0] + arglist[1]
        : funct == "subtraction"
        ? arglist[0] - arglist[1]
        : funct == "multiplication"
        ? arglist[0] * arglist[1]
        : funct == "division"
        ? arglist[0] / arglist[1]
        : "Error -- unknown primitive   type"
          
 }
 
   setup_environment() {
     return extend_environment(
                primitive_function_symbols.concat(primitive_constant_symbols),
                primitive_function_objects.concat(primitive_constant_values),
                the_empty_environment);
 }
 
 the_global_environment = setup_environment();
 
//    user_print(prompt_string, object) {
//       to_string(object) {	
//         return is_compound_ (object)
//                ? "<compound- >"
//                : is_primitive_ (object)
//            ? "<primitive- >"
//            : is_pair(object)
//            ? "[" + to_string(head(object)) + ", "
//                  + to_string(tail(object)) + "]"
//            : stringify(object);
//      }
//      display("----------------------------",
//              prompt_string + "\n" + to_string(object) + "\n");
//  }
 
//    user_read(prompt_string) {
//      return prompt(prompt_string);
//  }
 
//  const input_prompt = "M-evaluate input: ";
//  const output_prompt = "M-evaluate value: ";
 
//    driver_loop(env) {
//      const input = user_read(input_prompt);
//      if (is_null(input)) {
//          display("--- evaluator terminated ---", "");
//      } else {
//          display("----------------------------",
//                  input_prompt + "\n" + input + "\n");
//          const program = parse(input);
//          const locals = scan_out_declarations(program);
//          const unassigneds = list_of_unassigned(locals);
//          const program_env = extend_environment(
//                                  locals, unassigneds, env);
//          const output = evaluate(program, program_env);
//          user_print(output_prompt, output);
//          return driver_loop(program_env);
//      }
//  }
//  "metacircular evaluator loaded";
 
//  // driver_loop(the_global_environment);
 
   interpreter_evaluate(program) {
         return evaluate(program,
                     the_global_environment);
}

}
module.exports = Interpreter;
// module.exports = {
//     evaluate:  (program){
//      interpreter_evaluate(program)
//     },
//     apply:  (fun, args){
//         apply(fun, args)
//     }
// };

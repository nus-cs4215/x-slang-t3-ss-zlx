def f(a, b):
    a = a - 1

# { externalSymbols: [],
#   errors: [],
#   externalContext: undefined,
#   moduleParams: undefined,
#   runtime:
#    { break: false,
#      debuggerOn: true,
#      isRunning: true,
#      environments:
#       [ { name: 'programEnvironment',
#           tail: { tail: null, name: 'global', head: {} },
#           head:
#            { f:
#               { [Closure]
#                 node:
#                  { type: 'FunctionPythonDeclaration',
#                    id: { type: 'Identifier', name: 'f' },
#                    params:
#                     { type: 'ParameterExpression',
#                       expressions:
#                        [ { type: 'TypedargslistExpression',
#                            name: { type: 'Literal', value: 'a' },
#                            default: null } ] },
#                    body:
#                     { type: 'BlockStatement',
#                       body:
#                        [ { type: 'ExpressionStatement',
#                            expression:
#                             { type: 'AssignmentExpression',
#                               operator: '=',
#                               left: { type: 'Identifier', name: 'a' },
#                               right:
#                                { type: 'BinaryExpression',
#                                  operator: '-',
#                                  left: { type: 'Identifier', name: 'a' },
#                                  right: { type: 'Literal', value: 1 } } } } ] } },
#                 environment: [Circular],
#                 originalNode:
#                  { type: 'FunctionPythonDeclaration',
#                    id: { type: 'Identifier', name: 'f' },
#                    params:
#                     { type: 'ParameterExpression',
#                       expressions:
#                        [ { type: 'TypedargslistExpression',
#                            name: { type: 'Literal', value: 'a' },
#                            default: null } ] },
#                    body:
#                     { type: 'BlockStatement',
#                       body:
#                        [ { type: 'ExpressionStatement',
#                            expression:
#                             { type: 'AssignmentExpression',
#                               operator: '=',
#                               left: { type: 'Identifier', name: 'a' },
#                               right:
#                                { type: 'BinaryExpression',
#                                  operator: '-',
#                                  left: { type: 'Identifier', name: 'a' },
#                                  right: { type: 'Literal', value: 1 } } } } ] } },
#                 functionName: 'f',
#                 fun: { [Function: f] toString: [Function], call: [Function] } } } },
#         { tail: null, name: 'global', head: {} } ],
#      value: undefined,
#      nodes:
#       [ { type: 'FunctionPythonDeclaration',
#           id: { type: 'Identifier', name: 'f' },
#           params:
#            { type: 'ParameterExpression',
#              expressions:
#               [ { type: 'TypedargslistExpression',
#                   name: { type: 'Literal', value: 'a' },
#                   default: null } ] },
#           body:
#            { type: 'BlockStatement',
#              body:
#               [ { type: 'ExpressionStatement',
#                   expression:
#                    { type: 'AssignmentExpression',
#                      operator: '=',
#                      left: { type: 'Identifier', name: 'a' },
#                      right:
#                       { type: 'BinaryExpression',
#                         operator: '-',
#                         left: { type: 'Identifier', name: 'a' },
#                         right: { type: 'Literal', value: 1 } } } } ] } },
#         { type: 'Program',
#           sourceType: 'script',
#           body:
#            [ { type: 'FunctionPythonDeclaration',
#                id: { type: 'Identifier', name: 'f' },
#                params:
#                 { type: 'ParameterExpression',
#                   expressions:
#                    [ { type: 'TypedargslistExpression',
#                        name: { type: 'Literal', value: 'a' },
#                        default: null } ] },
#                body:
#                 { type: 'BlockStatement',
#                   body:
#                    [ { type: 'ExpressionStatement',
#                        expression:
#                         { type: 'AssignmentExpression',
#                           operator: '=',
#                           left: { type: 'Identifier', name: 'a' },
#                           right:
#                            { type: 'BinaryExpression',
#                              operator: '-',
#                              left: { type: 'Identifier', name: 'a' },
#                              right: { type: 'Literal', value: 1 } } } } ] } } ] } ] },
#   numberOfOuterEnvironments: 2,
#   prelude: null,
#   executionMethod: 'auto',
#   variant: 'python',
#   typeEnvironment:
#    [ { typeMap:
#         Map {
#           '-_1' => { kind: 'function',
#             parameterTypes: [ { kind: 'primitive', name: 'number' } ],
#             returnType: { kind: 'primitive', name: 'number' } },
#           '!' => { kind: 'function',
#             parameterTypes: [ { kind: 'primitive', name: 'boolean' } ],
#             returnType: { kind: 'primitive', name: 'boolean' } },
#           '&&' => { kind: 'forall',
#             polyType:
#              { kind: 'function',
#                parameterTypes:
#                 [ { kind: 'primitive', name: 'boolean' },
#                   { kind: 'variable', name: 'TT', constraint: 'none' } ],
#                returnType: { kind: 'variable', name: 'TT', constraint: 'none' } } },
#           '||' => { kind: 'forall',
#             polyType:
#              { kind: 'function',
#                parameterTypes:
#                 [ { kind: 'primitive', name: 'boolean' },
#                   { kind: 'variable', name: 'TT', constraint: 'none' } ],
#                returnType: { kind: 'variable', name: 'TT', constraint: 'none' } } },
#           '<' => { kind: 'forall',
#             polyType:
#              { kind: 'function',
#                parameterTypes:
#                 [ { kind: 'variable', name: 'A', constraint: 'addable' },
#                   { kind: 'variable', name: 'A', constraint: 'addable' } ],
#                returnType: { kind: 'primitive', name: 'boolean' } } },
#           '<=' => { kind: 'forall',
#             polyType:
#              { kind: 'function',
#                parameterTypes:
#                 [ { kind: 'variable', name: 'A', constraint: 'addable' },
#                   { kind: 'variable', name: 'A', constraint: 'addable' } ],
#                returnType: { kind: 'primitive', name: 'boolean' } } },
#           '>' => { kind: 'forall',
#             polyType:
#              { kind: 'function',
#                parameterTypes:
#                 [ { kind: 'variable', name: 'A', constraint: 'addable' },
#                   { kind: 'variable', name: 'A', constraint: 'addable' } ],
#                returnType: { kind: 'primitive', name: 'boolean' } } },
#           '>=' => { kind: 'forall',
#             polyType:
#              { kind: 'function',
#                parameterTypes:
#                 [ { kind: 'variable', name: 'A', constraint: 'addable' },
#                   { kind: 'variable', name: 'A', constraint: 'addable' } ],
#                returnType: { kind: 'primitive', name: 'boolean' } } },
#           '+' => { kind: 'forall',
#             polyType:
#              { kind: 'function',
#                parameterTypes:
#                 [ { kind: 'variable', name: 'A', constraint: 'addable' },
#                   { kind: 'variable', name: 'A', constraint: 'addable' } ],
#                returnType: { kind: 'variable', name: 'A', constraint: 'addable' } } },
#           '%' => { kind: 'function',
#             parameterTypes:
#              [ { kind: 'primitive', name: 'number' },
#                { kind: 'primitive', name: 'number' } ],
#             returnType: { kind: 'primitive', name: 'number' } },
#           '-' => { kind: 'function',
#             parameterTypes:
#              [ { kind: 'primitive', name: 'number' },
#                { kind: 'primitive', name: 'number' } ],
#             returnType: { kind: 'primitive', name: 'number' } },
#           '*' => { kind: 'function',
#             parameterTypes:
#              [ { kind: 'primitive', name: 'number' },
#                { kind: 'primitive', name: 'number' } ],
#             returnType: { kind: 'primitive', name: 'number' } },
#           '/' => { kind: 'function',
#             parameterTypes:
#              [ { kind: 'primitive', name: 'number' },
#                { kind: 'primitive', name: 'number' } ],
#             returnType: { kind: 'primitive', name: 'number' } } },
#        declKindMap:
#         Map {
#           '-_1' => 'const',
#           '!' => 'const',
#           '&&' => 'const',
#           '||' => 'const',
#           '<' => 'const',
#           '<=' => 'const',
#           '>' => 'const',
#           '>=' => 'const',
#           '+' => 'const',
#           '%' => 'const',
#           '-' => 'const',
#           '*' => 'const',
#           '/' => 'const' } } ] }
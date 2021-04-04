import { ancestor, base, FullWalkerCallback } from '../utils/walkers'
import * as ast from '../parser/ast'
// import * as es from 'estree'
import { Context, TypeAnnotatedNode } from '../types'
import { getVariableDecarationName } from '../utils/astCreator'

class Declaration {
  public accessedBeforeDeclaration: boolean = false
  constructor(public isConstant: boolean) {}
}

export function validateAndAnnotate(
  program: ast.Program,
  context: Context
): TypeAnnotatedNode<ast.Program> {
  const accessedBeforeDeclarationMap = new Map<ast.Node, Map<string, Declaration>>()
  const scopeHasCallExpressionMap = new Map<ast.Node, boolean>()
  function processBlock(node: ast.Program | ast.BlockStatement) {
    const initialisedIdentifiers = new Map<string, Declaration>()
    scopeHasCallExpressionMap.set(node, false)
    accessedBeforeDeclarationMap.set(node, initialisedIdentifiers)
  }
  function processFunction(node: ast.FunctionDeclaration | ast.ArrowFunctionExpression) {
    accessedBeforeDeclarationMap.set(
      node,
      new Map((node.params as ast.Identifier[]).map(id => [id.name, new Declaration(false)]))
    )
    scopeHasCallExpressionMap.set(node, false)
  }

  // initialise scope of variables
  ancestor(program as ast.Node, {
    Program: processBlock,
    BlockStatement: processBlock,
    FunctionDeclaration: processFunction,
    ArrowFunctionExpression: processFunction,
    ForStatement(forStatement: ast.ForStatement, ancestors: ast.Node[]) {}
  })

  function validateIdentifier(id: ast.Identifier, ancestors: ast.Node[]) {
    const name = id.name
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const a = ancestors[i]
      const map = accessedBeforeDeclarationMap.get(a)
      if (map?.has(name)) {
        map.get(name)!.accessedBeforeDeclaration = true
        break
      }
    }
  }
  const customWalker = {
    ...base,
    VariableDeclarator(node: ast.VariableDeclarator, st: never, c: FullWalkerCallback<never>) {
      // don't visit the id
      if (node.init) {
        c(node.init, st, 'Expression')
      }
    }
  }
  ancestor(
    program,
    {
      VariableDeclaration(node: TypeAnnotatedNode<ast.VariableDeclaration>, ancestors: ast.Node[]) {
        const lastAncestor = ancestors[ancestors.length - 2]
        const name = getVariableDecarationName(node)
        const accessedBeforeDeclaration = accessedBeforeDeclarationMap.get(lastAncestor)!.get(name)!
          .accessedBeforeDeclaration
        node.typability = accessedBeforeDeclaration ? 'Untypable' : 'NotYetTyped'
      },
      Identifier: validateIdentifier,
      FunctionDeclaration(node: TypeAnnotatedNode<ast.FunctionDeclaration>, ancestors: ast.Node[]) {
        // a function declaration can be typed if there are no function calls in the same scope before it
        const lastAncestor = ancestors[ancestors.length - 2]
        node.typability = scopeHasCallExpressionMap.get(lastAncestor) ? 'Untypable' : 'NotYetTyped'
      },
      Pattern(node: ast.Pattern, ancestors: ast.Node[]) {},
      CallExpression(call: ast.CallExpression, ancestors: ast.Node[]) {
        for (let i = ancestors.length - 1; i >= 0; i--) {
          const a = ancestors[i]
          if (scopeHasCallExpressionMap.has(a)) {
            scopeHasCallExpressionMap.set(a, true)
            break
          }
        }
      }
    },
    customWalker
  )

  return program
}

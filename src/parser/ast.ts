// Type definitions for ESTree AST specification
// Project: https://github.com/estree/estree
// Definitions by: RReverser <https://github.com/RReverser>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// This definition file follows a somewhat unusual format. ESTree allows
// runtime type checks based on the `type` parameter. In order to explain this
// to typescript we want to use discriminated union types:
// https://github.com/Microsoft/TypeScript/pull/9163
//
// For ESTree this is a bit tricky because the high level interfaces like
// Node or Function are pulling double duty. We want to pass common fields down
// to the interfaces that extend them (like Identifier or
// ArrowFunctionExpression), but you can't extend a type union or enforce
// common fields on them. So we've split the high level interfaces into two
// types, a base type which passes down inhereted fields, and a type union of
// all types which extend the base type. Only the type union is exported, and
// the union is how other types refer to the collection of inheriting types.
//
// This makes the definitions file here somewhat more difficult to maintain,
// but it has the notable advantage of making ESTree much easier to use as
// an end user.

interface BaseNodeWithoutComments {
  // Every leaf interface that extends BaseNode must specify a type property.
  // The type property should be a string literal. For example, Identifier
  // has: `type: "Identifier"`
  type: string
  loc?: SourceLocation | null
  range?: [number, number]
}

interface BaseNode extends BaseNodeWithoutComments {
  leadingComments?: Array<Comment>
  trailingComments?: Array<Comment>
}

export type Node =
  | Identifier
  | Literal
  | Program
  | Function
  | SwitchCase
  | CatchClause
  | VariableDeclarator
  | Statement
  | Expression
  | Property
  | AssignmentProperty
  | Super
  | TemplateElement
  | SpreadElement
  | Pattern
  | ClassBody
  | Class
  | MethodDefinition
  | ModuleDeclaration
  | ModuleSpecifier

export interface Comment extends BaseNodeWithoutComments {
  type: 'Line' | 'Block'
  value: string
}

export interface SourceLocation {
  source?: string | null
  start: Position
  end: Position
}

export interface Position {
  /** >= 1 */
  line: number
  /** >= 0 */
  column: number
}

export interface Program extends BaseNode {
  type: 'Program'
  sourceType: 'script' | 'module'
  body: Array<Directive | Statement | ModuleDeclaration>
  comments?: Array<Comment>
}

export interface Directive extends BaseNode {
  type: 'ExpressionStatement'
  expression: Literal
  directive: string
}

interface BaseFunction extends BaseNode {
  params: Array<Pattern>
  generator?: boolean
  async?: boolean
  // The body is either BlockStatement or Expression because arrow functions
  // can have a body that's either. FunctionDeclarations and
  // FunctionExpressions have only BlockStatement bodies.
  body: BlockStatement | Expression
}

export type Function =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunctionExpression
  | FunctionPythonDeclaration

export type Statement =
  | ExpressionStatement // use
  | BlockStatement // use a lot, suite in python
  | EmptyStatement // use
  | DebuggerStatement
  | WithStatement // use
  | ReturnStatement // use ReturnPythonStatement instead
  | LabeledStatement
  | BreakStatement // use
  | ContinueStatement //use
  | IfStatement // use
  | SwitchStatement
  | ThrowStatement
  | TryStatement // // Did not use it, uses TryPythonStatement instead
  | WhileStatement // Did not use it, uses WhilePythonStatement instead
  | DoWhileStatement
  | ForStatement // Did not use it, as the for statement logic in Python is different, use ForPythonStatement instead
  | ForInStatement
  | ForOfStatement
  | Declaration
  // Newly Added
  | DeleteStatement
  | PassStatement
  | ImportStatement
  | GlobalStatement
  | NonlocalStatement
  | WhilePythonStatement
  | ForPythonStatement
  | AssertStatement
  | TryPythonStatement
  | RaiseStatement
  | YieldStatement
  | ReturnPythonStatement

type BaseStatement = BaseNode

export interface EmptyStatement extends BaseStatement {
  type: 'EmptyStatement'
}

export interface ReturnPythonStatement extends BaseStatement {
  type: 'ReturnPythonStatement'
  argument: Array<Expression> | null
}

export interface YieldStatement extends BaseStatement {
  type: 'YieldStatement'
  expression: Expression
}

export interface RaiseStatement extends BaseStatement {
  type: 'RaiseStatement'
  info: Expression | null
}

export interface TryPythonStatement extends BaseStatement {
  type: 'TryPythonStatement'
  trybody: Statement
  exceptbody: Statement
  elsebody: Statement | null
  finallybody: Statement | null
}

export interface AssertStatement extends BaseStatement {
  type: 'AssertStatement'
  expression: Expression
}

export interface ForPythonStatement extends BaseStatement {
  type: 'ForPythonStatement'
  iter: Expression
  iterated: Array<Expression>
  body: Statement
  els: Statement
}

export interface WhilePythonStatement extends BaseStatement {
  type: 'WhilePythonStatement'
  test: Expression
  body: Statement
  els: Statement
}

export interface GlobalStatement extends BaseStatement {
  type: 'GlobalStatement'
  globallist: Array<String>
}

export interface NonlocalStatement extends BaseStatement {
  type: 'NonlocalStatement'
  nonlocallist: Array<String>
}

export interface ImportStatement extends BaseStatement {
  type: 'ImportStatement'
  expression: Expression
}

export interface PassStatement extends BaseStatement {
  type: 'PassStatement'
}

export interface DeleteStatement extends BaseStatement {
  type: 'DeleteStatement'
  elements: Array<Expression>
}

export interface BlockStatement extends BaseStatement {
  type: 'BlockStatement'
  body: Array<Statement>
  innerComments?: Array<Comment>
}

export interface ExpressionStatement extends BaseStatement {
  type: 'ExpressionStatement'
  expression: Expression
}

export interface IfStatement extends BaseStatement {
  type: 'IfStatement'
  test: Expression
  consequent: Statement
  alternate?: Statement | null
}

export interface LabeledStatement extends BaseStatement {
  type: 'LabeledStatement'
  label: Identifier
  body: Statement
}

export interface BreakStatement extends BaseStatement {
  type: 'BreakStatement'
  label?: Identifier | null
}

export interface ContinueStatement extends BaseStatement {
  type: 'ContinueStatement'
  label?: Identifier | null
}

export interface WithStatement extends BaseStatement {
  type: 'WithStatement'
  object: Expression
  body: Statement
}

export interface SwitchStatement extends BaseStatement {
  type: 'SwitchStatement'
  discriminant: Expression
  cases: Array<SwitchCase>
}

export interface ReturnStatement extends BaseStatement {
  type: 'ReturnStatement'
  argument?: Expression | null
}

export interface ThrowStatement extends BaseStatement {
  type: 'ThrowStatement'
  argument: Expression
}

export interface TryStatement extends BaseStatement {
  type: 'TryStatement'
  block: BlockStatement
  handler?: CatchClause | null
  finalizer?: BlockStatement | null
}

export interface WhileStatement extends BaseStatement {
  type: 'WhileStatement'
  test: Expression
  body: Statement
}

export interface DoWhileStatement extends BaseStatement {
  type: 'DoWhileStatement'
  body: Statement
  test: Expression
}

export interface ForStatement extends BaseStatement {
  type: 'ForStatement'
  init?: VariableDeclaration | Expression | null
  test?: Expression | null
  update?: Expression | null
  body: Statement
}

interface BaseForXStatement extends BaseStatement {
  left: VariableDeclaration | Pattern
  right: Expression
  body: Statement
}

export interface ForInStatement extends BaseForXStatement {
  type: 'ForInStatement'
}

export interface DebuggerStatement extends BaseStatement {
  type: 'DebuggerStatement'
}

export type Declaration =
  | FunctionDeclaration
  | VariableDeclaration
  | ClassDeclaration
  | FunctionPythonDeclaration
  | ClassPythonDeclaration

type BaseDeclaration = BaseStatement

export interface FunctionDeclaration extends BaseFunction, BaseDeclaration {
  type: 'FunctionDeclaration'
  /** It is null when a function declaration is a part of the `export default function` statement */
  id: Identifier | null
  body: BlockStatement
}

export interface ClassPythonDeclaration extends BaseDeclaration {
  type: 'ClassPythonDeclaration'
  id: Identifier
  arglist: Array<Expression>
  body: Statement
}

export interface FunctionPythonDeclaration extends BaseDeclaration {
  type: 'FunctionPythonDeclaration'
  id: Identifier
  params: Expression
  body: Statement
}

export interface VariableDeclaration extends BaseDeclaration {
  type: 'VariableDeclaration'
  declarations: Array<VariableDeclarator>
  kind: 'var' | 'let' | 'const'
}

export interface VariableDeclarator extends BaseNode {
  type: 'VariableDeclarator'
  id: Pattern
  init?: Expression | null
}

export type Expression =
  | ThisExpression
  | ArrayExpression // List
  | ObjectExpression
  | FunctionExpression
  | ArrowFunctionExpression
  | YieldExpression // use
  | Literal // use
  | UnaryExpression // use
  | UpdateExpression
  | BinaryExpression // use
  | AssignmentExpression // Use
  | LogicalExpression
  | MemberExpression
  | ConditionalExpression // use
  | CallExpression
  | NewExpression
  | SequenceExpression // Tuple
  | TemplateLiteral
  | TaggedTemplateExpression
  | ClassExpression
  | MetaProperty
  | Identifier
  | AwaitExpression
  | ImportExpression // Not used, the properties are not complete, using ImportFromExpression instead
  | ChainExpression
  // Newly added
  | DictExpression // Dict
  | TrailerExpression
  | ArgListExpression
  | SubscriptListExpression
  | ImportFromExpression
  | TestListStarExpression
  | SubscriptExpression
  | ParameterExpression
  | TypedargslistExpression // used in typearglist and varargslist
  | ArgumentExpression
  | SetExpression
  | KeyValueExpression
  | ImportedElementExpression
  | WithItemExpression
  | LambdaDefExpression

export type BaseExpression = BaseNode

type ChainElement = SimpleCallExpression | MemberExpression

export interface LambdaDefExpression extends BaseExpression {
  type: 'LambdaDefExpression'
  arguments: Array<Expression> | null
  body: Expression
}

export interface WithItemExpression extends BaseExpression {
  type: 'WithItemExpression'
  object: Expression
  alias: Expression | null
}

export interface KeyValueExpression extends BaseExpression {
  type: 'KeyValueExpression'
  key: Expression
  value: Expression
}

export interface SetExpression extends BaseExpression {
  type: 'SetExpression'
  elements: Array<Expression>
}

export interface ArgumentExpression extends BaseExpression {
  type: 'ArgumentExpression'
  key: Expression | null
  value: Expression
}

export interface TypedargslistExpression extends BaseExpression {
  type: 'TypedargslistExpression'
  name: Expression
  default: Expression | null
}

export interface ParameterExpression extends BaseExpression {
  type: 'ParameterExpression'
  expressions: Array<Expression>
}

export interface SubscriptExpression extends BaseExpression {
  type: 'SubscriptExpression'
  start: Expression | null
  end: Expression | null
  sep: Expression | null
}

export interface TestListStarExpression extends BaseExpression {
  type: 'TestListStarExpression'
  expressions: Array<Expression>
}

export interface ImportFromExpression extends BaseExpression {
  type: 'ImportFromExpression'
  from: Expression | null
  imported: Array<Expression>
}

export interface ImportedElementExpression extends BaseExpression {
  type: 'ImportedElementExpression'
  name: Expression
  alias: Expression | null
}

export interface SubscriptListExpression extends BaseExpression {
  type: 'SubscriptListExpression'
  body: Array<Expression>
}
export interface ArgListExpression extends BaseExpression {
  type: 'ArgListExpression'
  body: Array<Expression>
}

export interface TrailerExpression extends BaseExpression {
  type: 'TrailerExpression'
  base: Expression
  trailer: Array<Expression>
}
export interface DictExpression extends BaseExpression {
  type: 'DictExpression'
  elements: Array<Expression>
}

export interface ChainExpression extends BaseExpression {
  type: 'ChainExpression'
  expression: ChainElement
}

export interface ThisExpression extends BaseExpression {
  type: 'ThisExpression'
}

export interface ArrayExpression extends BaseExpression {
  type: 'ArrayExpression'
  elements: Array<Expression | SpreadElement>
}

export interface ObjectExpression extends BaseExpression {
  type: 'ObjectExpression'
  properties: Array<Property | SpreadElement>
}

export interface Property extends BaseNode {
  type: 'Property'
  key: Expression
  value: Expression | Pattern // Could be an AssignmentProperty
  kind: 'init' | 'get' | 'set'
  method: boolean
  shorthand: boolean
  computed: boolean
}

export interface FunctionExpression extends BaseFunction, BaseExpression {
  id?: Identifier | null
  type: 'FunctionExpression'
  body: BlockStatement
}

export interface SequenceExpression extends BaseExpression {
  type: 'SequenceExpression'
  expressions: Array<Expression>
}

export interface UnaryExpression extends BaseExpression {
  type: 'UnaryExpression'
  operator: UnaryOperator
  prefix: true
  argument: Expression
}

export interface BinaryExpression extends BaseExpression {
  type: 'BinaryExpression'
  operator: BinaryOperator
  left: Expression
  right: Expression
}

export interface AssignmentExpression extends BaseExpression {
  type: 'AssignmentExpression'
  operator: AssignmentOperator
  left: Pattern | MemberExpression | Expression
  right: Expression
}

export interface UpdateExpression extends BaseExpression {
  type: 'UpdateExpression'
  operator: UpdateOperator
  argument: Expression
  prefix: boolean
}

export interface LogicalExpression extends BaseExpression {
  type: 'LogicalExpression'
  operator: LogicalOperator
  left: Expression
  right: Expression
}

export interface ConditionalExpression extends BaseExpression {
  type: 'ConditionalExpression'
  test: Expression
  alternate: Expression
  consequent: Expression
}

interface BaseCallExpression extends BaseExpression {
  callee: Expression | Super
  arguments: Array<Expression | SpreadElement>
}
export type CallExpression = SimpleCallExpression | NewExpression

export interface SimpleCallExpression extends BaseCallExpression {
  type: 'CallExpression'
  optional: boolean
}

export interface NewExpression extends BaseCallExpression {
  type: 'NewExpression'
}

export interface MemberExpression extends BaseExpression, BasePattern {
  type: 'MemberExpression'
  object: Expression | Super
  property: Expression
  computed: boolean
  optional: boolean
}

export type Pattern =
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | RestElement
  | AssignmentPattern
  | MemberExpression

type BasePattern = BaseNode

export interface SwitchCase extends BaseNode {
  type: 'SwitchCase'
  test?: Expression | null
  consequent: Array<Statement>
}

export interface CatchClause extends BaseNode {
  type: 'CatchClause'
  param: Pattern | null
  body: BlockStatement
}

export interface Identifier extends BaseNode, BaseExpression, BasePattern {
  type: 'Identifier'
  name: string
}

export type Literal = SimpleLiteral | RegExpLiteral

export interface SimpleLiteral extends BaseNode, BaseExpression {
  type: 'Literal'
  value: string | boolean | number | null
  raw?: string
}

export interface RegExpLiteral extends BaseNode, BaseExpression {
  type: 'Literal'
  value?: RegExp | null
  regex: {
    pattern: string
    flags: string
  }
  raw?: string
}

export type UnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete' | 'not'

export type BinaryOperator =
  | '=='
  | '!='
  | '==='
  | '!=='
  | '<'
  | '<='
  | '>'
  | '>='
  | '<<'
  | '>>'
  | '>>>'
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '**'
  | '|'
  | '^'
  | '&'
  | 'in'
  | 'not in'
  | 'is'
  | 'is not'
  | '<>'
  | 'and'
  | 'or'
  | '//'
;('instanceof')

export type LogicalOperator = '||' | '&&' | '??'

export type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '**='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&='
  | '//='

export type UpdateOperator = '++' | '--'

export interface ForOfStatement extends BaseForXStatement {
  type: 'ForOfStatement'
  await: boolean
}

export interface Super extends BaseNode {
  type: 'Super'
}

export interface SpreadElement extends BaseNode {
  type: 'SpreadElement'
  argument: Expression
}

export interface ArrowFunctionExpression extends BaseExpression, BaseFunction {
  type: 'ArrowFunctionExpression'
  expression: boolean
  body: BlockStatement | Expression
}

export interface YieldExpression extends BaseExpression {
  type: 'YieldExpression'
  argument?: Array<Expression> | null
  delegate: boolean
}

export interface TemplateLiteral extends BaseExpression {
  type: 'TemplateLiteral'
  quasis: Array<TemplateElement>
  expressions: Array<Expression>
}

export interface TaggedTemplateExpression extends BaseExpression {
  type: 'TaggedTemplateExpression'
  tag: Expression
  quasi: TemplateLiteral
}

export interface TemplateElement extends BaseNode {
  type: 'TemplateElement'
  tail: boolean
  value: {
    cooked: string
    raw: string
  }
}

export interface AssignmentProperty extends Property {
  value: Pattern
  kind: 'init'
  method: boolean // false
}

export interface ObjectPattern extends BasePattern {
  type: 'ObjectPattern'
  properties: Array<AssignmentProperty | RestElement>
}

export interface ArrayPattern extends BasePattern {
  type: 'ArrayPattern'
  elements: Array<Pattern>
}

export interface RestElement extends BasePattern {
  type: 'RestElement'
  argument: Pattern
}

export interface AssignmentPattern extends BasePattern {
  type: 'AssignmentPattern'
  left: Pattern
  right: Expression
}

export type Class = ClassDeclaration | ClassExpression
interface BaseClass extends BaseNode {
  superClass?: Expression | null
  body: ClassBody
}

export interface ClassBody extends BaseNode {
  type: 'ClassBody'
  body: Array<MethodDefinition>
}

export interface MethodDefinition extends BaseNode {
  type: 'MethodDefinition'
  key: Expression
  value: FunctionExpression
  kind: 'constructor' | 'method' | 'get' | 'set'
  computed: boolean
  static: boolean
}

export interface ClassDeclaration extends BaseClass, BaseDeclaration {
  type: 'ClassDeclaration'
  /** It is null when a class declaration is a part of the `export default class` statement */
  id: Identifier | null
}

export interface ClassExpression extends BaseClass, BaseExpression {
  type: 'ClassExpression'
  id?: Identifier | null
}

export interface MetaProperty extends BaseExpression {
  type: 'MetaProperty'
  meta: Identifier
  property: Identifier
}

export type ModuleDeclaration =
  | ImportDeclaration
  | ExportNamedDeclaration
  | ExportDefaultDeclaration
  | ExportAllDeclaration
type BaseModuleDeclaration = BaseNode

export type ModuleSpecifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ExportSpecifier
interface BaseModuleSpecifier extends BaseNode {
  local: Identifier
}

export interface ImportDeclaration extends BaseModuleDeclaration {
  type: 'ImportDeclaration'
  specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>
  source: Literal
}

export interface ImportSpecifier extends BaseModuleSpecifier {
  type: 'ImportSpecifier'
  imported: Identifier
}

export interface ImportExpression extends BaseExpression {
  type: 'ImportExpression'
  source: Expression
}

export interface ImportDefaultSpecifier extends BaseModuleSpecifier {
  type: 'ImportDefaultSpecifier'
}

export interface ImportNamespaceSpecifier extends BaseModuleSpecifier {
  type: 'ImportNamespaceSpecifier'
}

export interface ExportNamedDeclaration extends BaseModuleDeclaration {
  type: 'ExportNamedDeclaration'
  declaration?: Declaration | null
  specifiers: Array<ExportSpecifier>
  source?: Literal | null
}

export interface ExportSpecifier extends BaseModuleSpecifier {
  type: 'ExportSpecifier'
  exported: Identifier
}

export interface ExportDefaultDeclaration extends BaseModuleDeclaration {
  type: 'ExportDefaultDeclaration'
  declaration: Declaration | Expression
}

export interface ExportAllDeclaration extends BaseModuleDeclaration {
  type: 'ExportAllDeclaration'
  source: Literal
}

export interface AwaitExpression extends BaseExpression {
  type: 'AwaitExpression'
  argument: Expression
}

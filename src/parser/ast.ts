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
  //loc?: SourceLocation | null
  range?: [number, number]
}

interface BaseNode extends BaseNodeWithoutComments {
  leadingComments?: Array<Comment>
  trailingComments?: Array<Comment>
}

export type Node =
  | Name
  // | Identifier
  | Value
  // | Literal
  | Program
  // | Function
  // | SwitchCase
  // | CatchClause
  // | VariableDeclarator
  | Statement
  | Expression
  | Definition
// | Property
// | AssignmentProperty
// | Super
// | TemplateElement
// | SpreadElement
// | Pattern
// | ClassBody
// | Class
// | MethodDefinition
// | ModuleDeclaration
// | ModuleSpecifier

/*export interface Comment extends BaseNodeWithoutComments {
  type: 'Line' | 'Block'
  value: string
}*/

/*export interface SourceLocation {
  source?: string | null
  start: Position
  end: Position
}*/

/*export interface Position {
  // >= 1
  line: number
  // >= 0
  column: number
}*/

export interface Name extends BaseNode {
  type: 'Name'
  name: string
}

export interface Program extends BaseNode {
  type: 'Program'
  sourceType: 'script' // | 'module'
  //body: Array<Directive | Statement | ModuleDeclaration>
  body: Array<StatementStatement>
}

/*export interface Directive extends BaseNode {
  type: 'ExpressionStatement'
  expression: Literal
  directive: string
}*/

/*interface BaseFunction extends BaseNode {
  params: Array<Pattern>
  generator?: boolean
  async?: boolean
  // The body is either BlockStatement or Expression because arrow functions
  // can have a body that's either. FunctionDeclarations and
  // FunctionExpressions have only BlockStatement bodies.
  body: BlockStatement | Expression
}*/

//export type Function = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
export type Value = StringValue | IntegerValue | FloatValue | BooleanValue | NoneValue

export type Statement =
  | StatementStatement
  | SimpleStatement
  | CompoundStatement
  | SmallStatement
  | ExpressionStatement
  | DeleteStatement
  | PassStatement
  | FlowStatement
  | ImportStatement
  | GlobalStatement
  | NonlocalStatement
  | AssertStatement
  | AugAssignStatement
  | AssignmentStatement
  | BreakStatement
  | ContinueStatement
  | ReturnStatement
  | RaiseStatement
  | YieldStatement
  | IfStatement
  | WhileStatement
  | ForStatement
  | TryStatement
  | WithStatement
  | SuiteStatement
  | ExceptStatement

export type Expression =
  | ExpressionExpression
  | TestListStarExpression
  | ExprListExpression
  | ImportNameExpression
  | ImportFromExpression
  | TestExpression
  | TestListExpression
  | YieldExpression
  | WithItemExpression
  | ExceptClauseExpression
  | StarExpression
  | DottedAsNameExpression
  | DottedAsNamesExpression
  | DottedNameExpression
  | ImportAsNameExpression
  | ImportedAsNamesExpression
  | OrTestExpression
  | AndTestExpression
  | NotTestExpression
  | NotOpExpression
  | ComparisonExpression
  | SingleLineIfExpression
  | YieldArgumentExpression
  | XorExpression
  | AndExpression
  | ShiftExpression
  | ArithExpression
  | TermExpression
  | FactorExpression
  | UnaryExpression
  | PowerExpression
  | AtomExpression
  | TrailerExpression
  | TupleExpression
  | TestListCompExpression
  | ListExpression
  | TestCompForExpression
  | CompForExpression
  | CompIterExpression
  | CompIfExpression
  | TestNoCondExpression
  | DictorsetMakerExpression
  | SetExpression
  | SetCompForExpression
  | SetListExpression
  | DictExpression
  | DictKeyValueExpression
  | DictCompForExpression
  | ArgListExpression
  | ArgumentExpression
  | ArgumentKeyValueExpression
  | ArgumentWithoutKeyExpression
  | SubscriptlistExpression
  | SubscriptExpression
  | SubscriptIntervalExpression
  | SliceOpExpression
  | VarArgsListExpression
  | ParameterExpression
  | TypedArgsListExpression
  | TypedArgsKeyValueExpression
  | TfpDefExpression
  | VarArgsKeyValueExpression
  | VfpDefExpression
  | DecoratorsExpression
  | DecoratorExpression

export type AugAssignOperator =
  | '+='
  | '-='
  | '*='
  | '@='
  | '/='
  | '%='
  | '&='
  | '|='
  | '^='
  | '<<='
  | '>>='
  | '**='
  | '//='

export type ShiftOperator = '<<' | '>>'
export type ArithOperator = '+' | '-'
export type TermOperator = '*' | '/' | '%' | '//' | '@'
export type UnaryOperator = '+' | '-' | '~'
export type ComparisonOperator =
  | '<'
  | '>'
  | '=='
  | '>='
  | '<='
  | '<>'
  | '!='
  | 'in'
  | 'not in'
  | 'is'
  | 'is not'

export type Definition = FuncDefinition | ClassDefinition | LambDefinition | LambNoCondDefinition

type BaseStatement = BaseNode

/*export interface EmptyStatement extends BaseStatement {
  type: 'EmptyStatement'
}*/

/*export interface BlockStatement extends BaseStatement {
  type: 'BlockStatement'
  body: Array<Statement>
  innerComments?: Array<Comment>
}*/

export interface StatementStatement extends BaseStatement {
  type: 'StatementStatement'
  body: SimpleStatement | CompoundStatement
}
export interface SimpleStatement extends BaseStatement {
  type: 'SimpleStatement'
  body: Array<SmallStatement>
  //value: AssignmentExpression | BinaryExpression | UnaryExpression | ConditionalExpression
}

export interface SmallStatement extends BaseStatement {
  type: 'SimpleStatement'
  body:
    | ExpressionStatement
    | DeleteStatement
    | PassStatement
    | FlowStatement
    | ImportStatement
    | GlobalStatement
    | NonlocalStatement
    | AssertStatement
  //value: AssignmentExpression | BinaryExpression | UnaryExpression | ConditionalExpression
}

export interface ExpressionStatement extends BaseStatement {
  type: 'ExpressionStatement'
  body: AugAssignStatement | AssignmentStatement | TestListStarExpression
}

export interface DeleteStatement extends BaseStatement {
  type: 'DeleteStatement'
  expression: ExprListExpression
}

export interface PassStatement extends BaseStatement {
  type: 'PassStatement'
}

export interface FlowStatement extends BaseStatement {
  type: 'FlowStatement'
  body: BreakStatement | ContinueStatement | ReturnStatement | RaiseStatement | YieldStatement
}

export interface ImportStatement extends BaseStatement {
  type: 'ImportStatement'
  body: ImportNameExpression | ImportFromExpression
}

export interface GlobalStatement extends BaseStatement {
  type: 'GlobalStatement'
  expression: Array<Name>
}

export interface NonlocalStatement extends BaseStatement {
  type: 'NonlocalStatement'
  expression: Array<Name>
}

export interface AssertStatement extends BaseStatement {
  type: 'AssertStatement'
  expression: Array<TestExpression>
}

export interface AugAssignStatement extends BaseStatement {
  type: 'AugAssignStatement'
  left: TestListStarExpression
  operator: AugAssignOperator
  right: TestListExpression | YieldExpression
}

export interface AssignmentStatement extends BaseStatement {
  type: 'AssignmentStatement'
  left: TestListStarExpression
  right: TestListStarExpression | YieldExpression | AssignmentStatement
}

export interface BreakStatement extends BaseStatement {
  type: 'BreakStatement'
}

export interface ContinueStatement extends BaseStatement {
  type: 'ContinueStatement'
}

export interface ReturnStatement extends BaseStatement {
  type: 'ReturnStatement'
  returned?: TestListExpression
}

export interface RaiseStatement extends BaseStatement {
  type: 'RaiseStatement'
  info: TestExpression
}

export interface YieldStatement extends BaseStatement {
  type: 'YieldStatement'
  body: YieldExpression
}

export interface CompoundStatement extends BaseStatement {
  type: 'CompoundStatement'
  body:
    | IfStatement
    | WhileStatement
    | ForStatement
    | TryStatement
    | WithStatement
    | FuncDefinition
    | ClassDefinition
    | Decorated
}

export interface IfStatement extends BaseStatement {
  type: 'IfStatement'
  test: TestExpression
  test_true: SuiteStatement
  test_false: SuiteStatement
}

export interface WhileStatement extends BaseStatement {
  type: 'WhileStatement'
  test: TestExpression
  body: SuiteStatement
  else: SuiteStatement
}

export interface ForStatement extends BaseStatement {
  type: 'ForStatement'
  iter: ExprListExpression
  iterated: TestListExpression
  body: SuiteStatement
  else: SuiteStatement
}

export interface TryStatement extends BaseStatement {
  type: 'TryStatement'
  trybody: SuiteStatement
  exceptlist: Array<ExceptStatement>
  else: SuiteStatement
  Finally: SuiteStatement
}

export interface WithStatement extends BaseStatement {
  type: 'WithStatement'
  items: Array<WithItemExpression>
  body: SuiteStatement
}

export interface SuiteStatement extends BaseStatement {
  type: 'SuiteStatement'
  body: SimpleStatement | Array<StatementStatement>
}

export interface ExceptStatement extends BaseStatement {
  type: 'ExceptStatement'
  test: ExceptClauseExpression
  body: SuiteStatement
}

type BaseExpression = BaseNode

export interface TestListStarExpression extends BaseExpression {
  type: 'TestListStarExpression'
  value: Array<TestExpression>
}

export interface ExprListExpression extends BaseExpression {
  type: 'ExprListExpression'
  value: Array<StarExpression>
}

export interface ImportNameExpression extends BaseExpression {
  type: 'ImportNameExpression'
  imported: DottedAsNamesExpression
}

export interface ImportFromExpression extends BaseExpression {
  type: 'ImportFromExpression'
  file: DottedNameExpression
  imported: ImportedAsNamesExpression
}

export interface TestExpression extends BaseExpression {
  type: 'TestExpression'
  body: SingleLineIfExpression | LambDefinition
}

export interface SingleLineIfExpression extends BaseExpression {
  type: 'SingleLineIfExpression'
  test: OrTestExpression
  test_true: OrTestExpression
  test_false: TestExpression
}

export interface TestListExpression extends BaseExpression {
  type: 'TestListExpression'
  value: Array<TestExpression>
}

export interface YieldExpression extends BaseExpression {
  type: 'YieldExpression'
  arg: YieldArgumentExpression
}

export interface WithItemExpression extends BaseExpression {
  type: 'WithItemExpression'
  test: TestExpression
  alias: ExpressionExpression | undefined
}

export interface ExpressionExpression extends BaseExpression {
  type: 'ExpressionExpression'
  left: XorExpression
  right: XorExpression | ExpressionExpression
}

export interface XorExpression extends BaseExpression {
  type: 'XorExpression'
  left: AndExpression
  right: AndExpression | XorExpression
}

export interface AndExpression extends BaseExpression {
  type: 'AndExpression'
  left: ShiftExpression
  right: ShiftExpression | AndExpression
}

export interface ShiftExpression extends BaseExpression {
  type: 'ShiftExpression'
  left: ArithExpression
  operator: ShiftOperator
  right: ArithExpression | ShiftExpression
}

export interface ArithExpression extends BaseExpression {
  type: 'ArithExpression'
  left: TermExpression
  operator: ArithOperator
  right: TermExpression | ArithExpression
}

export interface TermExpression extends BaseExpression {
  type: 'TermExpression'
  left: FactorExpression
  operator: TermOperator
  right: FactorExpression | TermExpression
}

export interface FactorExpression extends BaseExpression {
  type: 'FactorExpression'
  body: UnaryExpression | PowerExpression
}

export interface UnaryExpression extends BaseExpression {
  type: 'UnaryExpression'
  operator: UnaryOperator
  body: FactorExpression
}

export interface PowerExpression extends BaseExpression {
  type: 'PowerExpression'
  atom: AtomExpression
  trailer: TrailerExpression | undefined
  exp: FactorExpression
}

export interface AtomExpression extends BaseExpression {
  type: 'AtomExpression'
  body:
    | Name
    | IntegerValue
    | FloatValue
    | StringValue
    | NoneValue
    | BooleanValue
    | TupleExpression
    | TestListCompExpression
    | DictorsetMakerExpression
}

export interface TrailerExpression extends BaseExpression {
  type: 'TrailerExpression'
  body: ArgListExpression | SubscriptlistExpression | Name | undefined
}

export interface TupleExpression extends BaseExpression {
  type: 'TupleExpression'
  body: YieldExpression | TestListCompExpression | undefined
}

export interface TestListCompExpression extends BaseExpression {
  type: 'TestListCompExpression'
  body: ListExpression | TestCompForExpression | undefined
}

export interface ListExpression extends BaseExpression {
  type: 'ListExpression'
  element: Array<TestExpression>
}

export interface TestCompForExpression extends BaseExpression {
  type: 'TestCompForExpression'
  element: TestExpression
  compfor: CompForExpression
}

export interface CompForExpression extends BaseExpression {
  type: 'CompForExpression'
  iter: ExprListExpression
  iterated: OrTestExpression
  compiter: CompIterExpression
}

export interface CompIterExpression extends BaseExpression {
  type: 'CompIterExpression'
  body: CompForExpression | CompIfExpression
}

export interface CompIfExpression extends BaseExpression {
  type: 'CompIfExpression'
  test: TestNoCondExpression
  compiter: CompIterExpression
}

export interface TestNoCondExpression extends BaseExpression {
  type: 'TestNoCondExpression'
  body: OrTestExpression | LambNoCondDefinition
}

export interface DictorsetMakerExpression extends BaseExpression {
  type: 'DictorsetMakerExpression'
  body: SetExpression | DictExpression | undefined
}

export interface SetExpression extends BaseExpression {
  type: 'SetExpression'
  body: SetCompForExpression | SetListExpression
}

export interface SetCompForExpression extends BaseExpression {
  type: 'SetCompForExpression'
  element: TestExpression
  compfor: CompForExpression
}

export interface SetListExpression extends BaseExpression {
  type: 'SetListExpression'
  element: Array<TestExpression>
}

export interface DictExpression extends BaseExpression {
  type: 'DictExpression'
  body: Array<DictKeyValueExpression> | DictCompForExpression
}

export interface DictKeyValueExpression extends BaseExpression {
  type: 'DictKeyValueExpression'
  key: TestExpression
  value: TestExpression
}

export interface DictCompForExpression extends BaseExpression {
  type: 'DictCompForExpression'
  key: TestExpression
  value: TestCompForExpression
}

export interface ExceptClauseExpression extends BaseExpression {
  type: 'ExceptClauseExpression'
  test: TestExpression | undefined
}

export interface StarExpression extends BaseExpression {
  type: 'StarExpression'
  star: BooleanValue
  expr: ExpressionExpression
}

export interface OrTestExpression extends BaseExpression {
  type: 'OrTestExpression'
  left: AndTestExpression
  right: AndTestExpression | OrTestExpression
}

export interface AndTestExpression extends BaseExpression {
  type: 'AndTestExpression'
  left: NotTestExpression
  right: NotTestExpression | AndTestExpression
}

export interface NotTestExpression extends BaseExpression {
  type: 'NotTestExpression'
  body: NotOpExpression | ComparisonExpression
}

export interface NotOpExpression extends BaseExpression {
  type: 'NotOpExpression'
  body: NotTestExpression
}

export interface ComparisonExpression extends BaseExpression {
  type: 'ComparisonExpression'
  left: StarExpression
  operator: ComparisonOperator
  right: StarExpression | ComparisonExpression
}

export interface DottedAsNamesExpression extends BaseExpression {
  type: 'DottedAsNamesExpression'
  body: Array<DottedAsNameExpression>
}

export interface DottedAsNameExpression extends BaseExpression {
  type: 'DottedAsNameExpression'
  name: DottedNameExpression
  alias: Name | undefined
}

export interface DottedNameExpression extends BaseExpression {
  type: 'DottedNameExpression'
  name: Array<Name>
}

export interface ImportedAsNamesExpression extends BaseExpression {
  type: 'ImportedAsNamesExpression'
  body: Array<ImportAsNameExpression>
}

export interface ImportAsNameExpression extends BaseExpression {
  type: 'ImportAsNameExpression'
  name: Name
  alias: Name | undefined
}

export interface YieldArgumentExpression extends BaseExpression {
  type: 'YieldArgumentExpression'
  body: TestExpression | TestListExpression
}

export interface ArgListExpression extends BaseExpression {
  type: 'ArgListExpression'
  body: Array<ArgumentExpression>
}

export interface ArgumentExpression extends BaseExpression {
  type: 'ArgumentExpression'
  body: ArgumentKeyValueExpression | ArgumentWithoutKeyExpression
}

export interface ArgumentKeyValueExpression extends BaseExpression {
  type: 'ArgumentKeyValueExpression'
  key: TestExpression
  value: TestExpression
}

export interface ArgumentWithoutKeyExpression extends BaseExpression {
  type: 'ArgumentWithoutKeyExpression'
  value: TestExpression
}

export interface SubscriptlistExpression extends BaseExpression {
  type: 'SubscriptlistExpression'
  body: Array<SubscriptExpression>
}

export interface SubscriptExpression extends BaseExpression {
  type: 'SubscriptExpression'
  body: TestExpression | SubscriptIntervalExpression
}

export interface SubscriptIntervalExpression extends BaseExpression {
  type: 'SubscriptIntervalExpression'
  start: TestExpression | undefined
  end: TestExpression | undefined
  sep: SliceOpExpression | undefined
}

export interface SliceOpExpression extends BaseExpression {
  type: 'SliceOpExpression'
  body: TestExpression | undefined
}

export type BaseDefinition = BaseNode

type Decoration = BaseNode

export interface Decorated extends Decoration {
  type: 'Decorated'
  decorators: DecoratorsExpression
  decorated: ClassDefinition | FuncDefinition
}

export interface DecoratorsExpression extends BaseExpression {
  type: 'DecoratorsExpression'
  body: Array<DecoratorExpression>
}

export interface DecoratorExpression extends BaseExpression {
  type: 'DecoratorExpression'
  name: DottedNameExpression
  arglist: ArgListExpression
}

export interface LambDefinition extends BaseDefinition {
  type: 'LambdaDefinition'
  arguments: VarArgsListExpression | undefined
  body: TestExpression
}

export interface LambNoCondDefinition extends BaseDefinition {
  type: 'LambdaDefinition'
  arguments: VarArgsListExpression | undefined
  body: TestNoCondExpression
}

export interface VarArgsListExpression extends BaseExpression {
  type: 'VarArgsListExpression'
  body: Array<VarArgsKeyValueExpression>
}

export interface VarArgsKeyValueExpression extends BaseExpression {
  type: 'VarArgsKeyValueExpression'
  name: VfpDefExpression
  default: TestExpression | undefined
}

export interface VfpDefExpression extends BaseExpression {
  type: 'VfpDefExpression'
  name: Name
}

export interface FuncDefinition extends BaseDefinition {
  type: 'FuncDefinition'
  name: Name
  parameters: ParameterExpression
  body: SuiteStatement
}

export interface ParameterExpression extends BaseExpression {
  type: 'ParameterExpression'
  body: TypedArgsListExpression | undefined
}

export interface TypedArgsListExpression extends BaseExpression {
  type: 'TypedArgsListExpression'
  body: Array<TypedArgsKeyValueExpression>
}

export interface TypedArgsKeyValueExpression extends BaseExpression {
  type: 'TypedArgsKeyValueExpression'
  name: TfpDefExpression
  default: TestExpression | undefined
}

export interface TfpDefExpression extends BaseExpression {
  type: 'TfpDefExpression'
  name: Name
}
export interface ClassDefinition extends BaseDefinition {
  type: 'ClassDefinition'
  name: Name
  arglist: ArgListExpression | undefined
  body: SuiteStatement
}

type BaseValue = BaseNode

export interface StringValue extends BaseValue {
  type: 'StringValue'
  value: string
}

export interface IntegerValue extends BaseValue {
  type: 'IntegerValue'
  value: number
}

export interface FloatValue extends BaseValue {
  type: 'FloatValue'
  value: number
}

export interface BooleanValue extends BaseValue {
  type: 'BooleanValue'
  value: boolean
}

export interface NoneValue extends BaseValue {
  type: 'NoneValue'
  value: null
}
// export interface CompoundStatement extends BaseStatement {
//   type: 'CompoundStatement'
//   value: ConditionalExpression
// }

// export interface IfStatement extends BaseStatement {
//   type: 'IfStatement'
//   test: Expression
//   consequent: Statement
//   alternate?: Statement | null
// }

// export interface LabeledStatement extends BaseStatement {
//   type: 'LabeledStatement'
//   label: Identifier
//   body: Statement
// }

// export interface BreakStatement extends BaseStatement {
//   type: 'BreakStatement'
//   label?: Identifier | null
// }

// export interface ContinueStatement extends BaseStatement {
//   type: 'ContinueStatement'
//   label?: Identifier | null
// }

// export interface WithStatement extends BaseStatement {
//   type: 'WithStatement'
//   object: Expression
//   body: Statement
// }

// export interface SwitchStatement extends BaseStatement {
//   type: 'SwitchStatement'
//   discriminant: Expression
//   cases: Array<SwitchCase>
// }

// export interface ReturnStatement extends BaseStatement {
//   type: 'ReturnStatement'
//   returned: Expression
// }

// export interface ThrowStatement extends BaseStatement {
//   type: 'ThrowStatement'
//   argument: Expression
// }

// export interface TryStatement extends BaseStatement {
//   type: 'TryStatement'
//   block: BlockStatement
//   handler?: CatchClause | null
//   finalizer?: BlockStatement | null
// }

// export interface WhileStatement extends BaseStatement {
//   type: 'WhileStatement'
//   test: Expression
//   body: Statement
// }

// export interface DoWhileStatement extends BaseStatement {
//   type: 'DoWhileStatement'
//   body: Statement
//   test: Expression
// }

// export interface ForStatement extends BaseStatement {
//   type: 'ForStatement'
//   init?: VariableDeclaration | Expression | null
//   test?: Expression | null
//   update?: Expression | null
//   body: Statement
// }

// interface BaseForXStatement extends BaseStatement {
//   left: VariableDeclaration | Pattern
//   right: Expression
//   body: Statement
// }

// export interface ForInStatement extends BaseForXStatement {
//   type: 'ForInStatement'
// }

// export interface DebuggerStatement extends BaseStatement {
//   type: 'DebuggerStatement'
// }

// export type Declaration = FunctionDeclaration | VariableDeclaration | ClassDeclaration

// type BaseDeclaration = BaseStatement

// export interface FunctionDeclaration extends BaseFunction, BaseDeclaration {
//   type: 'FunctionDeclaration'
//   /** It is null when a function declaration is a part of the `export default function` statement */
//   id: Identifier | null
//   body: BlockStatement
// }

// export interface VariableDeclaration extends BaseDeclaration {
//   type: 'VariableDeclaration'
//   declarations: Array<VariableDeclarator>
//   kind: 'var' | 'let' | 'const'
// }

// export interface VariableDeclarator extends BaseNode {
//   type: 'VariableDeclarator'
//   id: Pattern
//   init?: Expression | null
// }

//   | ThisExpression
//   | ArrayExpression
//   | ObjectExpression
//   | FunctionExpression
//   | ArrowFunctionExpression
//   | YieldExpression
//   | Value
//   | Literal
//   | UnaryExpression
//   | UpdateExpression
//   | BinaryExpression
//   | AssignmentExpression
//   | LogicalExpression
//   | MemberExpression
//   | ConditionalExpression
//   | CallExpression
//   | NewExpression
//   | SequenceExpression
//   | TemplateLiteral
//   | TaggedTemplateExpression
//   | ClassExpression
//   | MetaProperty
//   | Name
//   | Identifier
//   | AwaitExpression
//   | ImportExpression
//   | ChainExpression

// export type BaseExpression = BaseNode

// type ChainElement = SimpleCallExpression | MemberExpression

// export interface ChainExpression extends BaseExpression {
//   type: 'ChainExpression'
//   expression: ChainElement
// }

// export interface ThisExpression extends BaseExpression {
//   type: 'ThisExpression'
// }

// export interface ArrayExpression extends BaseExpression {
//   type: 'ArrayExpression'
//   elements: Array<Expression | SpreadElement>
// }

// export interface ObjectExpression extends BaseExpression {
//   type: 'ObjectExpression'
//   properties: Array<Property | SpreadElement>
// }

// export interface Property extends BaseNode {
//   type: 'Property'
//   key: Expression
//   value: Expression | Pattern // Could be an AssignmentProperty
//   kind: 'init' | 'get' | 'set'
//   method: boolean
//   shorthand: boolean
//   computed: boolean
// }

// export interface FunctionExpression extends BaseFunction, BaseExpression {
//   id?: Identifier | null
//   type: 'FunctionExpression'
//   body: BlockStatement
// }

// export interface SequenceExpression extends BaseExpression {
//   type: 'SequenceExpression'
//   expressions: Array<Expression>
// }

// export interface UnaryExpression extends BaseExpression {
//   type: 'UnaryExpression'
//   operator: UnaryOperator
//   prefix: true
//   argument: Expression
// }

// export interface BinaryExpression extends BaseExpression {
//   type: 'BinaryExpression'
//   operator: BinaryOperator
//   left: Expression
//   right: Expression
// }

// export interface AssignmentExpression extends BaseExpression {
//   type: 'Assignment'
//   left: Name
//   right: Expression
// }

// export interface UpdateExpression extends BaseExpression {
//   type: 'UpdateExpression'
//   operator: UpdateOperator
//   argument: Expression
//   prefix: boolean
// }

// export interface LogicalExpression extends BaseExpression {
//   type: 'LogicalExpression'
//   operator: LogicalOperator
//   left: Expression
//   right: Expression
// }

// export interface ConditionalExpression extends BaseExpression {
//   type: 'ConditionalExpression'
//   judge: Expression
//   judge_true: Expression
//   judge_false: Expression
// }

// interface BaseCallExpression extends BaseExpression {
//   callee: Expression | Super
//   arguments: Array<Expression | SpreadElement>
// }
// export type CallExpression = SimpleCallExpression | NewExpression

// export interface SimpleCallExpression extends BaseCallExpression {
//   type: 'CallExpression'
//   optional: boolean
// }

// export interface NewExpression extends BaseCallExpression {
//   type: 'NewExpression'
// }

// export interface MemberExpression extends BaseExpression, BasePattern {
//   type: 'MemberExpression'
//   object: Expression | Super
//   property: Expression
//   computed: boolean
//   optional: boolean
// }

// export type Pattern =
//   | Name
//   | Identifier
//   | ObjectPattern
//   | ArrayPattern
//   | RestElement
//   | AssignmentPattern
//   | MemberExpression

// type BasePattern = BaseNode

// /*export interface SwitchCase extends BaseNode {
//   type: 'SwitchCase'
//   test?: Expression | null
//   consequent: Array<Statement>
// }*/

// export interface CatchClause extends BaseNode {
//   type: 'CatchClause'
//   param: Pattern | null
//   body: BlockStatement
// }

// export interface Name extends BaseNode {
//   type: 'Name'
//   name: string
// }

// /*export interface Identifier extends BaseNode, BaseExpression, BasePattern {
//   type: 'Identifier'
//   name: string
// }*/

// export type Value = Number | Bool | String

// export interface Number extends BaseNode {
//   type: 'Number'
//   value: number
// }

// export interface Bool extends BaseNode {
//   type: 'Bool'
//   value: boolean
// }

// export interface String extends BaseNode {
//   type: 'String'
//   value: string
// }

// /*export type Literal = SimpleLiteral | RegExpLiteral

// export interface SimpleLiteral extends BaseNode, BaseExpression {
//   type: 'Literal'
//   value: string | boolean | number | null
//   raw?: string
// }

// export interface RegExpLiteral extends BaseNode, BaseExpression {
//   type: 'Literal'
//   value?: RegExp | null
//   regex: {
//     pattern: string
//     flags: string
//   }
//   raw?: string
// }*/

// export type UnaryOperator = '-' | '+' | '!' | 'not' | '~' | 'typeof' | 'void' | 'delete'

// export type BinaryOperator =
//   | '=='
//   | '!='
//   | '==='
//   | '!=='
//   | '<'
//   | '<='
//   | '>'
//   | '>='
//   | '<<'
//   | '>>'
//   | '>>>'
//   | '+'
//   | '-'
//   | '*'
//   | '/'
//   | '//'
//   | '%'
//   | '**'
//   | '|'
//   | 'or'
//   | '^'
//   | '&'
//   | 'and'
//   | 'in'
//   | 'instanceof'

// export type LogicalOperator = '||' | '&&' | '??'

// export type AssignmentOperator =
//   | '='
//   | '+='
//   | '-='
//   | '*='
//   | '/='
//   | '%='
//   | '**='
//   | '<<='
//   | '>>='
//   | '>>>='
//   | '|='
//   | '^='
//   | '&='

// export type UpdateOperator = '++' | '--'

// export interface ForOfStatement extends BaseForXStatement {
//   type: 'ForOfStatement'
//   await: boolean
// }

// export interface Super extends BaseNode {
//   type: 'Super'
// }

// export interface SpreadElement extends BaseNode {
//   type: 'SpreadElement'
//   argument: Expression
// }

// export interface ArrowFunctionExpression extends BaseExpression, BaseFunction {
//   type: 'ArrowFunctionExpression'
//   expression: boolean
//   body: BlockStatement | Expression
// }

// export interface YieldExpression extends BaseExpression {
//   type: 'YieldExpression'
//   argument?: Expression | null
//   delegate: boolean
// }

// export interface TemplateLiteral extends BaseExpression {
//   type: 'TemplateLiteral'
//   quasis: Array<TemplateElement>
//   expressions: Array<Expression>
// }

// export interface TaggedTemplateExpression extends BaseExpression {
//   type: 'TaggedTemplateExpression'
//   tag: Expression
//   quasi: TemplateLiteral
// }

// export interface TemplateElement extends BaseNode {
//   type: 'TemplateElement'
//   tail: boolean
//   value: {
//     cooked: string
//     raw: string
//   }
// }

// export interface AssignmentProperty extends Property {
//   value: Pattern
//   kind: 'init'
//   method: boolean // false
// }

// export interface ObjectPattern extends BasePattern {
//   type: 'ObjectPattern'
//   properties: Array<AssignmentProperty | RestElement>
// }

// export interface ArrayPattern extends BasePattern {
//   type: 'ArrayPattern'
//   elements: Array<Pattern>
// }

// export interface RestElement extends BasePattern {
//   type: 'RestElement'
//   argument: Pattern
// }

// export interface AssignmentPattern extends BasePattern {
//   type: 'AssignmentPattern'
//   left: Pattern
//   right: Expression
// }

// export type Class = ClassDeclaration | ClassExpression
// interface BaseClass extends BaseNode {
//   superClass?: Expression | null
//   body: ClassBody
// }

// export interface ClassBody extends BaseNode {
//   type: 'ClassBody'
//   body: Array<MethodDefinition>
// }

// export interface MethodDefinition extends BaseNode {
//   type: 'MethodDefinition'
//   key: Expression
//   value: FunctionExpression
//   kind: 'constructor' | 'method' | 'get' | 'set'
//   computed: boolean
//   static: boolean
// }

// export interface ClassDeclaration extends BaseClass, BaseDeclaration {
//   type: 'ClassDeclaration'
//   /** It is null when a class declaration is a part of the `export default class` statement */
//   id: Identifier | null
// }

// export interface ClassExpression extends BaseClass, BaseExpression {
//   type: 'ClassExpression'
//   id?: Identifier | null
// }

// export interface MetaProperty extends BaseExpression {
//   type: 'MetaProperty'
//   meta: Identifier
//   property: Identifier
// }

// export type ModuleDeclaration =
//   | ImportDeclaration
//   | ExportNamedDeclaration
//   | ExportDefaultDeclaration
//   | ExportAllDeclaration
// type BaseModuleDeclaration = BaseNode

// export type ModuleSpecifier =
//   | ImportSpecifier
//   | ImportDefaultSpecifier
//   | ImportNamespaceSpecifier
//   | ExportSpecifier
// interface BaseModuleSpecifier extends BaseNode {
//   local: Identifier
// }

// export interface ImportDeclaration extends BaseModuleDeclaration {
//   type: 'ImportDeclaration'
//   specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>
//   source: Literal
// }

// export interface ImportSpecifier extends BaseModuleSpecifier {
//   type: 'ImportSpecifier'
//   imported: Identifier
// }

// export interface ImportExpression extends BaseExpression {
//   type: 'ImportExpression'
//   source: Expression
// }

// export interface ImportDefaultSpecifier extends BaseModuleSpecifier {
//   type: 'ImportDefaultSpecifier'
// }

// export interface ImportNamespaceSpecifier extends BaseModuleSpecifier {
//   type: 'ImportNamespaceSpecifier'
// }

// export interface ExportNamedDeclaration extends BaseModuleDeclaration {
//   type: 'ExportNamedDeclaration'
//   declaration?: Declaration | null
//   specifiers: Array<ExportSpecifier>
//   source?: Literal | null
// }

// export interface ExportSpecifier extends BaseModuleSpecifier {
//   type: 'ExportSpecifier'
//   exported: Identifier
// }

// export interface ExportDefaultDeclaration extends BaseModuleDeclaration {
//   type: 'ExportDefaultDeclaration'
//   declaration: Declaration | Expression
// }

// export interface ExportAllDeclaration extends BaseModuleDeclaration {
//   type: 'ExportAllDeclaration'
//   source: Literal
// }

// export interface AwaitExpression extends BaseExpression {
//   type: 'AwaitExpression'
//   argument: Expression
// }

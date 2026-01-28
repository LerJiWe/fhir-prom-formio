import { 
    IRspec,
    MacroMap, Macro, NonLeafMacro, LeafMacro,
    Node, CommentNode, Node1, NonLeafNode, LeafNode,
    Condition, Cardinality,
    Type, NumberBoundType, DecimalType, IntegerType, StringType, MarkdownType,
    DateBoundType, DatePrecision, DateType, DateTimeType,
    TimeType, Base64BinaryType, BooleanType,
    CodeType, Option, Attachment, NonLeafAttachment, LeafAttachment,
} from "./StructMD-IRspec";

export interface Visitor {
    visitIRspec             (visitee: IRspec,            ...data: any[]): any;
    visitMacroMap           (visitee: MacroMap,          ...data: any[]): any;
    // visitMacro           (visitee: Macro,             ...data: any[]): any;
    visitNonLeafMacro       (visitee: NonLeafMacro,      ...data: any[]): any;
    visitLeafMacro          (visitee: LeafMacro,         ...data: any[]): any;
    // visitNode            (visitee: Node,              ...data: any[]): any;
    visitCommentNode        (visitee: CommentNode,       ...data: any[]): any;
    // visitNode1           (visitee: Node1,             ...data: any[]): any;
    visitNonLeafNode        (visitee: NonLeafNode,       ...data: any[]): any;
    visitLeafNode           (visitee: LeafNode,          ...data: any[]): any;
    visitCondition          (visitee: Condition,         ...data: any[]): any;
    visitCardinality        (visitee: Cardinality,       ...data: any[]): any;
    // visitType            (visitee: Type,              ...data: any[]): any;
    // visitNumberBoundType (visitee: NumberBoundType,   ...data: any[]): any;
    visitDecimalType        (visitee: DecimalType,       ...data: any[]): any;
    visitIntegerType        (visitee: IntegerType,       ...data: any[]): any;
    visitStringType         (visitee: StringType,        ...data: any[]): any;
    visitMarkdownType       (visitee: MarkdownType,      ...data: any[]): any;
    // visitDateBoundType   (visitee: DateBoundType,     ...data: any[]): any;
    visitDateType           (visitee: DateType,          ...data: any[]): any;
    visitDateTimeType       (visitee: DateTimeType,      ...data: any[]): any;
    visitTimeType           (visitee: TimeType,          ...data: any[]): any;
    visitBase64BinaryType   (visitee: Base64BinaryType,  ...data: any[]): any;
    visitBooleanType        (visitee: BooleanType,       ...data: any[]): any;
    visitCodeType           (visitee: CodeType,          ...data: any[]): any;
    visitOption             (visitee: Option,            ...data: any[]): any;
    // visitAttachment      (visitee: Attachment,        ...data: any[]): any;
    visitNonLeafAttachment  (visitee: NonLeafAttachment, ...data: any[]): any;
    visitLeafAttachment     (visitee: LeafAttachment,    ...data: any[]): any;
}

/*
    concrete class 才要
    abstract class 不用
 */

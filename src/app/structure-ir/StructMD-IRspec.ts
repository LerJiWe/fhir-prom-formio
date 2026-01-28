import fs from "fs";
import moment, { Moment, isMoment } from "moment";
import { Visitor } from "./Visitor";

/*  # StructMD-IR 相關文件與資料
    ## StructMD-IRspec Grammar
        規範 StructMD-IRspec，間接規範 StructMD-IR。
    ## StructMD-IRspec json 檔
        可能是待查核的 json 檔，也可能是查核後正確的 json 檔。
    ## StructMD-IRspec 內部資料結構
        從 json 檔載入後的記憶體內部資料結構，引導 Toolkit 中 Visitor 的運作。
 */

/*  # StructMD-IR 相關工具
    ## StructMD-IRspec Compiler
        -   內嵌：StructMD-IRspec grammar。
        -   輸入：待查核的 StructMD-IRspec.json。
        -   動作：查核是否符合 Grammar。
        -   輸出：轉成 StructMD-IRspec 內部結構，或輸出錯誤與警示訊息。
               再借助 StructMD-IR Toolkit 功能，輸出為正確的 StructMD-IRspec.json。
    ## StructMD-IR Toolkit
        -   兩大元件
            -   StructMD-IRspec 內部資料結構。
            -   引用 Visitor Design Pattern 的各個 Visitor。
                Visitor 將一邊 traversal StructMD-IRspec 內部資料結構，一邊做動作。
        -   前置動作：輸入正確的 StructMD-IRspec.json，轉成 StructMD-IRspec 內部資料結構。
        -   加值動作，由各個 Visitor 分頭負責：
            -   輸出正確的 StructMD-IRspec.json。
            -   輸出 StructMD-IR 模板，亦即呈現完整結構但填入假資料。
                目的：期待可以供 LLM 的 prompt 使用。
            -   輸入 StructMD-IR，檢核其正確性。
            -   輸入 StructMD-IR，做 json-to-json 轉換。
                轉換後的 json 可能是 StructMD-IR 的變體，目的：
                -   替換 StructMD-IR 裡面的 mName, code 等為使用者易讀的 name, display。
                -   搭配公版 json-to-yamal 產生使用者企望的 YAML。
                    寧可改 json，不動公版 json-to-yaml。
                -   應該還有。
 */

/*  # null 與 undefined 的使用
    ## StructMD-IRspec Compiler
        -   背景
            -   StructMD-IRspec 允許某些欄位從缺，如 Node 的 Condition 等。
            -   有提供的欄位可能解析正確，也可能有誤。
        -   輸入 json 的欄位 (json 的規則)
            -   必填的欄位：DATA (非 undefined 非 null)
            -   選填的欄位：DATA 或 undefined (從缺)
        -   解析的過程
            -   解析正確：回傳 DATA。
            -   解析有誤：回傳 undefined。
            -   確認從缺：回傳 null。
    ## StructMD-IR Toolkit 的內部資料結構
        -   背景
            -   考量物件中必填的欄位、選填的欄位、資料結構中的向上連結、向下連結。
            -   當從 Compiler 逐步堆疊時：
                -   資料結構是由下往上長。即先確認下層物件的正確性、產生下層物件、
                    再檢核上層物件的正確性、最後產生上層物件，
                -   上層物件要關連到下層物件，易。下層物件要關連到上層物件，較煩。
                -   幸虧，此途徑主要用途是 dump 出正確的 StructMD-IRspec；利用向下的連結就夠了。
            -   當由已知正確的 StructMD-IRspec 載入時，因為不用再檢核：
                -   資料結構可以由上往下長。即上層物件的 constructor 半途要產生下層物件時，
                    -   可以把 this 傳入下層物件的 constructor，藉此讓下層物件建立向上的連結；
                    -   下層物件產生後，上層物件即可建立向下的連結。
        -   物件中的變數
            -   必填的欄位：DATA
            -   選填的欄位：DATA 或 null (確認從缺)
            -   向下的連結：Object
            -   向上的連結：Object 或 undefined (從 Compiler 逐步堆疊時可以從缺)
        -   從 Compiler 逐步建構的 constructor 的參數
            -   必填的欄位：從 Compiler 傳入 DATA
            -   選填的欄位：從 Compiler 傳入 DATA 或 null (確認從缺)
        -   從正確 IRspec 載入 json 的欄位 (json 的規則)
            -   必填的欄位：DATA
            -   選填的欄位：DATA 或 undefined (未提供)
 */

/*  # StructMD-IRspec 內部結構 classes 間的 HAS-A 關係
    ## IRspec
        -   <NODES>
        -   <MACROS> (Local Macro)
    ## Global Macro
        -   <MACROS>
    ## NODES
        -   NonLeafNode
            -   <NODES>
        -   NonLeafNode (child: NonLeafMacro)
        -   LeafNode (type: other)
        -   LeafNode (type: CodeType)
            -   <OPTIONS>
        -   LeafNode (type: LeafMacro)
        -   CommentNode
        -   Node 可以有 Condition
    ## MACROS
        -   NonLeafMacro
            -   <NODES>
        -   NonLeafMacro (child: NonLeafMacro) 【沒道理引用巨集，用原有的就好】
        -   LeafMacro (type: other)
        -   LeafMacro (type: CodeType)
            -   <OPTIONS>
        -   LeafMacro (type: LeafMacro) 【沒道理引用巨集，用原有的就好】
    ## OPTIONS
        -   Option
            -   NonLeafAttachment
                -   <NODES>
            -   NonLeafAttachment (child: NonLeafMacro)
            -   LeafAttachment (type: other)
            `   LeafAttachment (type: CodeType)
                -   <OPTIONS>
            -   LeafAttachment (type: LeafMacro)
 */

/*  # 巨集的規劃
        -   全域巨集收集於：MacroMap class 的 static 變數 globals
        -   區域巨集收集於：各 IRspec 配予一個 MacroMap object，其中的 instance 變數 locals
        -   Q:  如何讓 (Non)LeafNode 和 (Non)LeafAttachment 存取到該存取的巨集？
            A:  讓它們多一個參數 ofSpec，
                當建立區域巨集和正規節點時，ofSpec 即為所屬 IRspec，再抓取 locals；
                當建立全域巨集時，ofSpec 為 undefined，則直接從 MacroMap 的 globals 取得全域巨集。
 */

interface Visitee {
    accept(visitor: Visitor, ...data: any[]): any;
}

/** 這是 StructMD-IRspec 內部資料結構。
 * 建立方式：
 *     1) StructMD-IRspec Compiler 逐步堆疊。
 *     2) StructMD-IR Toolkit 載入。
 */
export class IRspec implements Visitee {

    /** 所有的 StructMD-IRspec。
     * 將來應該改成 DB 機制。
     */
    private static all: Map<number, IRspec> = new Map<number, IRspec>();

    /** 根據 specNum 查找 StructMD-IRspec。
     * 將來應該改成 DB 機制。
     * @param specNum 目標 StructMD-IRspec 編號。
     * @returns 查找到的 StructMD-IRspec。
     *          若找不到，回傳 undefined。
     */
    static get(specNum: number): IRspec | undefined {
        return IRspec.all.get(specNum);
    }

    //..10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100

    /** 本 IRspec 的編號。
     */
    specNum: number;

    /** [輸出用] 本 IRspec 的名稱。
     * 若無，則 null。
     */
    display: string | null;

    /** [內部用] 本 IRspec 的巨集們。
     * 雖然本 IRspec 可能沒有定義巨集，還是給一個沒有區域巨集的 MacroMap，
     * 因為藉由此 MacroMap instance 可以 get 全域巨集。
     */
    macros: MacroMap;

    /** 本 IRspec 的子節點們。
     */
    children: Node[];

    /** [內部用] 集中所有子節點名稱，以方便接續 Visitor 使用。
     * 包含系統產生的 attachment 內部名稱。
     * 逐步拼湊結構時，忽略此欄位 (空陣列)。
     */
    childNames: string[];

    // private sourceMacro: NonLeafMacro;  沒道理引用巨集，IRspec 等同原巨集

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param specNum 本 IRspec 的編號。
     * @param display 本 IRspec 名稱。若無，則傳入 null。
     * @param macros 本 IRspec 的巨集們。
     * @param children 本 IRspec 的子節點們。
     */
    constructor(specNum: number,
        display: string | null,
        macros: MacroMap,
        children: Node[]);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param irSpecFile StructIR-Spec 檔案名稱
     */
    constructor(irSpecFile: string);

    constructor(p1: number | string,
        p2?: string | null,
        p3?: MacroMap,
        p4?: Node[]) {
        if (typeof p1 === "number") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.specNum = p1;
            this.display = <string | null>p2;
            this.macros = <MacroMap>p3;
            this.children = <Node[]>p4;

            this.childNames = [];

        } else {
            // 由 StructMD-IR Toolkit 載入
            let irSpecFile = p1;
            let target = <{
                specNum: number,
                display?: string,
                macro?: [],
                child: []
            }>JSON.parse(irSpecFile); // 乃人修改
            // }>JSON.parse(fs.readFileSync(irSpecFile).toString());

            this.specNum = target.specNum;

            this.display = target.display !== undefined
                ? target.display
                : null;

            // 先處理 macro 再處理 child，child 中可能會用到 macro
            this.macros = new MacroMap(this);
            if (target.macro !== undefined) {  // 若 undefined，就讓 macroMap 裡面空著，但還是有殼
                for (let elmt of target.macro) {
                    // lookahead 後分流
                    let macro: Macro = (Object.keys(elmt).includes("child"))
                        ? new NonLeafMacro(elmt, this)
                        : new LeafMacro(elmt, this);
                    // 放入 macroMap.locals
                    this.macros.setLocal(macro.name, macro);
                }
            }

            // 處理 child
            this.children = [];
            this.childNames = [];
            let nameSet: Set<string> = new Set<string>();
            for (let i = 0; i < target.child.length; i++) {
                let elmt: any = target.child[i];

                // lookahead 後分流
                if (Object.keys(elmt).includes("displayC")) {
                    let node: CommentNode = new CommentNode(elmt, i);
                    this.children.push(node);
                    nameSet.add(<string>node.name);

                } else if (Object.keys(elmt).includes("child")) {
                    let node: NonLeafNode = new NonLeafNode(elmt, this, this);
                    this.children.push(node);
                    nameSet.add(node.name);   // 考量 name 可能等於 mName 所以採用 Set
                    nameSet.add(node.mName);

                } else {
                    let node: LeafNode = new LeafNode(elmt, this, this);
                    this.children.push(node);
                    nameSet.add(node.name);
                    nameSet.add(node.mName);

                    if (node.type instanceof CodeType) {
                        // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                        let prefix: string = node.mName + Attachment.sep;
                        for (let n of node.type.getAttachNames(prefix)) {
                            nameSet.add(n);
                        }
                    }
                }
            }
            this.childNames = Array.from(nameSet);

            // 由 StructMD-IR Toolkit 載入，放入 StructMD-IRspec pool
            if (IRspec.all.has(this.specNum)) {
                console.log(`編號 ${this.specNum} 的 StructMD-IRspec 已經存在`);
            }
            IRspec.all.set(this.specNum, this);
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitIRspec(this, ...data);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//..5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
////////////////////////////////////////////////////////////////////////////////////////////////////

/** 巨集的集合以及查詢機制。
 */
export class MacroMap implements Visitee {

    /** 全域巨集的集合。
     * 此集合中，全域巨集的名稱不包含前置星號。
     */
    private static globals: Map<string, Macro>;

    /** 根據全域巨集名稱，查找巨集。
     * @param name 目標全域巨集名稱，不包含前置星號。
     * @returns 查找到的巨集。
     *          若找不到，回傳 undefined。
     */
    static getGlobal(name: string): Macro | undefined {
        // lazy initialization
        if (MacroMap.globals === undefined) {
            MacroMap.globals = new Map<string, Macro>();

            // 假設 globalMacros.json 無誤
            // let macros = <object[]>JSON.parse(
            //     fs.readFileSync("src\\globalMacros.json").toString()
            // );
            // let macros = <object[]>globalMacros; // 乃人修改(改成用import json的方式取得globalMacros )
            let macros = []; // 乃人修改(改成用import json的方式取得globalMacros )

            for (let elmt of macros) {
                // lookahead 後分流
                let macro: Macro = (Object.keys(elmt).includes("child"))
                    ? new NonLeafMacro(elmt, null)  // null 代表正建立全域巨集
                    : new LeafMacro(elmt, null);
                // 放入 MacroMap.globals
                MacroMap.globals.set(macro.name, macro);
            }
        }

        // query
        return MacroMap.globals.get(name);
    }

    //..10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100

    /** [內部用] 本 MacroMap 歸屬的 StructMD-IRspec。
     * 一定歸屬於某個 IRspec，不須像 Node, Macro 等全域巨集的情境考量 null。
     * 與 IRspec.macros 合組成 double-link。
     * 逐步拼湊結構時，忽略此欄位 (undefined)。
     */
    ofSpec?: IRspec;

    /** [內部用] 區域巨集的集合，歸屬於 ofSpec。
     */
    locals: Map<string, Macro>;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     */
    constructor();

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param ofSpec 本 MacroMap 歸屬的 StructMD-IRspec。
     */
    constructor(ofSpec: IRspec);

    constructor(p1?: IRspec) {
        this.locals = new Map<string, Macro>();

        if (p1 === undefined) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;

        } else {
            // 由 StructMD-IR Toolkit 載入
            this.ofSpec = p1;
        }
    }

    /** 放入區域巨集。
     * @param name 巨集名稱。
     * @param macro 巨集物件。
     */
    setLocal(name: string,
        macro: Macro): void {
        this.locals.set(name, macro);
    }

    /** 根據巨集名稱，查找巨集。
     * @param name 目標巨集名稱。
     *             若有前置星號，代表查找全域巨集，否則為區域巨集。
     * @returns 查找到的巨集。
     *          若找不到，回傳 undefined。
     */
    get(name: string): Macro | undefined {
        if (name.startsWith("*")) {
            // 查找全域巨集
            return MacroMap.getGlobal(name.substring(1));

        } else {
            // 查找區域巨集
            return this.locals.get(name);
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitMacroMap(this, ...data);
    }
}

/** 巨集。
 * 巨集有兩種，分別用 NonLeafMacro 和 LeafMacro 實作。
 * 本 Macro 是它們共用的部分。
 */
export abstract class Macro implements Visitee {

    /** [內部用] 區域巨集歸屬的 StructMD-IRspec。
     * 若是全域巨集，則 null。
     * 逐步拼湊結構時，忽略此欄位 (undefined)。
     */
    ofSpec?: IRspec | null;

    /** 本 Macro 名稱。
     */
    name: string;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param name 本 Macro 名稱。
     */
    constructor(name: string);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 載入標的。
     * @param ofSpec 區域巨集歸屬的 StructMD-IRspec。若是全域巨集，則傳入 null。
     */
    constructor(target: object,
        ofSpec: IRspec | null);

    constructor(p1: string | object,
        p2?: IRspec | null) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;
            this.name = p1;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                name: string
            }>p1;
            let ofSpec = <IRspec | null>p2;

            this.ofSpec = ofSpec;
            this.name = target.name;
        }
    }

    abstract accept(visitor: Visitor, ...data: any[]): any;
}

/** 子節點巨集。
 */
export class NonLeafMacro extends Macro {

    /** 本 NonLeafMacro 的內容，即子節點們。
     */
    children: Node[];

    /** [內部用] 集中所有子節點名稱，以方便接續 Visitor 使用。
     * 包含系統產生的 attachment 內部名稱。
     * 逐步拼湊結構時，忽略此欄位 (空陣列)。
     */
    childNames: string[];

    // private sourceMacro: NonLeafMacro;  沒道理巨集立即引用巨集

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param name 本 Macro 名稱。
     * @param children 本 NonLeafMacro 的內容，即子節點們。
     */
    constructor(name: string,
        children: Node[]);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 載入標的。
     * @param ofSpec 區域巨集歸屬的 StructMD-IRspec。若是全域巨集，則傳入 null。
     */
    constructor(target: object,
        ofSpec: IRspec | null);

    constructor(p1: string | object,
        p2: Node[] | IRspec | null) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1);
            this.children = <Node[]>p2;

            this.childNames = [];

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                child: []
            }>p1;
            let ofSpec = <IRspec | null>p2;

            super(p1, ofSpec);

            this.children = [];
            this.childNames = [];
            let nameSet: Set<string> = new Set<string>();
            for (let i = 0; i < target.child.length; i++) {
                let elmt: any = target.child[i];

                // lookahead 後分流
                if (Object.keys(elmt).includes("displayC")) {
                    let node: CommentNode = new CommentNode(elmt, i);
                    this.children.push(node);
                    nameSet.add(<string>node.name);

                } else if (Object.keys(elmt).includes("child")) {
                    let node: NonLeafNode = new NonLeafNode(elmt, this, ofSpec);
                    this.children.push(node);
                    nameSet.add(node.name);
                    nameSet.add(node.mName);

                } else {
                    let node: LeafNode = new LeafNode(elmt, this, ofSpec);
                    this.children.push(node);
                    nameSet.add(node.name);
                    nameSet.add(node.mName);

                    if (node.type instanceof CodeType) {
                        // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                        let prefix: string = node.mName + Attachment.sep;
                        for (let n of node.type.getAttachNames(prefix)) {
                            nameSet.add(n);
                        }
                    }
                }
            }
            this.childNames = Array.from(nameSet);
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitNonLeafMacro(this, ...data);
    }
}

/** 型態巨集。
 */
export class LeafMacro extends Macro {

    /** 本 LeafMacro 內容，即資料型態。
     */
    type: Type;

    // private sourceMacro: LeafMacro;  沒道理巨集立即引用巨集

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param name 本 Macro 名稱。
     * @param type 本 LeafMacro 內容，即資料型態。
     */
    constructor(name: string,
        type: Type);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 載入標的。
     * @param ofSpec 區域巨集歸屬的 StructMD-IRspec。若是全域巨集，則傳入 null。
     */
    constructor(target: object,
        ofSpec: IRspec | null);

    constructor(p1: string | object,
        p2: Type | IRspec | null) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1);
            this.type = <Type>p2;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                type: string
            }>p1;
            let ofSpec = <IRspec | null>p2;

            super(p1, ofSpec);

            // lookahead 後分流
            this.type = (target.type === "decimal") ? DecimalType.create(p1)
                : (target.type === "integer") ? IntegerType.create(p1)
                    : (target.type === "string") ? StringType.create(p1)
                        : (target.type === "markdown") ? MarkdownType.create(p1)
                            : (target.type === "date") ? DateType.create(p1)
                                : (target.type === "dateTime") ? DateTimeType.create(p1)
                                    : (target.type === "time") ? TimeType.create(p1)
                                        : (target.type === "boolean") ? BooleanType.create(p1)
                                            : (target.type === "base64Binary") ? Base64BinaryType.create(p1)
                                                : /* target.type === "code" */       new CodeType(p1, ofSpec)
                ;
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitLeafMacro(this, ...data);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//..5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
////////////////////////////////////////////////////////////////////////////////////////////////////

/** 節點。
 * 分為 CommentNode 以及 Node1。
 * Node1 再分 LeafNode 和 NonLeafNode。
 */
export abstract class Node implements Visitee {

    abstract accept(visitor: Visitor, ...data: any[]): any;
}

/** 註解節點。
 * [輸出用] CommentNode 是一種特殊的 LeafNode，會被裝在某層的 NonLeafOOO 內。
 * 其 name 是「__comment數字」，數字為它在所屬的 NonLeafOOO 中的次序。
 * 單純是為了輸出用。轉成 readable 時：
 *      (1) 先 toReadable 為 json 的「__comment123: "lalala"」
 *      (2) 利用開源的 json-to-yaml 轉為 yaml 的「    __comment123: lalala」
 *      (3) 再由 yaml 中找特殊的由 __comment 帶頭的 mapping
 *          改成 yaml 的註解，即「    # lalala」
 *          保留此特殊 mapping 前面的空白，如此 displayC 就會出現在該在該在的階層內
 */
export class CommentNode extends Node {

    static prefix: string = "__comment";

    /** [輸出用] 系統給本 CommentNode 的內部名稱。
     * 一定是「__comment數字」。
     */
    name?: string;

    /** [輸出用] 擬呈現為 YAML 的註解。
     */
    comment: string;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param comment 擬呈現為 YAML 的註解文字。
     */
    constructor(comment: string);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 只有特殊欄位 displayC 的 Node 物件。
     * @param ranking 本 CommentNode 在親兄弟姊妹間的排行，由 0 開始數。
     *                將用來建立本 CommentNode 內部名稱「__comment數字」。
     */
    constructor(target: object,
        ranking: number);

    constructor(p1: string | object,
        p2?: number) {
        super();

        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.comment = p1;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                displayC: string
            }>p1;

            this.name = `${CommentNode.prefix}${<number>p2}`;
            this.comment = target.displayC;
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitCommentNode(this, ...data);
    }
}

/** 真實的節點。
 * 有兩種，分別用 NonLeafNode 和 LeafNode 實作。
 * 本 Node1 是它們共用的部分。
 */
export abstract class Node1 extends Node implements Visitee {

    /** [內部用] 下列情形設定為歸屬的 StructMD-IRspec：
     *     IRspec 底下的 Node1 (不論哪一層)、
     *     區域巨集底下的 Node1、
     *     IRspec 底下的 NonLeafAttachment 底下的 Node1、
     *     區域巨集底下的 NonLeafAttachment 底下的 Node1。
     * 下列情形設定為 null，即無歸屬的 StructMD-IRspec：
     *     全域巨集底下的 Node1、
     *     全域巨集底下的 NonLeafAttachment 底下的 Node1。
     * 逐步拼湊結構時，忽略此欄位 (undefined)。
     */
    ofSpec?: IRspec | null;

    /** [內部用] 本 Node1 的上層節點。
     * 分別與下列 children 合組成 double-link：
     *     NonLeafNode.children,
     *     IRspec.children,
     *     NonLeafMacro.children,
     *     NonLeafAttachment.children.
     * 逐步拼湊結構時，忽略此欄位 (undefined)。
     */
    parent?: NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment;

    /** 本 Node1 名稱。
     */
    name: string;

    /** 本 Node1 系統內部名稱 (Machine NAME)。
     * 搭配程式語言操作，所以必須是語言的 identifier。
     */
    mName: string;

    /** 在 StructMD-IR 中，本 Node1 存在的前提。
     * 若沒有前提，則 null。
     */
    condition: Condition | null;

    /** 本 Node1 的基數。
     */
    cardinality: Cardinality;

    /** [輸出用] 當 StructMD-IR 提供 0 筆本 Node1 時，呈現的替代文字。
     * cardinality 的下限必須為 0，displayAbsent 才有意義。
     * 若沒有替代文字，則 null。
     */
    displayAbsent: string | null;

    /** [輸入用] 本 Node1 的說明。
     * 可以當成輸入時的輔助，比如 form 的 tooltip。
     */
    description: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param name 本 Node1 名稱。
     * @param mName 本 Node1 系統內部名稱 (Machine NAME)，
     * @param condition 本 Node1 存在的前提。若沒有前提，則傳入 null。
     * @param cardinality 本 Node1 的基數。
     * @param displayAbsent 當 StructMD-IR 提供 0 筆本 Node1 時，呈現的替代文字。
     *                      若沒有替代文字，則傳入 null。
     * @param description 本 Node1 的說明。若沒有說明，則傳入 null。
     */
    constructor(name: string,
        mName: string,
        condition: Condition | null,
        cardinality: Cardinality,
        displayAbsent: string | null,
        description: string | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 載入標的。
     * @param parent 本 Node1 的上層節點。
     * @param ofSpec 本 Node1 歸屬的 StructMD-IRspec。若是宣告全域巨集情境，則傳入 null。
     */
    constructor(target: object,
        parent: NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment,
        ofSpec: IRspec | null);

    constructor(p1: string | object,
        p2: string | NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment,
        p3: Condition | null | IRspec | null,
        p4?: Cardinality,
        p5?: string | null,
        p6?: string | null) {
        super();

        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;
            this.parent = undefined;
            this.name = p1;
            this.mName = <string>p2;
            this.condition = <Condition | null>p3;
            this.cardinality = <Cardinality>p4;
            this.displayAbsent = <string | null>p5;
            this.description = <string | null>p6;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                name: string,
                mName?: string,     // 可以是 undefined
                cond?: object,      // 可以是 undefined
                card?: string,      // 可以是 undefined
                display0?: string,  // 可以是 undefined
                desc?: string       // 可以是 undefined
            }>p1;
            let parent = <NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment>p2;
            let ofSPec = <IRspec | null>p3;

            this.ofSpec = ofSPec;
            this.parent = parent;

            this.name = target.name;

            this.mName = target.mName !== undefined
                ? target.mName
                : target.name;                           // 若 undefined，同 name

            this.cardinality = target.card !== undefined
                ? Cardinality.create(target.card)
                : Cardinality.oneOne;              // 若 undefined，就 1..1

            this.displayAbsent = target.display0 !== undefined
                ? target.display0
                : null;

            this.description = target.desc !== undefined
                ? target.desc
                : null;

            // 底下處理 Condition
            // Condition 的欄位 ofNode 為其依附的 Node1，欄位 subject 為其根據的 LeafNode。
            // 如下例，A 為真時，才該有 B
            //     [ { name: "A", type: boolean },
            //       { name: "B", cond: {subject: "A", operator: "=", value: true} } ]
            // 當本 Node1.constructor() 處理 B 進而處理其 cond 時，
            // B 的 this 即為 Condition 的 ofNode
            // 代表 A 的 LeafNode 即為 Condition 的 subject，可以在 parent.children 中用 "A" 字串查找

            this.condition = null;  // 先預設無前提
            if (target.cond !== undefined) {  // 本 Node1 有前提
                // lookahead subjectName
                let cond = <{
                    subject: string
                }>target.cond;
                let subjectName: string = cond.subject;

                // 不論在 IRspec, NonLeafNode, NonLeafMacro 還是 NonLeafAttachment
                // children 都是用迴圈逐步加入
                // 所以處理到本 Node1 時，parent.children 將會是本 Node1 的親哥哥親姊姊
                for (let elderSibling of parent.children) {
                    if (elderSibling instanceof CommentNode) continue;

                    let e: Node1 = <Node1>elderSibling;
                    if (subjectName === e.name || subjectName === e.mName) {
                        this.condition = new Condition(e, target.cond, this);
                        break;
                    }
                }
            }
        }
    }
}

/** 非終端節點。
 */
export class NonLeafNode extends Node1 {

    /** 本 NonLeafNode 的子節點們。
     * 當借助巨集宣告此 NonLeafNode 的子節點們時，children 將串到 NonLeafMacro 的內容。
     * 當不是時，則串到專屬的 Node[]。
     */
    children: Node[];

    /** [內部用] 集中所有子節點名稱，以方便接續 Visitor 使用。
     * 包含系統產生的 attachment 內部名稱。
     * 逐步拼湊結構時，忽略此欄位 (空陣列)。
     */
    childNames: string[];

    /** [內部用] 當借助巨集宣告此 NonLeafNode 的子節點們時，多保留來源巨集名稱。
     * 雖然 children 已經串到 NonLeafMacro 的內容，後續運算不必用到此 NonLeafMacro，
     * 但是考量輸出 IRspec 時欲保留 macro 的名稱，所以多存此 sourceMacro。
     * 當非借助巨集宣告此 NonLeafNode 的子節點們時，則 null。
     */
    sourceMacro: NonLeafMacro | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param name 本 NonLeafNode 名稱。
     * @param mName 本 NonLeafNode 系統內部名稱 (Machine NAME)。
     * @param condition 本 NonLeafNode 存在的前提。若沒有前提，則傳入 null。
     * @param cardinality 本 NonLeafNode 的基數。
     * @param displayAbsent 當 StructMD-IR 提供 0 筆本 NonLeafNode 時，呈現的替代文字。
     *                      若沒有替代文字，則傳入 null。
     * @param description 本 NonLeafNode 的說明。若沒有說明，則傳入 null。
     * @param children 本 NonLeafNode 的子節點們。
     * @param sourceMacro 借助宣告此 NonLeafNode 的巨集。若非，則傳入 null。
     */
    constructor(name: string,
        mName: string,
        condition: Condition | null,
        cardinality: Cardinality,
        displayAbsent: string | null,
        description: string | null,
        children: Node[],
        sourceMacro: NonLeafMacro | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 載入標的。
     * @param parent 本 NonLeafNode 的上層節點。
     * @param ofSpec 本 NonLeafNode 歸屬的 StructMD-IRspec。若是宣告全域巨集情境，則傳入 null。
     */
    constructor(target: object,
        parent: NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment,
        ofSpec: IRspec | null);

    constructor(p1: string | object,
        p2: string | NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment,
        p3: Condition | null | IRspec | null,
        p4?: Cardinality | IRspec | null,
        p5?: string | null,
        p6?: string | null,
        p7?: Node[],
        p8?: NonLeafMacro | null) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1,
                <string>p2,
                <Condition | null>p3,
                <Cardinality>p4,
                <string | null>p5,
                <string | null>p6);
            this.children = <Node[]>p7;
            this.sourceMacro = <NonLeafMacro | null>p8;

            this.childNames = [];

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                child: []      // 直接宣告子節點們
                | string  // 借助巨集宣告子節點們
            }>p1;
            let parent = <NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment>p2;
            let ofSpec = <IRspec | null>p3;

            super(p1, parent, ofSpec);

            if (Array.isArray(target.child)) {
                // 直接宣告子節點們
                this.sourceMacro = null;

                this.children = [];
                this.childNames = [];
                let nameSet: Set<string> = new Set<string>();
                for (let i = 0; i < target.child.length; i++) {
                    let elmt: any = target.child[i];

                    // lookahead 後分流
                    if (Object.keys(elmt).includes("displayC")) {
                        let node: CommentNode = new CommentNode(elmt, i);
                        this.children.push(node);
                        nameSet.add(<string>node.name);

                    } else if (Object.keys(elmt).includes("child")) {
                        let node: NonLeafNode = new NonLeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);

                    } else {
                        let node: LeafNode = new LeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);

                        if (node.type instanceof CodeType) {
                            // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                            let prefix: string = node.mName + Attachment.sep;
                            for (let n of node.type.getAttachNames(prefix)) {
                                nameSet.add(n);
                            }
                        }
                    }
                }
                this.childNames = Array.from(nameSet);

            } else {
                // 借助巨集宣告子節點們
                this.sourceMacro = ofSpec === null
                    ? <NonLeafMacro>MacroMap.getGlobal(target.child)  // 借助全域巨集
                    : <NonLeafMacro>ofSpec.macros.get(target.child);  // 借助區域巨集

                this.children = this.sourceMacro.children;
                this.childNames = this.sourceMacro.childNames;
            }
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitNonLeafNode(this, ...data);
    }
}

/** 終端節點。
 */
export class LeafNode extends Node1 {

    /** 本 LeafNode 的資料型態。
     * 當借助巨集宣告此 LeafNode 的資料型態時，type 將串到 LeafMacro 的內容。
     * 當不是時，則串到專屬的 Type。
     */
    type: Type;

    /** [輸入用] 
     * 搭配 form.io 收集數據時，非 1..1 NonLeafNode 會採用 EditGrid。
     * 單筆 EditGrid 輸入結束，form.io 允許把該 EditGrid 收攏為 table 的一行，只標出「重點」。
     * 可以利用此 isKey 來指定哪些是重點。 
     */
    isKey: boolean;

    /** [內部用] 當借助巨集宣告此 LeafNode 的資料型態時，多保留來源巨集名稱。
     * 雖然 type 已經串到 LeafMacro 的內容，後續運算不必用到此 LeafMacro，
     * 但是考量輸出 IRspec 時欲保留 macro 的名稱，所以多存此 sourceMacro。
     * 當非借助巨集宣告此 LeafNode 的資料型態時，則 null。
     */
    sourceMacro: LeafMacro | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param name 本 LeafNode 名稱。
     * @param mName 本 LeafNode 系統內部名稱 (Machine NAME)。
     * @param condition 本 LeafNode 存在的前提。若沒有前提，則傳入 null。
     * @param cardinality 本 LeafNode 的基數。
     * @param displayAbsent 當 StructMD-IR 提供 0 筆本 LeafNode 時，呈現的替代文字。
     *                      若沒有替代文字，則傳入 null。
     * @param description 本 LeafNode 的說明。若沒有說明，則傳入 null。
     * @param type 本 LeafNode 的資料型態。
     * @param isKey 本 LeafNode 出現在非 1..1 的 NonLeafNode 時，
     *              用來指示本 LeafNode 是否為「重點」。
     *              假如把所有(多筆) NonLeafNode 視為一個 table，
     *              各個 NonLeafNode 視為 table 內的 record，
     *              NonLeafNode 內的 LeafNode 視為 record 的 field，
     *              則此 isKey 相當於標註哪些欄位是 table 的 key。
     *              (StructMD-IRspec 事實上並不做這 key 重不重複的檢核。)
     * @param sourceMacro 借助宣告此 LeafNode 的巨集。若非，則傳入 null。
     */
    constructor(name: string,
        mName: string,
        condition: Condition | null,
        cardinality: Cardinality,
        displayAbsent: string | null,
        description: string | null,
        type: Type,
        isKey: boolean,
        sourceMacro: LeafMacro | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 載入標的。
     * @param parent 本 LeafNode 的上層節點。
     * @param ofSpec 本 LeafNode 歸屬的 StructMD-IRspec。若是宣告全域巨集情境，則傳入 null。
     */
    constructor(target: object,
        parent: NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment,
        ofSpec: IRspec | null);

    constructor(p1: string | object,
        p2: string | NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment,
        p3: Condition | null | IRspec | null,
        p4?: Cardinality | IRspec | null,
        p5?: string | null,
        p6?: string | null,
        p7?: Type,
        p8?: boolean,
        p9?: LeafMacro | null) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1,
                <string>p2,
                <Condition | null>p3,
                <Cardinality>p4,
                <string | null>p5,
                <string | null>p6);
            this.type = <Type>p7;
            this.isKey = <boolean>p8;
            this.sourceMacro = <LeafMacro | null>p9;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                type: string,
                isKey: boolean | undefined
            }>p1;
            let parent = <NonLeafNode | IRspec | NonLeafMacro | NonLeafAttachment>p2;
            let ofSpec = <IRspec | null>p3;

            super(p1, parent, ofSpec);

            this.isKey = (target.isKey === undefined) ? false : target.isKey;

            let type: Type | undefined;
            type = (target.type === "decimal") ? DecimalType.create(target)
                : (target.type === "integer") ? IntegerType.create(target)
                    : (target.type === "string") ? StringType.create(target)
                        : (target.type === "markdown") ? MarkdownType.create(target)
                            : (target.type === "date") ? DateType.create(target)
                                : (target.type === "dateTime") ? DateTimeType.create(target)
                                    : (target.type === "time") ? TimeType.create(target)
                                        : (target.type === "boolean") ? BooleanType.create(target)
                                            : (target.type === "base64Binary") ? Base64BinaryType.create(target)
                                                : (target.type === "code") ? new CodeType(target, ofSpec)
                                                    : /* 上述 10 個之外，即 macro */      undefined  // 暫時註記
                ;

            if (type !== undefined) {
                // 直接宣告資料型態
                this.sourceMacro = null;
                this.type = type;

            } else {
                // 借助巨集宣告資料型態
                this.sourceMacro = ofSpec === null
                    ? <LeafMacro>MacroMap.getGlobal(target.type)  // 借助全域巨集
                    : <LeafMacro>ofSpec.macros.get(target.type);  // 借助區域巨集

                this.type = this.sourceMacro.type;
            }
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitLeafNode(this, ...data);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//..5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
////////////////////////////////////////////////////////////////////////////////////////////////////

/** 依附於 Node1 的 Condition。
 * 在 StructMD-IR 中，該 Node1 存在的前提。
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *  # StructMD-IR 中 Node1 的個數
 *  ## 大原則
 *      StructMD-IR 的 Node1 (含 NonLeafNode 與 LeafNode) 出現的個數
 *      由 StructMD-IRspec 的 Condition 與 Cardinality 規範。
 *      必須先符合 Condition 才有價值出現，再由 Cardinality 決定個數。
 *  ## 舉例
 *      -   StructMD-IRspec
 *                      "child": [
 *                  ┌       {
 *          spec    │           "name": "嗜好",
 *          Subject │           "card": "0..*",
 *                  │           "type": "code",
 *                  │           "option": ["琴", "棋", "書", "畫"]
 *                  └       },
 *                  ┌       {
 *          spec    │          "name": "哪種琴",
 *          Target  │           "cond": {
 *                  │               "subject": "嗜好",
 *                  │               "operator": "has",
 *                  │               "value": "琴"
 *                  │           },
 *                  │           "card": "1..*",
 *                  │           "type": "string"
 *                  └       }
 *                      ]
 *      -   StructMD-IR
 *                      {
 *          irSubject       "嗜好": ["琴", "棋"],
 *          irTarget        "哪種琴": ["二胡", "琵琶"]
 *                      }
 *  ## 討論
 *      -   若無 specTarget.cond
 *          則 irTarget 無條件可以存在
 *      -   若有 specTarget.cond 且比較標的是 irSubject 的個數，如 cond.operator 為 exist
 *          則 irTarget 可以存在的條件為
 *              (1) specTarget.cond.value 為 true   (spec 說，回答上面那題必須多答此題)
 *                  而且
 *                  irSubject 的確存在
 *              或
 *              (2) specTarget.cond.value 為 false  (spec 說，沒有回答上面那題必須追答此題)
 *                  而且
 *                  irSubject 的確不存在
 *      -   若有 specTarget.cond 且比較標的是 irSubject 的數值，如 cond.operator 非 exist
 *          則 irTarget 可以存在的條件為
 *              (1) irSubject 必須存在 (要先回答嗜好，才有回不回答哪種琴的議題)
 *              而且
 *        　    (2) irSubject 的型態必須滿足 specSubject.type
 *              而且
 *        　    (3) irSubject 的數值必須滿足 specTarget.cond
 *      -   至於 irTarget 多少筆則由 specTarget.card 規範
 *  ## specSubject.card 的討論
 *      -   specTarget.cond.operator 為 exist 時，irSubject 必須有不存在的可能性
 *          所以 specSubject.card.lower 必須為 0
 *      -   specTarget.cond.operator 為數值比較類時 (ge, lt, btw)，
 *          因為要把 irSubject 的純量 (非向量) 帶入 specTarget.cond，
 *          所以 specSubject.card.upper 必須為 1。
 *          不見得必須 1..1 也可以是 0..1，即允許 irSubject 不回答，連帶不用回答 irTarget
 *      -   specTarget.cond.operator 為集合運算類時 (has, anyIn, allNotIn)，
 *          specSubject.card 可以不受限，即 upper = 1 為 radio button，upper > 1 為 check box。
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *  # 有支援的 Condition 列表
 *      ┌───────────────────────────────────┬────────────────┬─────────────────────┐
 *      │ SUBJECT                           │ OPERATOR       │ VALUE               │
 *      ├──────┬──────────────┬─────────────┤                │                     │
 *      │ NODE │ DATA TYPE    │ CARDINALITY │                │ DATA TYPE           │
 *      ├──────┼──────────────┼─────────────┼────────────────┼─────────────────────┤
 *      │ Leaf │ decimal      │ ?..1        │ ge lt          │ number              │
 *      │ Node │              │ ?..1        │ btw            │ [number, number]    │
 *      │      │              │ 0..?        │ exist          │ boolean             │
 *      │      ├──────────────┼─────────────┼────────────────┼─────────────────────┤
 *      │      │ integer      │ ?..1        │ ge lt          │ number (integer)    │
 *      │      │              │ ?..1        │ btw            │ [number, number]    │
 *      │      │              │ 0..?        │ exist          │ boolean             │
 *      │      ├──────────────┼─────────────┼────────────────┼─────────────────────┤
 *      │      │ date         │ ?..1        │ ge lt          │ string (YYYY-MM-DD) │
 *      │      │ dateTime     │ ?..1        │ btw            │ [string, string]    │
 *      │      │              │ 0..?        │ exist          │ boolean             │
 *      │      ├──────────────┼─────────────┼────────────────┼─────────────────────┤
 *      │      │ boolean      │ ?..1        │ eq             │ boolean | string    │
 *      │      │              │ 0..?        │ exist          │ boolean             │
 *      │      ├──────────────┼─────────────┼────────────────┼─────────────────────┤
 *      │      │ code         │ ?..?        │ has            │ string              │
 *      │      │              │ ?..?        │ anyIn allNotIn │ string[]            │
 *      │      │              │ 0..?        │ exist          │ boolean             │
 *      │      ├──────────────┼─────────────┼────────────────┼─────────────────────┤
 *      │      │ string       │ 0..?        │ exist          │ boolean             │
 *      │      │ time         │             │                │                     │
 *      │      │ markdown     │             │                │                     │
 *      │      │ base64Binary │             │                │                     │
 *      ├──────┴──────────────┤             │                │                     │
 *      │ NonLeafNode         │             │                │                     │
 *      └─────────────────────┴─────────────┴────────────────┴─────────────────────┘
 *      btw (BeTWeen) 包含下限，不包含上限
 *      boolean+eq 的 value 可以寫 displayT 或是 displayF，但由 compiler 負責轉成 boolean
 *      dateTime 先採計到 date 再比較
 */
export class Condition implements Visitee {

    /** [內部用] 本 Condition 依附的 Node1。
     * 與 Node1.condition 合組成 double-link。
     * 逐步拼湊結構時，忽略此欄位 (undefined)。
     */
    ofNode?: Node1;

    /** 本 Condition 根據的 Node1。
     * 應該是與依附的 Node1 同一層而且先出現的 Node1，即親哥哥或親姊姊。
     */
    subject: Node1;

    /** 本 Condition 的運算子。
     */
    operator: string;

    /** 本 Condition 比較的數值。
     */
    value: number | [number, number] |
        Moment | [Moment, Moment] |
        boolean |
        Option | Option[];

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param subject 本 Condition 根據的 Node1。
     * @param operator 本 Condition 的運算子。
     * @param value 本 Condition 比較的數值。
     */
    constructor(subject: Node1,
        operator: string,
        value: number | [number, number]
            | Moment | [Moment, Moment]
            | boolean
            | Option | Option[]);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param subject 本 Condition 根據的 Node1。
     * @param target 載入標的。
     * @param ofNode 本 Condition 依附的 Node1。
     */
    constructor(subject: Node1,
        target: object,
        ofNode: Node1);

    constructor(p1: Node1,
        p2: string | object,
        p3: number | [number, number] | Moment | [Moment, Moment]
            | boolean | Option | Option[] | Node1) {
        if (typeof p2 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofNode = undefined;
            this.subject = p1;
            this.operator = p2;
            this.value = <number | [number, number] | Moment
                | [Moment, Moment] | boolean | Option | Option[]>p3;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let subject = p1;
            let target = <{
                // subject: string,  已在 Node1() 看過此字串，轉成 LeafNode p1 了
                operator: string;
                value: number | [number, number]
                | string | [string, string]
                | boolean
                | string | string[];
            }>p2;
            let ofNode = <Node1>p3;

            this.ofNode = ofNode;
            this.subject = subject;
            this.operator = target.operator;

            if (this.operator === "exist") {
                this.value = <boolean>target.value;

            } else if (subject instanceof LeafNode && subject.type instanceof CodeType) {
                if (typeof target.value === "string") {
                    // this.value = <Option>this.getOption(subject.type.options, target.value);
                    this.value = <Option>subject.type.getOption(target.value);

                } else {
                    this.value = [];
                    for (let elmt of <string[]>target.value) {
                        // this.value.push(<Option>this.getOption(subject.type.options, elmt));
                        this.value.push(<Option>subject.type.getOption(elmt));
                    }
                }

            } else if (subject instanceof LeafNode && subject.type instanceof DateBoundType) {
                if (typeof target.value === "string") {
                    this.value = moment(target.value);

                } else {
                    let dates = <[string, string]>target.value;
                    this.value = [moment(dates[0]), moment(dates[1])];
                }

            } else /* DecimalType, IntegerType 或 BooleanType */ {
                this.value = <number | [number, number] | boolean>target.value;
            }
        }
    }

    // private getOption(options: Option[],
    //                   target: string): Option | undefined
    // {
    //     for (let option of options) {
    //         if (target === option.code || target === option.display) {
    //             return option;
    //         }
    //     }

    //     return undefined;
    // }

    toString(): string {
        let subject: string = `標的(${this.subject.name})`;

        let result: string = "";

        switch (this.operator) {
            case "exist":
                return (this.value === true) ? `${subject}存在`
                    : (this.value === false) ? `${subject}不存在`
                        : "理當不會出現此訊息 1"
                    ;

            case "ge":
                result += (typeof this.value === "number") ? this.value
                    : (isMoment(this.value)) ? this.value.format("YYYY-MM-DD")
                        : "理當不會出現此訊息 2"
                    ;
                result += ` <= ${subject}`;
                return result;

            case "lt":
                result += `${subject} < `;
                result += (typeof this.value === "number") ? this.value
                    : (isMoment(this.value)) ? this.value.format("YYYY-MM-DD")
                        : "理當不會出現此訊息 3"
                    ;
                return result;

            case "btw":
                if (!Array.isArray(this.value)) {
                    return "理當不會出現此訊息 4";
                }

                result += (typeof this.value[0] === "number") ? this.value[0]
                    : (isMoment(this.value[0])) ? this.value[0].format("YYYY-MM-DD")
                        : "理當不會出現此訊息 5"
                    ;
                result += ` <= ${subject} < `;
                result += (typeof this.value[1] === "number") ? this.value[1]
                    : (isMoment(this.value[1])) ? this.value[1].format("YYYY-MM-DD")
                        : "理當不會出現此訊息 6"
                    ;
                return result;

            case "eq":
                return (this.value === true) ? `${subject}為真`
                    : (this.value === false) ? `${subject}為偽`
                        : "理當不會出現此訊息 7"
                    ;

            case "has":
                return (this.value instanceof Option) ? `${subject}有${JSON.stringify(this.value.code)}`
                    : "理當不會出現此訊息 8"
                    ;

            case "anyIn":
            case "allNotIn":
                if (Array.isArray(this.value) && this.value[0] instanceof Option) {
                    for (let elmt of this.value) {
                        result += `,"${(<Option>elmt).code}"`;
                    }
                    return (this.operator === "anyIn")
                        ? `${subject}有任一[${result.substring(1)}]`
                        : `${subject}全無[${result.substring(1)}]`;

                } else {
                    return "理當不會出現此訊息 9";
                }

            default:
                return "理當不會出現此訊息 10";
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitCondition(this, ...data);
    }
}

/** 基數。
 * 因為最常出現的基數不外乎 0..1, 1..1, 0..*, 1..* 等少數幾種，
 * 本 Cardinality 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class Cardinality implements Visitee {

    /** 最常見的 Cardinalities。
     */
    static zeroOne = new Cardinality(0, 1);
    static oneOne = new Cardinality(1, 1);
    static zeroMany = new Cardinality(0, Number.MAX_SAFE_INTEGER);
    static oneMany = new Cardinality(1, Number.MAX_SAFE_INTEGER);

    //..10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100

    /** 本 Cardinality 的下限 (含)。
     */
    lower: number;

    /** 本 Cardinality 的上限 (含)。
     * FHIR 的 Cardinality 包含上限，遵循之。
     * 若是無上限，填入 Number.MAX_SAFE_INTEGER。
     */
    upper: number;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param lower 本 Cardinality 的下限 (含)。
     * @param upper 本 Cardinality 的上限 (含)。
     */
    static create(lower: number,
        upper: number): Cardinality;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 載入標的。
     *               undefined 視為 1..1。
     */
    static create(target?: string): Cardinality;

    static create(p1?: number | string,
        p2?: number): Cardinality {
        if (typeof p1 === "number") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            let upper = <number>p2;

            if (p1 === 0 && upper === 1)
                return Cardinality.zeroOne;
            if (p1 === 1 && upper === 1)
                return Cardinality.oneOne;
            if (p1 === 0 && upper === Number.MAX_SAFE_INTEGER)
                return Cardinality.zeroMany;
            if (p1 === 1 && upper === Number.MAX_SAFE_INTEGER)
                return Cardinality.oneMany;

            return new Cardinality(p1, upper);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <string | undefined>p1;

            if (target === undefined) {
                return Cardinality.oneOne;

            } else {
                switch (target) {
                    case "0..1":
                        return Cardinality.zeroOne;
                    case "1..1":
                        return Cardinality.oneOne;
                    case "0..*":
                        return Cardinality.zeroMany;
                    case "1..*":
                        return Cardinality.oneMany;
                    default:
                        let dotdot: number = target.indexOf("..");
                        let uString: string = target.substring(dotdot + 2);
                        let lower: number = parseInt(target.substring(0, dotdot));
                        let upper: number = (uString === "*")
                            ? Number.MAX_SAFE_INTEGER
                            : parseInt(uString);
                        return new Cardinality(lower, upper);
                }
            }
        }
    }

    /** 已排除四種最常見的 Cardinality。
     * @param lower 本 Cardinality 的下限 (含)。
     * @param upper 本 Cardinality 的上限 (含)。
     */
    private constructor(lower: number,
        upper: number) {
        this.lower = lower;
        this.upper = upper;
    }

    toString(): string {
        return this.upper === Number.MAX_SAFE_INTEGER
            ? `${this.lower}..*`
            : `${this.lower}..${this.upper}`;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitCardinality(this, ...data);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//..5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
////////////////////////////////////////////////////////////////////////////////////////////////////

/** 資料型態。
 * 不計 defaultValue，
 * 可以有數值 lower 或 upper 參數的 decimal, integer, string, markdown，
 *     實作 NumberBoundType (延伸自 Type)；
 * 可以有日期 lower 或 upper 參數的 date, dateTime，實作 DateBoundType (延伸自 Type)；
 * 沒有額外參數的 time, base64Binary，直接實作 Type；
 * 可以有 displayT 和 displayF 參數的 boolean，直接實作 Type；
 * 一定要有 option 參數和 attach 選擇性參數的 code，直接實作 Type。
 */
export abstract class Type implements Visitee {

    /** [內部用] 目的只是為了印出訊息時可以方便知道是哪種型態，
     * 雖然從各個 subclass name 就足以判斷是哪種型態。
     */
    name: string;

    /**
     * @param name 目的只是為了印出訊息時可以方便知道是哪種型態，
     *             雖然從各個 subclass name 就足以判斷是哪種型態。
     */
    constructor(name: string) {
        this.name = name;
    }

    abstract accept(visitor: Visitor, ...data: any[]): any;
}

/** 有數值 lower 或 upper 參數的資料型態。
 * 包含 decimal, integer, string, markdown。
 */
export abstract class NumberBoundType extends Type {

    /** 本 NumberBoundType 的下限 (含)。
     * null 代表沒有規範。
     */
    lower: number | null;

    /** 本 NumberBoundType 的上限 (不含)。
     * null 代表沒有規範。
     */
    upper: number | null;

    /**
     * @param lower 本 NumberBoundType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 NumberBoundType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param name 目的只是為了印出訊息時可以方便知道是哪種型態，
     *             雖然從各個 subclass name 就足以判斷是哪種型態。
     */
    constructor(lower: number | null,
        upper: number | null,
        name: string) {
        super(name);
        this.lower = lower;
        this.upper = upper;
    }

    /**
     * 當由 StructMD-IR Toolkit 載入 IRspec 時，
     * 假如沒有 lower/upper/default，將讀到 undefined
     * 但是在 AST 中必須明白表示成 null
     * deUndefined() 可以把 undefined 轉成 null
     */
    static deUndefined(target0: object): [number | null,
        number | null,
        number | string | null] {
        let target = <{
            lower?: number,
            upper?: number,
            default?: number | string
        }>target0;

        let lower: number | null = target.lower !== undefined
            ? target.lower
            : null;
        let upper: number | null = target.upper !== undefined
            ? target.upper
            : null;
        let defaultValue: number | string | null = target.default !== undefined
            ? target.default
            : null;
        return [lower, upper, defaultValue];
    }
}

/** decimal 型態。
 * 可以有 number 的 lower 或 upper，代表此 decimal 的下限(含) 和上限(不含)。
 * 如 lower=1.2, upper=3.4 則合規的 x 為 1.2 <= x < 3.4。
 * 因為最常出現的是沒有參數的，本 DecimalType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class DecimalType extends NumberBoundType {

    /** 無參數的 decimal。
     */
    static noArg: DecimalType = new DecimalType(null, null, null);

    /** [輸入用] 預設值，方便使用者快速輸入。
     * null 代表沒有指定預設值。
     */
    defaultValue: number | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param lower 本 DecimalType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 DecimalType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 DecimalType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    static create(lower: number | null,
        upper: number | null,
        defaultValue: number | null): DecimalType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 decimal 的整個 LeafNode 物件。
     */
    static create(target: object): DecimalType;

    static create(p1: number | null | object,
        p2?: number | null,
        p3?: number | null): DecimalType {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const lower = p1 as number || null;
            const upper = p2 ?? null;
            const defaultValue = p3 ?? null;
            return (lower === null && upper === null && defaultValue === null)
                ? DecimalType.noArg
                : new DecimalType(lower, upper, defaultValue);
            // return (p1 === null && p2 === null && p3 === null)
            //      ? DecimalType.noArg
            //      : new DecimalType(p1, <number | null>p2, <number | null>p3);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue]: [number | null, number | null, number | string | null]
                = NumberBoundType.deUndefined(p1);

            return (lower === null && upper === null && defaultValue === null)
                ? DecimalType.noArg
                : new DecimalType(lower, upper, <number | null>defaultValue);
        }
    }

    /**
     * @param lower 本 DecimalType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 DecimalType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 DecimalType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    private constructor(lower: number | null,
        upper: number | null,
        defaultValue: number | null) {
        super(lower, upper, "decimal");

        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitDecimalType(this, ...data);
    }
}

/** integer 型態。
 * 可以有整數的 lower 或 upper，代表此 integer 的下限(含) 和上限(不含)。
 * 如 lower=-1, upper=3 則合規的為 -1, 0, 1, 2。
 * 因為最常出現的是沒有參數的，本 IntegerType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class IntegerType extends NumberBoundType {

    /** 無參數的 integer。
     */
    static noArg: IntegerType = new IntegerType(null, null, null);

    /** [輸入用] 預設值，方便使用者快速輸入。
     * 限定是整數。
     * null 代表沒有指定預設值。
     */
    defaultValue: number | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param lower 本 IntegerType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 IntegerType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 IntegerType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    static create(lower: number | null,
        upper: number | null,
        defaultValue: number | null): IntegerType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 integer 的整個 LeafNode 物件。
     */
    static create(target: object): IntegerType;

    static create(p1: number | null | object,
        p2?: number | null,
        p3?: number | null): IntegerType {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊

            const lower = p1 as number || null;
            const upper = p2 ?? null;
            const defaultValue = p3 ?? null;
            return (lower === null && upper === null && defaultValue === null)
                ? IntegerType.noArg
                : new IntegerType(lower, upper, defaultValue);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue]: [number | null, number | null, number | string | null]
                = NumberBoundType.deUndefined(p1);

            return (lower === null && upper === null && defaultValue === null)
                ? IntegerType.noArg
                : new IntegerType(lower, upper, <number | null>defaultValue);
        }
    }

    /**
     * @param lower 本 IntegerType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 IntegerType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 IntegerType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    private constructor(lower: number | null,
        upper: number | null,
        defaultValue: number | null) {
        super(lower, upper, "integer");

        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitIntegerType(this, ...data);
    }
}

/** string 型態。
 * 可以有非負整數的 lower 或 upper，代表此 string 長度的下限(含) 和上限(不含)。
 * 如 lower=0, upper=3 則合規的長度為 0, 1, 2。
 * 因為最常出現的是沒有參數的，本 StringType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class StringType extends NumberBoundType {

    /** 無參數的 string。
     */
    static noArg: StringType = new StringType(null, null, null);

    /** [輸入用] 預設值，方便使用者快速輸入。
     * null 代表沒有指定預設值。
     */
    defaultValue: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param lower 本 StringType 長度的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 StringType 長度的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 StringType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    static create(lower: number | null,
        upper: number | null,
        defaultValue: string | null): StringType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 string 的整個 LeafNode 物件。
     */
    static create(target: object): StringType;

    static create(p1: number | null | object,
        p2?: number | null,
        p3?: string | null): StringType {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊

            const lower = p1 as number || null;
            const upper = p2 ?? null;
            const defaultValue = p3 ?? null;
            return (lower === null && upper === null && defaultValue === null)
                ? StringType.noArg
                : new StringType(lower, upper, defaultValue);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue]: [number | null, number | null, number | string | null]
                = NumberBoundType.deUndefined(p1);

            return (lower === null && upper === null && defaultValue === null)
                ? StringType.noArg
                : new StringType(lower, upper, <string | null>defaultValue);
        }
    }

    /**
     * @param lower 本 StringType 長度的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 StringType 長度的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 StringType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    private constructor(lower: number | null,
        upper: number | null,
        defaultValue: string | null) {
        super(lower, upper, "string");

        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitStringType(this, ...data);
    }
}

/** markdown 型態。
 * 可以有非負整數的 lower 或 upper，代表此 markdown 長度的下限(含) 和上限(不含)。
 * 如 lower=10, upper=13 則合規的長度為 10, 11, 12。
 * 因為最常出現的是沒有參數的，本 MarkdownType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class MarkdownType extends NumberBoundType {

    /** 無參數的 markdown。
     */
    static noArg: MarkdownType = new MarkdownType(null, null, null);

    /** [輸入用] 預設值，方便使用者快速輸入。
     * null 代表沒有指定預設值。
     */
    defaultValue: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param lower 本 MarkdownType 長度的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 MarkdownType 長度的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 MarkdownType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    static create(lower: number | null,
        upper: number | null,
        defaultValue: string | null): MarkdownType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 markdown 的整個 LeafNode 物件。
     */
    static create(target: object): MarkdownType;

    static create(p1: number | null | object,
        p2?: number | null,
        p3?: string | null): MarkdownType {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊

            const lower = p1 as number || null;
            const upper = p2 ?? null;
            const defaultValue = p3 ?? null;
            return (lower === null && upper === null && defaultValue === null)
                ? MarkdownType.noArg
                : new MarkdownType(lower, upper, defaultValue);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue]: [number | null, number | null, number | string | null]
                = NumberBoundType.deUndefined(p1);

            return (lower === null && upper === null && defaultValue === null)
                ? MarkdownType.noArg
                : new MarkdownType(lower, upper, <string | null>defaultValue);
        }
    }

    /**
     * @param lower 本 MarkdownType 長度的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 MarkdownType 長度的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 MarkdownType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    private constructor(lower: number | null,
        upper: number | null,
        defaultValue: string | null) {
        super(lower, upper, "markdown");

        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitMarkdownType(this, ...data);
    }
}

/** 有日期 lower 或 upper 參數的資料型態。
 * 包含 date, dateTime。
 */
export abstract class DateBoundType extends Type {

    /** 本 DateBoundType 的下限 (含)。
     * 規格必須寫全年月日，Moment 存成零時零分零秒。
     * null 代表沒有規範。
     */
    lower: Moment | null;

    /** 本 DateBoundType 的上限 (不含)。
     * 規格必須寫全年月日，Moment 存成零時零分零秒。
     * null 代表沒有規範。
     */
    upper: Moment | null;

    /**
     * @param lower 本 DateBoundType 的下限 (含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param upper 本 DateBoundType 的上限 (不含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param name 目的只是為了印出訊息時可以方便知道是哪種型態，
     *             雖然從各個 subclass name 就足以判斷是哪種型態。
     */
    constructor(lower: Moment | null,
        upper: Moment | null,
        name: string) {
        super(name);
        this.lower = lower;
        this.upper = upper;
    }

    static deUndefined(target0: object): [
        DatePrecision,                                                  // v2.2 新增
        Moment | null,
        Moment | null,
        string | null] {
        let target = <{
            mustHave?: DatePrecision,                                   // v2.2 新增
            lower?: string,
            upper?: string,
            default?: string
        }>target0;

        let mustHave: DatePrecision = target.mustHave === undefined     // v2.2 新增
            ? DatePrecision.Y                   // v2.2 新增
            : target.mustHave;                  // v2.2 新增
        let lower: Moment | null = target.lower === undefined
            ? null
            : moment(target.lower);
        let upper: Moment | null = target.upper === undefined
            ? null
            : moment(target.upper);
        let defaultValue: string | null = target.default === undefined
            ? null
            : target.default;
        return [mustHave, lower, upper, defaultValue];                  // v2.2 異動
    }
}

/** DateType 和 DateTimeTime 的最低精確度。
 * @see VisitorFormIO.visitDateTimeType
 */
export enum DatePrecision {                                             // v2.2 新增
    "Y",
    "YM",
    "YMD",
    "YMDT"
}

/** date 型態。
 * 可以有日期的 lower 或 upper，代表此 date 的下限(含) 和上限(不含)。
 * 如 lower="2024-01-01", upper="2024-02-01" 則合規的為 2024-01-01 到 2024-01-31。
 * 因為最常出現的是沒有參數的，本 DateType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class DateType extends DateBoundType {

    /** 無參數的 dateTime，註明 mustHave = Y。
     */
    static noArgY: DateType = new DateType(DatePrecision.Y, null, null, null);

    /** 無參數的 dateTime，註明 mustHave = YM。
     */
    static noArgYM: DateType = new DateType(DatePrecision.YM, null, null, null);

    /** 無參數的 dateTime，註明 mustHave = YMD。
     */
    static noArgYMD: DateType = new DateType(DatePrecision.YMD, null, null, null);

    // 以上三個為 v2.2 新增；底下一個保留 v2.1 的，即視為 mustHave = Y (雖然好像不必)

    /** 無參數的 date。
     */
    static noArg: DateType = DateType.noArgY;

    /** 本 DateType 的最低精確度。
     *      | IRspec    |          IR                 |
     *      |-----------|----------|------------------|
     *      | mustHave  | date     | datetime         |
     *      |-----------|----------|------------------|
     *      | "Y"       | YMD YM Y | YMDhmsZ YMD YM Y |
     *      | "YM"      | YMD YM   | YMDhmsZ YMD YM   |
     *      | "YMD"     | YMD      | YMDhmsZ YMD      |
     *      | "YMDT"    |          | YMDhmsZ          |
     *      | undefined | YMD YM Y | YMDhmsZ YMD YM Y | (原 v2.1)
     * @see VisitorFormIO.visitDateTimeType
     */
    mustHave: DatePrecision;                                            // v2.2 新增

    /** [輸入用] 預設值，方便使用者快速輸入。
     * 可以是合法的 YYYY-MM-DD 或 YYYY-MM 或 YYYY 字串或特殊預設值。
     * 特殊預設值目前只開放 "now" 代表輸入時。
     * null 代表沒有指定預設值。
     */
    defaultValue: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param mustHave 本 DateType 的最低精確度。
     * @param lower 本 DateType 的下限 (含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param upper 本 DateType 的上限 (不含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param defaultValue 本 DateType 的預設值。
     *                     可以是合法的 YYYY-MM-DD 或 YYYY-MM 或 YYYY 字串或特殊預設值。
     *                     特殊預設值目前只開放 "now" 代表輸入時。
     *                     null 代表沒有指定預設值。
     */
    static create(mustHave: DatePrecision,                              // v2.2 新增
        lower: Moment | null,
        upper: Moment | null,
        defaultValue: string | null): DateType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 date 的整個 LeafNode 物件。
     */
    static create(target: object): DateType;

    static create(p1: DatePrecision | object,                  // v2.2 新增，更新函式內相關程式碼
        p2?: Moment | null,
        p3?: Moment | null,
        p4?: string | null): DateType {
        let mustHave: DatePrecision;
        let lower: Moment | null;
        let upper: Moment | null;
        let defaultValue: string | null;

        if (typeof p1 === "number") {  // enum 用 number 編碼
            // 由 StructMD-IRspec Compiler 逐步堆疊
            mustHave = p1;
            lower = <Moment | null>p2;
            upper = <Moment | null>p3;
            defaultValue = <string | null>p4;

        } else {
            // 由 StructMD-IR Toolkit 載入
            [mustHave, lower, upper, defaultValue] = DateBoundType.deUndefined(p1);
        }

        if (lower !== null || upper !== null || defaultValue !== null) {
            return new DateType(mustHave, lower, upper, defaultValue);

        } else {
            return mustHave === DatePrecision.Y ? DateType.noArgY
                : mustHave === DatePrecision.YM ? DateType.noArgYM
                    : DateType.noArgYMD
                ;
        }
    }

    /**
     * @param mustHave 本 DateType 的最低精確度。
     * @param lower 本 DateType 的下限 (含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param upper 本 DateType 的上限 (不含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param defaultValue 本 DateType 的預設值。
     *                     可以是合法的 YYYY-MM-DD 或 YYYY-MM 或 YYYY 字串或特殊預設值。
     *                     特殊預設值目前只開放 "now" 代表輸入時。
     *                     null 代表沒有指定預設值。
     */
    private constructor(mustHave: DatePrecision,    // v2.2 新增
        lower: Moment | null,
        upper: Moment | null,
        defaultValue: string | null) {
        super(lower, upper, "date");

        this.mustHave = mustHave;                   // v2.2 新增
        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitDateType(this, ...data);
    }
}

/** dateTime 型態。
 * 可以有日期的 lower 或 upper，代表此 dateTime 的下限(含) 和上限(不含)。
 * 如 lower="2024-01-01", upper="2024-02-01" 則合規的為 2024-01-01T00:00:00 到 2024-01-31T23:59:59。
 * 因為最常出現的是沒有參數的，本 DateTimeType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class DateTimeType extends DateBoundType {

    /** 無參數的 dateTime，註明 mustHave = Y。
     */
    static noArgY: DateTimeType = new DateTimeType(DatePrecision.Y, null, null, null);

    /** 無參數的 dateTime，註明 mustHave = YM。
     */
    static noArgYM: DateTimeType = new DateTimeType(DatePrecision.YM, null, null, null);

    /** 無參數的 dateTime，註明 mustHave = YMD。
     */
    static noArgYMD: DateTimeType = new DateTimeType(DatePrecision.YMD, null, null, null);

    /** 無參數的 dateTime，註明 mustHave = YMDT。
     */
    static noArgYMDT: DateTimeType = new DateTimeType(DatePrecision.YMDT, null, null, null);

    // 以上四個為 v2.2 新增；底下一個保留 v2.1 的，即視為 mustHave = Y (雖然好像不必)

    /** 無參數的 dateTime。
     */
    static noArg: DateTimeType = DateTimeType.noArgY;

    /** 本 DateTimeType 的最低精確度。
     *      | IRspec    |          IR                 |
     *      |-----------|----------|------------------|
     *      | mustHave  | date     | datetime         |
     *      |-----------|----------|------------------|
     *      | "Y"       | YMD YM Y | YMDhmsZ YMD YM Y |
     *      | "YM"      | YMD YM   | YMDhmsZ YMD YM   |
     *      | "YMD"     | YMD      | YMDhmsZ YMD      |
     *      | "YMDT"    |          | YMDhmsZ          |
     *      | undefined | YMD YM Y | YMDhmsZ YMD YM Y | (原 v2.1)
     * @see VisitorFormIO.visitDateTimeType                             
     */
    mustHave: DatePrecision;                                            // v2.2 新增

    /** [輸入用] 預設值，方便使用者快速輸入。
     * 可以是合法的 YYYY-MM-DDThh:mm:ss+zz:zz 或 YYYY-MM-DD 或 YYYY-MM 或 YYYY 字串或特殊預設值。
     * 特殊預設值目前只開放 "now" 代表輸入時。
     * null 代表沒有指定預設值。
     */
    defaultValue: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param mustHave 本 DateTimeType 的最低精確度。
     * @param lower 本 DateTimeType 的下限 (含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param upper 本 DateTimeType 的上限 (不含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param defaultValue 本 DateTimeType 的預設值。
     *                     可以是合法的 YYYY-MM-DDThh:mm:ss+zz:zz 或 YYYY-MM-DD 或 YYYY-MM 或 YYYY 
     *                     字串或特殊預設值。
     *                     特殊預設值目前只開放 "now" 代表輸入時。
     *                     null 代表沒有指定預設值。
     */
    static create(mustHave: DatePrecision,                              // v2.2 新增
        lower: Moment | null,
        upper: Moment | null,
        defaultValue: string | null): DateTimeType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 dateTime 的整個 LeafNode 物件。
     */
    static create(target: object): DateTimeType;

    static create(p1: DatePrecision | object,                  // v2.2 新增，更新函式內相關程式碼
        p2?: Moment | null,
        p3?: Moment | null,
        p4?: string | null): DateTimeType {
        let mustHave: DatePrecision;
        let lower: Moment | null;
        let upper: Moment | null;
        let defaultValue: string | null;

        if (typeof p1 === "number") {  // enum 用 number 編碼
            // 由 StructMD-IRspec Compiler 逐步堆疊
            mustHave = p1;
            lower = <Moment | null>p2;
            upper = <Moment | null>p3;
            defaultValue = <string | null>p4;

        } else {
            // 由 StructMD-IR Toolkit 載入
            [mustHave, lower, upper, defaultValue] = DateBoundType.deUndefined(p1);
        }

        if (lower !== null || upper !== null || defaultValue !== null) {
            return new DateTimeType(mustHave, lower, upper, defaultValue);

        } else {
            return mustHave === DatePrecision.Y ? DateTimeType.noArgY
                : mustHave === DatePrecision.YM ? DateTimeType.noArgYM
                    : mustHave === DatePrecision.YMD ? DateTimeType.noArgYMD
                        : DateTimeType.noArgYMDT
                ;
        }
    }

    /**
     * @param mustHave 本 DateTimeType 的最低精確度。
     * @param lower 本 DateTimeType 的下限 (含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param upper 本 DateTimeType 的上限 (不含)。
     *              規格必須寫全年月日，Moment 存成零時零分零秒。
     *              null 代表沒有規範。
     * @param defaultValue 本 DateTimeType 的預設值。
     *                     可以是合法的 YYYY-MM-DDThh:mm:ss+zz:zz 或 YYYY-MM-DD 或 YYYY-MM 或 YYYY 
     *                     字串或特殊預設值。
     *                     特殊預設值目前只開放 "now" 代表輸入時。
     *                     null 代表沒有指定預設值。
     */
    private constructor(mustHave: DatePrecision,    // v2.2 新增
        lower: Moment | null,
        upper: Moment | null,
        defaultValue: string | null) {
        super(lower, upper, "dateTime");

        this.mustHave = mustHave;                   // v2.2 新增
        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitDateTimeType(this, ...data);
    }
}

/** time 型態。
 * 因為最常出現的是沒有參數的，本 DateType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class TimeType extends Type {

    /** 無參數的 time。
     */
    static noArg: TimeType = new TimeType(null);

    /** [輸入用] 預設值，方便使用者快速輸入。
     * 若為 hh:mm:ss 代表特定時間，其他為特殊預設值，目前只開放 "now" 代表輸入時。
     * null 代表沒有指定預設值。
     */
    defaultValue: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param defaultValue 本 TimeType 的預設值。
     *                     若為 hh:mm:ss 代表特定時間，其他為特殊預設值，目前只開放 "now" 代表輸入時。
     *                     null 代表沒有指定預設值。
     */
    static create(defaultValue: string | null): TimeType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 time 的整個 LeafNode 物件。
     */
    static create(target: object): TimeType;

    static create(p1: string | null | object): TimeType {
        if (typeof p1 === "string" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊

            const defaultValue = p1 as string || null;

            return (defaultValue === null)
                ? TimeType.noArg
                : new TimeType(defaultValue);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                default?: string  // 可以是 undefined
            }>p1;

            let defaultValue: string | null = target.default !== undefined
                ? target.default
                : null;

            return (defaultValue === null)
                ? TimeType.noArg
                : new TimeType(defaultValue);
        }
    }

    /**
     * @param defaultValue 本 TimeType 的預設值。
     *                     若為 hh:mm:ss 代表特定時間，其他為特殊預設值，目前只開放 "now" 代表輸入時。
     *                     null 代表沒有指定預設值。
     */
    private constructor(defaultValue: string | null) {
        super("time");

        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitTimeType(this, ...data);
    }
}

/** base64Binary 型態。
 * 因為最常出現的是沒有參數的，本 Base64BinaryType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class Base64BinaryType extends Type {

    /** 無參數的 base64Binary。
     */
    static noArg: Base64BinaryType = new Base64BinaryType(null);

    /** [輸入用] 先設定的預設值，方便使用者偷懶。
     * null 代表沒有指定預設值。
     */
    defaultValue: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param defaultValue 本 Base64BinaryType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    static create(defaultValue: string | null): Base64BinaryType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 base64Binary 的整個 LeafNode 物件。
     */
    static create(target: object): Base64BinaryType;

    static create(p1: string | null | object): Base64BinaryType {
        if (typeof p1 === "string" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const defaultValue = p1 as string || null;
            return (defaultValue === null)
                ? Base64BinaryType.noArg
                : new Base64BinaryType(defaultValue);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                default?: string  // 可以是 undefined
            }>p1;

            let defaultValue: string | null = target.default !== undefined
                ? target.default
                : null;

            return (defaultValue === null)
                ? Base64BinaryType.noArg
                : new Base64BinaryType(defaultValue);
        }
    }

    /**
     * @param defaultValue 本 Base64BinaryType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    private constructor(defaultValue: string | null) {
        super("base64Binary");

        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitBase64BinaryType(this, ...data);
    }
}

/** boolean 型態。
 * 因為最常出現的是沒有參數的，本 BooleanType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
export class BooleanType extends Type {

    /** 無參數的 boolean。
     */
    static noArg: BooleanType = new BooleanType(null, null, null);

    /** [輸出用] 當 StructMD-IR 中對應的數值為真時，顯示的文字。
     * null 代表直接印出 true。
     */
    displayTrue: string | null;

    /** [輸出用] 當 StructMD-IR 中對應的數值為偽時，顯示的文字。
     * null 代表直接印出 false。
     */
    displayFalse: string | null;

    /** [輸入用] 預設值，方便使用者快速輸入。
     * null 代表沒有指定預設值。
     */
    defaultValue: boolean | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param displayTrue  當 StructMD-IR 中對應的數值為真時，顯示的文字。
     *                     null 代表直接印出 true;
     * @param displayFalse 當 StructMD-IR 中對應的數值為偽時，顯示的文字。
     *                     null 代表直接印出 false。
     * @param defaultValue 本 BooleanType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    static create(displayTrue: string | null,
        displayFalse: string | null,
        defaultValue: boolean | null): BooleanType;

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 boolean 的整個 LeafNode 物件。
     */
    static create(target: object): BooleanType;

    static create(p1: string | null | object,
        p2?: string | null,
        p3?: boolean | null): BooleanType {
        if (typeof p1 === "string" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const displayTrue =p1 as "string" || null;
            return (p1 === null && p2 === null && p3 === null)
                ? BooleanType.noArg
                : new BooleanType(displayTrue, <string | null>p2, <boolean | null>p3);

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                displayT?: string,  // 可以是 undefined
                displayF?: string,  // 可以是 undefined
                default?: boolean   // 可以是 undefined
            }>p1;

            let displayT: string | null = target.displayT !== undefined
                ? target.displayT
                : null;
            let displayF: string | null = target.displayF !== undefined
                ? target.displayF
                : null;
            let defaultValue: boolean | null = target.default !== undefined
                ? target.default
                : null;

            return (displayT === null && displayF === null && defaultValue === null)
                ? BooleanType.noArg
                : new BooleanType(displayT, displayF, defaultValue);
        }
    }

    /**
     * @param displayTrue  當 StructMD-IR 中對應的數值為真時，顯示的文字。
     *                     null 代表直接印出 true;
     * @param displayFalse 當 StructMD-IR 中對應的數值為偽時，顯示的文字。
     *                     null 代表直接印出 false。
     * @param defaultValue 本 BooleanType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    private constructor(displayTrue: string | null,
        displayFalse: string | null,
        defaultValue: boolean | null) {
        super("boolean");

        this.displayTrue = displayTrue;
        this.displayFalse = displayFalse;
        this.defaultValue = defaultValue;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitBooleanType(this, ...data);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//..5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
////////////////////////////////////////////////////////////////////////////////////////////////////

/*  # CodeType 底下的資料結構考量
    ## 緣由
        因為 CodeType 一路往下會有 Node1，建置 Node1 時可以用巨集，
        所以要有 ofSpec 的機制，以便取得 MacroMap。
    ## 上下連結
        Object Level                    │ down link     │ up link
        ────────────────────────────────┼───────────────┼───────────────
        (Leaf)Node or (Leaf)Attachment  │ type          │
          CodeType                      │ options       │ ???
            Option                      │ attachment    │ ofCodeType
              (NonLeaf)Attachment       │ children      │ subject
                Node1                   │               │ parent
    ## CodeType 的 up link
        -   若溯源到 LeafNode，Node1 有 ofSpec，滿足所需
        -   若溯源到 LeafAttachment，會形成 Attachment --> Option --> CodeType --> ... 繞圈圈
    ## 規劃
        讓 CodeType 直接擁有 ofSpec，如此建置底下的 Node1 時可以沿著 up link 得到 ofSpec
 */

/** code 型態。
 */
export class CodeType extends Type {

    /** [內部用] 下列情形設定為歸屬的 StructMD-IRspec：
     *     IRspec 底下的 LeafNode 的 CodeType、
     *     區域巨集底下的 LeafNode 的 CodeType、
     *     IRspec 底下的 NonLeafAttachment 底下的 LeafNode 的 CodeType、
     *     區域巨集底下的 NonLeafAttachment 底下的 LeafNode 的 CodeType。
     * 下列情形設定為 null，即無歸屬的 StructMD-IRspec：
     *     全域巨集底下的 LeafNode 的 CodeType、
     *     全域巨集底下的 NonLeafAttachment 底下的 LeafNode 的 CodeType。
     * 逐步拼湊結構時，忽略此欄位 (undefined)。
     */
    ofSpec?: IRspec | null;

    // // 此 ofNode 機制只實作在 CodeType
    // // 因為其他 9 種值得實作 static noArg，而 static 牴觸了 ofNode 的設計
    // /** [內部用] 本 CodeType 的歸屬 LeafNode、LeafMacro、LeafAttachment。
    //  * 當 LeafNode.type 是 CodeType 時，共同組成 double-link。
    //  * 逐步拼湊結構時，忽略此欄位 (undefined)。
    //  */
    // ofNode?: LeafNode | LeafMacro | LeafAttachment;

    /** 本 CodeType 的選項。
     */
    options: Option[];

    /** [輸入用] 預設值，方便使用者快速輸入。
     * null 代表沒有指定預設值。
     */
    defaults: Option[] | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param options 本 CodeType 的選項。若有 attachment，已經放在對應的 Option 物件中了。
     * @param defaults 本 CodeType 的預設值。
     *                 null 代表沒有指定預設值。
     */
    constructor(options: Option[],
        defaults: Option[] | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param target 型態為 code 的整個 LeafNode 物件，包含必填的 option 以及選填的 attach 欄位。
     * @param ofSpec 本 CodeType 歸屬的 StructMD-IRspec。若是宣告全域巨集情境，則傳入 null。
     */
    constructor(target: object,
        ofSpec: IRspec | null);

    constructor(p1: Option[] | object,
        p2?: Option[] | null | IRspec | null) {
        super("code");

        if (Array.isArray(p1) && p1[0] instanceof Option) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;
            this.options = p1;
            this.defaults = <Option[] | null>p2;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let target = <{
                option: [],
                attach?: [],  // 可以是 undefined
                default?: []  // 可以是 undefined
            }>p1;
            let ofSpec = <IRspec | null>p2;
            let attach: [] = target.attach !== undefined
                ? target.attach
                : [];

            this.ofSpec = ofSpec;

            this.options = [];
            for (let elmt of target.option) {
                this.options.push(new Option(this, elmt, attach));
            }

            if (target.default === undefined) {
                this.defaults = null;

            } else {
                this.defaults = [];
                for (let codeString of target.default) {
                    this.defaults.push(<Option>this.getOption(codeString));
                }
            }
        }
    }

    getAttachNames(prefix: string): string[] {
        let result: string[] = [];

        for (let option of this.options) {
            if (option.attachment !== null) {
                // let p: string = prefix + option.code;    v2.2 異動
                let p: string = prefix + option.seqno;
                result.push(p);

                if (option.attachment instanceof LeafAttachment
                    && option.attachment.type instanceof CodeType) {
                    result.push(
                        ...option.attachment.type.getAttachNames(p + Attachment.sep)
                    );
                }
            }
        }

        return result;
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitCodeType(this, ...data);
    }

    //..10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
    // 當需要從 CodeType 中比對出 Option 時，利用 Map 會比較方便

    /** this.options 整理成的 Map。 
     * 用 lazy initialization 方式來建立。
     */
    private optionMap: Map<string, Option> | undefined;

    /** 從本 CodeType 中比對出 Option。
     * @param codeOrDisplay 
     */
    getOption(codeOrDisplay: string): Option | undefined {
        // lazy initialization
        if (this.optionMap === undefined) {
            this.optionMap = new Map<string, Option>();

            for (let option of this.options) {
                // compiler 階段已經保證各 Option 的 code 和 display 不重複
                // 除了同一 Option 的 code 和 display 允許相同
                this.optionMap.set(option.code, option);
                if (option.display !== option.code) {
                    this.optionMap.set(option.display, option);
                }
            }
        }

        return this.optionMap.get(codeOrDisplay);
    }
}

/** CodeType 的選項。
 */
export class Option implements Visitee {

    /** [內部用] 本 Option 歸屬的 CodeType。
     * 與 CodeType.options 合組成 double-link。
     * 逐步拼湊結構時，忽略此欄位 (undefined)。
     */
    ofCodeType?: CodeType;

    /** 本 Option 的編碼。
     */
    code: string;

    /** 本 Option 的顯示文字。
     */
    display: string;

    /** 本 Option 在歸屬 CodeType 的 options 中出現的次序，由 0 開始數。
     * v2.2 新增。
     */
    seqno: number;

    /** [輸出用/進階] 本 Option 對應的 SNOMED-CT 碼們。
     * null 代表沒有指定 SNOMED-CT。
     */
    snomeds: number[] | null;

    /** 本 Option 的補充說明。
     * null 代表不須補充說明。
     */
    attachment: Attachment | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param code 本 Option 的編碼。
     * @param display 本 Option 的顯示文字。
     * @param seqno 本 Option 在歸屬 CodeType 的 options 中出現的次序，由 0 開始數。
     * @param snomeds 本 Option 對應的 SNOMED-CT 碼們。
     * @param attachment 本 Option 的補充說明。若無，則傳入 null。
     */
    constructor(code: string,
        display: string,
        seqno: number,  // v2.2 新增
        snomeds: number[] | null,
        attachment: Attachment | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param ofCodeType 本 Option 歸屬的 CodeType。
     * @param optionTarget 載入的 option 標的。
     *                     可以有兩種形式，簡易的為字串；
     *                     或者為物件，其中有必要性的 code 欄位以及選擇性的 display 和 snomed 欄位。
     *                     倘若無 display，讓 display 等同 code。
     * @param attachArray 搭配的 attach 陣列標的，將從中挑取對應的 attachment。若無，則傳入空陣列。
     */
    constructor(ofCodeType: CodeType,
        optionTarget: string | object,
        attachArray: []);

    constructor(p1: string | CodeType,
        p2: string | string | object,
        p3: number | [],            // v2.2 因應新增 seqno 異動
        p4?: number[] | null,       // v2.2 因應新增 seqno 異動
        p5?: Attachment | null)     // v2.2 因應新增 seqno 異動
    {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofCodeType = undefined;
            this.code = p1;
            this.display = <string>p2;
            this.seqno = <number>p3;                    // v2.2 新增
            this.snomeds = <number[] | null>p4;         // v2.2 因應新增 seqno 異動
            this.attachment = <Attachment | null>p5;    // v2.2 因應新增 seqno 異動

        } else {
            // 由 StructMD-IR Toolkit 載入
            let ofCodeType = p1;
            // let optionTarget = <string | object>p2;  // v2.2 異動
            let optionTarget = <{                       // v2.2 異動
                code: string,                           // v2.2 異動
                display?: string,                       // v2.2 異動
                seqno: number,                          // v2.2 異動
                snomed?: number[]                       // v2.2 異動
            }>p2;                                       // v2.2 異動
            let attachArray = <[]>p3;

            this.ofCodeType = ofCodeType;

            // 處理 option

            // if (typeof optionTarget === "string") {
            //     // 簡易的字串
            //     this.code = optionTarget;
            //     this.display = optionTarget;
            //     this.snomeds = null;
            // } else {
            //     // 全套的物件
            //     let optionTaregt2 = <{
            //         code: string,
            //         display?: string,
            //         snomed?: number[]
            //     }>optionTarget;
            //     this.code = optionTaregt2.code;
            //     this.display = (optionTaregt2.display !== undefined)
            //                  ? optionTaregt2.display
            //                  : optionTaregt2.code;
            //     this.snomeds = (optionTaregt2.snomed !== undefined)
            //                  ? optionTaregt2.snomed
            //                  : null;
            // }
            // 以上是 v2.1 的
            this.code = optionTarget.code;
            this.display = (optionTarget.display !== undefined)
                ? optionTarget.display
                : optionTarget.code;
            this.seqno = optionTarget.seqno;
            this.snomeds = (optionTarget.snomed !== undefined)
                ? optionTarget.snomed
                : null;

            // 底下處理 attachment

            // 先從 attachArray 挑選有無對應的 attachment
            let attachTarget: object | null = null;  // 先設定為沒有前提
            for (let elmt of attachArray) {      // 再從 attachArray 查找
                let x = <{
                    subject: string
                }>elmt;

                if (x.subject === this.code || x.subject === this.display) {
                    attachTarget = elmt;
                    break;
                }
            }

            if (attachTarget !== null) {
                // lookahead 後分流
                this.attachment = (Object.keys(attachTarget).includes("child"))
                    ? new NonLeafAttachment(this, attachTarget)
                    : new LeafAttachment(this, attachTarget);

            } else {
                this.attachment = null;
            }
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitOption(this, ...data);
    }
}

/*  # Attachment 類似沒有名稱的 Node1
 *  ## 利用有名稱的 Node1 的 Condition 來規範
 *      -   StructMD-IRspec
 *              "child": [
 *                  {
 *                      "name": "嗜好",
 *                      "type": "code",
 *                      "option": ["琴", "棋", "書", "畫"]
 *                  },
 *                  {
 *                     "name": "哪種琴",
 *                      "cond": {
 *                          "subject": "嗜好",
 *                          "operator": "has",
 *                          "value": "琴"
 *                      },
 *                      "card": "1..*",
 *                      "type": "string"
 *                  },
 *                  {
 *                     "name": "哪種棋",
 *                      "cond": {
 *                          "subject": "嗜好",
 *                          "operator": "has",
 *                          "value": "棋"
 *                      },
 *                      "card": "1..*",
 *                      "type": "string"
 *                  }
 *              ]
 *      -   StructMD-IR
 *              {
 *                  "嗜好": ["琴", "畫"],
 *                  "哪種琴": ["二胡", "琵琶"]
 *              }
 *  ## 利用 Attachment 來規範
 *      -   StructMD-IRspec
 *              "child": [
 *                  {
 *                      "name": "嗜好",
 *                      "type": "code",
 *                      "option": ["琴", "棋", "書", "畫"],
 *                      "attach": [
 *                          {
 *                              "subject": "琴",
 *                              "card": "1..*",
 *                              "type": "string"
 *                          },
 *                          {
 *                              "subject": "棋",
 *                              "card": "1..*",
 *                              "type": "string"
 *                          }
 *                      ]
 *                  }
 *              ]
 *      -   StructMD-IR
 *              {
 *                  "嗜好": ["琴", "畫"],
 *                  "嗜好>>琴": ["二胡", "琵琶"]
 *              }
 */

/** CodeType 的 Option 的補充說明。
 * 補充說明可以是簡單的 LeafAttachment (類似沒有名稱的 LeafNode)，
 *     也可以是較複雜的 NonLeafAttachment (類似沒有名稱的 NonLeafNode)。
 * 本 Attachment 是它們共用的部分。
 */
export abstract class Attachment implements Visitee {

    /** 附屬欄位名稱的分隔符號。
     * IRspec 中，Option 的 Attachment 是沒有名字的，但是 IR 中，還是要有欄位名稱。
     * 
     * 假設有個 mName 為 M 的 CodeType-LeafNode，其 Option 的 code 分別為 A, B, C，
     *     則若有附屬欄位，將分別命名為 M>>A, M>>B, M>>C。
     * 進一步，若 A 的附屬欄位是個 CodeType-LeafAttachment，其 Option 的 code 分別為 D, E, F，
     *     則若有附屬欄位，將分別命名為 M>>A>>D, M>>A>>E, M>>A>>F。
     * 再進一步，若 D 的附屬欄位又是個 CodeType-LeafAttachment，其 Option 的 code 分別為 G, H, I，
     *     則若有附屬欄位，將分別命名為 M>>A>>D>>G, M>>A>>D>>H, M>>A>>D>>I。
     * 以下依此類推。
     * 
     * 附屬欄位名稱不值得紀錄在此 Attchment，必須動態產生，
     * 因為本 Attachment 歸屬的 Option 歸屬的 CodeType 可能利用 LeafMacro 定義，
     * 然後多個 LeafNode 引用該 LeafMacro。
     * 在 LeafMacro 底下的 Attachment 尚未配給 mName，如上例的 M。
     * 
     * 前例使用 >> 當成 separator。假如未來要改，改這裡。
     * 
     * v2.1
     * 
     * .10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
     * 
     * 為了 Form.io 再次修正
     * 
     * 本來為了 StructMD-IR 的可讀性，Attachment 的名稱串 Option 的 code，如上例 M>>A, M>>B 的 A, B
     * 但實務上 code 會五花八門，不會遵循程式語言變數 identfier 的規則，如有空白、中文字、...
     * 將在 Form.io 將在 Form.io 惹麻煩
     * 
     * v2.2 改成串 Option 的 seqno，即該 Option 在歸屬 CodeType 的 Option[] 出現的次序，由 0 開始數
     * 
     * clchen 2025-12-11 v2.2
     */
    static sep: string = "_OpT_";  // 因應 Form.io 的 API propertyName 必須是 identifier
    // 把原本的 >> 改成「底線大O小p大T底線」   clchen 2025/05/35

    /** 本 Attachment 歸屬的 Option。
     * 當該 Option 被挑選時，本 Attachment 才應該出現。
     * 與 Option.attachment 合組成 double-link。
     */
    subject: Option;

    /** 本 Attachment 的基數。
     * 當 subject 被挑選時，本 Attachment 出現的次數。
     */
    cardinality: Cardinality;

    /** 當 StructMD-IR 提供 0 筆本 Attachment 時，呈現的替代文字。
     * cardinality 的下限必須為 0，displayAbsent 才有意義。
     * 若沒有替代文字，則 null。
     */
    displayAbsent: string | null;

    /** [輸入用] 本 Attachment 的說明。
     * 可以當成輸入時的輔助，比如 form 的 tooltip。
     */
    description: string | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param subject 本 Attachment 歸屬的 Option。
     * @param cardinality 本 Attachment 的基數。
     * @param displayAbsent 當 StructMD-IR 提供 0 筆本 Attachment 時，呈現的替代文字。
     *                      若沒有替代文字，則傳入 null。
     * @param description 本 Attachment 的說明。若沒有說明，則傳入 null。
     */
    constructor(subject: Option,
        cardinality: Cardinality,
        displayAbsent: string | null,
        description: string | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param subject 本 Attachment 歸屬的 Option。
     * @param target 載入標的。
     */
    constructor(subject: Option,
        target: object);

    constructor(p1: Option,
        p2: Cardinality | object,
        p3?: string | null,
        p4?: string | null) {
        if (p2 instanceof Cardinality) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.subject = p1;
            this.cardinality = p2;
            this.displayAbsent = <string | null>p3;
            this.description = <string | null>p4;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let subject = p1;
            let target = <{
                // subject: string,     // 已在 Option() 看過此字串
                // 同時帶入 Option 的 this，即參數 p1
                card?: string,          // 可以是 undefined
                display0?: string,      // 可以是 undefined
                desc?: string           // 可以是 undefined
            }>p2;

            this.subject = subject;

            this.cardinality = Cardinality.create(target.card);  // create() 會處理 undefined

            this.displayAbsent = target.display0 !== undefined
                ? target.display0
                : null;

            this.description = target.desc !== undefined
                ? target.desc
                : null;
        }
    }

    abstract accept(visitor: Visitor, ...data: any[]): any;
}

/** CodeType 的 Option 的補充複雜說明，包含子節點們。
 * 類似沒有名稱的 NonLeafNode。
 */
export class NonLeafAttachment extends Attachment {

    /** 本 NonLeafAttachment 的子節點們。
     * 當借助巨集宣告此 NonLeafAttachment 的子節點們時，children 將串到 NonLeafMacro 的內容。
     * 當不是時，則串到專屬的 Node[]。
     */
    children: Node[];

    /** 集中所有子節點名稱，以方便接續 Visitor 使用。
     * 包含系統產生的 attachment 內部名稱。
     * 逐步拼湊結構時，忽略此欄位 (空陣列)。
     */
    childNames: string[];

    /** 當借助巨集宣告此 NonLeafAttachment 的子節點們時，多保留來源巨集名稱。
     * 雖然 children 已經串到 NonLeafMacro 的內容，後續運算不必用到此 NonLeafMacro，
     * 但是考量輸出 IRspec 時欲保留 macro 的名稱，所以多存此 sourceMacro。
     * 當非借助巨集宣告此 NonLeafNode 的子節點們時，則 null。
     */
    sourceMacro: NonLeafMacro | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param subject 本 NonLeafAttachment 歸屬的 Option。
     * @param cardinality 本 NonLeafAttachment 的基數。
     * @param displayAbsent 當 StructMD-IR 提供 0 筆本 NonLeafAttachment 時，呈現的替代文字。
     *                      若沒有替代文字，則傳入 null。
     * @param description 本 NonLeafAttachment 的說明。若沒有說明，則傳入 null。
     * @param children 本 NonLeafAttachment 的子節點們。
     * @param sourceMacro 借助宣告此 NonLeafAttachment 的巨集。若非，則傳入 null。
     */
    constructor(subject: Option,
        cardinality: Cardinality,
        displayAbsent: string | null,
        description: string | null,
        children: Node[],
        sourceMacro: NonLeafMacro | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param subject 本 NonLeafAttachment 歸屬的 Option。
     * @param target 載入標的。
     */
    constructor(subject: Option,
        target: object);

    constructor(p1: Option,
        p2: Cardinality | object,
        p3?: string | null,
        p4?: string | null,
        p5?: Node[],
        p6?: NonLeafMacro | null) {
        if (p2 instanceof Cardinality) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1, <Cardinality>p2, <string | null>p3, <string | null>p4);

            this.children = <Node[]>p5;
            this.sourceMacro = <NonLeafMacro | null>p6;

            this.childNames = [];

        } else {
            // 由 StructMD-IR Toolkit 載入
            let subject: Option = p1;
            let target = <{
                child: []      // 直接宣告子節點們
                | string  // 引用子節點巨集
            }>p2;

            super(subject, p2);

            // 從 subject: Option 的 ofCodeType 找到 CodeType
            // 在從 CodeType 的 ofSpec 找到歸屬的 IRspec 或 null (當宣告全域巨集時)
            let ofCodeType: CodeType = <CodeType>subject.ofCodeType;
            let ofSpec: IRspec | null = <IRspec | null>ofCodeType.ofSpec;

            if (Array.isArray(target.child)) {
                // 直接宣告子節點們
                this.sourceMacro = null;

                this.children = [];
                this.childNames = [];
                let nameSet: Set<string> = new Set<string>();
                for (let i = 0; i < target.child.length; i++) {
                    let elmt: any = target.child[i];

                    // lookahead 後分流
                    if (Object.keys(elmt).includes("displayC")) {
                        let node: CommentNode = new CommentNode(elmt, i);
                        this.children.push(node);
                        nameSet.add(<string>node.name);

                    } else if (Object.keys(elmt).includes("child")) {
                        let node: NonLeafNode = new NonLeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);

                    } else {
                        let node: LeafNode = new LeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);

                        if (node.type instanceof CodeType) {
                            // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                            let prefix: string = node.mName + Attachment.sep;
                            for (let n of node.type.getAttachNames(prefix)) {
                                nameSet.add(n);
                            }
                        }
                    }
                }
                this.childNames = Array.from(nameSet);

            } else {
                // 借助巨集宣告子節點們
                this.sourceMacro = ofSpec === null
                    ? <NonLeafMacro>MacroMap.getGlobal(target.child)  // 借助全域巨集
                    : <NonLeafMacro>ofSpec.macros.get(target.child);  // 借助區域巨集

                this.children = this.sourceMacro.children;
                this.childNames = this.sourceMacro.childNames;
            }
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitNonLeafAttachment(this, ...data);
    }
}

/** CodeType 的 Option 的簡易說明，只有一個欄位。
 * 類似沒有名稱的 LeafNode。
 */
export class LeafAttachment extends Attachment {

    /** 本 LeafAttachemnt 的資料型態。
     * 當借助巨集宣告此 LeafAttachemnt 的資料型態時，type 將串到 LeafMacro 的內容。
     * 當不是時，則串到專屬的 Type。
     */
    type: Type;

    /** 當借助巨集宣告此 LeafAttachemnt 的資料型態時，多保留來源巨集名稱。
     * 雖然 type 已經串到 LeafMacro 的內容，後續運算不必用到此 LeafMacro，
     * 但是考量輸出 IRspec 時欲保留 macro 的名稱，所以多存此 sourceMacro。
     * 當非借助巨集宣告此 LeafNode 的資料型態時，則 null。
     */
    sourceMacro: LeafMacro | null;

    /** 由 StructMD-IRspec Compiler 逐步堆疊時使用。
     * @param subject 本 LeafAttachemnt 歸屬的 Option。
     * @param cardinality 本 LeafAttachemnt 的基數。
     * @param displayAbsent 當 StructMD-IR 提供 0 筆本 LeafAttachemnt 時，呈現的替代文字。
     *                      若沒有替代文字，則傳入 null。
     * @param description 本 LeafAttachment 的說明。若沒有說明，則傳入 null。
     * @param type 本 LeafAttachemnt 的資料型態。
     * @param sourceMacro 借助宣告此 LeafAttachemnt 的巨集。若非，則傳入 null。
     */
    constructor(subject: Option,
        cardinality: Cardinality,
        displayAbsent: string | null,
        description: string | null,
        type: Type,
        sourceMacro: LeafMacro | null);

    /** 由 StructMD-IR Toolkit 載入時使用。
     * @param subject 本 LeafAttachemnt 歸屬的 Option。
     * @param target 載入標的。
     */
    constructor(subject: Option,
        target: object);

    constructor(p1: Option,
        p2: Cardinality | object,
        p3?: string | null,
        p4?: string | null,
        p5?: Type,
        p6?: LeafMacro | null) {
        if (p2 instanceof Cardinality) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1, <Cardinality>p2, <string | null>p3, <string | null>p4);

            this.type = <Type>p5;
            this.sourceMacro = <LeafMacro | null>p6;

        } else {
            // 由 StructMD-IR Toolkit 載入
            let subject: Option = p1;
            let target = <{
                type: string
            }>p2;

            super(subject, p2);

            // 從 subject: Option 的 ofCodeType 找到 CodeType
            // 在從 CodeType 的 ofSpec 找到歸屬的 IRspec 或 null (當宣告全域巨集時)
            let ofCodeType: CodeType = <CodeType>subject.ofCodeType;
            let ofSpec: IRspec | null = <IRspec | null>ofCodeType.ofSpec;

            let type: Type | undefined;
            type = (target.type === "decimal") ? DecimalType.create(target)
                : (target.type === "integer") ? IntegerType.create(target)
                    : (target.type === "string") ? StringType.create(target)
                        : (target.type === "markdown") ? MarkdownType.create(target)
                            : (target.type === "date") ? DateType.create(target)
                                : (target.type === "dateTime") ? DateTimeType.create(target)
                                    : (target.type === "time") ? TimeType.create(target)
                                        : (target.type === "boolean") ? BooleanType.create(target)
                                            : (target.type === "base64Binary") ? Base64BinaryType.create(target)
                                                : (target.type === "code") ? new CodeType(target, ofSpec)
                                                    : /* 上述 10 個之外，即 macro */      undefined  // 暫時註記
                ;

            if (type !== undefined) {
                // 直接宣告資料型態
                this.sourceMacro = null;
                this.type = type;

            } else {
                // 借助巨集宣告資料型態
                this.sourceMacro = ofSpec === null
                    ? <LeafMacro>MacroMap.getGlobal(target.type)  // 借助全域巨集
                    : <LeafMacro>ofSpec.macros.get(target.type);  // 借助區域巨集

                this.type = this.sourceMacro.type;
            }
        }
    }

    accept(visitor: Visitor, ...data: any[]): any {
        return visitor.visitLeafAttachment(this, ...data);
    }
}

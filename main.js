(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/runner/work/fhir-prom-formio/fhir-prom-formio/src/main.ts */"zUnb");


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "HRil":
/*!*************************************************!*\
  !*** ./src/app/structure-ir/StructMD-IRspec.ts ***!
  \*************************************************/
/*! exports provided: IRspec, MacroMap, Macro, NonLeafMacro, LeafMacro, Node, CommentNode, Node1, NonLeafNode, LeafNode, Condition, Cardinality, Type, NumberBoundType, DecimalType, IntegerType, StringType, MarkdownType, DateBoundType, DatePrecision, DateType, DateTimeType, TimeType, Base64BinaryType, BooleanType, CodeType, Option, Attachment, NonLeafAttachment, LeafAttachment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IRspec", function() { return IRspec; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MacroMap", function() { return MacroMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Macro", function() { return Macro; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NonLeafMacro", function() { return NonLeafMacro; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LeafMacro", function() { return LeafMacro; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Node", function() { return Node; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentNode", function() { return CommentNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Node1", function() { return Node1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NonLeafNode", function() { return NonLeafNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LeafNode", function() { return LeafNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Condition", function() { return Condition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cardinality", function() { return Cardinality; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Type", function() { return Type; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NumberBoundType", function() { return NumberBoundType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DecimalType", function() { return DecimalType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntegerType", function() { return IntegerType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringType", function() { return StringType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkdownType", function() { return MarkdownType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateBoundType", function() { return DateBoundType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatePrecision", function() { return DatePrecision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateType", function() { return DateType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateTimeType", function() { return DateTimeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeType", function() { return TimeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Base64BinaryType", function() { return Base64BinaryType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BooleanType", function() { return BooleanType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodeType", function() { return CodeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Option", function() { return Option; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Attachment", function() { return Attachment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NonLeafAttachment", function() { return NonLeafAttachment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LeafAttachment", function() { return LeafAttachment; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "wd/R");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);

/** 這是 StructMD-IRspec 內部資料結構。
 * 建立方式：
 *     1) StructMD-IRspec Compiler 逐步堆疊。
 *     2) StructMD-IR Toolkit 載入。
 */
class IRspec {
    constructor(p1, p2, p3, p4) {
        if (typeof p1 === "number") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.specNum = p1;
            this.display = p2;
            this.macros = p3;
            this.children = p4;
            this.childNames = [];
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let irSpecFile = p1;
            let target = JSON.parse(irSpecFile); // 乃人修改
            // }>JSON.parse(fs.readFileSync(irSpecFile).toString());
            this.specNum = target.specNum;
            this.display = target.display !== undefined
                ? target.display
                : null;
            // 先處理 macro 再處理 child，child 中可能會用到 macro
            this.macros = new MacroMap(this);
            if (target.macro !== undefined) { // 若 undefined，就讓 macroMap 裡面空著，但還是有殼
                for (let elmt of target.macro) {
                    // lookahead 後分流
                    let macro = (Object.keys(elmt).includes("child"))
                        ? new NonLeafMacro(elmt, this)
                        : new LeafMacro(elmt, this);
                    // 放入 macroMap.locals
                    this.macros.setLocal(macro.name, macro);
                }
            }
            // 處理 child
            this.children = [];
            this.childNames = [];
            let nameSet = new Set();
            for (let i = 0; i < target.child.length; i++) {
                let elmt = target.child[i];
                // lookahead 後分流
                if (Object.keys(elmt).includes("displayC")) {
                    let node = new CommentNode(elmt, i);
                    this.children.push(node);
                    nameSet.add(node.name);
                }
                else if (Object.keys(elmt).includes("child")) {
                    let node = new NonLeafNode(elmt, this, this);
                    this.children.push(node);
                    nameSet.add(node.name); // 考量 name 可能等於 mName 所以採用 Set
                    nameSet.add(node.mName);
                }
                else {
                    let node = new LeafNode(elmt, this, this);
                    this.children.push(node);
                    nameSet.add(node.name);
                    nameSet.add(node.mName);
                    if (node.type instanceof CodeType) {
                        // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                        let prefix = node.mName + Attachment.sep;
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
    /** 根據 specNum 查找 StructMD-IRspec。
     * 將來應該改成 DB 機制。
     * @param specNum 目標 StructMD-IRspec 編號。
     * @returns 查找到的 StructMD-IRspec。
     *          若找不到，回傳 undefined。
     */
    static get(specNum) {
        return IRspec.all.get(specNum);
    }
    accept(visitor, ...data) {
        return visitor.visitIRspec(this, ...data);
    }
}
/** 所有的 StructMD-IRspec。
 * 將來應該改成 DB 機制。
 */
IRspec.all = new Map();
////////////////////////////////////////////////////////////////////////////////////////////////////
//..5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
////////////////////////////////////////////////////////////////////////////////////////////////////
/** 巨集的集合以及查詢機制。
 */
class MacroMap {
    constructor(p1) {
        this.locals = new Map();
        if (p1 === undefined) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            this.ofSpec = p1;
        }
    }
    /** 根據全域巨集名稱，查找巨集。
     * @param name 目標全域巨集名稱，不包含前置星號。
     * @returns 查找到的巨集。
     *          若找不到，回傳 undefined。
     */
    static getGlobal(name) {
        // lazy initialization
        if (MacroMap.globals === undefined) {
            MacroMap.globals = new Map();
            // 假設 globalMacros.json 無誤
            // let macros = <object[]>JSON.parse(
            //     fs.readFileSync("src\\globalMacros.json").toString()
            // );
            // let macros = <object[]>globalMacros; // 乃人修改(改成用import json的方式取得globalMacros )
            let macros = []; // 乃人修改(改成用import json的方式取得globalMacros )
            for (let elmt of macros) {
                // lookahead 後分流
                let macro = (Object.keys(elmt).includes("child"))
                    ? new NonLeafMacro(elmt, null) // null 代表正建立全域巨集
                    : new LeafMacro(elmt, null);
                // 放入 MacroMap.globals
                MacroMap.globals.set(macro.name, macro);
            }
        }
        // query
        return MacroMap.globals.get(name);
    }
    /** 放入區域巨集。
     * @param name 巨集名稱。
     * @param macro 巨集物件。
     */
    setLocal(name, macro) {
        this.locals.set(name, macro);
    }
    /** 根據巨集名稱，查找巨集。
     * @param name 目標巨集名稱。
     *             若有前置星號，代表查找全域巨集，否則為區域巨集。
     * @returns 查找到的巨集。
     *          若找不到，回傳 undefined。
     */
    get(name) {
        if (name.startsWith("*")) {
            // 查找全域巨集
            return MacroMap.getGlobal(name.substring(1));
        }
        else {
            // 查找區域巨集
            return this.locals.get(name);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitMacroMap(this, ...data);
    }
}
/** 巨集。
 * 巨集有兩種，分別用 NonLeafMacro 和 LeafMacro 實作。
 * 本 Macro 是它們共用的部分。
 */
class Macro {
    constructor(p1, p2) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;
            this.name = p1;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let ofSpec = p2;
            this.ofSpec = ofSpec;
            this.name = target.name;
        }
    }
}
/** 子節點巨集。
 */
class NonLeafMacro extends Macro {
    constructor(p1, p2) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1);
            this.children = p2;
            this.childNames = [];
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let ofSpec = p2;
            super(p1, ofSpec);
            this.children = [];
            this.childNames = [];
            let nameSet = new Set();
            for (let i = 0; i < target.child.length; i++) {
                let elmt = target.child[i];
                // lookahead 後分流
                if (Object.keys(elmt).includes("displayC")) {
                    let node = new CommentNode(elmt, i);
                    this.children.push(node);
                    nameSet.add(node.name);
                }
                else if (Object.keys(elmt).includes("child")) {
                    let node = new NonLeafNode(elmt, this, ofSpec);
                    this.children.push(node);
                    nameSet.add(node.name);
                    nameSet.add(node.mName);
                }
                else {
                    let node = new LeafNode(elmt, this, ofSpec);
                    this.children.push(node);
                    nameSet.add(node.name);
                    nameSet.add(node.mName);
                    if (node.type instanceof CodeType) {
                        // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                        let prefix = node.mName + Attachment.sep;
                        for (let n of node.type.getAttachNames(prefix)) {
                            nameSet.add(n);
                        }
                    }
                }
            }
            this.childNames = Array.from(nameSet);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitNonLeafMacro(this, ...data);
    }
}
/** 型態巨集。
 */
class LeafMacro extends Macro {
    constructor(p1, p2) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1);
            this.type = p2;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let ofSpec = p2;
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
                                                : /* target.type === "code" */ new CodeType(p1, ofSpec);
        }
    }
    accept(visitor, ...data) {
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
class Node {
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
class CommentNode extends Node {
    constructor(p1, p2) {
        super();
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.comment = p1;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            this.name = `${CommentNode.prefix}${p2}`;
            this.comment = target.displayC;
        }
    }
    accept(visitor, ...data) {
        return visitor.visitCommentNode(this, ...data);
    }
}
CommentNode.prefix = "__comment";
/** 真實的節點。
 * 有兩種，分別用 NonLeafNode 和 LeafNode 實作。
 * 本 Node1 是它們共用的部分。
 */
class Node1 extends Node {
    constructor(p1, p2, p3, p4, p5, p6) {
        super();
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;
            this.parent = undefined;
            this.name = p1;
            this.mName = p2;
            this.condition = p3;
            this.cardinality = p4;
            this.displayAbsent = p5;
            this.description = p6;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let parent = p2;
            let ofSPec = p3;
            this.ofSpec = ofSPec;
            this.parent = parent;
            this.name = target.name;
            this.mName = target.mName !== undefined
                ? target.mName
                : target.name; // 若 undefined，同 name
            this.cardinality = target.card !== undefined
                ? Cardinality.create(target.card)
                : Cardinality.oneOne; // 若 undefined，就 1..1
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
            this.condition = null; // 先預設無前提
            if (target.cond !== undefined) { // 本 Node1 有前提
                // lookahead subjectName
                let cond = target.cond;
                let subjectName = cond.subject;
                // 不論在 IRspec, NonLeafNode, NonLeafMacro 還是 NonLeafAttachment
                // children 都是用迴圈逐步加入
                // 所以處理到本 Node1 時，parent.children 將會是本 Node1 的親哥哥親姊姊
                for (let elderSibling of parent.children) {
                    if (elderSibling instanceof CommentNode)
                        continue;
                    let e = elderSibling;
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
class NonLeafNode extends Node1 {
    constructor(p1, p2, p3, p4, p5, p6, p7, p8) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1, p2, p3, p4, p5, p6);
            this.children = p7;
            this.sourceMacro = p8;
            this.childNames = [];
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let parent = p2;
            let ofSpec = p3;
            super(p1, parent, ofSpec);
            if (Array.isArray(target.child)) {
                // 直接宣告子節點們
                this.sourceMacro = null;
                this.children = [];
                this.childNames = [];
                let nameSet = new Set();
                for (let i = 0; i < target.child.length; i++) {
                    let elmt = target.child[i];
                    // lookahead 後分流
                    if (Object.keys(elmt).includes("displayC")) {
                        let node = new CommentNode(elmt, i);
                        this.children.push(node);
                        nameSet.add(node.name);
                    }
                    else if (Object.keys(elmt).includes("child")) {
                        let node = new NonLeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);
                    }
                    else {
                        let node = new LeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);
                        if (node.type instanceof CodeType) {
                            // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                            let prefix = node.mName + Attachment.sep;
                            for (let n of node.type.getAttachNames(prefix)) {
                                nameSet.add(n);
                            }
                        }
                    }
                }
                this.childNames = Array.from(nameSet);
            }
            else {
                // 借助巨集宣告子節點們
                this.sourceMacro = ofSpec === null
                    ? MacroMap.getGlobal(target.child) // 借助全域巨集
                    : ofSpec.macros.get(target.child); // 借助區域巨集
                this.children = this.sourceMacro.children;
                this.childNames = this.sourceMacro.childNames;
            }
        }
    }
    accept(visitor, ...data) {
        return visitor.visitNonLeafNode(this, ...data);
    }
}
/** 終端節點。
 */
class LeafNode extends Node1 {
    constructor(p1, p2, p3, p4, p5, p6, p7, p8, p9) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1, p2, p3, p4, p5, p6);
            this.type = p7;
            this.isKey = p8;
            this.sourceMacro = p9;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let parent = p2;
            let ofSpec = p3;
            super(p1, parent, ofSpec);
            this.isKey = (target.isKey === undefined) ? false : target.isKey;
            let type;
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
                                                    : /* 上述 10 個之外，即 macro */ undefined // 暫時註記
            ;
            if (type !== undefined) {
                // 直接宣告資料型態
                this.sourceMacro = null;
                this.type = type;
            }
            else {
                // 借助巨集宣告資料型態
                this.sourceMacro = ofSpec === null
                    ? MacroMap.getGlobal(target.type) // 借助全域巨集
                    : ofSpec.macros.get(target.type); // 借助區域巨集
                this.type = this.sourceMacro.type;
            }
        }
    }
    accept(visitor, ...data) {
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
class Condition {
    constructor(p1, p2, p3) {
        if (typeof p2 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofNode = undefined;
            this.subject = p1;
            this.operator = p2;
            this.value = p3;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let subject = p1;
            let target = p2;
            let ofNode = p3;
            this.ofNode = ofNode;
            this.subject = subject;
            this.operator = target.operator;
            if (this.operator === "exist") {
                this.value = target.value;
            }
            else if (subject instanceof LeafNode && subject.type instanceof CodeType) {
                if (typeof target.value === "string") {
                    // this.value = <Option>this.getOption(subject.type.options, target.value);
                    this.value = subject.type.getOption(target.value);
                }
                else {
                    this.value = [];
                    for (let elmt of target.value) {
                        // this.value.push(<Option>this.getOption(subject.type.options, elmt));
                        this.value.push(subject.type.getOption(elmt));
                    }
                }
            }
            else if (subject instanceof LeafNode && subject.type instanceof DateBoundType) {
                if (typeof target.value === "string") {
                    this.value = moment__WEBPACK_IMPORTED_MODULE_0___default()(target.value);
                }
                else {
                    let dates = target.value;
                    this.value = [moment__WEBPACK_IMPORTED_MODULE_0___default()(dates[0]), moment__WEBPACK_IMPORTED_MODULE_0___default()(dates[1])];
                }
            }
            else /* DecimalType, IntegerType 或 BooleanType */ {
                this.value = target.value;
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
    toString() {
        let subject = `標的(${this.subject.name})`;
        let result = "";
        switch (this.operator) {
            case "exist":
                return (this.value === true) ? `${subject}存在`
                    : (this.value === false) ? `${subject}不存在`
                        : "理當不會出現此訊息 1";
            case "ge":
                result += (typeof this.value === "number") ? this.value
                    : (Object(moment__WEBPACK_IMPORTED_MODULE_0__["isMoment"])(this.value)) ? this.value.format("YYYY-MM-DD")
                        : "理當不會出現此訊息 2";
                result += ` <= ${subject}`;
                return result;
            case "lt":
                result += `${subject} < `;
                result += (typeof this.value === "number") ? this.value
                    : (Object(moment__WEBPACK_IMPORTED_MODULE_0__["isMoment"])(this.value)) ? this.value.format("YYYY-MM-DD")
                        : "理當不會出現此訊息 3";
                return result;
            case "btw":
                if (!Array.isArray(this.value)) {
                    return "理當不會出現此訊息 4";
                }
                result += (typeof this.value[0] === "number") ? this.value[0]
                    : (Object(moment__WEBPACK_IMPORTED_MODULE_0__["isMoment"])(this.value[0])) ? this.value[0].format("YYYY-MM-DD")
                        : "理當不會出現此訊息 5";
                result += ` <= ${subject} < `;
                result += (typeof this.value[1] === "number") ? this.value[1]
                    : (Object(moment__WEBPACK_IMPORTED_MODULE_0__["isMoment"])(this.value[1])) ? this.value[1].format("YYYY-MM-DD")
                        : "理當不會出現此訊息 6";
                return result;
            case "eq":
                return (this.value === true) ? `${subject}為真`
                    : (this.value === false) ? `${subject}為偽`
                        : "理當不會出現此訊息 7";
            case "has":
                return (this.value instanceof Option) ? `${subject}有${JSON.stringify(this.value.code)}`
                    : "理當不會出現此訊息 8";
            case "anyIn":
            case "allNotIn":
                if (Array.isArray(this.value) && this.value[0] instanceof Option) {
                    for (let elmt of this.value) {
                        result += `,"${elmt.code}"`;
                    }
                    return (this.operator === "anyIn")
                        ? `${subject}有任一[${result.substring(1)}]`
                        : `${subject}全無[${result.substring(1)}]`;
                }
                else {
                    return "理當不會出現此訊息 9";
                }
            default:
                return "理當不會出現此訊息 10";
        }
    }
    accept(visitor, ...data) {
        return visitor.visitCondition(this, ...data);
    }
}
/** 基數。
 * 因為最常出現的基數不外乎 0..1, 1..1, 0..*, 1..* 等少數幾種，
 * 本 Cardinality 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class Cardinality {
    /** 已排除四種最常見的 Cardinality。
     * @param lower 本 Cardinality 的下限 (含)。
     * @param upper 本 Cardinality 的上限 (含)。
     */
    constructor(lower, upper) {
        this.lower = lower;
        this.upper = upper;
    }
    static create(p1, p2) {
        if (typeof p1 === "number") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            let upper = p2;
            if (p1 === 0 && upper === 1)
                return Cardinality.zeroOne;
            if (p1 === 1 && upper === 1)
                return Cardinality.oneOne;
            if (p1 === 0 && upper === Number.MAX_SAFE_INTEGER)
                return Cardinality.zeroMany;
            if (p1 === 1 && upper === Number.MAX_SAFE_INTEGER)
                return Cardinality.oneMany;
            return new Cardinality(p1, upper);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            if (target === undefined) {
                return Cardinality.oneOne;
            }
            else {
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
                        let dotdot = target.indexOf("..");
                        let uString = target.substring(dotdot + 2);
                        let lower = parseInt(target.substring(0, dotdot));
                        let upper = (uString === "*")
                            ? Number.MAX_SAFE_INTEGER
                            : parseInt(uString);
                        return new Cardinality(lower, upper);
                }
            }
        }
    }
    toString() {
        return this.upper === Number.MAX_SAFE_INTEGER
            ? `${this.lower}..*`
            : `${this.lower}..${this.upper}`;
    }
    accept(visitor, ...data) {
        return visitor.visitCardinality(this, ...data);
    }
}
/** 最常見的 Cardinalities。
 */
Cardinality.zeroOne = new Cardinality(0, 1);
Cardinality.oneOne = new Cardinality(1, 1);
Cardinality.zeroMany = new Cardinality(0, Number.MAX_SAFE_INTEGER);
Cardinality.oneMany = new Cardinality(1, Number.MAX_SAFE_INTEGER);
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
class Type {
    /**
     * @param name 目的只是為了印出訊息時可以方便知道是哪種型態，
     *             雖然從各個 subclass name 就足以判斷是哪種型態。
     */
    constructor(name) {
        this.name = name;
    }
}
/** 有數值 lower 或 upper 參數的資料型態。
 * 包含 decimal, integer, string, markdown。
 */
class NumberBoundType extends Type {
    /**
     * @param lower 本 NumberBoundType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 NumberBoundType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param name 目的只是為了印出訊息時可以方便知道是哪種型態，
     *             雖然從各個 subclass name 就足以判斷是哪種型態。
     */
    constructor(lower, upper, name) {
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
    static deUndefined(target0) {
        let target = target0;
        let lower = target.lower !== undefined
            ? target.lower
            : null;
        let upper = target.upper !== undefined
            ? target.upper
            : null;
        let defaultValue = target.default !== undefined
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
class DecimalType extends NumberBoundType {
    /**
     * @param lower 本 DecimalType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 DecimalType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 DecimalType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    constructor(lower, upper, defaultValue) {
        super(lower, upper, "decimal");
        this.defaultValue = defaultValue;
    }
    static create(p1, p2, p3) {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const lower = p1 || null;
            const upper = p2 !== null && p2 !== void 0 ? p2 : null;
            const defaultValue = p3 !== null && p3 !== void 0 ? p3 : null;
            return (lower === null && upper === null && defaultValue === null)
                ? DecimalType.noArg
                : new DecimalType(lower, upper, defaultValue);
            // return (p1 === null && p2 === null && p3 === null)
            //      ? DecimalType.noArg
            //      : new DecimalType(p1, <number | null>p2, <number | null>p3);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue] = NumberBoundType.deUndefined(p1);
            return (lower === null && upper === null && defaultValue === null)
                ? DecimalType.noArg
                : new DecimalType(lower, upper, defaultValue);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitDecimalType(this, ...data);
    }
}
/** 無參數的 decimal。
 */
DecimalType.noArg = new DecimalType(null, null, null);
/** integer 型態。
 * 可以有整數的 lower 或 upper，代表此 integer 的下限(含) 和上限(不含)。
 * 如 lower=-1, upper=3 則合規的為 -1, 0, 1, 2。
 * 因為最常出現的是沒有參數的，本 IntegerType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class IntegerType extends NumberBoundType {
    /**
     * @param lower 本 IntegerType 的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 IntegerType 的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 IntegerType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    constructor(lower, upper, defaultValue) {
        super(lower, upper, "integer");
        this.defaultValue = defaultValue;
    }
    static create(p1, p2, p3) {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const lower = p1 || null;
            const upper = p2 !== null && p2 !== void 0 ? p2 : null;
            const defaultValue = p3 !== null && p3 !== void 0 ? p3 : null;
            return (lower === null && upper === null && defaultValue === null)
                ? IntegerType.noArg
                : new IntegerType(lower, upper, defaultValue);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue] = NumberBoundType.deUndefined(p1);
            return (lower === null && upper === null && defaultValue === null)
                ? IntegerType.noArg
                : new IntegerType(lower, upper, defaultValue);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitIntegerType(this, ...data);
    }
}
/** 無參數的 integer。
 */
IntegerType.noArg = new IntegerType(null, null, null);
/** string 型態。
 * 可以有非負整數的 lower 或 upper，代表此 string 長度的下限(含) 和上限(不含)。
 * 如 lower=0, upper=3 則合規的長度為 0, 1, 2。
 * 因為最常出現的是沒有參數的，本 StringType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class StringType extends NumberBoundType {
    /**
     * @param lower 本 StringType 長度的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 StringType 長度的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 StringType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    constructor(lower, upper, defaultValue) {
        super(lower, upper, "string");
        this.defaultValue = defaultValue;
    }
    static create(p1, p2, p3) {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const lower = p1 || null;
            const upper = p2 !== null && p2 !== void 0 ? p2 : null;
            const defaultValue = p3 !== null && p3 !== void 0 ? p3 : null;
            return (lower === null && upper === null && defaultValue === null)
                ? StringType.noArg
                : new StringType(lower, upper, defaultValue);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue] = NumberBoundType.deUndefined(p1);
            return (lower === null && upper === null && defaultValue === null)
                ? StringType.noArg
                : new StringType(lower, upper, defaultValue);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitStringType(this, ...data);
    }
}
/** 無參數的 string。
 */
StringType.noArg = new StringType(null, null, null);
/** markdown 型態。
 * 可以有非負整數的 lower 或 upper，代表此 markdown 長度的下限(含) 和上限(不含)。
 * 如 lower=10, upper=13 則合規的長度為 10, 11, 12。
 * 因為最常出現的是沒有參數的，本 MarkdownType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class MarkdownType extends NumberBoundType {
    /**
     * @param lower 本 MarkdownType 長度的下限 (含)。
     *              null 代表沒有規範。
     * @param upper 本 MarkdownType 長度的上限 (不含)。
     *              null 代表沒有規範。
     * @param defaultValue 本 MarkdownType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    constructor(lower, upper, defaultValue) {
        super(lower, upper, "markdown");
        this.defaultValue = defaultValue;
    }
    static create(p1, p2, p3) {
        if (typeof p1 === "number" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const lower = p1 || null;
            const upper = p2 !== null && p2 !== void 0 ? p2 : null;
            const defaultValue = p3 !== null && p3 !== void 0 ? p3 : null;
            return (lower === null && upper === null && defaultValue === null)
                ? MarkdownType.noArg
                : new MarkdownType(lower, upper, defaultValue);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let [lower, upper, defaultValue] = NumberBoundType.deUndefined(p1);
            return (lower === null && upper === null && defaultValue === null)
                ? MarkdownType.noArg
                : new MarkdownType(lower, upper, defaultValue);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitMarkdownType(this, ...data);
    }
}
/** 無參數的 markdown。
 */
MarkdownType.noArg = new MarkdownType(null, null, null);
/** 有日期 lower 或 upper 參數的資料型態。
 * 包含 date, dateTime。
 */
class DateBoundType extends Type {
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
    constructor(lower, upper, name) {
        super(name);
        this.lower = lower;
        this.upper = upper;
    }
    static deUndefined(target0) {
        let target = target0;
        let mustHave = target.mustHave === undefined // v2.2 新增
            ? DatePrecision.Y // v2.2 新增
            : target.mustHave; // v2.2 新增
        let lower = target.lower === undefined
            ? null
            : moment__WEBPACK_IMPORTED_MODULE_0___default()(target.lower);
        let upper = target.upper === undefined
            ? null
            : moment__WEBPACK_IMPORTED_MODULE_0___default()(target.upper);
        let defaultValue = target.default === undefined
            ? null
            : target.default;
        return [mustHave, lower, upper, defaultValue]; // v2.2 異動
    }
}
/** DateType 和 DateTimeTime 的最低精確度。
 * @see VisitorFormIO.visitDateTimeType
 */
var DatePrecision;
(function (DatePrecision) {
    DatePrecision[DatePrecision["Y"] = 0] = "Y";
    DatePrecision[DatePrecision["YM"] = 1] = "YM";
    DatePrecision[DatePrecision["YMD"] = 2] = "YMD";
    DatePrecision[DatePrecision["YMDT"] = 3] = "YMDT";
})(DatePrecision || (DatePrecision = {}));
/** date 型態。
 * 可以有日期的 lower 或 upper，代表此 date 的下限(含) 和上限(不含)。
 * 如 lower="2024-01-01", upper="2024-02-01" 則合規的為 2024-01-01 到 2024-01-31。
 * 因為最常出現的是沒有參數的，本 DateType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class DateType extends DateBoundType {
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
    constructor(mustHave, // v2.2 新增
    lower, upper, defaultValue) {
        super(lower, upper, "date");
        this.mustHave = mustHave; // v2.2 新增
        this.defaultValue = defaultValue;
    }
    static create(p1, // v2.2 新增，更新函式內相關程式碼
    p2, p3, p4) {
        let mustHave;
        let lower;
        let upper;
        let defaultValue;
        if (typeof p1 === "number") { // enum 用 number 編碼
            // 由 StructMD-IRspec Compiler 逐步堆疊
            mustHave = p1;
            lower = p2;
            upper = p3;
            defaultValue = p4;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            [mustHave, lower, upper, defaultValue] = DateBoundType.deUndefined(p1);
        }
        if (lower !== null || upper !== null || defaultValue !== null) {
            return new DateType(mustHave, lower, upper, defaultValue);
        }
        else {
            return mustHave === DatePrecision.Y ? DateType.noArgY
                : mustHave === DatePrecision.YM ? DateType.noArgYM
                    : DateType.noArgYMD;
        }
    }
    accept(visitor, ...data) {
        return visitor.visitDateType(this, ...data);
    }
}
/** 無參數的 dateTime，註明 mustHave = Y。
 */
DateType.noArgY = new DateType(DatePrecision.Y, null, null, null);
/** 無參數的 dateTime，註明 mustHave = YM。
 */
DateType.noArgYM = new DateType(DatePrecision.YM, null, null, null);
/** 無參數的 dateTime，註明 mustHave = YMD。
 */
DateType.noArgYMD = new DateType(DatePrecision.YMD, null, null, null);
// 以上三個為 v2.2 新增；底下一個保留 v2.1 的，即視為 mustHave = Y (雖然好像不必)
/** 無參數的 date。
 */
DateType.noArg = DateType.noArgY;
/** dateTime 型態。
 * 可以有日期的 lower 或 upper，代表此 dateTime 的下限(含) 和上限(不含)。
 * 如 lower="2024-01-01", upper="2024-02-01" 則合規的為 2024-01-01T00:00:00 到 2024-01-31T23:59:59。
 * 因為最常出現的是沒有參數的，本 DateTimeType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class DateTimeType extends DateBoundType {
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
    constructor(mustHave, // v2.2 新增
    lower, upper, defaultValue) {
        super(lower, upper, "dateTime");
        this.mustHave = mustHave; // v2.2 新增
        this.defaultValue = defaultValue;
    }
    static create(p1, // v2.2 新增，更新函式內相關程式碼
    p2, p3, p4) {
        let mustHave;
        let lower;
        let upper;
        let defaultValue;
        if (typeof p1 === "number") { // enum 用 number 編碼
            // 由 StructMD-IRspec Compiler 逐步堆疊
            mustHave = p1;
            lower = p2;
            upper = p3;
            defaultValue = p4;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            [mustHave, lower, upper, defaultValue] = DateBoundType.deUndefined(p1);
        }
        if (lower !== null || upper !== null || defaultValue !== null) {
            return new DateTimeType(mustHave, lower, upper, defaultValue);
        }
        else {
            return mustHave === DatePrecision.Y ? DateTimeType.noArgY
                : mustHave === DatePrecision.YM ? DateTimeType.noArgYM
                    : mustHave === DatePrecision.YMD ? DateTimeType.noArgYMD
                        : DateTimeType.noArgYMDT;
        }
    }
    accept(visitor, ...data) {
        return visitor.visitDateTimeType(this, ...data);
    }
}
/** 無參數的 dateTime，註明 mustHave = Y。
 */
DateTimeType.noArgY = new DateTimeType(DatePrecision.Y, null, null, null);
/** 無參數的 dateTime，註明 mustHave = YM。
 */
DateTimeType.noArgYM = new DateTimeType(DatePrecision.YM, null, null, null);
/** 無參數的 dateTime，註明 mustHave = YMD。
 */
DateTimeType.noArgYMD = new DateTimeType(DatePrecision.YMD, null, null, null);
/** 無參數的 dateTime，註明 mustHave = YMDT。
 */
DateTimeType.noArgYMDT = new DateTimeType(DatePrecision.YMDT, null, null, null);
// 以上四個為 v2.2 新增；底下一個保留 v2.1 的，即視為 mustHave = Y (雖然好像不必)
/** 無參數的 dateTime。
 */
DateTimeType.noArg = DateTimeType.noArgY;
/** time 型態。
 * 因為最常出現的是沒有參數的，本 DateType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class TimeType extends Type {
    /**
     * @param defaultValue 本 TimeType 的預設值。
     *                     若為 hh:mm:ss 代表特定時間，其他為特殊預設值，目前只開放 "now" 代表輸入時。
     *                     null 代表沒有指定預設值。
     */
    constructor(defaultValue) {
        super("time");
        this.defaultValue = defaultValue;
    }
    static create(p1) {
        if (typeof p1 === "string" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const defaultValue = p1 || null;
            return (defaultValue === null)
                ? TimeType.noArg
                : new TimeType(defaultValue);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let defaultValue = target.default !== undefined
                ? target.default
                : null;
            return (defaultValue === null)
                ? TimeType.noArg
                : new TimeType(defaultValue);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitTimeType(this, ...data);
    }
}
/** 無參數的 time。
 */
TimeType.noArg = new TimeType(null);
/** base64Binary 型態。
 * 因為最常出現的是沒有參數的，本 Base64BinaryType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class Base64BinaryType extends Type {
    /**
     * @param defaultValue 本 Base64BinaryType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    constructor(defaultValue) {
        super("base64Binary");
        this.defaultValue = defaultValue;
    }
    static create(p1) {
        if (typeof p1 === "string" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const defaultValue = p1 || null;
            return (defaultValue === null)
                ? Base64BinaryType.noArg
                : new Base64BinaryType(defaultValue);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let defaultValue = target.default !== undefined
                ? target.default
                : null;
            return (defaultValue === null)
                ? Base64BinaryType.noArg
                : new Base64BinaryType(defaultValue);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitBase64BinaryType(this, ...data);
    }
}
/** 無參數的 base64Binary。
 */
Base64BinaryType.noArg = new Base64BinaryType(null);
/** boolean 型態。
 * 因為最常出現的是沒有參數的，本 BooleanType 引用 Static Factory Marthod Design Pattern。
 * 提供 public 的 create()，然後把 constructor() 設為 private。
 */
class BooleanType extends Type {
    /**
     * @param displayTrue  當 StructMD-IR 中對應的數值為真時，顯示的文字。
     *                     null 代表直接印出 true;
     * @param displayFalse 當 StructMD-IR 中對應的數值為偽時，顯示的文字。
     *                     null 代表直接印出 false。
     * @param defaultValue 本 BooleanType 的預設值。
     *                     null 代表沒有指定預設值。
     */
    constructor(displayTrue, displayFalse, defaultValue) {
        super("boolean");
        this.displayTrue = displayTrue;
        this.displayFalse = displayFalse;
        this.defaultValue = defaultValue;
    }
    static create(p1, p2, p3) {
        if (typeof p1 === "string" || p1 === null) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            const displayTrue = p1 || null;
            return (p1 === null && p2 === null && p3 === null)
                ? BooleanType.noArg
                : new BooleanType(displayTrue, p2, p3);
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let displayT = target.displayT !== undefined
                ? target.displayT
                : null;
            let displayF = target.displayF !== undefined
                ? target.displayF
                : null;
            let defaultValue = target.default !== undefined
                ? target.default
                : null;
            return (displayT === null && displayF === null && defaultValue === null)
                ? BooleanType.noArg
                : new BooleanType(displayT, displayF, defaultValue);
        }
    }
    accept(visitor, ...data) {
        return visitor.visitBooleanType(this, ...data);
    }
}
/** 無參數的 boolean。
 */
BooleanType.noArg = new BooleanType(null, null, null);
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
class CodeType extends Type {
    constructor(p1, p2) {
        super("code");
        if (Array.isArray(p1) && p1[0] instanceof Option) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofSpec = undefined;
            this.options = p1;
            this.defaults = p2;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let target = p1;
            let ofSpec = p2;
            let attach = target.attach !== undefined
                ? target.attach
                : [];
            this.ofSpec = ofSpec;
            this.options = [];
            for (let elmt of target.option) {
                this.options.push(new Option(this, elmt, attach));
            }
            if (target.default === undefined) {
                this.defaults = null;
            }
            else {
                this.defaults = [];
                for (let codeString of target.default) {
                    this.defaults.push(this.getOption(codeString));
                }
            }
        }
    }
    getAttachNames(prefix) {
        let result = [];
        for (let option of this.options) {
            if (option.attachment !== null) {
                // let p: string = prefix + option.code;    v2.2 異動
                let p = prefix + option.seqno;
                result.push(p);
                if (option.attachment instanceof LeafAttachment
                    && option.attachment.type instanceof CodeType) {
                    result.push(...option.attachment.type.getAttachNames(p + Attachment.sep));
                }
            }
        }
        return result;
    }
    accept(visitor, ...data) {
        return visitor.visitCodeType(this, ...data);
    }
    /** 從本 CodeType 中比對出 Option。
     * @param codeOrDisplay
     */
    getOption(codeOrDisplay) {
        // lazy initialization
        if (this.optionMap === undefined) {
            this.optionMap = new Map();
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
class Option {
    constructor(p1, p2, p3, // v2.2 因應新增 seqno 異動
    p4, // v2.2 因應新增 seqno 異動
    p5) {
        if (typeof p1 === "string") {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.ofCodeType = undefined;
            this.code = p1;
            this.display = p2;
            this.seqno = p3; // v2.2 新增
            this.snomeds = p4; // v2.2 因應新增 seqno 異動
            this.attachment = p5; // v2.2 因應新增 seqno 異動
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let ofCodeType = p1;
            // let optionTarget = <string | object>p2;  // v2.2 異動
            let optionTarget = p2; // v2.2 異動
            let attachArray = p3;
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
            let attachTarget = null; // 先設定為沒有前提
            for (let elmt of attachArray) { // 再從 attachArray 查找
                let x = elmt;
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
            }
            else {
                this.attachment = null;
            }
        }
    }
    accept(visitor, ...data) {
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
class Attachment {
    constructor(p1, p2, p3, p4) {
        if (p2 instanceof Cardinality) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            this.subject = p1;
            this.cardinality = p2;
            this.displayAbsent = p3;
            this.description = p4;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let subject = p1;
            let target = p2;
            this.subject = subject;
            this.cardinality = Cardinality.create(target.card); // create() 會處理 undefined
            this.displayAbsent = target.display0 !== undefined
                ? target.display0
                : null;
            this.description = target.desc !== undefined
                ? target.desc
                : null;
        }
    }
}
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
Attachment.sep = "_OpT_"; // 因應 Form.io 的 API propertyName 必須是 identifier
/** CodeType 的 Option 的補充複雜說明，包含子節點們。
 * 類似沒有名稱的 NonLeafNode。
 */
class NonLeafAttachment extends Attachment {
    constructor(p1, p2, p3, p4, p5, p6) {
        if (p2 instanceof Cardinality) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1, p2, p3, p4);
            this.children = p5;
            this.sourceMacro = p6;
            this.childNames = [];
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let subject = p1;
            let target = p2;
            super(subject, p2);
            // 從 subject: Option 的 ofCodeType 找到 CodeType
            // 在從 CodeType 的 ofSpec 找到歸屬的 IRspec 或 null (當宣告全域巨集時)
            let ofCodeType = subject.ofCodeType;
            let ofSpec = ofCodeType.ofSpec;
            if (Array.isArray(target.child)) {
                // 直接宣告子節點們
                this.sourceMacro = null;
                this.children = [];
                this.childNames = [];
                let nameSet = new Set();
                for (let i = 0; i < target.child.length; i++) {
                    let elmt = target.child[i];
                    // lookahead 後分流
                    if (Object.keys(elmt).includes("displayC")) {
                        let node = new CommentNode(elmt, i);
                        this.children.push(node);
                        nameSet.add(node.name);
                    }
                    else if (Object.keys(elmt).includes("child")) {
                        let node = new NonLeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);
                    }
                    else {
                        let node = new LeafNode(elmt, this, ofSpec);
                        this.children.push(node);
                        nameSet.add(node.name);
                        nameSet.add(node.mName);
                        if (node.type instanceof CodeType) {
                            // let prefix: string = `${Attachment.prefix}_${node.mName}`;
                            let prefix = node.mName + Attachment.sep;
                            for (let n of node.type.getAttachNames(prefix)) {
                                nameSet.add(n);
                            }
                        }
                    }
                }
                this.childNames = Array.from(nameSet);
            }
            else {
                // 借助巨集宣告子節點們
                this.sourceMacro = ofSpec === null
                    ? MacroMap.getGlobal(target.child) // 借助全域巨集
                    : ofSpec.macros.get(target.child); // 借助區域巨集
                this.children = this.sourceMacro.children;
                this.childNames = this.sourceMacro.childNames;
            }
        }
    }
    accept(visitor, ...data) {
        return visitor.visitNonLeafAttachment(this, ...data);
    }
}
/** CodeType 的 Option 的簡易說明，只有一個欄位。
 * 類似沒有名稱的 LeafNode。
 */
class LeafAttachment extends Attachment {
    constructor(p1, p2, p3, p4, p5, p6) {
        if (p2 instanceof Cardinality) {
            // 由 StructMD-IRspec Compiler 逐步堆疊
            super(p1, p2, p3, p4);
            this.type = p5;
            this.sourceMacro = p6;
        }
        else {
            // 由 StructMD-IR Toolkit 載入
            let subject = p1;
            let target = p2;
            super(subject, p2);
            // 從 subject: Option 的 ofCodeType 找到 CodeType
            // 在從 CodeType 的 ofSpec 找到歸屬的 IRspec 或 null (當宣告全域巨集時)
            let ofCodeType = subject.ofCodeType;
            let ofSpec = ofCodeType.ofSpec;
            let type;
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
                                                    : /* 上述 10 個之外，即 macro */ undefined // 暫時註記
            ;
            if (type !== undefined) {
                // 直接宣告資料型態
                this.sourceMacro = null;
                this.type = type;
            }
            else {
                // 借助巨集宣告資料型態
                this.sourceMacro = ofSpec === null
                    ? MacroMap.getGlobal(target.type) // 借助全域巨集
                    : ofSpec.macros.get(target.type); // 借助區域巨集
                this.type = this.sourceMacro.type;
            }
        }
    }
    accept(visitor, ...data) {
        return visitor.visitLeafAttachment(this, ...data);
    }
}


/***/ }),

/***/ "JUOo":
/*!*************************************************!*\
  !*** ./src/app/smart-auth/smart-auth.module.ts ***!
  \*************************************************/
/*! exports provided: SmartAuthModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SmartAuthModule", function() { return SmartAuthModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _launch_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./launch.component */ "SsXV");
/* harmony import */ var _fhir_client_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fhir-client.service */ "hAIa");





class SmartAuthModule {
}
SmartAuthModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: SmartAuthModule });
SmartAuthModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function SmartAuthModule_Factory(t) { return new (t || SmartAuthModule)(); }, providers: [_fhir_client_service__WEBPACK_IMPORTED_MODULE_3__["FhirClientService"]], imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](SmartAuthModule, { declarations: [_launch_component__WEBPACK_IMPORTED_MODULE_2__["LaunchComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SmartAuthModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_launch_component__WEBPACK_IMPORTED_MODULE_2__["LaunchComponent"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
                ],
                providers: [_fhir_client_service__WEBPACK_IMPORTED_MODULE_3__["FhirClientService"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "L/fE":
/*!*********************************************************************!*\
  !*** ./src/app/questionnaire-center/questionnaire-center.module.ts ***!
  \*********************************************************************/
/*! exports provided: QuestionnaireCenterModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuestionnaireCenterModule", function() { return QuestionnaireCenterModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _formio_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @formio/angular */ "oiZh");
/* harmony import */ var formiojs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! formiojs */ "Mr5W");
/* harmony import */ var formiojs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(formiojs__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _questionnaire_center_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./questionnaire-center.component */ "vOHG");



// formio 用




formiojs__WEBPACK_IMPORTED_MODULE_4__["Formio"].cdn.setBaseUrl('/web/cdn/formio');
_formio_angular__WEBPACK_IMPORTED_MODULE_3__["Templates"].framework = 'bootstrap3';
class QuestionnaireCenterModule {
}
QuestionnaireCenterModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: QuestionnaireCenterModule });
QuestionnaireCenterModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function QuestionnaireCenterModule_Factory(t) { return new (t || QuestionnaireCenterModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
            _formio_angular__WEBPACK_IMPORTED_MODULE_3__["FormioModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](QuestionnaireCenterModule, { declarations: [_questionnaire_center_component__WEBPACK_IMPORTED_MODULE_5__["QuestionnaireCenterComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
        _formio_angular__WEBPACK_IMPORTED_MODULE_3__["FormioModule"]], exports: [_questionnaire_center_component__WEBPACK_IMPORTED_MODULE_5__["QuestionnaireCenterComponent"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](QuestionnaireCenterModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_questionnaire_center_component__WEBPACK_IMPORTED_MODULE_5__["QuestionnaireCenterComponent"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                    _formio_angular__WEBPACK_IMPORTED_MODULE_3__["FormioModule"]
                ],
                exports: [_questionnaire_center_component__WEBPACK_IMPORTED_MODULE_5__["QuestionnaireCenterComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "RnhZ":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "K/tc",
	"./af.js": "K/tc",
	"./ar": "jnO4",
	"./ar-dz": "o1bE",
	"./ar-dz.js": "o1bE",
	"./ar-kw": "Qj4J",
	"./ar-kw.js": "Qj4J",
	"./ar-ly": "HP3h",
	"./ar-ly.js": "HP3h",
	"./ar-ma": "CoRJ",
	"./ar-ma.js": "CoRJ",
	"./ar-sa": "gjCT",
	"./ar-sa.js": "gjCT",
	"./ar-tn": "bYM6",
	"./ar-tn.js": "bYM6",
	"./ar.js": "jnO4",
	"./az": "SFxW",
	"./az.js": "SFxW",
	"./be": "H8ED",
	"./be.js": "H8ED",
	"./bg": "hKrs",
	"./bg.js": "hKrs",
	"./bm": "p/rL",
	"./bm.js": "p/rL",
	"./bn": "kEOa",
	"./bn-bd": "loYQ",
	"./bn-bd.js": "loYQ",
	"./bn.js": "kEOa",
	"./bo": "0mo+",
	"./bo.js": "0mo+",
	"./br": "aIdf",
	"./br.js": "aIdf",
	"./bs": "JVSJ",
	"./bs.js": "JVSJ",
	"./ca": "1xZ4",
	"./ca.js": "1xZ4",
	"./cs": "PA2r",
	"./cs.js": "PA2r",
	"./cv": "A+xa",
	"./cv.js": "A+xa",
	"./cy": "l5ep",
	"./cy.js": "l5ep",
	"./da": "DxQv",
	"./da.js": "DxQv",
	"./de": "tGlX",
	"./de-at": "s+uk",
	"./de-at.js": "s+uk",
	"./de-ch": "u3GI",
	"./de-ch.js": "u3GI",
	"./de.js": "tGlX",
	"./dv": "WYrj",
	"./dv.js": "WYrj",
	"./el": "jUeY",
	"./el.js": "jUeY",
	"./en-au": "Dmvi",
	"./en-au.js": "Dmvi",
	"./en-ca": "OIYi",
	"./en-ca.js": "OIYi",
	"./en-gb": "Oaa7",
	"./en-gb.js": "Oaa7",
	"./en-ie": "4dOw",
	"./en-ie.js": "4dOw",
	"./en-il": "czMo",
	"./en-il.js": "czMo",
	"./en-in": "7C5Q",
	"./en-in.js": "7C5Q",
	"./en-nz": "b1Dy",
	"./en-nz.js": "b1Dy",
	"./en-sg": "t+mt",
	"./en-sg.js": "t+mt",
	"./eo": "Zduo",
	"./eo.js": "Zduo",
	"./es": "iYuL",
	"./es-do": "CjzT",
	"./es-do.js": "CjzT",
	"./es-mx": "tbfe",
	"./es-mx.js": "tbfe",
	"./es-us": "Vclq",
	"./es-us.js": "Vclq",
	"./es.js": "iYuL",
	"./et": "7BjC",
	"./et.js": "7BjC",
	"./eu": "D/JM",
	"./eu.js": "D/JM",
	"./fa": "jfSC",
	"./fa.js": "jfSC",
	"./fi": "gekB",
	"./fi.js": "gekB",
	"./fil": "1ppg",
	"./fil.js": "1ppg",
	"./fo": "ByF4",
	"./fo.js": "ByF4",
	"./fr": "nyYc",
	"./fr-ca": "2fjn",
	"./fr-ca.js": "2fjn",
	"./fr-ch": "Dkky",
	"./fr-ch.js": "Dkky",
	"./fr.js": "nyYc",
	"./fy": "cRix",
	"./fy.js": "cRix",
	"./ga": "USCx",
	"./ga.js": "USCx",
	"./gd": "9rRi",
	"./gd.js": "9rRi",
	"./gl": "iEDd",
	"./gl.js": "iEDd",
	"./gom-deva": "qvJo",
	"./gom-deva.js": "qvJo",
	"./gom-latn": "DKr+",
	"./gom-latn.js": "DKr+",
	"./gu": "4MV3",
	"./gu.js": "4MV3",
	"./he": "x6pH",
	"./he.js": "x6pH",
	"./hi": "3E1r",
	"./hi.js": "3E1r",
	"./hr": "S6ln",
	"./hr.js": "S6ln",
	"./hu": "WxRl",
	"./hu.js": "WxRl",
	"./hy-am": "1rYy",
	"./hy-am.js": "1rYy",
	"./id": "UDhR",
	"./id.js": "UDhR",
	"./is": "BVg3",
	"./is.js": "BVg3",
	"./it": "bpih",
	"./it-ch": "bxKX",
	"./it-ch.js": "bxKX",
	"./it.js": "bpih",
	"./ja": "B55N",
	"./ja.js": "B55N",
	"./jv": "tUCv",
	"./jv.js": "tUCv",
	"./ka": "IBtZ",
	"./ka.js": "IBtZ",
	"./kk": "bXm7",
	"./kk.js": "bXm7",
	"./km": "6B0Y",
	"./km.js": "6B0Y",
	"./kn": "PpIw",
	"./kn.js": "PpIw",
	"./ko": "Ivi+",
	"./ko.js": "Ivi+",
	"./ku": "JCF/",
	"./ku.js": "JCF/",
	"./ky": "lgnt",
	"./ky.js": "lgnt",
	"./lb": "RAwQ",
	"./lb.js": "RAwQ",
	"./lo": "sp3z",
	"./lo.js": "sp3z",
	"./lt": "JvlW",
	"./lt.js": "JvlW",
	"./lv": "uXwI",
	"./lv.js": "uXwI",
	"./me": "KTz0",
	"./me.js": "KTz0",
	"./mi": "aIsn",
	"./mi.js": "aIsn",
	"./mk": "aQkU",
	"./mk.js": "aQkU",
	"./ml": "AvvY",
	"./ml.js": "AvvY",
	"./mn": "lYtQ",
	"./mn.js": "lYtQ",
	"./mr": "Ob0Z",
	"./mr.js": "Ob0Z",
	"./ms": "6+QB",
	"./ms-my": "ZAMP",
	"./ms-my.js": "ZAMP",
	"./ms.js": "6+QB",
	"./mt": "G0Uy",
	"./mt.js": "G0Uy",
	"./my": "honF",
	"./my.js": "honF",
	"./nb": "bOMt",
	"./nb.js": "bOMt",
	"./ne": "OjkT",
	"./ne.js": "OjkT",
	"./nl": "+s0g",
	"./nl-be": "2ykv",
	"./nl-be.js": "2ykv",
	"./nl.js": "+s0g",
	"./nn": "uEye",
	"./nn.js": "uEye",
	"./oc-lnc": "Fnuy",
	"./oc-lnc.js": "Fnuy",
	"./pa-in": "8/+R",
	"./pa-in.js": "8/+R",
	"./pl": "jVdC",
	"./pl.js": "jVdC",
	"./pt": "8mBD",
	"./pt-br": "0tRk",
	"./pt-br.js": "0tRk",
	"./pt.js": "8mBD",
	"./ro": "lyxo",
	"./ro.js": "lyxo",
	"./ru": "lXzo",
	"./ru.js": "lXzo",
	"./sd": "Z4QM",
	"./sd.js": "Z4QM",
	"./se": "//9w",
	"./se.js": "//9w",
	"./si": "7aV9",
	"./si.js": "7aV9",
	"./sk": "e+ae",
	"./sk.js": "e+ae",
	"./sl": "gVVK",
	"./sl.js": "gVVK",
	"./sq": "yPMs",
	"./sq.js": "yPMs",
	"./sr": "zx6S",
	"./sr-cyrl": "E+lV",
	"./sr-cyrl.js": "E+lV",
	"./sr.js": "zx6S",
	"./ss": "Ur1D",
	"./ss.js": "Ur1D",
	"./sv": "X709",
	"./sv.js": "X709",
	"./sw": "dNwA",
	"./sw.js": "dNwA",
	"./ta": "PeUW",
	"./ta.js": "PeUW",
	"./te": "XLvN",
	"./te.js": "XLvN",
	"./tet": "V2x9",
	"./tet.js": "V2x9",
	"./tg": "Oxv6",
	"./tg.js": "Oxv6",
	"./th": "EOgW",
	"./th.js": "EOgW",
	"./tk": "Wv91",
	"./tk.js": "Wv91",
	"./tl-ph": "Dzi0",
	"./tl-ph.js": "Dzi0",
	"./tlh": "z3Vd",
	"./tlh.js": "z3Vd",
	"./tr": "DoHr",
	"./tr.js": "DoHr",
	"./tzl": "z1FC",
	"./tzl.js": "z1FC",
	"./tzm": "wQk9",
	"./tzm-latn": "tT3J",
	"./tzm-latn.js": "tT3J",
	"./tzm.js": "wQk9",
	"./ug-cn": "YRex",
	"./ug-cn.js": "YRex",
	"./uk": "raLr",
	"./uk.js": "raLr",
	"./ur": "UpQW",
	"./ur.js": "UpQW",
	"./uz": "Loxo",
	"./uz-latn": "AQ68",
	"./uz-latn.js": "AQ68",
	"./uz.js": "Loxo",
	"./vi": "KSF8",
	"./vi.js": "KSF8",
	"./x-pseudo": "/X5v",
	"./x-pseudo.js": "/X5v",
	"./yo": "fzPg",
	"./yo.js": "fzPg",
	"./zh-cn": "XDpg",
	"./zh-cn.js": "XDpg",
	"./zh-hk": "SatO",
	"./zh-hk.js": "SatO",
	"./zh-mo": "OmwH",
	"./zh-mo.js": "OmwH",
	"./zh-tw": "kOpN",
	"./zh-tw.js": "kOpN"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "RnhZ";

/***/ }),

/***/ "SsXV":
/*!************************************************!*\
  !*** ./src/app/smart-auth/launch.component.ts ***!
  \************************************************/
/*! exports provided: LaunchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaunchComponent", function() { return LaunchComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fhirclient */ "qdye");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fhirclient__WEBPACK_IMPORTED_MODULE_1__);



class LaunchComponent {
    constructor() { }
    ngOnInit() {
        // 檢查 sessionStorage 中是否存在 iss 參數（無論是在 # 之前還是之後）
        const iss = sessionStorage.getItem('iss_self');
        const launch = sessionStorage.getItem('launch_self');
        if (iss && launch) {
            // 如果在網址列抓到了 iss，手動傳給 authorize
            fhirclient__WEBPACK_IMPORTED_MODULE_1__["oauth2"].authorize({
                clientId: 'my_web_app',
                scope: 'launch/patient openid fhirUser patient/*.read patient/*.write',
                redirectUri: '#/questionnaire-center',
                iss: iss,
                launch: launch
            });
        }
        else {
            // 如果沒抓到，嘗試讓套件自己抓（原本的邏輯）
            fhirclient__WEBPACK_IMPORTED_MODULE_1__["oauth2"].authorize({
                clientId: 'my_web_app',
                scope: 'launch/patient openid fhirUser patient/*.read',
                redirectUri: '#/questionnaire-center',
            }).catch(err => console.error(err));
        }
    }
}
LaunchComponent.ɵfac = function LaunchComponent_Factory(t) { return new (t || LaunchComponent)(); };
LaunchComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LaunchComponent, selectors: [["app-launch"]], decls: 2, vars: 0, template: function LaunchComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "launch works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJsYXVuY2guY29tcG9uZW50LnNjc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LaunchComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-launch',
                templateUrl: './launch.component.html',
                styleUrls: ['./launch.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");




class AppComponent {
    constructor(router) {
        this.router = router;
        this.title = 'fhir-prom-formio';
    }
    ngOnInit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            console.log('app component 當前原始網址：', window.location.href);
            const searchParams = new URLSearchParams(window.location.search);
            const hashPart = window.location.hash.split('?')[1]; // 取得 # 後面的 ? 內容
            const hashParams = new URLSearchParams(hashPart || '');
            const urlParams = searchParams;
            hashParams.forEach((value, key) => { urlParams.append(key, value); });
            yield this.setURLSearchParams(urlParams);
            // // 1. 使用原生 JS 抓取 # 號之前的參數 (window.location.search)
            // const code = urlParams.get('code');
            // const state = urlParams.get('state');
            // if (code && state) {
            //   console.log('偵測到外部回傳參數，準備帶參數跳轉至 FhirComponent');
            //   // 2. 手動將這些參數塞進 Angular 的導向中
            //   // 這會讓網址變成 #/fhir?code=xxx&state=yyy
            //   const queryParams = {};
            //   for (let k of urlParams.keys()) {
            //     queryParams[k] = urlParams.get(k);
            //   }
            //   this.router.navigate(['fhir'], {
            //     queryParams: queryParams,
            //     replaceUrl: true, // 替換掉目前的歷史紀錄，避免使用者按上一頁回到錯誤狀態
            //   });
            // }
            if (Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["isDevMode"])()) {
            }
        });
    }
    setURLSearchParams(urlParams) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            for (let k of urlParams.keys()) {
                console.log('k', k, urlParams.get(k));
                yield sessionStorage.setItem(`${k}_self`, urlParams.get(k));
            }
        });
    }
    showMsg(event) {
        console.log(event);
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 2, vars: 0, consts: [[2, "height", "100vh"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterOutlet"]], styles: ["[_nghost-%COMP%]     .p-component {\n  font-size: 1em;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7QUFDRiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCA6Om5nLWRlZXAgLnAtY29tcG9uZW50IHtcbiAgZm9udC1zaXplOiAxZW07XG59XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.scss'],
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }]; }, null); })();


/***/ }),

/***/ "UsjP":
/*!***********************************************!*\
  !*** ./src/app/structure-ir/VisitorFormIO.ts ***!
  \***********************************************/
/*! exports provided: VisitorFormIO */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VisitorFormIO", function() { return VisitorFormIO; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "wd/R");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StructMD-IRspec */ "HRil");


/* .5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100

    clchen 2025-11-16 (v2.1.4)

    Form.io 必須面對的問題：
    (1) Form.io 名叫 "a" 的 radio 其中 value 是 "foo" 的選項被挑選時，答案卷寫成 "a":"foo"。
        當 value 為長得像 number 的字串 (如 "123") 的選項被挑選時，答案卷寫成 "a":123；
        不符合 IR 的規範，Form.io 客製化的 valid=... 和 show=... 也會變得容易出錯。
    (2) 2.1.3 之前(含)，單選用 radio，多選用 selectBoxes；
        2.1.4 期待除了 radio 和 selectBoxes 還可以用 select。

    對策：
    (1) [VisitorFormIO]
            IRspec 轉成 form.io 題目卷時，不論是否長得像 number，一律強制加 optionPrefix，如 __；
            如此，填答後答案卷將寫成 "a":"__123"。
            必須留意客製化的 valid=... 與 show=... 要跟著小修。
        [VisitorFormIO2]
            答案卷轉成 IR 時，去掉 __ 成為 "123"。
        [VisitorFormIO3]
            IR 轉成答案卷時，再把 __ 加回。
    (2) [VisitorFormIO]
            增加輸入參數 selectThreshold，
            當 code 的 option 個數小於此參數時採用 radio 或 selectBoxes，否則採用 select。
            Form.io 答案卷記錄方式為 radio            "a":"__foo"
                                    select          "a":"__foo"
                                    select+multiple "a":["__foo","__bar"]
                                    selectBoxes     "a":{"__foo":true,"__baz":false}
            必須留意客製化的 valid=... 與 show=...。
        [VisitorFormIO2]
            答案卷轉成 IR 時，根據 IRspec 單選的都轉成 "a":"foo"；
            多選的都轉成 "a":["foo","bar"]，同時在 IR 中塞入 optionMemo，
            如："__FormioOptionMemo_a":1 代表答案卷的 a 欄採用 select+multiple 形式，
              "__FormioOptionMemo_a":2 代表答案卷的 a 欄採用 selectBoxes 形式。
        [VisitorFormIO3]
            IR 轉成答案卷時，單選的不論 radio 或 select 都轉成 "a":"__foo" 即可；
            多選的則依照 __FormioOptionMemo_a
                轉成 "a":["__foo","__bar"]
                或轉成 "a":{"__foo":true,"__baz":false}。

....5...10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95.. */
class VisitorFormIO {
    constructor() {
        // v2.1.4 增加，1 代表預設都用 select
        this.selectThreshold = 1;
    }
    /** 把指定的 StructMD_IRspec 轉成 Form.io 題目卷。
     * @param specNum 指定的 StructMD_IRspec 編號。
     * @param selectThreshold 當 code 的 option 個數小於此參數時採用 radio 或 selectBoxes，
     *                        大於等於時採用 select。
     * @param outputFile 輸出的 Form.io 題目卷檔案名稱。
     *                   倘若從缺，輸出檔案名稱預設為 Form_<規格編號>.json。
     * @return 回傳 Form.io 題目卷的 JSON 字串。
     */
    gen(specNum, selectThreshold, outputFile) {
        if (selectThreshold !== undefined) {
            this.selectThreshold = selectThreshold;
        }
        let spec = _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["IRspec"].get(specNum);
        if (outputFile === undefined) {
            outputFile = `Form_${spec.specNum}.json`;
        }
        return spec.accept(this); // 乃人修改
        // fs.writeFileSync(outputFile, JSON.stringify(spec.accept(this)));
        // 跳著跳著實際呼叫 visitIRspec()
    }
    visitIRspec(v) {
        let result = {
            components: [
                {
                    type: "panel",
                    theme: VisitorFormIO.formioPanelTheme,
                    collapsible: VisitorFormIO.formioPanelCollapsible,
                    collapsed: false,
                    title: v.display !== null
                        ? v.display
                        : `表單(${v.specNum})`,
                    tooltip: `這是 StructMD-IRspec 編號 ${v.specNum} 的表單`,
                    components: [] // 底下馬上加
                }
            ]
        };
        let panel = result.components[0];
        for (let child of v.children) {
            panel.components.push(...child.accept(this, "data"));
            // 跳著跳著實際呼叫 visitCommentNode(), visitNonLeafNode(),
            // visitLeafNode()
        }
        return result;
    }
    visitCommentNode(v) {
        // CommentNode 是加值 StructMD-IR 輸出用的
        // form.io 用不上，但 visitor 還是會來走一圈
        return [];
    }
    /**
     * @param fqParent 本 NonLeafNode 在答案卷中上一層的 Fully Qualified name，
     *                 即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *                 因為題目卷裡面的 show=... 和 valid=... 判斷式必須用 fully qualified name，
     *                 所以由上而下一路傳進來，
     *                 疊加本 NonLeafNode 對應的 form.io 元件 API property name 後再一路往下傳。
     * @returns 一個陣列，只有一個元素，即 form.io 的 panel + (container 或 editgrid)，
     *          container 或 editgrid 內含本 NonLeafNode 的 children 對應的 form.io 元件 。
     */
    visitNonLeafNode(v, fqParent) {
        // 因為 form.io 的 container 和 editGrid 沒有畫出外框
        // 為了讓使用者看出樹狀結構的層層堆疊，在 container 和 editGrid 的外頭加一個 panel
        let result = [
            {
                type: "panel",
                theme: VisitorFormIO.formioPanelTheme,
                collapsible: VisitorFormIO.formioPanelCollapsible,
                collapsed: VisitorFormIO.formioPanelCollapsible,
                title: v.name,
                hideLabel: false,
                tooltip: "TBD",
                components: [
                    {
                        // 假如 NonLeafNode 的 cardinality.upper = 1，
                        // 採用 container 來裝此 NonLeafNode 的 children 產生的 form.io 元件
                        // 否則採用 editGrid
                        //
                        // 當 cardinality.upper = 1，採用 container 使用者體驗的確較佳
                        //
                        // 實務上，癌登長表幾乎沒有多筆的 NonLeafNode，但是癌藥事審有
                        // 或許是癌登長表還停留在 csv 架構，癌藥事審已經 FHIR 架構
                        // clchen 2025-11-30
                        type: v.cardinality.upper === 1
                            ? "container"
                            : "editgrid",
                        key: v.mName,
                        label: v.name,
                        hideLabel: true,
                        tooltip: v.description === null // 先把 IRspec 有的訊息放進來
                            ? "" // visitCardinality() 可能會補充
                            : `  ${v.description}`,
                        validate: {},
                        // 倘若沒有，底下再 delete
                        components: [] // 底下馬上加
                    }
                ]
            }
        ];
        let panel = result[0];
        let container = panel.components[0]; // 名叫 container，實際也可能是 editgrid
        // 若有 condition，多加 conditional 或 customConditional
        if (v.condition !== null) {
            // 跳著跳著實際呼叫 visitCondition()
            v.condition.accept(this, container, `${fqParent}.${v.condition.subject.mName}`);
        }
        // 考慮 cardinality
        // 跳著跳著實際呼叫 visitCardinality()
        v.cardinality.accept(this, container, `${fqParent}.${v.mName}`);
        // 強迫症，看空的 validate 不順眼
        if (Object.keys(container.validate).length === 0) {
            delete container.validate;
        }
        // 把下層 container 的 customConditional 複製到外層 panel
        if (container.customConditional !== undefined) {
            panel.customConditional = container.customConditional;
        }
        // 把下層 container 或 editgrid 的 tooltip 搬到上層
        if (container.tooltip.length > 2) {
            // 加進去 tooltip 的子句前頭都會有兩個空白，拿掉最前面的
            panel.tooltip = container.tooltip.substring(2);
        }
        delete container.tooltip;
        // 把 NonLeafNode 的 children 放到 container 或 editgrid
        for (let child of v.children) {
            let p = container.type === "editgrid"
                ? "row" // editgrid 從 row 開始重新命名
                : `${fqParent}.${v.mName}`;
            container.components.push(...child.accept(this, `${p}`));
            // 跳著跳著實際呼叫 visitCommentNode(), visitNonLeafNode(),
            // visitLeafNode()
        }
        return result;
    }
    /**
     * @param fqParent 本 LeafNode 在答案卷中上一層的 Fully Qualified name，
     *                 即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *                 因為題目卷裡面的 show=... 和 valid=... 判斷式必須用 fully qualified name，
     *                 所以由上而下而下一路傳進來。
     * @returns 本 LeafNode 對應的 form.io 元件組成的陣列。
     *          CodeType 有 Attachment 時，會有多個 form.io 元件。
     */
    visitLeafNode(v, fqParent) {
        let result = [
            {
                type: "TBD",
                key: v.mName,
                label: v.name,
                labelPosition: VisitorFormIO.formioLabelPosition,
                labelWidth: VisitorFormIO.formioLabelWidth,
                labelMargin: VisitorFormIO.formioLabelMargin,
                hideLabel: false,
                tableView: v.isKey // v2.1.4 新增
                    ? true
                    : false,
                tooltip: v.description === null // 先把 IRspec 有的訊息放進來
                    ? "" // visitCardinality() 可能會補充
                    : `  ${v.description}`,
                validate: {} // visitCardinality() 可能會放東西
                // 倘若沒有，底下再 delete
            }
        ];
        // 把 type 加進去 result[0]，含這個欄位的上下限
        // 同時把附加的 form.io 元件(主要是 attachment)加進去 result
        result.push(...v.type.accept(this, // 所有 visitXXXType() 都會用
        result[0], // 所有 visitXXXType() 都會用
        v, // visitBooleanType() 和 visitCodeType() 會用
        fqParent, // visitDateType(), visitDateTimeType() 和 visitCodeType() 會用
        v.mName // 只有 visitCodeType() 會用
        )); // 跳著跳著實際呼叫 visitXXXType()
        // 若有 condition，多加 conditional 或 customConditional
        if (v.condition !== null) {
            // 跳著跳著實際呼叫 visitCondition()
            v.condition.accept(this, result[0], `${fqParent}.${v.condition.subject.mName}`);
        }
        // 考慮 cardinality
        // 跳著跳著實際呼叫 visitCardinality()
        v.cardinality.accept(this, result[0], `${fqParent}.${v.mName}`);
        // 強迫症，看空的 validate 不順眼
        if (Object.keys(result[0].validate).length === 0) {
            delete result[0].validate;
        }
        if (result[0].tooltip.length > 2) {
            // 加進去 tooltip 的子句前頭都會有兩個空白，拿掉最前面的
            result[0].tooltip = result[0].tooltip.substring(2);
        }
        else {
            delete result[0].tooltip;
        }
        if (result[0].defaultValue === undefined) {
            switch (result[0].type) {
                case "number": // 這些 form.io 元件可以顯示 placeholder
                case "textfield":
                case "textarea":
                case "datetime":
                case "time":
                case "select": // v2.1.4 新增
                    // 有 description 就用 description，不然抄 tooltip，好歹提供一些訊息
                    result[0].placeholder = v.description !== null
                        ? v.description
                        : result[0].tooltip;
            }
        }
        return result;
    }
    /**
     * @param updated 半成品的 form.io 元件，將根據本 Condition 放入 customConditional 欄位。
     * @param fqSubject 本 Condition 的 subject 在 form.io 中的 fully qualified name，
     *                  將使用在 customConditional 中 show=... 的 RHS。
     */
    visitCondition(v, updated, fqSubject) {
        /*
            有支援的 Condition 列表
            ┌──────────────────────────────────────────┬────────────────┬─────────────────────┐
            │ SUBJECT                                  │ OPERATOR       │ VALUE               │
            ├──────┬──────────────┬──────┬─────────────┤                │                     │
            │ NODE │ DATA TYPE    │ CARD │ formIo type │                │ DATA TYPE           │
            ├──────┼──────────────┼──────┼─────────────┼────────────────┼─────────────────────┤
            │ Leaf │ decimal      │ ?..1 │ number      │ ge lt          │ number              │
            │ Node │              │ ?..1 │ number      │ btw            │ [number, number]    │
            │      │              │ 0..? │ number[]    │ exist          │ boolean             │
            │      ├──────────────┼──────┼─────────────┼────────────────┼─────────────────────┤
            │      │ integer      │ ?..1 │ number      │ ge lt          │ number (integer)    │
            │      │              │ ?..1 │ number      │ btw            │ [number, number]    │
            │      │              │ 0..? │ number[]    │ exist          │ boolean             │
            │      ├──────────────┼──────┼─────────────┼────────────────┼─────────────────────┤
            │      │ date         │ ?..1 │ datetime    │ ge lt          │ string (YYYY-MM-DD) │
            │      │ dateTime     │ ?..1 │ datetime    │ btw            │ [string, string]    │
            │      │              │ 0..? │ datetime[]  │ exist          │ boolean             │
            │      ├──────────────┼──────┼─────────────┼────────────────┼─────────────────────┤
            │      │ boolean      │ ?..1 │ radio       │ eq             │ boolean | string    │
            │      │              │ 0..? │ editgrid    │ exist          │ boolean             │
            │      ├──────────────┼──────┼─────────────┼────────────────┼─────────────────────┤
            │      │ code         │ ?..? │ radio       │ has            │ string              │
            │      │              │ ?..? │ OR          │ anyIn allNotIn │ string[]            │
            │      │              │ 0..? │ selectboxes │ exist          │ boolean             │
            │      ├──────────────┼──────┼─────────────┼────────────────┼─────────────────────┤
            │      │ string       │ 0..? │ textfield   │ exist          │ boolean             │
            │      │ time         │      │ time        │                │                     │
            │      │ markdown     │      │ textarea    │                │                     │
            │      │ base64Binary │      │ textfield   │                │                     │
            ├──────┴──────────────┤      │             │                │                     │
            │ NonLeafNode         │      │ container   │                │                     │
            │                     │      │ OR editgrid │                │                     │
            └─────────────────────┴──────┴─────────────┴────────────────┴─────────────────────┘
        */
        // exist 適用於 LeafNode 與 NonLeafNode，讓底下的 switch 單純應付 LeafNode
        if (v.operator === "exist") {
            /*
                *                   單數       單數空值       複數        複數空值
                *  ─────────────┬───────────┬───────────┬─────────────┬──────────────
                *  Tree         │ container │ {各欄均空} │ editgrid    │ [] 或 [{各欄均空}]
                *  decimal      │ number    │ undefined │ number[]    │ [null]
                *  integer      │ number    │ undefined │ number[]    │ [null]
                *  string       │ textField │ ""        │ textField[] │ [] 或 [""]
                *  markdown     │ textArea  │ ""        │ textArea[]  │ [] 或 [""]
                *  base64Binary │ textField │ ""        │ textField[] │ [] 或 [""]
                *  date         │ dateTime  │ ""        │ dateTime[]  │ [] 或 [""]
                *  dateTime     │ dateTime  │ ""        │ dateTime[]  │ [] 或 [""]
                *  time         │ time      │ ""        │ time[]      │ [] 或 [""]
                *  boolean      │ radio     │ ""        │ editgrid    │ [] 或 [{各欄均空}]
                *  code         │ radio     │ ""        │ selectboxes │ {} 或 {均null}
                *  ─────────────┴───────────┴───────────┴─────────────┴──────────────
                */
            // 一直抓不準 form.io 的空值，乾脆寧可錯殺，不分類了
            updated.customConditional
                = `show=${v.value ? "!" : ""}(`
                    + `${fqSubject}===undefined`
                    + `||${fqSubject}===null` // null 也算 object
                    + `||${fqSubject}===""`
                    + `||`
                    + `Array.isArray(${fqSubject})` // 陣列也算 object
                    + `&&${fqSubject}.reduce(`
                    + `(a,x)=>(x===null||x===undefined||x==="")&&a,true`
                    + `)`
                    + `||`
                    + `typeof ${fqSubject}==="object"`
                    + `&&!Array.isArray(${fqSubject})` // 第二句，null 沒有其他條件
                    // 第四句，陣列還有 AND 其他條件
                    // 所以多加這個，以確保是正統 object
                    + `&&Object.values(${fqSubject}).reduce(`
                    + `(a,x)=>(x===false)&&a,true`
                    + `)`
                    + `)`;
            return;
        }
        let subject = v.subject;
        switch (v.operator) {
            case "ge":
                updated.customConditional
                    = (subject.type instanceof _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DecimalType"] || subject.type instanceof _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["IntegerType"])
                        ? `show=${v.value}<=${fqSubject};`
                        : `show=moment("${v.value}").isSameOrBefore(${fqSubject});`;
                return;
            case "lt":
                updated.customConditional
                    = (subject.type instanceof _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DecimalType"] || subject.type instanceof _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["IntegerType"])
                        ? `show=${v.value}>${fqSubject};`
                        : `show=moment("${v.value}").isAfter(${fqSubject});`;
                return;
            case "btw":
                if (subject.type instanceof _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DecimalType"] || subject.type instanceof _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["IntegerType"]) {
                    let n2 = v.value;
                    updated.customConditional
                        = `show=${n2[0]}<=${fqSubject}&&${fqSubject}<${n2[1]};`;
                }
                else /* datetime */ {
                    let m2 = v.value;
                    updated.customConditional
                        = `show=moment("${m2[0]}").isSameOrBefore(${fqSubject})`
                            + `&&moment("${m2[1]}").isAfter(${fqSubject});`;
                }
                return;
            case "eq":
                updated.customConditional = v.value
                    ? `show=${fqSubject}==="${VisitorFormIO.formioTrue}";`
                    : `show=${fqSubject}==="${VisitorFormIO.formioFalse}";`;
                // form.io 的 radio 尚未選擇時給空字串
                return;
            case "has":
                // v2.1.4 新增，參見本檔案最上面註解對策一
                let formioCondValue = VisitorFormIO.optionPrefix + v.value.code;
                let expr = "";
                if (subject.cardinality.upper === 1) {
                    // 適用於單選的 select 以及 radio
                    expr = `${fqSubject}==="${formioCondValue}"`;
                }
                else if (this.selectThreshold <= subject.type.options.length) {
                    // 適用於多選的 select
                    expr = `${fqSubject}.includes("${formioCondValue}")`;
                }
                else {
                    // 適用於 selectBoxes
                    expr = `${fqSubject}.${formioCondValue}`;
                }
                updated.customConditional = `show=${expr};`;
                return;
            case "anyIn":
            case "allNotIn":
                // v2.1.4 新增，參見本檔案最上面註解對策一
                let astCondValues = v.value;
                let formioCondValues = `[${astCondValues.map(x => `"${VisitorFormIO.optionPrefix}${x.code}"`)}]`;
                expr = "";
                if (subject.cardinality.upper === 1) {
                    // 適用於單選的 select 以及 radio
                    expr = `${formioCondValues}.includes(${fqSubject})`;
                }
                else if (this.selectThreshold <= subject.type.options.length) {
                    // 適用於多選的 select
                    // 外圈的 x 固定，內圈的任一 y 若與 x 相等，則回傳 true
                    let innerExpr = `(${fqSubject}.reduce((b,y)=>b||x===y,false))`;
                    // 外圈的任一 x 若與內圈的某一 y 相等，則回傳 true
                    expr = `${formioCondValues}.reduce((a,x)=>a||${innerExpr},false)`;
                }
                else {
                    // 適用於 selectBoxes
                    expr = `${formioCondValues}.reduce((a,x)=>a||${fqSubject}[x],false)`;
                }
                updated.customConditional = v.operator === "anyIn"
                    ? `show=(${expr});`
                    : `show=!(${expr});`;
                return;
        }
    }
    /**
     * @param updated 半成品的 form.io 元件，將根據本 Cardinality 增改欄位。
     * @param fqNode 修正的 form.io 元件在答案卷中的 Fully Qualified name，
     *               即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *               將使用在 validate.custom 中 valid=... 的 RHS。
     */
    visitCardinality(v, updated, fqNode) {
        /*
            card         │     type        │              validate
            ─────────────┼─────────────────┼────────────────────────────────────────────────────
                         │                 │ v2.1.4 新增，參見本檔案最上面註解對策二
                         │                 │ 下限不為 0 的，在 valid=... 中檢查下限
                         │                 │ 上限不為 * 的，在 valid=... 中檢查上限
            0..1 code    │ select          │
            1..1 code    │ select          │ required
            0..n code    │ select multiple │
            1..n code    │ select multiple │ required
            m..n code    │ select multiple │ required
            0..* code    │ select multiple │
            1..* code    │ select multiple │ required
            m..* code    │ select multiple │ required
            ─────────────┼─────────────────┼────────────────────────────────────────────────────
            0..1 code    │ radio           │
            1..1 code    │ radio           │ required
            0..n code    │ selectboxes     │                             maxSelectedCount=n
            1..n code    │ selectboxes     │ required                    maxSelectedCount=n
            m..n code    │ selectboxes     │ required minSelectedCount=m maxSelectedCount=n
            0..* code    │ selectboxes     │
            1..* code    │ selectboxes     │ required
            m..* code    │ selectboxes     │ required minSelectedCount=m
            ─────────────┼─────────────────┼────────────────────────────────────────────────────
            0..1 tree    │ container       │
            1..1 tree    │ container       │ required
            0..n tree    │ editgrid        │                      maxLength=n
            1..n tree    │ editgrid        │ required             maxLength=n
            m..n tree    │ editgrid        │ required minLength=m maxLength=n
            0..* tree    │ editgrid        │
            1..* tree    │ editgrid        │ required
            m..* tree    │ editgrid        │ required minLength=m
            ─────────────┼─────────────────┼────────────────────────────────────────────────────
            0..1 boolean │ radio           │
            1..1 boolean │ radio           │ required
            0..n boolean │ editgrid+radio  │                      maxLength=n
            1..n boolean │ editgrid+radio  │ required             maxLength=n
            m..n boolean │ editgrid+radio  │ required minLength=m maxLength=n
            0..* boolean │ editgrid+radio  │
            1..* boolean │ editgrid+radio  │ required
            m..* boolean │ editgrid+radio  │ required minLength=m
            ─────────────┼─────────────────┼────────────────────────────────────────────────────
            0..1 ppp     │ qqq             │          這三者，因為沒有 required，會被填入空值
            0..n ppp     │ qqq multiple    │          檢查個數是否合規後，還要確認多筆時不得有空值
            0..* ppp     │ qqq multiple    │
            1..1 ppp     │ qqq             │ required 這五者，因為 required，不會被填入空值
            1..n ppp     │ qqq multiple    │ required 所以只要檢查個數是否合規
            m..n ppp     │ qqq multiple    │ required 但不像 selectboxes 有 minSelectedCount
            1..* ppp     │ qqq multiple    │ required 也不像 editgrid 有 minLength 可以用
            m..* ppp     │ qqq multiple    │ required 只能自寫 javascript
            ─────────────┴─────────────────┴────────────────────────────────────────────────────
            IRspec          form.io
            ppp         --> qqq
            decimal     --> Number
            integer     --> Number
            string      --> Text Field
            base64Binary--> Text Field
            markdown    --> Text Area
            date        --> Date / Time
            dateTime    --> Date / Time
            time        --> Time
        */
        // 理想上，應該從 Abstract Syntax Tree 獲取判斷的資訊，即利用 v，
        // 無奈 Cardinality 上不去其歸屬的 LeafNode 或是 NonLeafNode，又沒有當成參數傳進來
        // 只得利用半成品的 form.io 元件，即 updated
        // 幸虧 v2.1.4 改寫成進入本函式後不再異動 updated.type
        // 加強 tooltip 以及 placeholder 說明
        // 先寫到 tooltip，visitLeafNode() 再負責搬到 placeholder
        let numRecord = v.lower === v.upper
            ? v.lower.toString()
            : `${v.lower}~${v.upper < Number.MAX_SAFE_INTEGER ? v.upper : ""}`;
        let isCodeType = updated.type === "select"
            || updated.type === "radio"
            || updated.type === "selectboxes";
        updated.tooltip += !isCodeType
            ? `  筆數[${numRecord}]`
            : v.upper === 1
                ? `  單選`
                : `  多選[${numRecord}項]]`;
        // 加必填的星星
        if (v.lower > 0) {
            updated.validate.required = true;
        }
        // 筆數限制
        if (updated.type === "container") {
            // 0..1 和 1..1 的，利用 form.io 檢核機制即可，不用特別檢核
        }
        else if (updated.type === "radio") {
            // 0..1 和 1..1 的，利用 form.io 檢核機制即可，不用特別檢核
        }
        else if (updated.type === "select" && v.upper === 1) {
            // 0..1 和 1..1 的，利用 form.io 檢核機制即可，不用特別檢核
        }
        else if (updated.type === "select") {
            let invalid = "";
            if (v.lower !== 0) {
                invalid += `||${fqNode}.length<${v.lower}`;
            }
            if (v.upper !== Number.MAX_SAFE_INTEGER) {
                invalid += `||${v.upper}<${fqNode}.length`;
            }
            if (invalid.length > 0) {
                updated.validate.custom = `valid=(${invalid.substring(2)})`
                    + `?"筆數錯誤"`
                    + `:true;`;
            }
        }
        else if (updated.type === "selectboxes") {
            // selectboxes 利用 validate.minSelectedCount(maxSelectedCount) 即可
            if (v.lower > 1) { // 2 以上才給，否則加上 required=true 會怪怪的
                updated.validate.minSelectedCount = v.lower;
            }
            if (v.upper > 1 && v.upper !== Number.MAX_SAFE_INTEGER) {
                updated.validate.maxSelectedCount = v.upper;
            }
        }
        else if (updated.type === "editgrid") {
            // // editgrid 利用 validate.minLength(maxLength) 即可
            // if (v.lower > 1) {  // 2 以上才給，否則加上 required=true 會怪怪的
            //     updated.validate.minLength = v.lower;
            // }
            // if (v.upper > 1 && v.upper !== Number.MAX_SAFE_INTEGER) {
            //     updated.validate.maxLength = v.upper;
            // }
            // editgrid 利用 validate.minLength(maxLength) 即可
            if (v.lower !== 0) { // 2 以上才給，否則加上 required=true 會怪怪的
                updated.validate.minLength = v.lower;
            }
            if (v.upper !== Number.MAX_SAFE_INTEGER) {
                updated.validate.maxLength = v.upper;
            }
            if (v.lower > 0) {
                updated.openWhenEmpty = true; // editgrid 尚無資料時，展開第一列
            }
        }
        else {
            // 0..1 和 1..1 的，沒有啟動 multiple，靠著 validate.required 應該就足以稽核
            if (v.upper > 1) {
                // 先啟動 multiple
                updated.multiple = true;
                // 製作 valid=... 的稽核判斷式
                // form.io 的 required 機制可以管控不得輸入空值，而且適用於 multiple 情境
                // 當 cardinality.lower = 0 時，因為要允許一筆都沒有，所以不能打開 required
                // 以至於每一筆都可以輸入空值，這不是我們想要的
                let xIsEmpty = `x===null||x===undefined||x===""`;
                let invalid1 = ""; // 稽核多筆時不得有空值
                let invalid2 = ""; // 稽核筆數錯誤
                // 已啟動 multiple，form.io 答案卷將存成陣列，length 代表筆數而不是字串長度
                invalid1 += `2<=${fqNode}.length`
                    + "&&"
                    + `${fqNode}.reduce((a,x)=>a||${xIsEmpty},false)`;
                if (v.lower !== 0) {
                    invalid2 += `||${fqNode}.length<${v.lower}`;
                }
                if (v.upper !== Number.MAX_SAFE_INTEGER) {
                    invalid2 += `||${v.upper}<${fqNode}.length`;
                }
                if (invalid1.length > 0 && invalid2.length > 0) {
                    updated.validate.custom = `valid=(${invalid1})`
                        + `?"多筆時不得有空值"`
                        + `:(${invalid2.substring(2)})`
                        + `?"筆數錯誤"`
                        + `:true;`;
                }
                else if (invalid1.length > 0) {
                    updated.validate.custom = `valid=(${invalid1})`
                        + `?"多筆時不得有空值"`
                        + `:true;`;
                }
                else if (invalid2.length > 0) {
                    updated.validate.custom = `valid=(${invalid2.substring(2)})`
                        + `?"筆數錯誤"`
                        + `:true;`;
                }
            }
            /*
             * 多筆時不得有空值，Form.io 有 bug
             * 假如一直按「+Add Another」，而不輸入，Form.io 不會啟動 validation
             * Javascript 寫的檢核或是 Form.io 內建的 Required 檢核，通通失效
             *
             * 結論：
             * Form.io 產生的答案卷不見得合 StructMD-IRspec 的規
             * 轉成 StructMD-IR 時，必須要多做工
             */
        }
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 DecimalType 直接增修參數，包含：型態、預設值、上下限檢核。
     *                tooltip 則附加型態與上下限的文字說明。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         本函式無。
     */
    visitDecimalType(v, updated) {
        // 型態
        updated.type = "number";
        updated.decimalLimit = VisitorFormIO.formioDecimalLimit;
        // 預設值
        if (v.defaultValue !== null) {
            updated.defaultValue = v.defaultValue;
        }
        // 上下限
        let range = "";
        if (v.lower !== null) {
            updated.validate.min = v.lower;
            range += `${v.lower}~`;
        }
        if (v.upper !== null) {
            updated.validate.max = v.upper - VisitorFormIO.formioDecimalEpsilon;
            range += `~${v.upper}(不含)`;
        }
        // tooltip
        updated.tooltip += "  數值";
        if (range.length !== 0) {
            updated.tooltip += `  範圍[${range.replace("~~", "~")}]`;
        }
        return []; // 沒有附加的 form.io 元件
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 IntegerType 直接增修參數，包含：型態、預設值、上下限檢核。
     *                tooltip 則附加型態與上下限的文字說明。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         本函式無。
     */
    visitIntegerType(v, updated) {
        // 型態
        updated.type = "number";
        updated.decimalLimit = 0;
        // 預設值
        if (v.defaultValue !== null) {
            updated.defaultValue = v.defaultValue;
        }
        // 上下限
        let range = "";
        if (v.lower !== null) {
            updated.validate.min = v.lower;
            range += `${v.lower}~`;
        }
        if (v.upper !== null) {
            updated.validate.max = v.upper - 1;
            range += `~${v.upper - 1}`;
        }
        // tooltip
        updated.tooltip += "  整數";
        if (range.length !== 0) {
            updated.tooltip += `  範圍[${range.replace("~~", "~")}]`;
        }
        return []; // 沒有附加的 form.io 元件
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 StringType 直接增修參數，包含：型態、預設值、字數上下限檢核。
     *                tooltip 則附加型態與字數上下限的文字說明。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         本函式無。
     */
    visitStringType(v, updated) {
        // 型態
        updated.type = "textfield";
        // 預設值
        if (v.defaultValue !== null) {
            updated.defaultValue = v.defaultValue;
        }
        // 上下限
        let range = "";
        if (v.lower !== null) {
            updated.validate.minLength = v.lower;
            range += `${v.lower}~`;
        }
        if (v.upper !== null) {
            updated.validate.maxLength = v.upper - 1;
            if (updated.validate.minLength === updated.validate.maxLength) {
                range = `${v.lower}`;
            }
            else {
                range += `~${v.upper - 1}`;
            }
        }
        // tooltip
        updated.tooltip += "  字串";
        if (range.length !== 0) {
            updated.tooltip += `  字數[${range.replace("~~", "~")}]`;
        }
        return []; // 沒有附加的 form.io 元件
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 MarkdownType 直接增修參數，包含：型態、預設值、字數上下限檢核。
     *                tooltip 則附加型態與字數上下限的文字說明。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         本函式無。
     */
    visitMarkdownType(v, updated) {
        // 型態
        updated.type = "textarea";
        // 預設值
        if (v.defaultValue !== null) {
            updated.defaultValue = v.defaultValue;
        }
        // 上下限
        let range = "";
        if (v.lower !== null) {
            updated.validate.minLength = v.lower;
            range += `${v.lower}~`;
        }
        if (v.upper !== null) {
            updated.validate.maxLength = v.upper - 1;
            if (updated.validate.minLength === updated.validate.maxLength) {
                range = `${v.lower}`;
            }
            else {
                range += `~${v.upper - 1}`;
            }
        }
        // tooltip
        updated.tooltip += "  請儘量以markdown呈現";
        if (range.length !== 0) {
            updated.tooltip += `  字數[${range.replace("~~", "~")}]`;
        }
        return []; // 沒有附加的 form.io 元件
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 Base64BinaryType 直接增修參數，包含：型態、預設值。
     *                tooltip 則附加型態的文字說明。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         本函式無。
     */
    visitBase64BinaryType(v, updated) {
        // 型態
        updated.type = "textfield";
        // 預設值
        if (v.defaultValue !== null) {
            updated.defaultValue = v.defaultValue;
        }
        // tooltip
        updated.tooltip += "  請選檔案，轉成base64Binary，再貼上";
        // TODO ////////////////////////////////////
        // 理想：在form.io挑檔案，然後程式接手，再說了
        ////////////////////////////////////////////
        return []; // 沒有附加的 form.io 元件
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 DateTimeType 直接增修參數，包含：型態、預設值、上下限檢核。
     *                tooltip 則附加型態與上下限的文字說明。
     * @param useless 無用。
     * @param fqLeafParent 本 DateTimeType 所屬的 LeafNode 或是 LeafAttachment
     *                     在答案卷中上一層的 Fully Qualified name，
     *                     即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *                     因為題目卷裡面的 show=... 判斷式必須用 fully qualified name，
     *                     所以由上而下一路傳進來。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         mustHave 不為 YMDT 者，回傳一個選擇性的 radio 輸入元件。
     */
    visitDateTimeType(v, updated, useless, fqLeafParent) {
        /* ..15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
    
            Form.io 的 datetime 欄位對時區的處理基本上是 OK 的，不過有些混亂，整理於下。
    
            + 當 Form.io 的元件 type=datetime 時，該元件的 format 只影響到表單的呈現 (給人看的)，
              與答案卷的存檔沒有關係。
            + 假如 format 從缺，內定使用年月日時分 (沒有秒) 的 12 小時制 (加 am 或 pm)。
            + 利用 defaultValue 來指定特定的預設值時，
                - 假如給 UTC 時間 (以 Z 結尾)，會以台灣時間呈現，不過沒有標示時區；
                  不異動直接存檔時也是 UTC 時間，異動後存檔則是台灣時間。
                - 假如給日本時間 (以 +09:00 結尾)，會以日本時間呈現，不過沒有標示時區【所以要避免使用】；
                  不異動直接存檔時也是日本時間，異動後存檔則是台灣時間。
                - 不能引用 moment()。
                - 可以啟動 multiple。
            + 利用 defaultDate 來指定特定的預設值時，
                - 可以引用 moment()，而且可以對該 Moment 物件加減。
                - 不可以啟動 multiple。
                - 判斷裡面轉成 UTC 時間，不異動直接存檔時也是 UTC 時間，異動後存檔則是台灣時間。
                  但會以台灣時間呈現，不過沒有標示時區。
            + 兩者都有時， defaultValue 優先。
    
            結論：
    
            + 給 format 以採用 24 小時制。
            + StructMD-IRspec 中，預設值為 now 時，用 defaultDate；
              多筆時帶入多個 now 沒有意義，先不考慮了。
            + StructMD-IRspec 中，指定特定預設時間時，用 defaultValue；
              不論用哪種時間，由 VisitorFormIO 負責轉成台灣時間。
            + 答案卷轉成 StructMD-IR 時，宜都用台灣時間，可以利用下列程式碼：
                    moment("2024-12-31T20:00:00Z").format("YYYY-MM-DDTHH:mm:ssZ")
                    moment("2025-01-01T05:00:00+09:00").format("YYYY-MM-DDTHH:mm:ssZ")
                    moment("2025-01-01T04:00:00+08:00").format("YYYY-MM-DDTHH:mm:ssZ")
              第一個把格林威治時間、第二個把日本時間、第三個把台灣時間都以台灣時間呈現。
    
        .....15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
    
            FHIR 的 date 可以只有年、年月，dateTime 可以只有年、年月、年月日，應該有它的道理。
            StructMD-IRspec 跟隨。Form.io 做底下的配合：
    
            策略：
            + IRspec grammar 升版為 v2.2。
                - "type":"date" 可以附加 "mustHave":"Y" 或 "YM" 或 "YMD"。
                - "type":"datetime" 可以附加 "mustHave":"Y" 或 "YM" 或 "YMD" 或 "YMDT"。
            + v2.2 導入 mustHave 機制後，IRspec 規範的欄位，IR 可以接受的日期時間格式如下表：
                    | IRspec    |          IR                 |
                    |-----------|----------|------------------|
                    | mustHave  | date     | datetime         |
                    |-----------|----------|------------------|
                    | "Y"       | YMD YM Y | YMDhmsZ YMD YM Y |
                    | "YM"      | YMD YM   | YMDhmsZ YMD YM   |
                    | "YMD"     | YMD      | YMDhmsZ YMD      |
                    | "YMDT"    |          | YMDhmsZ          |
                    | undefined | YMD YM Y | YMDhmsZ YMD YM Y | (原 v2.1)
            + IRspec 中，其他 "type":"date" 和 "type":"datetime" 的既有相關屬性規範：
                - lower 和 upper 必須是 YMD，維持不變。
                - default 已經允許可以省略，但不可以省過頭；如 "mustHave":"YM" 時，default 不可以只有 Y。
                - 當 Condition 的 subject 為 DateType 或 DateTimeType 時，
                  Condition 的 value 必須是 YMD，維持不變。
    
            程式異動：
            + StructMD-IRspec
                - class DateType (和 class DateTimeType，下略) 增加 instance variable mustHave。
                - create() 和 constructor() 跟著改。
            + StructMD-IRspec Compiler
                - class VisitorCompilerCondition
                    - visitDateType() 應該不用改，
                      因為檢核的是 IRspec 中的 lower/upper 以及 Condition 的 value，
                      而它們都維持必須是 YMD。
                - class Compiler 的 TYPE() 裡面的 case "date":
                    - 多接收 mustHave 參數，型態為 T_string，必須檢查只得 "Y" 或 "YM" 或 "YMD"。
                    - 多檢核 mustHave 與 default 有無矛盾，比如 mustHave=YM 但 default 只給 Y。
                    - 針對 lower/upper/default 的檢核應該不用改，因為它們是否寫全的規範沒有異動，
                      而且 T_date2() 已做到回傳時間概念的區間，
                      比如 2025-12 代表 2025-12-01T00:00:00(含) 到 2026-01-01T00:00:00(不含)。
                    - 一切合法後，傳入 StructMD-IRspec 中 DateType.create()。
            + VisitorDumpAST
                - visitDateType() 多印出 mustHave 欄位即可。
            + VisitorDumpSpec
                - visitDateType() 多印出 mustHave 欄位即可。
            + VisitorFormIO (Spec2Form)
                - 受限於 Form.io 的 Date/Time 內部儲存以及輸出還是完整的 datetime，
                  擬為每一 mustHave 不為 YMD 的 Form.io datetime 輸入元件
                        {
                            "type": "datetime",
                            "key": "birthdate",
                            "label": "出生日期",
                            "format": "yyyy-MM-dd",
                            "enableTime": false,
                            "multiple": 假設 cardinality.upper>1，則會設定為 true
                        }
                  附加一個選擇性的 radio 輸入元件
                        {
                            "type": "radio",
                            "key": "birthdate__precision",
                            "label": "精確程度(出生日期)",
                            "tooltip": "單選",
                            "validate": { "required": true },
                            "values": [
                                { "label": "只確定年",   "value": "__0" },
                                { "label": "只確定年月", "value": "__1" },
                                { "label": "確定年月日", "value": "__2" }
                            ],
                            "defaultValue": "__2",
                            "customConditional": "show=「根據的 datetime 有輸入」"
                        }
                  其中 0, 1, 2 是 enum 的數值。
                - 假設 cardinality.upper>1，還是只有一個「精確程度」radio，
                  即陣列內各筆的精確程度必須一致。
                - visitDateType()
                    - v2.1 原本回傳 []，代表沒有附加的 form.io 元件。
                    - v2.2 改為回傳上述「精確程度」的 radio。
                - 填答後的 Reply 將是
                        "birthdate": "2025-12-06T00:00:00+08:00",
                        "birthdate__precision": ""  // 理當必選，若使用者不選視為最精確，即 default
                                                    // mustHave 空白視為最寬鬆，有「年」即可
                                                    // precision 空白視為最精確
                  或是
                        "birthdate": "2025-12-06T00:00:00+08:00",
                        "birthdate__precision": "__YM"
                  或是
                        "birthdate": ["2025-12-06T00:00:00+08:00", "2025-12-07T00:00:00+08:00"],
                        "birthdate__precision": ""      // 註：只有一筆
                  或是
                        "birthdate": ["2025-12-06T00:00:00+08:00", "2025-12-07T00:00:00+08:00"],
                        "birthdate__precision": "__YM"  // 註：只有一筆
            + VisitorFormIO2 (Reply2IR)
                - visitDateType()
                    - 多接收兩個參數 fieldName 和 replyParent。
                    - 根據 fieldName 湊出 birthdate__precision 完整名稱。
                    - 從 replyParent 中找尋 birthdate__precision 的數值。
                    - 根據 Reply 中的 birthdate__precision 傳回精準格式的日期時間字串。
                    - 注意：不是根據 IRspec 中的 mustHave。
                - visitLeafNode()
                    - 根據 IRspec 會遊歷到 birthdate。
                    - 不會遊歷到 birthdate__precision，因為 IRspec 裡面沒有。
                    - 應該不用改。
                    - 最後產出的 IR 會是
                            "birthdate": "2025-12-06"
                      或是
                            "birthdate": "2025-12"
                      或是
                            "birthdate": ["2025-12-06", "2025-12-07"]
                      或是
                            "birthdate": ["2025-12", "2025-12"]
                - visitLeafAttachment() 可能也不用改，
                  但還需看看與 visitDateType() 的介接是否與 visitLeafNode() 一樣。
            + VisitorIRChecker
                - class VisitorCheckCondition 應該不用改，
                  因為其 doDateBoundType() 已經顧及 IR 中的 irSubject 可能是 Y 或 YM 的 date。
                - class VisitorIRChecker 的 visitDateType()
                    - v2.1 原本沒有 mustHave 機制，IR 中的 Y, YM 或 YMD 都是合法的 date。
                    - v2.2 有了 mustHave 機制
                        - IRspec 中 mustHave=YM 時，IR 中必須是 YM 或 YMD，不可以是 Y。
            + VisitorFormIO3 (IR2Reply)
                - visitLeafNode() 其中的
                        rContainer[visitee.mName] = value;   // 單筆
                        rContainer[visitee.mName] = values;  // 多筆
                  假如碰到 date 或是 dateTime 時，還必須根據 IR 中的日期時間格式補上
                        rContainer[`${visitee.mName}__fuzziness`] = ???
                    - 注意：不是根據 IRspec 中的 mustHave。
                - visitLeafAttachment() 可能不用改，
                  反而其 caller visitOption() 必須做與 visitLeafNode() 類似的修正。
            + VisitorReadable (IR2Yaml)
                - 應該不用改，因為是根據 IR，不論 IR 是 YMD, YM 或 Y 來函照登即可。
                - 注意：不是根據 IRspec 中的 mustHave。
    
            clchen 2025-12-07
    
        .....15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95.. */
        // 型態
        updated.type = "datetime";
        updated.format = "yyyy-MM-ddTHH:mm:ss";
        // 預設值
        if (typeof v.defaultValue === "string") {
            switch (v.defaultValue) {
                case "now":
                    // form.io 算是厲害
                    // 若 now 超過了上下限，此 defaultDate 沒有作用
                    updated.defaultDate = "moment()";
                    break;
                // 以後添加其他的特殊預設值，增加 case 於此
                default: // 指定的預設日期時間
                    updated.defaultValue = moment__WEBPACK_IMPORTED_MODULE_0___default()(v.defaultValue).format("YYYY-MM-DDTHH:mm:ssZ");
            }
        }
        // 上下限
        let range = "";
        if (v.lower !== null || v.upper !== null) {
            updated.datePicker = {};
            updated.widget = {};
            if (v.lower !== null) {
                // 根據 StructMD-IRspec 文法，v.lower 和 v.upper 應該是只有年月日
                let t = v.lower.format("YYYY-MM-DD");
                updated.datePicker.minDate = t;
                updated.widget.minDate = t;
                range += `${v.lower.format("YYYY-MM-DD")}~`;
            }
            if (v.upper !== null) {
                range += `~${v.upper.format("YYYY-MM-DD")}(不含)`;
                // v.upper 將會被減一秒，還沒有減之前先處理 range
                let t = v.upper.subtract(1, "s").format("YYYY-MM-DD");
                updated.datePicker.maxDate = t;
                updated.widget.maxDate = t;
            }
        }
        // tooltip
        updated.tooltip += "  日期時間";
        if (range.length !== 0) {
            updated.tooltip += `  範圍[${range.replace("~~", "~")}]`;
        }
        if (v.mustHave === _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMDT) {
            return []; // 沒有附加的 form.io 元件
        }
        // mustHave 不為 YMDT 者，回傳一個選擇性的 radio 輸入元件，v2.2 新增
        let x = `${fqLeafParent}.${updated.key}`;
        let radio = {
            "type": "radio",
            "key": `${updated.key}${VisitorFormIO.datePrecisionPostfix}`,
            "label": `精確程度(${updated.label})`,
            "labelPosition": VisitorFormIO.formioLabelPosition,
            "labelWidth": VisitorFormIO.formioLabelWidth,
            "labelMargin": VisitorFormIO.formioLabelMargin,
            "tooltip": "筆數[1]  單選",
            "validate": { "required": true },
            "values": [],
            "defaultValue": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMDT.toFixed()}`,
            "inline": VisitorFormIO.formioInline,
            "customConditional": `show=!(`
                + `${x}===undefined||${x}===""`
                + `||`
                + `Array.isArray(${x})`
                + `&&`
                + `${x}.reduce((a,x)=>(x===undefined||x==="")&&a,true)`
                + `)`
        };
        switch (v.mustHave) {
            case undefined:
            case _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].Y:
                radio.values.push({
                    "label": "只確定年",
                    "value": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].Y.toFixed()}`
                });
                break;
            // fall through
            case _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YM:
                radio.values.push({
                    "label": "只確定年月",
                    "value": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YM.toFixed()}`
                });
                break;
            // fall through
            case _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMD:
                radio.values.push({
                    "label": "只確定年月日",
                    "value": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMD.toFixed()}`
                });
                radio.values.push({
                    "label": "確定年月日時",
                    "value": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMDT.toFixed()}`
                });
        }
        return [radio];
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 DateType 直接增修參數，包含：型態、預設值、上下限檢核。
     *                tooltip 則附加型態與上下限的文字說明。
     * @param useless 無用。
     * @param fqLeafParent 本 DateType 所屬的 LeafNode 或是 LeafAttachment
     *                     在答案卷中上一層的 Fully Qualified name，
     *                     即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *                     因為題目卷裡面的 show=... 判斷式必須用 fully qualified name，
     *                     所以由上而下一路傳進來。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         mustHave 不為 YMD 者，回傳一個選擇性的 radio 輸入元件。
     */
    visitDateType(v, updated, useless, fqLeafParent) {
        // 型態
        updated.type = "datetime";
        updated.format = "yyyy-MM-dd";
        // 此設定只是讓表單輸入時不顯示時分秒，內部儲存以及輸出還是完整的 datetime
        updated.enableTime = false;
        // 預設值
        if (typeof v.defaultValue === "string") {
            switch (v.defaultValue) {
                case "now":
                    // 先用無參數的 moment() 取得目前年月日時分秒，只輸出年月日
                    // 再以有參數的 moment() 調整成 00:00:00+08:00
                    updated.defaultDate = `moment(moment().format("YYYY-MM-DD"))`;
                    break;
                // 以後添加其他的特殊預設值，增加 case 於此
                default: // 指定的預設日期時間
                    updated.defaultValue = moment__WEBPACK_IMPORTED_MODULE_0___default()(v.defaultValue).format("YYYY-MM-DDTHH:mm:ssZ");
            }
        }
        // 上下限
        let range = "";
        if (v.lower !== null || v.upper !== null) {
            updated.datePicker = {};
            updated.widget = {};
            if (v.lower !== null) {
                // 根據 StructMD-IRspec 文法，v.lower 和 v.upper 應該是只有年月日
                let t = v.lower.format("YYYY-MM-DD");
                updated.datePicker.minDate = t;
                updated.widget.minDate = t;
                range += `${v.lower.format("YYYY-MM-DD")}~`;
            }
            if (v.upper !== null) {
                range += `~${v.upper.subtract(1, "d").format("YYYY-MM-DD")}`;
                // v.upper 將會被減一秒，還沒有減之前先處理 range
                let t = v.upper.subtract(1, "s").format("YYYY-MM-DD");
                updated.datePicker.maxDate = t;
                updated.widget.maxDate = t;
            }
        }
        // tooltip
        updated.tooltip += "  日期";
        if (range.length !== 0) {
            updated.tooltip += `  範圍[${range.replace("~~", "~")}]`;
        }
        if (v.mustHave === _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMD) {
            return []; // 沒有附加的 form.io 元件
        }
        // mustHave 不為 YMD 者，回傳一個選擇性的 radio 輸入元件，v2.2 新增
        let x = `${fqLeafParent}.${updated.key}`;
        let radio = {
            "type": "radio",
            "key": `${updated.key}${VisitorFormIO.datePrecisionPostfix}`,
            "label": `精確程度(${updated.label})`,
            "labelPosition": VisitorFormIO.formioLabelPosition,
            "labelWidth": VisitorFormIO.formioLabelWidth,
            "labelMargin": VisitorFormIO.formioLabelMargin,
            "tooltip": "筆數[1]  單選",
            "validate": { "required": true },
            "values": [],
            "defaultValue": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMD.toFixed()}`,
            "inline": VisitorFormIO.formioInline,
            "customConditional": `show=!(`
                + `${x}===undefined||${x}===""`
                + `||`
                + `Array.isArray(${x})`
                + `&&`
                + `${x}.reduce((a,x)=>(x===undefined||x==="")&&a,true)`
                + `)`
        };
        switch (v.mustHave) {
            case undefined:
            case _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].Y:
                radio.values.push({
                    "label": "只確定年",
                    "value": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].Y.toFixed()}`
                });
                break;
            // fall through
            case _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YM:
                radio.values.push({
                    "label": "只確定年月",
                    "value": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YM.toFixed()}`
                });
                radio.values.push({
                    "label": "確定年月日",
                    "value": `${VisitorFormIO.optionPrefix}${_StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["DatePrecision"].YMD.toFixed()}`
                });
        }
        return [radio];
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 TimeType 直接增修參數，包含：型態、預設值。
     *                tooltip 則附加型態的文字說明。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         本函式無。
     */
    visitTimeType(v, updated) {
        // 型態
        updated.type = "time";
        updated.inputType = "text";
        updated.format = "HH:mm:ss";
        // 預設值
        if (v.defaultValue !== null) {
            updated.defaultValue = v.defaultValue;
        }
        // tooltip
        updated.tooltip += "  時間";
        return []; // 沒有附加的 form.io 元件
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 BooleanType 直接增修參數。
     *                tooltip 則附加型態與真偽值意義的文字說明。
     * @param astLeaf Abstract Syntax Tree 中，此 BooleanType 所屬的 LeafNode 或 LeafAttachment。
     *                因為 IRspec 中，此 BooleanType 可能定義於 macro，
     *                被多個 LeafNode 或 LeafAttachment 共用，所以無從紀錄其上一層，只得額外傳進來。
     * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
     *         本函式無。
     */
    visitBooleanType(v, updated, astLeaf) {
        // 規劃 0..1 或 1..1 的 boolean 利用 radio 呈現，
        //     不採用 checkbox，因為 0..1 的事實上有三種可能：true, false 或是從缺
        // 其他的則利用 editGrid 包裝很多的 radio
        if (astLeaf.cardinality.upper === 1) {
            // 型態
            updated.type = "radio";
            updated.inline = VisitorFormIO.formioInline;
            updated.values = [
                // {
                //     "label": (v.displayTrue !== null) ? v.displayTrue : "true",
                //     "value": "true"
                // },
                // 上面兩個 "true" 在 form.io 都會惹事，逃！逃！逃！
                {
                    "label": (v.displayTrue !== null)
                        ? v.displayTrue
                        : VisitorFormIO.formioTrue,
                    "value": VisitorFormIO.formioTrue
                },
                {
                    "label": (v.displayFalse !== null)
                        ? v.displayFalse
                        : VisitorFormIO.formioFalse,
                    "value": VisitorFormIO.formioFalse
                }
            ];
            // 預設值
            if (v.defaultValue !== null) {
                updated.defaultValue = v.defaultValue
                    ? VisitorFormIO.formioTrue
                    : VisitorFormIO.formioFalse;
            }
            // 是否 required 留到 visitCardinality() 再處理
        }
        else {
            // 外包裝的型態
            updated.type = "editgrid";
            updated.hideLabel = true;
            delete updated.labelPosition;
            delete updated.labelWidth;
            delete updated.labelMargin;
            updated.components = [
                {
                    key: VisitorFormIO.formioBooleanArrayElementName,
                    // label: updated.lable,  這種寫法不行，不懂
                    hideLabel: true,
                    tableView: true,
                    // 型態
                    type: "radio",
                    inline: VisitorFormIO.formioInline,
                    values: [
                        {
                            "label": (v.displayTrue !== null)
                                ? v.displayTrue
                                : VisitorFormIO.formioTrue,
                            "value": VisitorFormIO.formioTrue
                        },
                        {
                            "label": (v.displayFalse !== null)
                                ? v.displayFalse
                                : VisitorFormIO.formioFalse,
                            "value": VisitorFormIO.formioFalse
                        }
                    ],
                    // 讓 editgrid 裡面的 radio 一定 required
                    // 整個 boolean[] 多少筆靠 editgrid 的 min/maxlength 來控制
                    // 留到 visitCardinality() 再設定
                    validate: {
                        "required": true
                    }
                }
            ];
            // 因應上面「這種寫法不行」
            updated.components[0].label = updated.label;
            // 預設值
            if (v.defaultValue !== null) {
                updated.components[0].defaultValue = v.defaultValue
                    ? VisitorFormIO.formioTrue
                    : VisitorFormIO.formioFalse;
            }
        }
        // tooltip
        updated.tooltip += "  真偽值";
        updated.tooltip += ((v.displayTrue !== null) ? `  ${v.displayTrue}即為true` : "")
            + ((v.displayFalse !== null) ? `  ${v.displayFalse}即為false` : "");
        return []; // 沒有附加的 form.io 元件
    }
    /**
     * @param updated 半成品的 form.io 元件。
     *                將根據本 CodeType 直接增修參數。
     * @param astLeaf Abstract Syntax Tree 中，此 CodeType 所屬的 LeafNode 或 LeafAttachment。
     *                因為 IRspec 中，此 CodeType 可能定義於 macro，
     *                被多個 LeafNode 或 LeafAttachment 共用，所以無從紀錄其上一層，只得額外傳進來。
     * @param fqLeafParent 本 CodeType 所屬的 LeafNode 或是 LeafAttachment
     *                     在答案卷中上一層的 Fully Qualified name，
     *                     即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *                     因為題目卷裡面的 show=... 和 valid=... 判斷式必須用 fully qualified name，
     *                     所以由上而下一路傳進來。
     * @param fqAttachPrefix 倘若本 CodeType 有 attachment，
     *                       IR 中，該 attachement 的前半部完整名稱，
     *                       扣除該 attachment 補述的 Option 的 code。
     * @returns 若本 CodeType 有 Attachment，將以陣列的方式傳回各個 Attachment 對應的 form.io 元件。
     */
    visitCodeType(v, updated, astLeaf, fqLeafParent, fqAttachPrefix) {
        let formioOptions = v.options.map(x => x.accept(this));
        // 跳著跳著實際呼叫 visitOption()
        let formioDefaults = [];
        if (v.defaults !== null) {
            formioDefaults = v.defaults.map(x => VisitorFormIO.optionPrefix + x.code);
            // v2.1.4 主要修改，參見本檔案最上面註解對策一
        }
        // v2.1.4 異動，參見本檔案最上面註解對策二
        if (this.selectThreshold <= v.options.length) {
            // 採用 select
            updated.type = "select";
            updated.data = {
                values: formioOptions
            };
            if (astLeaf.cardinality.upper === 1) {
                if (formioDefaults.length > 0) {
                    // form.io 的 select 預設值採用 string
                    updated.defaultValue = formioDefaults[0];
                }
            }
            else {
                updated.multiple = true;
                if (formioDefaults.length > 0) {
                    // form.io 的 select + multiple 預設值採用 string[]
                    updated.defaultValue = formioDefaults;
                }
            }
        }
        else if (astLeaf.cardinality.upper === 1) {
            // 採用 radio
            updated.type = "radio";
            updated.values = formioOptions;
            updated.inline = VisitorFormIO.formioInline;
            if (formioDefaults.length > 0) {
                // form.io 的 radio 預設值採用 string
                updated.defaultValue = formioDefaults[0];
            }
        }
        else {
            // 採用 selectBoxes
            updated.type = "selectboxes";
            updated.values = formioOptions;
            updated.inline = VisitorFormIO.formioInline;
            if (formioDefaults.length > 0) {
                updated.defaultValue = {};
                for (let d of formioDefaults) {
                    updated.defaultValue[d] = true;
                }
            }
        }
        // 處理 attachment 後，回傳
        let attachments = [];
        for (let option of v.options) {
            if (option.attachment !== null) {
                attachments.push(...option.attachment.accept(this, astLeaf, fqLeafParent, `${fqLeafParent}.${updated.key}`, 
                // fqAttachPrefix + Attachment.sep + option.code    v2.2 異動
                fqAttachPrefix + _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_1__["Attachment"].sep + option.seqno)
                // 跳著跳著實際呼叫 visitNonLeafAttachment(), visitLeafAttachment()
                );
            }
        }
        return attachments;
    }
    /**
     * 把StructMD-IRspec 形式的選項轉成 Form.io 形式的選項。
     * @param v StructMD-IRspec 形式的選項。
     * @returns Form.io 形式的選項。
     */
    visitOption(v) {
        return {
            label: v.display,
            value: VisitorFormIO.optionPrefix + v.code
            // v2.1.4 主要修改，參見本檔案最上面註解對策一
        };
    }
    /**
     * @param astLeaf Abstract Syntax Tree 中，本 NonLeafAttachment
     *                所屬的 Option 所屬的 CodeType 所屬的 LeafNode 或 LeafAttachment。
     * @param fqLeafParent 本 NonLeafAttachment
     *                     所屬的 Option 所屬的 CodeType 所屬的 LeafNode 或 LeafAttachment
     *                     在答案卷中上一層的 Fully Qualified name，
     *                     即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *                     因為題目卷裡面的 show=... 和 valid=... 判斷式必須用 fully qualified name，
     *                     所以由上而下一路傳進來，
     *                     疊加本 NonLeafAttachment 對應的 form.io 元件 API property name 後
     *                     再一路往下傳。
     * @param fqSubject 本 NonLeafAttachment 的 subject 在答案卷中的 Fully Qualified name。
     * @param irAttachName IR 中，本 NonLeafAttachment 的名稱。
     * @returns 一個陣列，只有一個元素，即 form.io 的 panel + (container 或 editgrid)，
     *          container 或 editgrid 內含本 NonLeafAttachment 的 children 對應的 form.io 元件 。
     */
    visitNonLeafAttachment(v, astLeaf, fqLeafParent, fqSubject, irAttachName) {
        // 因為 form.io 的 container 和 editGrid 沒有畫出外框
        // 為了讓使用者看出樹狀結構的層層堆疊，在 container 和 editGrid 的外頭加一個 panel
        let result = [
            {
                type: "panel",
                theme: VisitorFormIO.formioPanelTheme,
                collapsible: VisitorFormIO.formioPanelCollapsible,
                // collapsed: VisitorFormIO.formioPanelCollapsible,
                collapsed: false,
                title: `${v.subject.display} 補述`,
                hideLabel: false,
                tooltip: "TBD",
                components: [
                    {
                        // 假如 NonLeafAttachment 的 cardinality.upper = 1，
                        // 採用 container 來裝此 NonLeafAttachment 的 children 產生的 form.io 元件
                        // 否則採用 editGrid
                        type: v.cardinality.upper === 1
                            ? "container"
                            : "editgrid",
                        key: irAttachName,
                        label: `${v.subject.display} 補述`,
                        hideLabel: true,
                        tooltip: v.description === null // 先把 IRspec 有的訊息放進來
                            ? "" // visitCardinality() 可能會補充
                            : `  ${v.description}`,
                        validate: {},
                        // 倘若沒有，底下再 delete
                        components: [] // 底下馬上加
                    }
                ]
            }
        ];
        let panel = result[0];
        let container = panel.components[0]; // 名叫 container，實際也可能是 editgrid
        // 設定本 NonLeafAttachment 現身的條件
        let formioCode = VisitorFormIO.optionPrefix + v.subject.code;
        let selectedCondition;
        if (astLeaf.cardinality.upper === 1) {
            // 適用於單選的 select 以及 radio
            selectedCondition = `${fqSubject}==="${formioCode}"`;
        }
        else if (this.selectThreshold <= astLeaf.type.options.length) {
            // 適用於多選的 select
            selectedCondition = `${fqSubject}.includes("${formioCode}")`;
        }
        else {
            // 適用於 selectBoxes
            selectedCondition = `${fqSubject}.${formioCode}`;
        }
        panel.customConditional = `show=${fqSubject}!==undefined&&${selectedCondition};`,
            // 考慮 cardinality
            // 跳著跳著實際呼叫 visitCardinality
            v.cardinality.accept(this, container, `${fqLeafParent}.${irAttachName}`);
        // 強迫症，看空的 validate 不順眼
        if (Object.keys(container.validate).length === 0) {
            delete container.validate;
        }
        // 把下層 container 或 editgrid 的 tooltip 搬到上層
        if (container.tooltip.length > 2) {
            // 加進去 tooltip 的子句前頭都會有兩個空白，拿掉最前面的
            panel.tooltip = container.tooltip.substring(2);
        }
        delete container.tooltip;
        // 把 NonLeafAttachment 的 children 放到 container 或 editgrid
        for (let child of v.children) {
            let p = result[0].type === "editgrid"
                ? "row" // editgrid 從 row 開始重新命名
                : `${fqLeafParent}.${irAttachName}`;
            container.components.push(...child.accept(this, `${p}`));
            // 跳著跳著實際呼叫 visitCommentNode(), visitNonLeafNode(),
            // visitLeafNode()
        }
        return result;
    }
    /**
     * @param astLeaf Abstract Syntax Tree 中，本 LeafAttachment
     *                所屬的 Option 所屬的 CodeType 所屬的 LeafNode 或 LeafAttachment。
     * @param fqLeafParent 本 LeafAttachment
     *                     所屬的 Option 所屬的 CodeType 所屬的 LeafNode 或 LeafAttachment
     *                     在答案卷中上一層的 Fully Qualified name，
     *                     即上面各層 form.io 元件 API property name 序列，由 data 開始一路點下來。
     *                     因為題目卷裡面的 show=... 和 valid=... 判斷式必須用 fully qualified name，
     *                     所以由上而下一路傳進來。
     * @param fqSubject 本 LeafAttachment 的 subject 在答案卷中的 Fully Qualified name。
     * @param irAttachName IR 中，本 LeafAttachment 的名稱。
     * @returns 本 LeafAttachment 對應的 form.io 元件組成的陣列。
     *          CodeType 有 Attachment 時，會有多個 form.io 元件。
     */
    visitLeafAttachment(v, astLeaf, fqLeafParent, fqSubject, irAttachName) {
        let result = [
            {
                type: "TBD",
                key: irAttachName,
                label: `${v.subject.display} 補述`,
                labelPosition: VisitorFormIO.formioLabelPosition,
                labelWidth: VisitorFormIO.formioLabelWidth,
                labelMargin: VisitorFormIO.formioLabelMargin,
                hideLabel: false,
                tableView: false,
                tooltip: v.description === null // 先把 IRspec 有的訊息放進來
                    ? "" // visitCardinality() 可能會補充
                    : `  ${v.description}`,
                validate: {} // visitCardinality() 可能會放東西
                // 倘若沒有，底下再 delete
            }
        ];
        // 把 type 加進去 result[0]，含這個欄位的上下限
        // 同時把附加的 form.io 元件(主要是 attachment)加進去 result
        result.push(...v.type.accept(this, // 所有 visitXXXType() 都會用
        result[0], // 所有 visitXXXType() 都會用
        v, // visitBooleanType() 和 visitCodeType() 會用
        fqLeafParent, // 只有 visitCodeType() 會用
        irAttachName // 只有 visitCodeType() 會用
        )); // 跳著跳著實際呼叫 visitXXXType()
        // 設定本 LeafAttachment 現身的條件
        let formioCode = VisitorFormIO.optionPrefix + v.subject.code;
        let selectedCondition;
        if (astLeaf.cardinality.upper === 1) {
            // 適用於單選的 select 以及 radio
            selectedCondition = `${fqSubject}==="${formioCode}"`;
        }
        else if (this.selectThreshold <= astLeaf.type.options.length) {
            // 適用於多選的 select
            selectedCondition = `${fqSubject}.includes("${formioCode}")`;
        }
        else {
            // 適用於 selectBoxes
            selectedCondition = `${fqSubject}.${formioCode}`;
        }
        result[0].customConditional = `show=${fqSubject}!==undefined&&${selectedCondition};`,
            // 考慮 cardinality
            // 跳著跳著實際呼叫 visitCardinality()
            v.cardinality.accept(this, result[0], `${fqLeafParent}.${irAttachName}`);
        // 強迫症，看空的 validate 不順眼
        if (Object.keys(result[0].validate).length === 0) {
            delete result[0].validate;
        }
        if (result[0].tooltip.length > 2) {
            // 加進去 tooltip 的子句前頭都會有兩個空白，拿掉最前面的
            result[0].tooltip = result[0].tooltip.substring(2);
        }
        else {
            delete result[0].tooltip;
        }
        if (result[0].defaultValue === undefined) {
            switch (result[0].type) {
                case "number": // 這些 form.io 元件可以顯示 placeholder
                case "textfield":
                case "textarea":
                case "datetime":
                case "time":
                case "select": // v2.1.4 新增
                    // 有 description 就用 description，不然抄 tooltip，好歹提供一些訊息
                    result[0].placeholder = v.description !== null
                        ? v.description
                        : result[0].tooltip;
            }
        }
        return result;
    }
    //..10...15...20...25...30...35...40...45...50...55...60...65...70...75...80...85...90...95..100
    // 底下用不到
    visitMacroMap(visitee) {
        throw new Error("Method not implemented.");
    }
    visitNonLeafMacro(visitee) {
        throw new Error("Method not implemented.");
    }
    visitLeafMacro(visitee) {
        throw new Error("Method not implemented.");
    }
}
VisitorFormIO.singleton = new VisitorFormIO();
// v2.1.4 把原來混在程式中的 Form.io 設定參數拉上來
// 更理想是寫在參數檔，由 static initializer 讀入，以後再說了
VisitorFormIO.formioPanelTheme = "info";
VisitorFormIO.formioPanelCollapsible = true;
VisitorFormIO.formioLabelPosition = "left-left";
VisitorFormIO.formioLabelWidth = 20;
VisitorFormIO.formioLabelMargin = 1;
VisitorFormIO.formioDecimalLimit = 5;
VisitorFormIO.formioDecimalEpsilon = 0.00001; // 即 10^(-formioDecimalLimit)
VisitorFormIO.formioInline = true;
VisitorFormIO.formioTrue = "TRUE"; // 直接用 true, flase 會惹事
VisitorFormIO.formioFalse = "FALSE";
VisitorFormIO.formioBooleanArrayElementName = "noname";
// v2.1.4 增加
VisitorFormIO.optionPrefix = "__";
// v2.1.4 增加
VisitorFormIO.optionMemo = "__FormioOptionMemo_"; // key-value-pair 的 key
VisitorFormIO.useSelect = 1; // key-value-pair 的 value
VisitorFormIO.useSelectBoxes = 2; // key-value-pair 的 value
// v2.2 新增
VisitorFormIO.datePrecisionPostfix = "__precision";


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _questionnaire_center_questionnaire_center_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./questionnaire-center/questionnaire-center.module */ "L/fE");
/* harmony import */ var _smart_auth_smart_auth_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./smart-auth/smart-auth.module */ "JUOo");









class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
            _questionnaire_center_questionnaire_center_module__WEBPACK_IMPORTED_MODULE_6__["QuestionnaireCenterModule"],
            _smart_auth_smart_auth_module__WEBPACK_IMPORTED_MODULE_7__["SmartAuthModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
        _questionnaire_center_questionnaire_center_module__WEBPACK_IMPORTED_MODULE_6__["QuestionnaireCenterModule"],
        _smart_auth_smart_auth_module__WEBPACK_IMPORTED_MODULE_7__["SmartAuthModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"],
        args: [{
                declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
                    _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                    _questionnaire_center_questionnaire_center_module__WEBPACK_IMPORTED_MODULE_6__["QuestionnaireCenterModule"],
                    _smart_auth_smart_auth_module__WEBPACK_IMPORTED_MODULE_7__["SmartAuthModule"],
                ],
                providers: [],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]],
            }]
    }], null, null); })();


/***/ }),

/***/ "hAIa":
/*!***************************************************!*\
  !*** ./src/app/smart-auth/fhir-client.service.ts ***!
  \***************************************************/
/*! exports provided: FhirClientService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FhirClientService", function() { return FhirClientService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fhirclient */ "qdye");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fhirclient__WEBPACK_IMPORTED_MODULE_2__);




class FhirClientService {
    constructor() {
        this.client = null;
    }
    // 封裝 FHIR.oauth2.ready 邏輯
    initializeClient() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (this.client)
                return this.client; // 如果已經有了，直接回傳
            try {
                const ReadyOptions = { code: sessionStorage.getItem('code_self'), stateKey: sessionStorage.getItem('state_self') };
                this.client = yield fhirclient__WEBPACK_IMPORTED_MODULE_2__["oauth2"].ready(ReadyOptions);
                return this.client;
            }
            catch (error) {
                console.error('FHIR Client 初始化失敗', error);
                throw error;
            }
        });
    }
    // 供其他頁面取得已建立的 client
    getClient() {
        if (!this.client) {
            throw new Error('Client 尚未初始化，請先呼叫 initializeClient');
        }
        return this.client;
    }
    // 包裝常用的 request 方法，減少重複程式碼
    request(url, options) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const client = this.getClient();
            return yield client.request(url, options);
        });
    }
}
FhirClientService.ɵfac = function FhirClientService_Factory(t) { return new (t || FhirClientService)(); };
FhirClientService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: FhirClientService, factory: FhirClientService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](FhirClientService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "tNLh":
/*!*****************************************************!*\
  !*** ./src/app/structure-ir/questionnaire-to-ir.ts ***!
  \*****************************************************/
/*! exports provided: QuestionnaireToIr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuestionnaireToIr", function() { return QuestionnaireToIr; });
/* harmony import */ var _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StructMD-IRspec */ "HRil");
/* harmony import */ var _VisitorFormIO__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VisitorFormIO */ "UsjP");


class QuestionnaireToIr {
    constructor() { }
    start(items) {
        const irSpec = {
            specNum: 0,
            display: "",
            child: this.traverseItems(items)
        };
        new _StructMD_IRspec__WEBPACK_IMPORTED_MODULE_0__["IRspec"](JSON.stringify(irSpec)); // IRspec在new的時候需要把input的irSpec轉成string
        const specNo = irSpec.specNum;
        const formTmpl = _VisitorFormIO__WEBPACK_IMPORTED_MODULE_1__["VisitorFormIO"].singleton.gen(specNo);
        return formTmpl;
    }
    /**
     * FHIR Questionnaire Item 遞迴走訪器
     * @param items Questionnaire.item 陣列
     * @param parentIR 你的 IR 樹狀結構父節點 (選填)
     */
    traverseItems(items, parentIR) {
        if (!items || items.length === 0)
            return [];
        return items.map(item => {
            // 1. 處理當前節點：將 FHIR Item 轉換為你的 IR 格式
            // 判斷該 node 的基數
            const card = `${item.required ? "1" : "0"}..${item.repeats ? "*" : "1"}`;
            const currentNode = {
                name: item.text,
                mName: item.linkId,
                card: card,
                child: [],
                type: this.mapFhirTypeToIR(item.type),
            };
            // 2. 遞迴點：如果該 item 還有子項目 (通常 type 為 group)
            if (item.item && item.item.length > 0 && item.type == 'group') {
                currentNode.child = this.traverseItems(item.item, currentNode);
                delete currentNode.type;
                return currentNode;
            }
            else {
                delete currentNode.child;
                // 處理 item 是 choice
                if (item.type === 'choice' || item.type === 'open-choice') {
                    currentNode['option'] = this.extractOptions(item);
                }
                return currentNode;
            }
        });
    }
    /**
     * 映射 FHIR 型別至你的 10 種 IR 型別
     */
    mapFhirTypeToIR(fhirType) {
        const mapping = {
            'decimal': 'decimal',
            'integer': 'integer',
            'string': 'string',
            'text': 'markdown',
            'date': 'date',
            'dateTime': 'dateTime',
            'boolean': 'boolean',
            'time': 'time',
            'attachment': 'base64Binary',
            'choice': 'code',
            'open-choice': 'code',
            'quantity': 'decimal' // 數值帶單位通常對應 decimal
        };
        return mapping[fhirType] || 'string';
    }
    /**
     * 提取 FHIR answerOption 並轉為 IR 的 OPTION_ARRAY
     */
    extractOptions(item) {
        if (!item.answerOption || !Array.isArray(item.answerOption)) {
            return [];
        }
        return item.answerOption.map((opt) => {
            // FHIR 的選項通常有這幾種可能，優先取 Coding
            if (opt.valueCoding) {
                return {
                    code: opt.valueCoding.code,
                    display: opt.valueCoding.display || opt.valueCoding.code
                };
            }
            else if (opt.valueString) {
                return {
                    code: opt.valueString,
                    display: opt.valueString
                };
            }
            else if (opt.valueInteger) {
                return {
                    code: opt.valueInteger.toString(),
                    display: opt.valueInteger.toString()
                };
            }
            return { code: 'unknown', display: '未知選項' };
        });
    }
}
QuestionnaireToIr.singleton = new QuestionnaireToIr();


/***/ }),

/***/ "vOHG":
/*!************************************************************************!*\
  !*** ./src/app/questionnaire-center/questionnaire-center.component.ts ***!
  \************************************************************************/
/*! exports provided: QuestionnaireCenterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuestionnaireCenterComponent", function() { return QuestionnaireCenterComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _structure_ir_questionnaire_to_ir__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../structure-ir/questionnaire-to-ir */ "tNLh");
/* harmony import */ var _smart_auth_fhir_client_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../smart-auth/fhir-client.service */ "hAIa");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _formio_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @formio/angular */ "oiZh");








function QuestionnaireCenterComponent_div_7_tr_36_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](13, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function QuestionnaireCenterComponent_div_7_tr_36_Template_button_click_15_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7); const q_r5 = ctx.$implicit; const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r6.selectQuestionnaire(q_r5.id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "\u9078\u64C7\u6B64\u554F\u5377");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const q_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](q_r5.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](q_r5.version);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMap"]("badge-" + q_r5.status);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](q_r5.status);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](q_r5.publisher);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](13, 7, q_r5.date, "yyyy-MM-dd"));
} }
function QuestionnaireCenterComponent_div_7_tr_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "td", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\u67E5\u7121\u554F\u5377\u8CC7\u6599");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function QuestionnaireCenterComponent_div_7_div_38_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function QuestionnaireCenterComponent_div_7_div_38_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r8.loadNextPage(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\u8F09\u5165\u66F4\u591A\u554F\u5377 (\u4E0B\u4E00\u9801)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function QuestionnaireCenterComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "input", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function QuestionnaireCenterComponent_div_7_Template_input_ngModelChange_3_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r10.searchTitle = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "\u767C\u5E03\u5340\u9593\uFF1A");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "input", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function QuestionnaireCenterComponent_div_7_Template_input_ngModelChange_7_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r12.dateStart = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "\u81F3");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "input", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function QuestionnaireCenterComponent_div_7_Template_input_ngModelChange_10_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r13.dateEnd = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "select", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function QuestionnaireCenterComponent_div_7_Template_select_ngModelChange_11_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r14.searchStatus = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "\u50C5\u986F\u793A\u555F\u7528 (Active)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "\u5DF2\u505C\u7528 (Retired)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "\u5168\u90E8\u72C0\u614B");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function QuestionnaireCenterComponent_div_7_Template_button_click_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r15.onSearch(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "\u641C\u5C0B");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "table", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "thead");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "\u6A19\u984C (Title)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "\u7248\u672C (Ver.)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "\u72C0\u614B (Status)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "\u767C\u5E03\u8005 (Publisher)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "\u767C\u5E03\u65E5\u671F (Date)");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "th");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, "\u64CD\u4F5C");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](36, QuestionnaireCenterComponent_div_7_tr_36_Template, 17, 10, "tr", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](37, QuestionnaireCenterComponent_div_7_tr_37_Template, 3, 0, "tr", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](38, QuestionnaireCenterComponent_div_7_div_38_Template, 3, 0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.searchTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.dateStart);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.dateEnd);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.searchStatus);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r0.questionnaireList);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.questionnaireList.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.nextUrl);
} }
function QuestionnaireCenterComponent_div_8_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "formio", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("form", ctx_r16.tmpl)("refresh", ctx_r16.triggerRefresh);
} }
function QuestionnaireCenterComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Form.io \u6E32\u67D3\u5340\u57DF");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "\u7576 IR \u8F49\u63DB\u5B8C\u6210\u5F8C\uFF0C\u8868\u55AE\u5C07\u5728\u6B64\u986F\u793A\u3002");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, QuestionnaireCenterComponent_div_8_div_6_Template, 2, 2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.tmpl);
} }
class QuestionnaireCenterComponent {
    constructor(fhirSvc) {
        this.fhirSvc = fhirSvc;
        this.questionnaireList = [];
        // 頁籤
        this.activeTab = "search";
        // 搜尋問卷標題
        this.searchTitle = "";
        // 搜尋問卷啟用狀態
        this.searchStatus = "all";
        // 下一頁的 url
        this.nextUrl = "";
        // 表單
        this.tmpl = {};
    }
    ngOnInit() {
        console.log('questionnaire component 當前原始網址：', window.location.href);
        this.fhirSvc.initializeClient()
            .then((client) => {
            client.request('Questionnaire')
                .then((bundle) => {
                this.questionnaireList = bundle.entry.map(x => x.resource);
                console.log('questionList', this.questionnaireList);
                console.log('questionList string', JSON.stringify(this.questionnaireList));
            });
        });
    }
    onSearch() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            // 構建查詢字串，加入 _elements 優化
            let url = `Questionnaire?_elements=id,title,status,version,publisher,date&_count=10`;
            if (this.searchTitle) {
                url += `&title:contains=${this.searchTitle}`;
            }
            if (this.searchStatus !== 'all') {
                url += `&status=${this.searchStatus}`;
            }
            if (this.dateStart) {
                url += `&date=ge${this.dateStart}`;
            }
            if (this.dateEnd) {
                url += `&date=le${this.dateEnd}`;
            }
            const bundle = yield this.fhirSvc.request(url);
            console.log('bundle', bundle);
            this.processBundle(bundle, false); // false 代表這是新搜尋，要清空舊列表
        });
    }
    processBundle(bundle, append) {
        // 1. 更新資料列表
        const newItems = (bundle.entry || []).map((e) => e.resource);
        this.questionnaireList = append ? [...this.questionnaireList, ...newItems] : newItems;
        // 2. 尋找下一頁的連結
        const nextLink = (bundle.link || []).find((l) => l.relation === 'next');
        this.nextUrl = nextLink ? nextLink.url : null;
    }
    loadNextPage() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (this.nextUrl) {
                // 這裡最關鍵：fhirclient 的 request 可以直接吃完整的 URL
                const bundle = yield this.fhirSvc.request(this.nextUrl);
                this.processBundle(bundle, true); // true 代表將資料附加在後面
            }
        });
    }
    selectQuestionnaire(id) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            console.log('選到的是', id);
            let url = `Questionnaire/${id}`;
            const bundle = yield this.fhirSvc.request(url);
            console.log('itemmm', bundle);
            this.activeTab = "render";
            const tmpl = _structure_ir_questionnaire_to_ir__WEBPACK_IMPORTED_MODULE_2__["QuestionnaireToIr"].singleton.start(bundle.item);
            this.tmpl = JSON.parse(JSON.stringify(tmpl));
            console.log('tmpl', tmpl);
            // formIo官方 refresh寫法
            this.triggerRefresh = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        });
    }
}
QuestionnaireCenterComponent.ɵfac = function QuestionnaireCenterComponent_Factory(t) { return new (t || QuestionnaireCenterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_smart_auth_fhir_client_service__WEBPACK_IMPORTED_MODULE_3__["FhirClientService"])); };
QuestionnaireCenterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: QuestionnaireCenterComponent, selectors: [["app-questionnaire-center"]], decls: 9, vars: 6, consts: [[1, "tab-container"], [1, "tabs"], [1, "tab-btn", 3, "click"], [1, "tab-content"], [4, "ngIf"], [1, "q-container"], [1, "search-toolbar"], ["type", "text", "placeholder", "\u641C\u5C0B\u554F\u5377\u6A19\u984C...", 1, "search-input", 3, "ngModel", "ngModelChange"], [1, "date-group"], ["type", "date", 1, "input-date", 3, "ngModel", "ngModelChange"], [1, "search-select", 3, "ngModel", "ngModelChange"], ["value", "active"], ["value", "retired"], ["value", "all"], [1, "btn-search", 3, "click"], [1, "q-table"], [4, "ngFor", "ngForOf"], ["class", "pagination-footer", 4, "ngIf"], [1, "btn-action", 3, "click"], ["colspan", "6", 2, "text-align", "center"], [1, "pagination-footer"], [1, "btn-next", 3, "click"], [1, "placeholder-box"], [3, "form", "refresh"]], template: function QuestionnaireCenterComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function QuestionnaireCenterComponent_Template_button_click_2_listener() { return ctx.activeTab = "search"; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, " \u554F\u5377\u67E5\u8A62\u6E05\u55AE ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function QuestionnaireCenterComponent_Template_button_click_4_listener() { return ctx.activeTab = "render"; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " \u8868\u55AE\u6E32\u67D3 ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, QuestionnaireCenterComponent_div_7_Template, 39, 7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, QuestionnaireCenterComponent_div_8_Template, 7, 1, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("active", ctx.activeTab === "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("active", ctx.activeTab === "render");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.activeTab === "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.activeTab === "render");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgModel"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["SelectControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgSelectOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_x"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _formio_angular__WEBPACK_IMPORTED_MODULE_6__["FormioComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["DatePipe"]], styles: ["@charset \"UTF-8\";\n.tab-container[_ngcontent-%COMP%] {\n  width: 100%;\n  margin: 0 auto;\n}\n.tabs[_ngcontent-%COMP%] {\n  display: flex;\n  border-bottom: 2px solid #e0e0e0;\n  background-color: #f8f9fa;\n}\n.tab-btn[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  border: none;\n  background: none;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 600;\n  color: #666;\n  transition: all 0.3s;\n}\n.tab-btn[_ngcontent-%COMP%]:hover {\n  background-color: #eee;\n}\n.tab-btn.active[_ngcontent-%COMP%] {\n  color: #007bff;\n  border-bottom: 3px solid #007bff;\n  margin-bottom: -2px;\n  \n}\n.tab-content[_ngcontent-%COMP%] {\n  padding: 20px;\n  border: 1px solid #e0e0e0;\n  border-top: none;\n  background-color: #fff;\n  min-height: 400px;\n}\n.placeholder-box[_ngcontent-%COMP%] {\n  border: 2px dashed #ccc;\n  padding: 40px;\n  text-align: center;\n  color: #999;\n}\n.q-container[_ngcontent-%COMP%] {\n  padding: 20px;\n  font-family: sans-serif;\n}\n.search-toolbar[_ngcontent-%COMP%] {\n  background: #f4f7f9;\n  padding: 15px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n  display: flex;\n  gap: 10px;\n  margin-bottom: 20px;\n}\n.search-input[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  padding: 8px;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n.search-select[_ngcontent-%COMP%] {\n  padding: 8px;\n  border-radius: 4px;\n}\n.btn-search[_ngcontent-%COMP%] {\n  padding: 8px 20px;\n  background: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.q-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  margin-top: 10px;\n}\n.q-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .q-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #eee;\n  padding: 12px;\n  text-align: left;\n}\n.q-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  color: #333;\n}\n.badge-active[_ngcontent-%COMP%] {\n  color: green;\n  font-weight: bold;\n}\n.badge-retired[_ngcontent-%COMP%] {\n  color: gray;\n}\n.btn-action[_ngcontent-%COMP%] {\n  background: #28a745;\n  color: white;\n  border: none;\n  padding: 5px 12px;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.pagination-footer[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  text-align: center;\n}\n.btn-next[_ngcontent-%COMP%] {\n  padding: 10px 30px;\n  background: white;\n  border: 1px solid #007bff;\n  color: #007bff;\n  border-radius: 20px;\n  cursor: pointer;\n  transition: 0.3s;\n}\n.btn-next[_ngcontent-%COMP%]:hover {\n  background: #007bff;\n  color: white;\n}\n.date-group[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #555;\n}\n.input-date[_ngcontent-%COMP%] {\n  padding: 6px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3F1ZXN0aW9ubmFpcmUtY2VudGVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdCQUFnQjtBQUFoQjtFQUNFLFdBQUE7RUFDQSxjQUFBO0FBRUY7QUFDQTtFQUNFLGFBQUE7RUFDQSxnQ0FBQTtFQUNBLHlCQUFBO0FBRUY7QUFDQTtFQUNFLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7RUFDQSxvQkFBQTtBQUVGO0FBQ0E7RUFDRSxzQkFBQTtBQUVGO0FBQ0E7RUFDRSxjQUFBO0VBQ0EsZ0NBQUE7RUFDQSxtQkFBQTtFQUFxQixXQUFBO0FBR3ZCO0FBQUE7RUFDRSxhQUFBO0VBQ0EseUJBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0VBQ0EsaUJBQUE7QUFHRjtBQUFBO0VBQ0UsdUJBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSxXQUFBO0FBR0Y7QUFBQTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtBQUdKO0FBQUE7RUFDSSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLFNBQUE7RUFDQSxtQkFBQTtBQUdKO0FBQUE7RUFDSSxZQUFBO0VBQ0EsWUFBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7QUFHSjtBQUFBO0VBQ0ksWUFBQTtFQUNBLGtCQUFBO0FBR0o7QUFBQTtFQUNJLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtBQUdKO0FBQUE7RUFDSSxXQUFBO0VBQ0EseUJBQUE7RUFDQSxnQkFBQTtBQUdKO0FBQUE7O0VBRUksNkJBQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7QUFHSjtBQUFBO0VBQ0kseUJBQUE7RUFDQSxXQUFBO0FBR0o7QUFBQTtFQUNJLFlBQUE7RUFDQSxpQkFBQTtBQUdKO0FBQUE7RUFDSSxXQUFBO0FBR0o7QUFBQTtFQUNJLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtBQUdKO0FBQUE7RUFDSSxnQkFBQTtFQUNBLGtCQUFBO0FBR0o7QUFBQTtFQUNJLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSx5QkFBQTtFQUNBLGNBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQUdKO0FBQUE7RUFDSSxtQkFBQTtFQUNBLFlBQUE7QUFHSjtBQUFBO0VBQ0ksZUFBQTtFQUNBLFdBQUE7QUFHSjtBQUFBO0VBQ0ksWUFBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7QUFHSiIsImZpbGUiOiJxdWVzdGlvbm5haXJlLWNlbnRlci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi50YWItY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuXG4udGFicyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjZTBlMGUwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO1xufVxuXG4udGFiLWJ0biB7XG4gIHBhZGRpbmc6IDEycHggMjRweDtcbiAgYm9yZGVyOiBub25lO1xuICBiYWNrZ3JvdW5kOiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICM2NjY7XG4gIHRyYW5zaXRpb246IGFsbCAwLjNzO1xufVxuXG4udGFiLWJ0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XG59XG5cbi50YWItYnRuLmFjdGl2ZSB7XG4gIGNvbG9yOiAjMDA3YmZmO1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgIzAwN2JmZjtcbiAgbWFyZ2luLWJvdHRvbTogLTJweDsgLyog6KaG6JOL5bqV6YOo6YKK5qGGICovXG59XG5cbi50YWItY29udGVudCB7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlMGUwZTA7XG4gIGJvcmRlci10b3A6IG5vbmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIG1pbi1oZWlnaHQ6IDQwMHB4O1xufVxuXG4ucGxhY2Vob2xkZXItYm94IHtcbiAgYm9yZGVyOiAycHggZGFzaGVkICNjY2M7XG4gIHBhZGRpbmc6IDQwcHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICM5OTk7XG59XG5cbi5xLWNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMjBweDtcbiAgICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbn1cblxuLnNlYXJjaC10b29sYmFyIHtcbiAgICBiYWNrZ3JvdW5kOiAjZjRmN2Y5O1xuICAgIHBhZGRpbmc6IDE1cHg7XG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBnYXA6IDEwcHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbn1cblxuLnNlYXJjaC1pbnB1dCB7XG4gICAgZmxleC1ncm93OiAxO1xuICAgIHBhZGRpbmc6IDhweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbn1cblxuLnNlYXJjaC1zZWxlY3Qge1xuICAgIHBhZGRpbmc6IDhweDtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5idG4tc2VhcmNoIHtcbiAgICBwYWRkaW5nOiA4cHggMjBweDtcbiAgICBiYWNrZ3JvdW5kOiAjMDA3YmZmO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLnEtdGFibGUge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbn1cblxuLnEtdGFibGUgdGgsXG4ucS10YWJsZSB0ZCB7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlZWU7XG4gICAgcGFkZGluZzogMTJweDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4ucS10YWJsZSB0aCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtcbiAgICBjb2xvcjogIzMzMztcbn1cblxuLmJhZGdlLWFjdGl2ZSB7XG4gICAgY29sb3I6IGdyZWVuO1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4uYmFkZ2UtcmV0aXJlZCB7XG4gICAgY29sb3I6IGdyYXk7XG59XG5cbi5idG4tYWN0aW9uIHtcbiAgICBiYWNrZ3JvdW5kOiAjMjhhNzQ1O1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgcGFkZGluZzogNXB4IDEycHg7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLnBhZ2luYXRpb24tZm9vdGVyIHtcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLmJ0bi1uZXh0IHtcbiAgICBwYWRkaW5nOiAxMHB4IDMwcHg7XG4gICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgIzAwN2JmZjtcbiAgICBjb2xvcjogIzAwN2JmZjtcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB0cmFuc2l0aW9uOiAwLjNzO1xufVxuXG4uYnRuLW5leHQ6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6ICMwMDdiZmY7XG4gICAgY29sb3I6IHdoaXRlO1xufVxuXG4uZGF0ZS1ncm91cCB7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGNvbG9yOiAjNTU1O1xufVxuXG4uaW5wdXQtZGF0ZSB7XG4gICAgcGFkZGluZzogNnB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xufSJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](QuestionnaireCenterComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-questionnaire-center',
                templateUrl: './questionnaire-center.component.html',
                styleUrls: ['./questionnaire-center.component.scss']
            }]
    }], function () { return [{ type: _smart_auth_fhir_client_service__WEBPACK_IMPORTED_MODULE_3__["FhirClientService"] }]; }, null); })();


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _smart_auth_launch_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./smart-auth/launch.component */ "SsXV");
/* harmony import */ var _questionnaire_center_questionnaire_center_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./questionnaire-center/questionnaire-center.component */ "vOHG");






const routes = [
    // { path: 'index', component: AppComponent },      // 處理回調 (或你的主畫面)
    // { path: '', redirectTo: 'index', pathMatch: 'full' }
    // { path: '', redirectTo: 'launch', pathMatch: 'full' },
    { path: '', component: _smart_auth_launch_component__WEBPACK_IMPORTED_MODULE_2__["LaunchComponent"] },
    {
        path: 'questionnaire-center',
        component: _questionnaire_center_questionnaire_center_component__WEBPACK_IMPORTED_MODULE_3__["QuestionnaireCenterComponent"],
    },
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, {
                useHash: true,
                onSameUrlNavigation: 'reload'
            })
        ], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, {
                        useHash: true,
                        onSameUrlNavigation: 'reload'
                    })
                ],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            }]
    }], null, null); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map
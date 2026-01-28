import moment, { Moment, isMoment } from "moment";
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
import {
  Visitor
} from "./Visitor";

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

export class VisitorFormIO implements Visitor {

  static singleton: VisitorFormIO = new VisitorFormIO();
  private constructor() { }

  // v2.1.4 把原來混在程式中的 Form.io 設定參數拉上來
  // 更理想是寫在參數檔，由 static initializer 讀入，以後再說了
  static formioPanelTheme: string = "info";
  static formioPanelCollapsible: boolean = true;
  static formioLabelPosition: string = "left-left";
  static formioLabelWidth: number = 20;
  static formioLabelMargin: number = 1;
  static formioDecimalLimit: number = 5;
  static formioDecimalEpsilon: number = 0.00001;  // 即 10^(-formioDecimalLimit)
  static formioInline: boolean = true;
  static formioTrue: string = "TRUE";             // 直接用 true, flase 會惹事
  static formioFalse: string = "FALSE";
  static formioBooleanArrayElementName: string = "noname";

  // v2.1.4 增加
  static optionPrefix: string = "__";

  // v2.1.4 增加，1 代表預設都用 select
  private selectThreshold: number = 1;

  // v2.1.4 增加
  static optionMemo: string = "__FormioOptionMemo_";  // key-value-pair 的 key
  static useSelect: number = 1;                       // key-value-pair 的 value
  static useSelectBoxes: number = 2;                  // key-value-pair 的 value

  // v2.2 新增
  static datePrecisionPostfix: string = "__precision";

  /** 把指定的 StructMD_IRspec 轉成 Form.io 題目卷。
   * @param specNum 指定的 StructMD_IRspec 編號。
   * @param selectThreshold 當 code 的 option 個數小於此參數時採用 radio 或 selectBoxes，
   *                        大於等於時採用 select。
   * @param outputFile 輸出的 Form.io 題目卷檔案名稱。
   *                   倘若從缺，輸出檔案名稱預設為 Form_<規格編號>.json。
   * @return 回傳 Form.io 題目卷的 JSON 字串。
   */
  gen(specNum: number,
    selectThreshold?: number,
    outputFile?: string): void | object // 乃人修改
  // outputFile?: string): void
  {
    if (selectThreshold !== undefined) {
      this.selectThreshold = selectThreshold;
    }

    let spec: IRspec = <IRspec>IRspec.get(specNum);
    if (outputFile === undefined) {
      outputFile = `Form_${spec.specNum}.json`;
    }
    return spec.accept(this) // 乃人修改
    // fs.writeFileSync(outputFile, JSON.stringify(spec.accept(this)));
    // 跳著跳著實際呼叫 visitIRspec()
  }

  visitIRspec(v: IRspec): any {
    let result: any = {
      components: [
        {
          type: "panel",
          theme: VisitorFormIO.formioPanelTheme,
          collapsible: VisitorFormIO.formioPanelCollapsible,
          collapsed: false, // 使用者填答時看到的第一層不收縮
          title: v.display !== null
            ? v.display
            : `表單(${v.specNum})`,
          tooltip: `這是 StructMD-IRspec 編號 ${v.specNum} 的表單`,
          components: []  // 底下馬上加
        }
      ]
    };

    let panel: any = result.components[0];

    for (let child of v.children) {
      panel.components.push(...child.accept(this, "data"));
      // 跳著跳著實際呼叫 visitCommentNode(), visitNonLeafNode(),
      // visitLeafNode()
    }

    return result;
  }

  visitCommentNode(v: CommentNode): any[] {
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
  visitNonLeafNode(v: NonLeafNode,
    fqParent: string): any[] {
    // 因為 form.io 的 container 和 editGrid 沒有畫出外框
    // 為了讓使用者看出樹狀結構的層層堆疊，在 container 和 editGrid 的外頭加一個 panel

    let result: any[] = [
      {
        type: "panel",
        theme: VisitorFormIO.formioPanelTheme,
        collapsible: VisitorFormIO.formioPanelCollapsible,
        collapsed: VisitorFormIO.formioPanelCollapsible,
        title: v.name,      // panel 的叫 title，其他的叫 label
        hideLabel: false,   // 不藏 title，讓使用者看
        tooltip: "TBD",     // 等下層的 tooltip 好了之後，再搬過來
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
            hideLabel: true,                // 藏 label，使用者可以看外層 panel 的 title
            tooltip: v.description === null // 先把 IRspec 有的訊息放進來
              ? ""                     // visitCardinality() 可能會補充
              : `  ${v.description}`,  // 然後會搬到上層 panel，再 delete
            validate: {},                   // visitCardinality() 可能會放東西
            // 倘若沒有，底下再 delete
            components: []                  // 底下馬上加
          }
        ]
      }
    ];

    let panel: any = result[0];
    let container: any = panel.components[0];  // 名叫 container，實際也可能是 editgrid

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
      let p: string = container.type === "editgrid"
        ? "row"  // editgrid 從 row 開始重新命名
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
  visitLeafNode(v: LeafNode,
    fqParent: string): any[] {
    let result: any[] = [
      {
        type: "TBD",                    // 由 visitXXXType 填入
        key: v.mName,
        label: v.name,
        labelPosition: VisitorFormIO.formioLabelPosition,
        labelWidth: VisitorFormIO.formioLabelWidth,
        labelMargin: VisitorFormIO.formioLabelMargin,
        hideLabel: false,               // 當然必須讓使用者看到這是什麼欄位
        tableView: v.isKey              // v2.1.4 新增
          ? true
          : false,               // undefned 視為 false
        tooltip: v.description === null // 先把 IRspec 有的訊息放進來
          ? ""                     // visitCardinality() 可能會補充
          : `  ${v.description}`,  // 假如最後是全空，再刪掉
        validate: {}                    // visitCardinality() 可能會放東西
        // 倘若沒有，底下再 delete
      }
    ];

    // 把 type 加進去 result[0]，含這個欄位的上下限
    // 同時把附加的 form.io 元件(主要是 attachment)加進去 result
    result.push(
      ...v.type.accept(
        this,          // 所有 visitXXXType() 都會用
        result[0],     // 所有 visitXXXType() 都會用
        v,             // visitBooleanType() 和 visitCodeType() 會用
        fqParent,      // visitDateType(), visitDateTimeType() 和 visitCodeType() 會用
        v.mName        // 只有 visitCodeType() 會用
      )
    );  // 跳著跳著實際呼叫 visitXXXType()

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
    } else {
      delete result[0].tooltip;
    }

    if (result[0].defaultValue === undefined) {
      switch (result[0].type) {
        case "number":      // 這些 form.io 元件可以顯示 placeholder
        case "textfield":
        case "textarea":
        case "datetime":
        case "time":
        case "select":      // v2.1.4 新增

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
  visitCondition(v: Condition,
    updated: any,
    fqSubject: string): void {
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
        = `show=${<boolean>v.value ? "!" : ""}(`
        + `${fqSubject}===undefined`
        + `||${fqSubject}===null`                  // null 也算 object
        + `||${fqSubject}===""`
        + `||`
        + `Array.isArray(${fqSubject})`       // 陣列也算 object
        + `&&${fqSubject}.reduce(`
        + `(a,x)=>(x===null||x===undefined||x==="")&&a,true`
        + `)`
        + `||`
        + `typeof ${fqSubject}==="object"`
        + `&&!Array.isArray(${fqSubject})`    // 第二句，null 沒有其他條件
        // 第四句，陣列還有 AND 其他條件
        // 所以多加這個，以確保是正統 object
        + `&&Object.values(${fqSubject}).reduce(`
        + `(a,x)=>(x===false)&&a,true`
        + `)`
        + `)`;
      return;
    }

    let subject: LeafNode = <LeafNode>v.subject;

    switch (v.operator) {
      case "ge":
        updated.customConditional
          = (subject.type instanceof DecimalType || subject.type instanceof IntegerType)
            ? `show=${<number>v.value}<=${fqSubject};`
            : `show=moment("${v.value}").isSameOrBefore(${fqSubject});`;
        return;

      case "lt":
        updated.customConditional
          = (subject.type instanceof DecimalType || subject.type instanceof IntegerType)
            ? `show=${<number>v.value}>${fqSubject};`
            : `show=moment("${v.value}").isAfter(${fqSubject});`;
        return;

      case "btw":
        if (subject.type instanceof DecimalType || subject.type instanceof IntegerType) {
          let n2: [number, number] = <[number, number]>v.value;
          updated.customConditional
            = `show=${n2[0]}<=${fqSubject}&&${fqSubject}<${n2[1]};`;

        } else /* datetime */ {
          let m2: [Moment, Moment] = <[Moment, Moment]>v.value;
          updated.customConditional
            = `show=moment("${m2[0]}").isSameOrBefore(${fqSubject})`
            + `&&moment("${m2[1]}").isAfter(${fqSubject});`;
        }
        return;

      case "eq":
        updated.customConditional = <boolean>v.value
          ? `show=${fqSubject}==="${VisitorFormIO.formioTrue}";`
          : `show=${fqSubject}==="${VisitorFormIO.formioFalse}";`;
        // form.io 的 radio 尚未選擇時給空字串
        return;

      case "has":
        // v2.1.4 新增，參見本檔案最上面註解對策一
        let formioCondValue: string = VisitorFormIO.optionPrefix + (<Option>v.value).code;

        let expr: string = "";

        if (subject.cardinality.upper === 1) {
          // 適用於單選的 select 以及 radio
          expr = `${fqSubject}==="${formioCondValue}"`;

        } else if (this.selectThreshold <= (<CodeType>subject.type).options.length) {
          // 適用於多選的 select
          expr = `${fqSubject}.includes("${formioCondValue}")`;

        } else {
          // 適用於 selectBoxes
          expr = `${fqSubject}.${formioCondValue}`;
        }

        updated.customConditional = `show=${expr};`;
        return;

      case "anyIn":
      case "allNotIn":
        // v2.1.4 新增，參見本檔案最上面註解對策一
        let astCondValues: Option[] = <Option[]>v.value;
        let formioCondValues: string
          = `[${astCondValues.map(x => `"${VisitorFormIO.optionPrefix}${x.code}"`)}]`;

        expr = "";

        if (subject.cardinality.upper === 1) {
          // 適用於單選的 select 以及 radio
          expr = `${formioCondValues}.includes(${fqSubject})`;

        } else if (this.selectThreshold <= (<CodeType>subject.type).options.length) {
          // 適用於多選的 select

          // 外圈的 x 固定，內圈的任一 y 若與 x 相等，則回傳 true
          let innerExpr: string = `(${fqSubject}.reduce((b,y)=>b||x===y,false))`;

          // 外圈的任一 x 若與內圈的某一 y 相等，則回傳 true
          expr = `${formioCondValues}.reduce((a,x)=>a||${innerExpr},false)`;

        } else {
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
  visitCardinality(v: Cardinality,
    updated: any,
    fqNode: string): void {
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
    let numRecord: string = v.lower === v.upper
      ? v.lower.toString()
      : `${v.lower}~${v.upper < Number.MAX_SAFE_INTEGER ? v.upper : ""}`;
    let isCodeType: boolean = updated.type === "select"
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

    } else if (updated.type === "radio") {
      // 0..1 和 1..1 的，利用 form.io 檢核機制即可，不用特別檢核

    } else if (updated.type === "select" && v.upper === 1) {
      // 0..1 和 1..1 的，利用 form.io 檢核機制即可，不用特別檢核

    } else if (updated.type === "select") {
      let invalid: string = "";
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

    } else if (updated.type === "selectboxes") {
      // selectboxes 利用 validate.minSelectedCount(maxSelectedCount) 即可
      if (v.lower > 1) {  // 2 以上才給，否則加上 required=true 會怪怪的
        updated.validate.minSelectedCount = v.lower;
      }
      if (v.upper > 1 && v.upper !== Number.MAX_SAFE_INTEGER) {
        updated.validate.maxSelectedCount = v.upper;
      }

    } else if (updated.type === "editgrid") {
      // // editgrid 利用 validate.minLength(maxLength) 即可
      // if (v.lower > 1) {  // 2 以上才給，否則加上 required=true 會怪怪的
      //     updated.validate.minLength = v.lower;
      // }
      // if (v.upper > 1 && v.upper !== Number.MAX_SAFE_INTEGER) {
      //     updated.validate.maxLength = v.upper;
      // }
      // editgrid 利用 validate.minLength(maxLength) 即可
      if (v.lower !== 0) {  // 2 以上才給，否則加上 required=true 會怪怪的
        updated.validate.minLength = v.lower;
      }
      if (v.upper !== Number.MAX_SAFE_INTEGER) {
        updated.validate.maxLength = v.upper;
      }

      if (v.lower > 0) {
        updated.openWhenEmpty = true;  // editgrid 尚無資料時，展開第一列
      }

    } else {
      // 0..1 和 1..1 的，沒有啟動 multiple，靠著 validate.required 應該就足以稽核
      if (v.upper > 1) {

        // 先啟動 multiple
        updated.multiple = true;

        // 製作 valid=... 的稽核判斷式
        // form.io 的 required 機制可以管控不得輸入空值，而且適用於 multiple 情境
        // 當 cardinality.lower = 0 時，因為要允許一筆都沒有，所以不能打開 required
        // 以至於每一筆都可以輸入空值，這不是我們想要的
        let xIsEmpty: string = `x===null||x===undefined||x===""`;
        let invalid1: string = "";  // 稽核多筆時不得有空值
        let invalid2: string = "";  // 稽核筆數錯誤

        // 已啟動 multiple，form.io 答案卷將存成陣列，length 代表筆數而不是字串長度
        invalid1 += `2<=${fqNode}.length`
          + "&&"
          + `${fqNode}.reduce((a,x)=>a||${xIsEmpty},false)`
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

        } else if (invalid1.length > 0) {
          updated.validate.custom = `valid=(${invalid1})`
            + `?"多筆時不得有空值"`
            + `:true;`;

        } else if (invalid2.length > 0) {
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
  visitDecimalType(v: DecimalType,
    updated: any): any[] {
    // 型態
    updated.type = "number";
    updated.decimalLimit = VisitorFormIO.formioDecimalLimit;

    // 預設值
    if (v.defaultValue !== null) {
      updated.defaultValue = v.defaultValue;
    }

    // 上下限
    let range: string = "";
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

    return [];  // 沒有附加的 form.io 元件
  }

  /**
   * @param updated 半成品的 form.io 元件。
   *                將根據本 IntegerType 直接增修參數，包含：型態、預設值、上下限檢核。
   *                tooltip 則附加型態與上下限的文字說明。
   * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
   *         本函式無。
   */
  visitIntegerType(v: IntegerType,
    updated: any): any[] {
    // 型態
    updated.type = "number";
    updated.decimalLimit = 0;

    // 預設值
    if (v.defaultValue !== null) {
      updated.defaultValue = v.defaultValue;
    }

    // 上下限
    let range: string = "";
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

    return [];  // 沒有附加的 form.io 元件
  }

  /**
   * @param updated 半成品的 form.io 元件。
   *                將根據本 StringType 直接增修參數，包含：型態、預設值、字數上下限檢核。
   *                tooltip 則附加型態與字數上下限的文字說明。
   * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
   *         本函式無。
   */
  visitStringType(v: StringType,
    updated: any): any[] {
    // 型態
    updated.type = "textfield";

    // 預設值
    if (v.defaultValue !== null) {
      updated.defaultValue = v.defaultValue;
    }

    // 上下限
    let range: string = "";
    if (v.lower !== null) {
      updated.validate.minLength = v.lower;
      range += `${v.lower}~`;
    }
    if (v.upper !== null) {
      updated.validate.maxLength = v.upper - 1;
      if (updated.validate.minLength === updated.validate.maxLength) {
        range = `${v.lower}`;
      } else {
        range += `~${v.upper - 1}`;
      }
    }

    // tooltip
    updated.tooltip += "  字串";
    if (range.length !== 0) {
      updated.tooltip += `  字數[${range.replace("~~", "~")}]`;
    }

    return [];  // 沒有附加的 form.io 元件
  }

  /**
   * @param updated 半成品的 form.io 元件。
   *                將根據本 MarkdownType 直接增修參數，包含：型態、預設值、字數上下限檢核。
   *                tooltip 則附加型態與字數上下限的文字說明。
   * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
   *         本函式無。
   */
  visitMarkdownType(v: MarkdownType,
    updated: any): any[] {
    // 型態
    updated.type = "textarea";

    // 預設值
    if (v.defaultValue !== null) {
      updated.defaultValue = v.defaultValue;
    }

    // 上下限
    let range: string = "";
    if (v.lower !== null) {
      updated.validate.minLength = v.lower;
      range += `${v.lower}~`;
    }
    if (v.upper !== null) {
      updated.validate.maxLength = v.upper - 1;
      if (updated.validate.minLength === updated.validate.maxLength) {
        range = `${v.lower}`;
      } else {
        range += `~${v.upper - 1}`;
      }
    }

    // tooltip
    updated.tooltip += "  請儘量以markdown呈現";
    if (range.length !== 0) {
      updated.tooltip += `  字數[${range.replace("~~", "~")}]`;
    }

    return [];  // 沒有附加的 form.io 元件
  }

  /**
   * @param updated 半成品的 form.io 元件。
   *                將根據本 Base64BinaryType 直接增修參數，包含：型態、預設值。
   *                tooltip 則附加型態的文字說明。
   * @return 附加到上一層的 form.io 元件 (updated 的兄弟姊妹)。
   *         本函式無。
   */
  visitBase64BinaryType(v: Base64BinaryType,
    updated: any): any[] {
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

    return [];  // 沒有附加的 form.io 元件
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
  visitDateTimeType(v: DateTimeType,
    updated: any,
    useless: LeafNode | LeafAttachment,
    fqLeafParent: string): any[] {
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
          updated.defaultValue = moment(v.defaultValue).format("YYYY-MM-DDTHH:mm:ssZ");
      }
    }

    // 上下限
    let range: string = "";
    if (v.lower !== null || v.upper !== null) {
      updated.datePicker = {};
      updated.widget = {};

      if (v.lower !== null) {
        // 根據 StructMD-IRspec 文法，v.lower 和 v.upper 應該是只有年月日
        let t: string = v.lower.format("YYYY-MM-DD");
        updated.datePicker.minDate = t;
        updated.widget.minDate = t;
        range += `${v.lower.format("YYYY-MM-DD")}~`;
      }

      if (v.upper !== null) {
        range += `~${v.upper.format("YYYY-MM-DD")}(不含)`;

        // v.upper 將會被減一秒，還沒有減之前先處理 range

        let t: string = v.upper.subtract(1, "s").format("YYYY-MM-DD");
        updated.datePicker.maxDate = t;
        updated.widget.maxDate = t;
      }
    }

    // tooltip
    updated.tooltip += "  日期時間";
    if (range.length !== 0) {
      updated.tooltip += `  範圍[${range.replace("~~", "~")}]`;
    }

    if (v.mustHave === DatePrecision.YMDT) {
      return [];  // 沒有附加的 form.io 元件
    }

    // mustHave 不為 YMDT 者，回傳一個選擇性的 radio 輸入元件，v2.2 新增
    let x: string = `${fqLeafParent}.${updated.key}`;
    let radio: any = {
      "type": "radio",
      "key": `${updated.key}${VisitorFormIO.datePrecisionPostfix}`,
      "label": `精確程度(${updated.label})`,
      "labelPosition": VisitorFormIO.formioLabelPosition,
      "labelWidth": VisitorFormIO.formioLabelWidth,
      "labelMargin": VisitorFormIO.formioLabelMargin,
      "tooltip": "筆數[1]  單選",
      "validate": { "required": true },
      "values": [],
      "defaultValue": `${VisitorFormIO.optionPrefix}${DatePrecision.YMDT.toFixed()}`,
      "inline": VisitorFormIO.formioInline,
      "customConditional":
        `show=!(`
        + `${x}===undefined||${x}===""`
        + `||`
        + `Array.isArray(${x})`
        + `&&`
        + `${x}.reduce((a,x)=>(x===undefined||x==="")&&a,true)`
        + `)`
    };

    switch (v.mustHave) {
      case undefined:
      case DatePrecision.Y:
        radio.values.push({
          "label": "只確定年",
          "value": `${VisitorFormIO.optionPrefix}${DatePrecision.Y.toFixed()}`
        });
        break;
      // fall through

      case DatePrecision.YM:
        radio.values.push({
          "label": "只確定年月",
          "value": `${VisitorFormIO.optionPrefix}${DatePrecision.YM.toFixed()}`
        });
        break;
      // fall through

      case DatePrecision.YMD:
        radio.values.push({
          "label": "只確定年月日",
          "value": `${VisitorFormIO.optionPrefix}${DatePrecision.YMD.toFixed()}`
        });
        radio.values.push({
          "label": "確定年月日時",
          "value": `${VisitorFormIO.optionPrefix}${DatePrecision.YMDT.toFixed()}`
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
  visitDateType(v: DateType,
    updated: any,
    useless: LeafNode | LeafAttachment,
    fqLeafParent: string): any[] {
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
          updated.defaultValue = moment(v.defaultValue).format("YYYY-MM-DDTHH:mm:ssZ");
      }
    }

    // 上下限
    let range: string = "";
    if (v.lower !== null || v.upper !== null) {
      updated.datePicker = {};
      updated.widget = {};

      if (v.lower !== null) {
        // 根據 StructMD-IRspec 文法，v.lower 和 v.upper 應該是只有年月日
        let t: string = v.lower.format("YYYY-MM-DD");
        updated.datePicker.minDate = t;
        updated.widget.minDate = t;
        range += `${v.lower.format("YYYY-MM-DD")}~`;
      }

      if (v.upper !== null) {
        range += `~${v.upper.subtract(1, "d").format("YYYY-MM-DD")}`;

        // v.upper 將會被減一秒，還沒有減之前先處理 range

        let t: string = v.upper.subtract(1, "s").format("YYYY-MM-DD");
        updated.datePicker.maxDate = t;
        updated.widget.maxDate = t;
      }
    }

    // tooltip
    updated.tooltip += "  日期";
    if (range.length !== 0) {
      updated.tooltip += `  範圍[${range.replace("~~", "~")}]`;
    }

    if (v.mustHave === DatePrecision.YMD) {
      return [];  // 沒有附加的 form.io 元件
    }

    // mustHave 不為 YMD 者，回傳一個選擇性的 radio 輸入元件，v2.2 新增
    let x: string = `${fqLeafParent}.${updated.key}`;
    let radio: any = {
      "type": "radio",
      "key": `${updated.key}${VisitorFormIO.datePrecisionPostfix}`,
      "label": `精確程度(${updated.label})`,
      "labelPosition": VisitorFormIO.formioLabelPosition,
      "labelWidth": VisitorFormIO.formioLabelWidth,
      "labelMargin": VisitorFormIO.formioLabelMargin,
      "tooltip": "筆數[1]  單選",
      "validate": { "required": true },
      "values": [],
      "defaultValue": `${VisitorFormIO.optionPrefix}${DatePrecision.YMD.toFixed()}`,
      "inline": VisitorFormIO.formioInline,
      "customConditional":
        `show=!(`
        + `${x}===undefined||${x}===""`
        + `||`
        + `Array.isArray(${x})`
        + `&&`
        + `${x}.reduce((a,x)=>(x===undefined||x==="")&&a,true)`
        + `)`
    };

    switch (v.mustHave) {
      case undefined:
      case DatePrecision.Y:
        radio.values.push({
          "label": "只確定年",
          "value": `${VisitorFormIO.optionPrefix}${DatePrecision.Y.toFixed()}`
        });
        break;
      // fall through

      case DatePrecision.YM:
        radio.values.push({
          "label": "只確定年月",
          "value": `${VisitorFormIO.optionPrefix}${DatePrecision.YM.toFixed()}`
        });
        radio.values.push({
          "label": "確定年月日",
          "value": `${VisitorFormIO.optionPrefix}${DatePrecision.YMD.toFixed()}`
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
  visitTimeType(v: TimeType,
    updated: any): any[] {
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

    return [];  // 沒有附加的 form.io 元件
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
  visitBooleanType(v: BooleanType,
    updated: any,
    astLeaf: LeafNode | LeafAttachment): any[] {
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

    } else {
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

    return [];  // 沒有附加的 form.io 元件
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
  visitCodeType(v: CodeType,
    updated: any,
    astLeaf: LeafNode | LeafAttachment,
    fqLeafParent: string,
    fqAttachPrefix: string): any[] {
    let formioOptions: object[] = v.options.map(x => x.accept(this));
    // 跳著跳著實際呼叫 visitOption()

    let formioDefaults: string[] = [];
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

      } else {
        updated.multiple = true;
        if (formioDefaults.length > 0) {
          // form.io 的 select + multiple 預設值採用 string[]
          updated.defaultValue = formioDefaults;
        }
      }

    } else if (astLeaf.cardinality.upper === 1) {
      // 採用 radio
      updated.type = "radio";
      updated.values = formioOptions;
      updated.inline = VisitorFormIO.formioInline;

      if (formioDefaults.length > 0) {
        // form.io 的 radio 預設值採用 string
        updated.defaultValue = formioDefaults[0];
      }

    } else {
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
    let attachments: any[] = [];
    for (let option of v.options) {
      if (option.attachment !== null) {
        attachments.push(
          ...option.attachment.accept(
            this,
            astLeaf,
            fqLeafParent,
            `${fqLeafParent}.${updated.key}`,
            // fqAttachPrefix + Attachment.sep + option.code    v2.2 異動
            fqAttachPrefix + Attachment.sep + option.seqno
          )
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
  visitOption(v: Option): any {
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
  visitNonLeafAttachment(v: NonLeafAttachment,
    astLeaf: LeafNode | LeafAttachment,
    fqLeafParent: string,
    fqSubject: string,
    irAttachName: string): any[] {
    // 因為 form.io 的 container 和 editGrid 沒有畫出外框
    // 為了讓使用者看出樹狀結構的層層堆疊，在 container 和 editGrid 的外頭加一個 panel

    let result: any[] = [
      {
        type: "panel",
        theme: VisitorFormIO.formioPanelTheme,
        collapsible: VisitorFormIO.formioPanelCollapsible,
        // collapsed: VisitorFormIO.formioPanelCollapsible,
        collapsed: false,                   // 既然已經挑選項了，讓使用者直接看到補述
        title: `${v.subject.display} 補述`, // panel 的叫 title，其他的叫 label
        hideLabel: false,                   // 不藏 title，讓使用者看
        tooltip: "TBD",                     // 等下層的 tooltip 好了之後，再搬過來
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
            hideLabel: true,                // 藏 label，使用者可以看外層 panel 的 title
            tooltip: v.description === null // 先把 IRspec 有的訊息放進來
              ? ""                     // visitCardinality() 可能會補充
              : `  ${v.description}`,  // 然後會搬到上層 panel，再 delete
            validate: {},                   // visitCardinality() 可能會放東西
            // 倘若沒有，底下再 delete
            components: []                  // 底下馬上加
          }
        ]
      }
    ];

    let panel: any = result[0];
    let container: any = panel.components[0];  // 名叫 container，實際也可能是 editgrid

    // 設定本 NonLeafAttachment 現身的條件
    let formioCode: string = VisitorFormIO.optionPrefix + v.subject.code;
    let selectedCondition: string;
    if (astLeaf.cardinality.upper === 1) {
      // 適用於單選的 select 以及 radio
      selectedCondition = `${fqSubject}==="${formioCode}"`;

    } else if (this.selectThreshold <= (<CodeType>astLeaf.type).options.length) {
      // 適用於多選的 select
      selectedCondition = `${fqSubject}.includes("${formioCode}")`;

    } else {
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
      let p: string = result[0].type === "editgrid"
        ? "row"  // editgrid 從 row 開始重新命名
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
  visitLeafAttachment(v: LeafAttachment,
    astLeaf: LeafNode | LeafAttachment,
    fqLeafParent: string,
    fqSubject: string,
    irAttachName: string): any[] {
    let result: any[] = [
      {
        type: "TBD",                    // 由 visitXXXType 填入
        key: irAttachName,
        label: `${v.subject.display} 補述`,
        labelPosition: VisitorFormIO.formioLabelPosition,
        labelWidth: VisitorFormIO.formioLabelWidth,
        labelMargin: VisitorFormIO.formioLabelMargin,
        hideLabel: false,               // 當然必須讓使用者看到這是什麼欄位
        tableView: false,
        tooltip: v.description === null // 先把 IRspec 有的訊息放進來
          ? ""                     // visitCardinality() 可能會補充
          : `  ${v.description}`,  // 假如最後是全空，再刪掉
        validate: {}                    // visitCardinality() 可能會放東西
        // 倘若沒有，底下再 delete
      }
    ];

    // 把 type 加進去 result[0]，含這個欄位的上下限
    // 同時把附加的 form.io 元件(主要是 attachment)加進去 result
    result.push(
      ...v.type.accept(
        this,          // 所有 visitXXXType() 都會用
        result[0],     // 所有 visitXXXType() 都會用
        v,             // visitBooleanType() 和 visitCodeType() 會用
        fqLeafParent,  // 只有 visitCodeType() 會用
        irAttachName   // 只有 visitCodeType() 會用
      )
    );  // 跳著跳著實際呼叫 visitXXXType()

    // 設定本 LeafAttachment 現身的條件
    let formioCode: string = VisitorFormIO.optionPrefix + v.subject.code;
    let selectedCondition: string;
    if (astLeaf.cardinality.upper === 1) {
      // 適用於單選的 select 以及 radio
      selectedCondition = `${fqSubject}==="${formioCode}"`;

    } else if (this.selectThreshold <= (<CodeType>astLeaf.type).options.length) {
      // 適用於多選的 select
      selectedCondition = `${fqSubject}.includes("${formioCode}")`;

    } else {
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
    } else {
      delete result[0].tooltip;
    }

    if (result[0].defaultValue === undefined) {
      switch (result[0].type) {
        case "number":      // 這些 form.io 元件可以顯示 placeholder
        case "textfield":
        case "textarea":
        case "datetime":
        case "time":
        case "select":      // v2.1.4 新增

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

  visitMacroMap(visitee: MacroMap): any {
    throw new Error("Method not implemented.");
  }
  visitNonLeafMacro(visitee: NonLeafMacro): any {
    throw new Error("Method not implemented.");
  }
  visitLeafMacro(visitee: LeafMacro): any {
    throw new Error("Method not implemented.");
  }
}

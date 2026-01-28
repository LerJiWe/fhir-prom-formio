import { IRspec } from "./StructMD-IRspec";
import { VisitorFormIO } from "./VisitorFormIO";

export class QuestionnaireToIr {

    static singleton: QuestionnaireToIr = new QuestionnaireToIr();

    constructor() { }

    public start(items: any[]) {
        const irSpec = {
            specNum: 0,
            display: "",
            child: this.traverseItems(items)
        }
        new IRspec(JSON.stringify(irSpec)); // IRspec在new的時候需要把input的irSpec轉成string
        const specNo = irSpec.specNum;
        const formTmpl = VisitorFormIO.singleton.gen(specNo)
        return formTmpl;
    }


    /**
     * FHIR Questionnaire Item 遞迴走訪器
     * @param items Questionnaire.item 陣列
     * @param parentIR 你的 IR 樹狀結構父節點 (選填)
     */
    private traverseItems(items: any[], parentIR?: any): any[] {
        if (!items || items.length === 0) return [];

        return items.map(item => {
            // 1. 處理當前節點：將 FHIR Item 轉換為你的 IR 格式

            // 判斷該 node 的基數
            const card = `${item.required ? "1" : "0"}..${item.repeats ? "*" : "1"}`;

            const currentNode = {
                name: item.text, // 顯示文字
                mName: item.linkId, // 唯一標識符
                card: card, // 基數
                child: [], // 初始化子節點
                type: this.mapFhirTypeToIR(item.type),    // 映射型別 (boolean -> checkbox 等)
            };

            // 2. 遞迴點：如果該 item 還有子項目 (通常 type 為 group)
            if (item.item && item.item.length > 0 && item.type == 'group') {
                currentNode.child = this.traverseItems(item.item, currentNode);
                delete currentNode.type;
                return currentNode;
            } else {
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
    private mapFhirTypeToIR(fhirType: string): string {
        const mapping: { [key: string]: string } = {
            'decimal': 'decimal',
            'integer': 'integer',
            'string': 'string',
            'text': 'markdown',     // FHIR text 通常較長，對應 markdown
            'date': 'date',
            'dateTime': 'dateTime',
            'boolean': 'boolean',
            'time': 'time',
            'attachment': 'base64Binary',
            'choice': 'code',       // 核心：選項類對應你的 code
            'open-choice': 'code',
            'quantity': 'decimal'   // 數值帶單位通常對應 decimal
        };
        return mapping[fhirType] || 'string';
    }

    /**
     * 提取 FHIR answerOption 並轉為 IR 的 OPTION_ARRAY
     */
    private extractOptions(item: any): any[] {
        if (!item.answerOption || !Array.isArray(item.answerOption)) {
            return [];
        }

        return item.answerOption.map((opt: any) => {
            // FHIR 的選項通常有這幾種可能，優先取 Coding
            if (opt.valueCoding) {
                return {
                    code: opt.valueCoding.code,
                    display: opt.valueCoding.display || opt.valueCoding.code
                };
            } else if (opt.valueString) {
                return {
                    code: opt.valueString,
                    display: opt.valueString
                };
            } else if (opt.valueInteger) {
                return {
                    code: opt.valueInteger.toString(),
                    display: opt.valueInteger.toString()
                };
            }
            return { code: 'unknown', display: '未知選項' };
        });
    }

}
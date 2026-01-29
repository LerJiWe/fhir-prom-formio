import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FhirClientService } from '../smart-auth/fhir-client.service';
import { QuestionnaireToIr } from '../structure-ir/questionnaire-to-ir';

@Component({
  selector: 'app-questionnaire-response',
  templateUrl: './questionnaire-response.component.html',
  styleUrls: ['./questionnaire-response.component.scss']
})
export class QuestionnaireResponseComponent implements OnInit {

  // 頁籤
  public activeTab: "search" | "render" = "search";

  // 搜尋問卷答案狀態
  public qrStatus: "completed" | "in-progress" | "all" = "all";

  public qrList: Array<any> = [];

  // 查找時間
  public qrDateStart: Date
  public qrDateEnd: Date

  // 下一頁的 url
  public nextUrl: string = "";

  constructor(private fhirSvc: FhirClientService, private router: Router) { }

  ngOnInit(): void {
  }

  // 找尋問卷答案清單
  public async onSearchQR() {
    // 構建查詢字串，加入 _elements 優化
    let url = `QuestionnaireResponse?_elements=id,authored,status,author&_count=10`;

    if (this.qrStatus !== 'all') {
      url += `&status=${this.qrStatus}`;
    }

    if (this.qrDateStart) {
      url += `&date=ge${this.qrDateStart}`;
    }
    if (this.qrDateEnd) {
      url += `&date=le${this.qrDateEnd}`;
    }

    const client = this.fhirSvc.getClient()
    client.patient
    url += `&subject=Patient/${client.patient.id}`;

    const bundle = await this.fhirSvc.request(url);
    console.log('bundle', bundle);
    this.processBundle(bundle, false); // false 代表這是新搜尋，要清空舊列表
  }

  processBundle(bundle: any, append: boolean) {
    // 1. 更新資料列表
    const newItems = (bundle.entry || []).map((e: any) => e.resource);
    this.qrList = append ? [...this.qrList, ...newItems] : newItems;

    // 2. 尋找下一頁的連結
    const nextLink = (bundle.link || []).find((l: any) => l.relation === 'next');
    this.nextUrl = nextLink ? nextLink.url : null;
  }

  // 跳回問卷選擇
  public backQuestionnaire() { this.router.navigate(['questionnaire-center']); }

  // 新建一筆填答
  public goToCreateNew() { }

  // 異動
  public goToEdit(id) { }

  public loadNextPage() { }

}

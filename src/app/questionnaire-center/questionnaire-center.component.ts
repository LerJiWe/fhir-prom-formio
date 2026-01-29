import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { FhirClientService } from '../smart-auth/fhir-client.service';
import { QuestionnaireToIr } from '../structure-ir/questionnaire-to-ir';

@Component({
  selector: 'app-questionnaire-center',
  templateUrl: './questionnaire-center.component.html',
  styleUrls: ['./questionnaire-center.component.scss']
})
export class QuestionnaireCenterComponent implements OnInit {

  public questionnaireList: any[] = [];

  // 頁籤
  public activeTab: "search" | "render" = "search";

  // 搜尋問卷標題
  public searchTitle: string = "";

  // 搜尋問卷啟用狀態
  public searchStatus: string = "all";

  public dateStart: Date
  public dateEnd: Date

  // 下一頁的 url
  public nextUrl: string = "";

  // 表單
  public tmpl = {};
  // 操控formIo refresh
  public triggerRefresh;

  constructor(private fhirSvc: FhirClientService, private router: Router) { }

  ngOnInit(): void {
    console.log('questionnaire component 當前原始網址：', window.location.href);
    this.fhirSvc.initializeClient()
      .then((client) => {
        client.request('Questionnaire')
          .then((bundle) => {
            this.questionnaireList = bundle.entry.map(x => x.resource);
            console.log('questionList', this.questionnaireList);
            console.log('questionList string', JSON.stringify(this.questionnaireList));
            this.processBundle(bundle, false); // false 代表這是新搜尋，要清空舊列表
          });
      });
  }

  public async onSearch() {
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

    const bundle = await this.fhirSvc.request(url);
    console.log('bundle', bundle);
    this.processBundle(bundle, false); // false 代表這是新搜尋，要清空舊列表
  }

  processBundle(bundle: any, append: boolean) {
    // 1. 更新資料列表
    const newItems = (bundle.entry || []).map((e: any) => e.resource);
    this.questionnaireList = append ? [...this.questionnaireList, ...newItems] : newItems;

    // 2. 尋找下一頁的連結
    const nextLink = (bundle.link || []).find((l: any) => l.relation === 'next');
    this.nextUrl = nextLink ? nextLink.url : null;
  }

  async loadNextPage() {
    if (this.nextUrl) {
      // 這裡最關鍵：fhirclient 的 request 可以直接吃完整的 URL
      const bundle = await this.fhirSvc.request(this.nextUrl);
      this.processBundle(bundle, true); // true 代表將資料附加在後面
    }
  }

  async selectQuestionnaire(id) {

    // this.router.navigate(['questionnaire-response']);

    console.log('選到的是', id);
    let url = `Questionnaire/${id}`;
    const bundle = await this.fhirSvc.request(url);
    console.log('itemmm', bundle);
    this.activeTab = "render";
    const tmpl = QuestionnaireToIr.singleton.start(bundle.item);
    this.tmpl = JSON.parse(JSON.stringify(tmpl));
    console.log('tmpl', tmpl);
    // formIo官方 refresh寫法
    this.triggerRefresh = new EventEmitter();
  }

}

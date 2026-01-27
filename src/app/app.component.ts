import { Component, isDevMode, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'fhir-prom-formio';

  constructor(private router: Router) {
  }

  async ngOnInit() {

    console.log('app component 當前原始網址：', window.location.href);

    const searchParams = new URLSearchParams(window.location.search);
    const hashPart = window.location.hash.split('?')[1]; // 取得 # 後面的 ? 內容
    const hashParams = new URLSearchParams(hashPart || '');
    const urlParams: URLSearchParams = searchParams;
    hashParams.forEach((value, key) => { urlParams.append(key, value) });

    await this.setURLSearchParams(urlParams);

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

    if (isDevMode()) {
    }
  }

  private async setURLSearchParams(urlParams: URLSearchParams) {
    for (let k of urlParams.keys()) {
      console.log('k', k, urlParams.get(k));
      await sessionStorage.setItem(`${k}_self`, urlParams.get(k));
    }

  }

  public showMsg(event) {
    console.log(event);
  }
}

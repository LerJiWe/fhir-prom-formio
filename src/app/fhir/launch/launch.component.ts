import { Component, OnInit } from '@angular/core';
import * as FHIR from 'fhirclient';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss']
})
export class LaunchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // 檢查 URL 中是否存在 iss 參數（無論是在 # 之前還是之後）
    const urlParams = new URLSearchParams(window.location.search);
    const iss = urlParams.get("iss");
    const launch = urlParams.get("launch");

    if (iss && launch) {
      // 如果在網址列抓到了 iss，手動傳給 authorize
      FHIR.oauth2.authorize({
        clientId: 'my_web_app',
        scope: 'launch openid fhirUser patient/*.read',
        redirectUri: 'fhir-prom-formio/fhir',
        iss: iss,
        launch: launch
      });
    } else {
      // 如果沒抓到，嘗試讓套件自己抓（原本的邏輯）
      FHIR.oauth2.authorize({
        clientId: 'my_web_app',
        scope: 'launch openid fhirUser patient/*.read'
      }).catch(err => console.error(err));
    }



  }

}

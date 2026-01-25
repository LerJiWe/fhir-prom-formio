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

    console.log('launch component 當前原始網址：', window.location.href);

    // 檢查 sessionStorage 中是否存在 iss 參數（無論是在 # 之前還是之後）
    const iss = sessionStorage.getItem('iss_self');
    const launch = sessionStorage.getItem('launch_self');

    console.log('launch/iss', iss);
    console.log('launch/launch', launch);

    if (iss && launch) {
      // 如果在網址列抓到了 iss，手動傳給 authorize
      FHIR.oauth2.authorize({
        clientId: 'my_web_app',
        scope: 'launch/patient openid fhirUser patient/*.read',
        redirectUri: '#/fhir',
        iss: iss,
        launch: launch
      });
    } else {
      // 如果沒抓到，嘗試讓套件自己抓（原本的邏輯）
      FHIR.oauth2.authorize({
        clientId: 'my_web_app',
        scope: 'launch/patient openid fhirUser patient/*.read'
      }).catch(err => console.error(err));
    }

  }

}

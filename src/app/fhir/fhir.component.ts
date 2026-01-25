import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import * as FHIR from 'fhirclient';
@Component({
  selector: 'app-fhir',
  templateUrl: './fhir.component.html',
  styleUrls: ['./fhir.component.scss']
})
export class FhirComponent implements OnInit {

  public patient: any;

  public meds: any;

  constructor(
    // private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('fhir component 當前原始網址：', window.location.href);

    // // 1. 從你手動存的備份中拿到 state
    // const myState = sessionStorage.getItem('state_self');

    // if (myState) {
    //   console.log('手動校準中，目標 State:', myState);

    //   // 2. 強行把所有可能的索引 Key 都設為這個 state
    //   // 這樣不管套件想找哪一個，都能找到正確的 JSON 記憶
    //   sessionStorage.setItem('SMART_KEY', myState);
    //   const fhirClientState = sessionStorage.getItem(myState);
    //   sessionStorage.setItem('fhir-client-state', fhirClientState);

    //   // 3. 檢查一下：那個以 state 值為 Key 的長 JSON 也要存在
    //   // (你之前說已經有看到這組了，所以這步通常沒問題)
    // }

    sessionStorage.setItem('fhir-client-state', JSON.stringify(sessionStorage.getItem('state_self')))

    FHIR.oauth2.ready()
      .then(client => {
        // 檢查 sessionStorage 裡面有沒有 fhir-client 存下的資料
        // console.log('SessionStorage 內容:', JSON.parse(sessionStorage.getItem('fhir-client-state') || '{}'));
        console.log('client', client);
        console.log('連線成功！', client.patient.id);
        // 現在你可以使用 client.request() 來抓取資料了

        if (!client.patient || !client.patient.id) {
          this.patient = "錯誤：未選定病人或 Scope 缺少 launch/patient";
          return;
        }

        const patientId = client.patient.id;
        console.log('病人 ID:', patientId);

        client.patient.read().then(
          (pt) => {
            // 找病人然後要顯示吧
            console.log('pt', pt);
            // 在拿到資料後執行：
            this.patient = JSON.stringify(pt, null, 4);
            // this.cdr.detectChanges(); // 強制 Angular 更新畫面
          },
          (error) => {
            this.patient = error.stack;
          }
        )

        client.request("MedicationRequest?patient=" + client.patient.id, {
          resolveReferences: ["medicationReference"],
          graph: true
        })
          .then((data) => {
            if (!data.entry || !data.entry.length) {
              throw new Error("No medications found for the selected patient");
            }
            return data.entry;
          })
          .then((meds) => {
            // 顯示吧不知道
            this.meds = JSON.stringify(meds, null, 4);
          }),
          (error) => {
            this.meds = error.stack;
          }
      })
      .catch(console.error);


  }

}

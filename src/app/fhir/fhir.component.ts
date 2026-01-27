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

  public questionnaire: any;

  constructor(
    // private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('fhir component 當前原始網址：', window.location.href);

    const ReadyOptions = { code: sessionStorage.getItem('code_self'), stateKey: sessionStorage.getItem('state_self') }

    FHIR.oauth2.ready(ReadyOptions)
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

        /**
         * Questionnaire/questionnaire 的 ID
         * Questionnaire?title=問卷名稱
         * Questionnaire?publisher=發布的人
         */
        client.request("Questionnaire/2c98768c-26a0-4bf5-903e-4f6151ca31b9")
          .then((questionnaire) => {
            this.questionnaire = JSON.stringify(questionnaire);
          })
          .catch(console.error);

        /**
         * 把 QuestionnaireResponse 寫入 FHIR Server
         */
        const questionnaireId = "";
        const myResponse = {
          resourceType: "QuestionnaireResponse",
          questionnaire: `Questionnaire/${questionnaireId}`,
          statue: "completed",
          subject: { reference: "Patient/" + client.patient.id }, // 關聯到目前並人
          item: [ /* 這裡放你轉換後的 formio reply */]
        };
        client.request({
          url: "QuestionnaireResponse",
          method: "POST",
          body: JSON.stringify(myResponse),
          headers: { "Content-Type": "application/fhir+json" }
        })
          .then((res) => console.log('存檔成功：', res))
          .catch((err) => console.error("存檔失敗：", err))

        /**
         * 撈出存入 FHIR Server 的 QuestionnaireResponse
         */
        client.request(`QuestionnaireResponse?subject=Patient/${client.patient.id}`)
        .then((bundle) => {
          console.log("該病人的歷史填答：", bundle.entry);
        })

        /**
         * 修改現有的答案卷
         */
        const responseId = ""
        client.request({
          url: `QuestionnaireResponse/${responseId}`,
          method: "PUT",
          body: JSON.stringify(myResponse)
        })

      })
      .catch(console.error);



  }

}

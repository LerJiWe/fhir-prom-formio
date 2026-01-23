import { Component, OnInit } from '@angular/core';
import * as FHIR from 'fhirclient';
@Component({
  selector: 'app-fhir',
  templateUrl: './fhir.component.html',
  styleUrls: ['./fhir.component.scss']
})
export class FhirComponent implements OnInit {

  public patient: any;

  public meds: any;

  constructor() { }

  ngOnInit(): void {
    FHIR.oauth2.ready()
      .then(client => {
        console.log('連線成功！', client.patient.id);
        // 現在你可以使用 client.request() 來抓取資料了

        client.patient.read().then(
          (pt) => {
            // 找病人然後要顯示吧
            this.patient = JSON.stringify(pt, null, 4);
          },
          (error) => {
            this.patient = error.stack;
          }
        )

        client.request("/MedicationRequest?patient=" + client.patient.id, {
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

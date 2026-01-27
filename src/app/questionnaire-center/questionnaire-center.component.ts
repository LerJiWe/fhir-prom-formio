import { Component, OnInit } from '@angular/core';

import { FhirClientService } from '../smart-auth/fhir-client.service';
import { client } from 'fhirclient';

@Component({
  selector: 'app-questionnaire-center',
  templateUrl: './questionnaire-center.component.html',
  styleUrls: ['./questionnaire-center.component.scss']
})
export class QuestionnaireCenterComponent implements OnInit {

  public questionnaireList: any[] = [];

  constructor(private fhirSvc: FhirClientService) { }

  ngOnInit(): void {
    console.log('questionnaire component 當前原始網址：', window.location.href);
    this.fhirSvc.initializeClient()
      .then((client) => {
        client.request('Questionnaire')
          .then((bundle) => {
            this.questionnaireList = bundle.entry.map(x => x.resource);
            console.log('questionList', this.questionnaireList);
            console.log('questionList string', JSON.stringify(this.questionnaireList));
          });
      });
  }

}

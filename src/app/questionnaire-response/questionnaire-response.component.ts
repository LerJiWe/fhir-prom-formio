import { Component, OnInit } from '@angular/core';

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

  constructor(private fhirSvc: FhirClientService) { }

  ngOnInit(): void {
  }

}

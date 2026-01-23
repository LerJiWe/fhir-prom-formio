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
    FHIR.oauth2.authorize({
      clientId: 'my_web_app',
      scope: 'launch openid fhirUser patient/*.read',
      redirectUri: 'fhir-prom-formio/fhir'
    });

  }

}

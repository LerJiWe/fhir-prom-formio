import { Component, isDevMode, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'fhir-prom-formio';

  constructor() { }

  ngOnInit() {

    this.setURLSearchParams();

    if (isDevMode()) {
    }
  }

  private setURLSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    for (let k of urlParams.keys()) {
      sessionStorage.setItem(k, urlParams.get(k));
    }

  }

  public showMsg(event) {
    console.log(event);
  }
}

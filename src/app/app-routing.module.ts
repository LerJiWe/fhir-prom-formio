import { FhirComponent } from './fhir/fhir.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchComponent } from './fhir/launch/launch.component';

const routes: Routes = [
  // { path: 'index', component: AppComponent },      // 處理回調 (或你的主畫面)
  // { path: '', redirectTo: 'index', pathMatch: 'full' }
  { path: '', redirectTo: 'launch', pathMatch: 'full' },
  { path: 'launch', component: LaunchComponent }, // 處理啟動
  {
    path: 'fhir',
    component: FhirComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

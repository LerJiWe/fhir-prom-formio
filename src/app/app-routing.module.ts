import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchComponent } from './smart-auth/launch.component';
import { QuestionnaireCenterComponent } from './questionnaire-center/questionnaire-center.component';

const routes: Routes = [
  // { path: 'index', component: AppComponent },      // 處理回調 (或你的主畫面)
  // { path: '', redirectTo: 'index', pathMatch: 'full' }
  // { path: '', redirectTo: 'launch', pathMatch: 'full' },
  { path: '', component: LaunchComponent }, // 處理啟動
  {
    path: 'questionnaire-center',
    component: QuestionnaireCenterComponent,
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

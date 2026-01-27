import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnaireCenterComponent } from './questionnaire-center.component';

@NgModule({
  declarations: [QuestionnaireCenterComponent],
  imports: [
    CommonModule,
  ],
  exports: [QuestionnaireCenterComponent]
})
export class QuestionnaireCenterModule { }

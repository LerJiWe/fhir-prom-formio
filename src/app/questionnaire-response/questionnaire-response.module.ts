import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuestionnaireResponseComponent } from './questionnaire-response.component';

@NgModule({
  declarations: [QuestionnaireResponseComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [QuestionnaireResponseComponent]
})
export class QuestionnaireResponseModule { }

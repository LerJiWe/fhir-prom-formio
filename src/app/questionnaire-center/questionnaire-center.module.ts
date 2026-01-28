import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// formio 用
import { FormioModule, Templates } from '@formio/angular';
import { Formio } from 'formiojs';
(Formio as any).cdn.setBaseUrl('/web/cdn/formio');
Templates.framework = 'bootstrap3';


import { QuestionnaireCenterComponent } from './questionnaire-center.component';

@NgModule({
  declarations: [QuestionnaireCenterComponent],
  imports: [
    CommonModule,
    FormsModule,

    FormioModule
  ],
  exports: [QuestionnaireCenterComponent]
})
export class QuestionnaireCenterModule { }

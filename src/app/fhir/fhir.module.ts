import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirComponent } from './fhir.component';



@NgModule({
  declarations: [FhirComponent,],
  imports: [
    CommonModule
  ],
  exports: [FhirComponent]
})
export class FhirModule { }

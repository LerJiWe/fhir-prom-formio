import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirComponent } from './fhir.component';
import { LaunchComponent } from './launch/launch.component';



@NgModule({
  declarations: [FhirComponent, LaunchComponent],
  imports: [
    CommonModule
  ],
  exports: [FhirComponent]
})
export class FhirModule { }

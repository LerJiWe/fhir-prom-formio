import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaunchComponent } from './launch.component';
import { FhirClientService } from './fhir-client.service';

@NgModule({
  declarations: [LaunchComponent],
  imports: [
    CommonModule
  ],
  providers: [FhirClientService]
})
export class SmartAuthModule { }

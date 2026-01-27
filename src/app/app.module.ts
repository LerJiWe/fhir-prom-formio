import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QuestionnaireCenterModule } from './questionnaire-center/questionnaire-center.module';
import { SmartAuthModule } from './smart-auth/smart-auth.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    QuestionnaireCenterModule,
    SmartAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

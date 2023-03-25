import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
// Components
import { RecordAudioComponent } from './Record-Audio/Recordaudio.component';

@NgModule({
  declarations: [
    AppComponent,
    RecordAudioComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FixHomeModule } from './fixhome.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FixHomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

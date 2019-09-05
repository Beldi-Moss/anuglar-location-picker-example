import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {AgmCoreModule} from '@agm/core';
import { environment } from '../environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { SpinnerComponent } from './spinner-overlay/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SpinnerOverlayComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireStorageModule,
  AgmCoreModule.forRoot({
    apiKey: 'AIzaSyCVEHJmurfGgEBaZthMP-wBCfDI7F6iQJQ'
  }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

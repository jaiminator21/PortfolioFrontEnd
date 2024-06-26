import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { CarousalComponent } from './components/carousal/carousal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './pages/register/register.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { VideogamesComponent } from './pages/videogames/videogames.component';
import { ViewVideogameComponent } from './pages/view-videogame/view-videogame.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from "@angular/material/icon";
import { TestComponent } from './pages/test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    CarousalComponent,
    AboutmeComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    VideogamesComponent,
    ViewVideogameComponent,
    TestComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  providers: [provideAnimations(),],
  bootstrap: [AppComponent]
})
export class AppModule { }

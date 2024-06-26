import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AboutmeComponent } from './pages/aboutme/aboutme.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VideogamesComponent } from './pages/videogames/videogames.component';
import { ViewVideogameComponent } from './pages/view-videogame/view-videogame.component';
import { TestComponent } from './pages/test/test.component';





const routes: Routes = [
  { path: '', component: AboutmeComponent },
  { path: 'about', component: AboutmeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'games', component: VideogamesComponent },
  { path: 'games/:id', component: ViewVideogameComponent },
  { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

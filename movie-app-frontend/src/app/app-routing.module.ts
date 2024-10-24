import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubmitMovieComponent } from './components/submit-movie/submit-movie.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile/:username', component: ProfileComponent},
  { path: 'submit_movie', component: SubmitMovieComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

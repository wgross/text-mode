import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'home', component: WelcomeComponent },
  { path: 'profile', component: ProfileComponent }
]
@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forRoot(routes)],
    [RouterModule]
  ],
  exports:[
    [RouterModule]
  ]
})
export class AppRoutingModule { }

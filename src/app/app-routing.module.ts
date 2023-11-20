import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/landing/home/home.component';
import { IndexComponent } from './pages/index/index.component';
import { ProfilepageComponent } from './pages/examples/profilepage/profilepage.component';
import { RegisterpageComponent } from './pages/examples/registerpage/registerpage.component';
import { LandingpageComponent } from './pages/examples/landingpage/landingpage.component';

import { RegisterComponent } from './pages/landing/register/register.component';
import { VotingComponent } from './pages/landing/voting/voting.component';
import { RanksComponent } from './pages/landing/ranks/ranks.component';
import { ActionComponent } from './pages/landing/action/action.component';
import { CratesComponent } from './pages/landing/crates/crates.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'action', component: ActionComponent },
  { path: 'voting', component: VotingComponent },
  { path: 'home2', component: IndexComponent },
  { path: 'profile', component: ProfilepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'ranks', component: RanksComponent },
  { path: 'crates', component: CratesComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then((mod) => mod.AdminModule) },
  { path: 'wiki', loadChildren: () => import('./wiki/wiki.module').then((mod) => mod.WikiModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {  scrollPositionRestoration: 'top' })

  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

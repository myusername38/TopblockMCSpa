import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WikiComponent } from './wiki.component';
import { WikiVotingComponent } from './components/wiki-voting/wiki-voting.component';

const routes: Routes = [
  {
    path: ':id',
    component: WikiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WikiRoutingModule { }

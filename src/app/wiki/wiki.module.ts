import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WikiRoutingModule } from './wiki-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { WikiVotingComponent } from './components/wiki-voting/wiki-voting.component';
import { WikiComponent } from './wiki.component';
import { WikiRulesComponent } from './components/wiki-rules/wiki-rules.component';
import { SharedComponentsModule } from '../components/shared-components.module';
import { WikiFeaturesComponent } from './components/wiki-features/wiki-features.component';
import { MarkdownModule } from 'ngx-markdown';
import { WikiContentComponent } from './components/wiki-content/wiki-content.component';


@NgModule({
  declarations: [
    WikiVotingComponent,
    WikiComponent,
    WikiRulesComponent,
    WikiFeaturesComponent,
    WikiContentComponent,
  ],
  imports: [
    CommonModule,
    WikiRoutingModule,
    RouterModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    ModalModule.forRoot(),
  ]
})
export class WikiModule { }

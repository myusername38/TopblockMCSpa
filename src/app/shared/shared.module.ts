import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDualSelectorComponent } from './form-dual-selector/form-dual-selector.component';
import { FormDropdownComponent } from './form-dropdown/form-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';



@NgModule({
  declarations: [
    FormDualSelectorComponent,
    FormDropdownComponent,
    
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
  ], 
  exports: [
    FormDualSelectorComponent,
    FormDropdownComponent,
  ]
})
export class SharedModule { }

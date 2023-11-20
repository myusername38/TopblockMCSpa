import { NgModule } from "@angular/core";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { AnnouncementsComponent } from "./pages/announcements/announcements.component";
import { AnnoucementsEditorComponent } from "./pages/annoucements-editor/annoucements-editor.component";
import { AdminHomeComponent } from "./pages/admin-home/admin-home.component";
import { ManageStaffComponent } from "./pages/manage-staff/manage-staff.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { AlertModule } from "ngx-bootstrap/alert";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { PopoverModule } from "ngx-bootstrap/popover";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SharedComponentsModule } from "../components/shared-components.module";
import { CommonModule } from "@angular/common";
import { ManagePlayersComponent } from './pages/manage-players/manage-players.component';
import { ViewPlayerRecordComponent } from './pages/view-player-record/view-player-record.component';
import { ConsumablesGivenChartComponent } from './components/consumables-given-chart/consumables-given-chart.component';
import { ConsumablesReedemedChartComponent } from './components/consumables-reedemed-chart/consumables-reedemed-chart.component';
import { MangeServerComponent } from './pages/mange-server/mange-server.component';
import { NgTerminalModule } from "ng-terminal";
import { PlayerVotesChartComponent } from './components/player-votes-chart/player-votes-chart.component';

@NgModule({
  declarations: [
    AdminComponent,
    AnnouncementsComponent,
    AnnoucementsEditorComponent,
    AdminHomeComponent,
    ManageStaffComponent,
    ManagePlayersComponent,
    ViewPlayerRecordComponent,
    ConsumablesGivenChartComponent,
    ConsumablesReedemedChartComponent,
    MangeServerComponent,
    PlayerVotesChartComponent,
  ],
  imports: [
    AdminRoutingModule,
    FormsModule,
    NgTerminalModule,
    CommonModule, // Use CommonModule
    ReactiveFormsModule,
    SharedComponentsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot()
  ],
})
export class AdminModule {}

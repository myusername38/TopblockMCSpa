import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AdminHomeComponent } from "./pages/admin-home/admin-home.component";
import { ManageStaffComponent } from "./pages/manage-staff/manage-staff.component";
import { GuardRequirement } from "../enums/guard-requirement.enum";
import { AuthGuard } from "../guards/auth-guard.service";
import { ManagePlayersComponent } from "./pages/manage-players/manage-players.component";
import { ViewPlayerRecordComponent } from "./pages/view-player-record/view-player-record.component";
import { MangeServerComponent } from "./pages/mange-server/mange-server.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "home",
        component: AdminHomeComponent,
      },
      {
        path: 'staff',
        component: ManageStaffComponent,
      },
      {
        path: 'players', 
        component: ManagePlayersComponent,
      },
      {
        path: 'server', 
        component: MangeServerComponent,
      },
      {
        path: 'view-player/:uuid',
        component: ViewPlayerRecordComponent,
      }
    ],
    canActivate: [AuthGuard],
    data: {
      roles: [GuardRequirement.senoirMod],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

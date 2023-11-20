import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SnackbarType } from "src/app/enums/snackbar-type.enum";
import { StaffRank } from "src/app/enums/staff-rank.enum";
import {
  AddFormItem,
  DialogFormData,
  FormItem,
} from "src/app/interface/misc/dialog-form-data";
import { Player } from "src/app/interface/player/player";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { PlayerService } from "src/app/services/player.service";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  selector: "app-manage-staff",
  templateUrl: "./manage-staff.component.html",
  styleUrls: ["./manage-staff.component.scss"],
})
export class ManageStaffComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  players: Player[] = [];
  unsubscribe;
  width: number = window.screen.width;

  get isSmall() {
    return this.width < 600;
  }

  constructor(
    private db: AngularFirestore,
    private snackbarService: SnackbarService,
    private loadingService: LoadingService,
    private playerService: PlayerService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.width = event.target.innerWidth;
  }

  ngOnInit(): void {
    this.unsubscribe = this.db
      .collection("player")
      .ref.where("staffRank", "!=", "")
      .onSnapshot((data) => {
        this.players = data.docs.map((x) => x.data() as Player);
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  generateCallback(uuid: string) {
    const updateStaffRank = this.playerService.updateStaffRank.bind(
      this.playerService
    );
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    return async function (data: { staffRank: string }): Promise<string> {
      try {
        loading("Updating Staff Rank...");
        await updateStaffRank(uuid, data.staffRank);

        showSnackbar(
          "Staff Rank Successfully updated",
          SnackbarType.success,
          4000
        );
      } catch (err) {
        showSnackbar(
          `Error updating Staff Rank - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  updateStaffRank(player: Player) {
    const formItems: FormItem[] = [
      {
        slug: "staffRank",
        name: "Staff Rank",
        required: true,
        placeholder: "Staff Rank",
        focused: false,
        type: AddFormItem.select,
        currentValue: player.staffRank,
        selectItems: [
          { name: "Owner", slug: StaffRank.owner },
          { name: "Admin", slug: StaffRank.developer },
          { name: "Manager", slug: StaffRank.seniorMod },
          { name: "Mod", slug: StaffRank.mod },
          { name: "Helper", slug: StaffRank.helper },
          { name: "Player", slug: StaffRank.player },
        ],
      },
    ];
    const dialogData: DialogFormData = {
      title: "Update Staff Rank",
      subtitle: `Only publish when you are sure you want to update levels accross all of Langabe!`,
      submitText: "Update",
      formItems,
      callback: this.generateCallback(player.uuid),
    };
    this.dialogService.showFormDialog(dialogData);
  }

  generateCallbackUsername() {
    const updateStaffRank = this.playerService.updateStaffRankByUsername.bind(
      this.playerService
    );
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    return async function (data: {
      staffRank: StaffRank;
      username: string;
    }): Promise<string> {
      try {
        loading("Updating Staff Rank...");
        await updateStaffRank(data.username, data.staffRank);

        showSnackbar(
          "Staff Rank Successfully updated",
          SnackbarType.success,
          4000
        );
      } catch (err) {
        showSnackbar(
          `Error updating Staff Rank - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  addStaffMember() {
    const formItems: FormItem[] = [
      {
        slug: "username",
        name: "Username",
        required: true,
        placeholder: "Username",
        focused: false,
        icon: "icon-single-02",
        type: AddFormItem.text,
      },
      {
        slug: "staffRank",
        name: "Staff Rank",
        required: true,
        placeholder: "Staff Rank",
        focused: false,
        type: AddFormItem.select,
        selectItems: [
          { name: "Owner", slug: StaffRank.owner },
          { name: "Admin", slug: StaffRank.developer },
          { name: "Manager", slug: StaffRank.seniorMod },
          { name: "Mod", slug: StaffRank.mod },
          { name: "Helper", slug: StaffRank.helper },
          { name: "Player", slug: StaffRank.player },
        ],
      },
    ];
    const dialogData: DialogFormData = {
      title: "Add Player to Staff",
      subtitle: `Only publish when you are sure you want to update levels accross all of Langabe!`,
      submitText: "Add",
      formItems,
      callback: this.generateCallbackUsername(),
    };
    this.dialogService.showFormDialog(dialogData);
  }

  home() {
    this.router.navigate(['admin/home'])
  }
}

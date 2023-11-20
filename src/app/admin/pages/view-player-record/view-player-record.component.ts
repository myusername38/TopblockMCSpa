import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { ClipboardService } from "ngx-clipboard";
import { Subscription } from "rxjs";
import { ButtonType } from "src/app/enums/button-type.enum";
import { PlayerAction } from "src/app/enums/player-actions/player-action.enum";
import { PlayerPunishment } from "src/app/enums/player-actions/player-punishment.enum";
import { PlayerTempPunishment } from "src/app/enums/player-actions/player-temp-punishment.enum";
import { Rank } from "src/app/enums/rank.enum";
import { SnackbarType } from "src/app/enums/snackbar-type.enum";
import { Consumable, ItemType } from "src/app/interface/consumable/consumable";
import {
  AddFormItem,
  DialogFormData,
  FormItem,
} from "src/app/interface/misc/dialog-form-data";
import { Player } from "src/app/interface/player/player";
import { ConsumableService } from "src/app/services/consumable.service";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { PlayerService } from "src/app/services/player.service";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  selector: "app-view-player-record",
  templateUrl: "./view-player-record.component.html",
  styleUrls: ["./view-player-record.component.scss"],
})
export class ViewPlayerRecordComponent implements OnInit, OnDestroy {
  player: Player;
  playerUUID: string;
  unsubscribe: Function;

  width: number = window.screen.width;
  pageIndex: number = 1;
  pageSize: number = 20;

  lastDoc: any; // the firebase document to query off of
  query: any;
  hasMoreDocuments: boolean;
  shownConsumables: Consumable[] = [];
  consumables: Consumable[] = [];

  consumablesType: string = "given";
  selectItems = [
    { name: "Given", slug: "given" },
    { name: "Redeemed", slug: "redeemed" },
    { name: "Vote record", slug: "votes" },
  ];

  get selectedItem() {
    return this.selectItems.find((x) => x.slug === this.consumablesType).name;
  }

  get numPages() {
    return Math.ceil(this.consumables.length / this.pageSize);
  }

  get isSmall() {
    return this.width < 600;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private snackbarService: SnackbarService,
    private loadingService: LoadingService,
    private clipboardService: ClipboardService,
    private consumableService: ConsumableService,
    private dialogService: DialogService,
    private playerService: PlayerService,
  ) {
    this.playerUUID = this.route.snapshot.paramMap.get("uuid").toLowerCase();
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.width = event.target.innerWidth;
  }
  ngOnDestroy(): void {
    this.unsubscribe();
  }
  ngOnInit(): void {
    this.loadingService.loading("Loading player...");
    this.unsubscribe = this.db
      .doc(`player/${this.playerUUID}`)
      .ref.onSnapshot((doc) => {
        const player = doc.data() as Player;
        if (!player) {
          this.router.navigate(["admin/players"]);
          this.snackbarService.showSnackbar(
            "Player not found",
            SnackbarType.warning,
            3000
          );
        }
        if (!this.player) {
          this.loadingService.loadingEnded();
        }
        this.player = player;
      });
    this.init();
  }

  async init() {
    await this.getConsumables(this.pageSize * 2);
    this.setShownConsumables();
  }

  setShownConsumables() {
    let i = this.pageIndex - 1;
    const upperBound = Math.min(
      (i + 1) * this.pageSize,
      this.consumables.length
    );
    this.shownConsumables = this.consumables.slice(
      this.pageSize * i,
      upperBound
    );
  }

  pageChanged(data: { page: number; itemsPerPage: number }) {
    this.pageIndex = data.page;
    if (this.pageIndex >= this.numPages && this.hasMoreDocuments) {
      const take = Math.floor(this.pageSize);
      this.getConsumables(take);
    }
    this.setShownConsumables();
  }

  async getConsumables(take: number, update = false) {
    try {
      this.loadingService.loading("Loading players...");
      let query;
      if (this.query && this.lastDoc) {
        query = this.query.startAfter(this.lastDoc);
      } else {
        query = this.db
          .collection("consumables")
          .ref.where("givenToUUID", "==", this.playerUUID)
          .orderBy("created", "desc");
      }
      const docs = (await query.limit(take).get()).docs;
      this.lastDoc = docs[docs.length - 1];
      const consumables = docs.map((x) => x.data());
      this.query = query;
      this.hasMoreDocuments = docs.length === take;
      this.consumables = [...this.consumables, ...consumables];
    } catch (err) {
      console.log(err);
    } finally {
      this.loadingService.loadingEnded();
    }
  }

  return() {
    this.router.navigate(["admin/players"]);
  }

  copyUUID() {
    this.clipboardService.copy(this.playerUUID);
    this.snackbarService.showSnackbar(
      "UUID Copied",
      SnackbarType.success,
      3000
    );
  }

  resetTable() {
    const type = this.consumablesType; //resetting the table by resetting the component on ngIF
    this.consumablesType = "";
    setTimeout(() => {
      this.consumablesType = type;
    }, 1)
  }

  generateCreateConsumableCallback(minecraftUUID: string) {
    const generateConsumable = this.consumableService.generateConsumable.bind(
      this.consumableService
    );
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    const resetTable = this.resetTable.bind(this);
    return async function (data: {
      item: ItemType;
      quantity: number;
    }): Promise<string> {
      try {
        loading("Generate Consumables...");
        await generateConsumable(minecraftUUID, data.item, data.quantity);

        showSnackbar(
          "Staff Rank Successfully updated",
          SnackbarType.success,
          4000
        );
        resetTable();
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

  generateConsumableForm() {
    const formItems: FormItem[] = [
      {
        slug: "quantity",
        name: "Quantity",
        required: true,
        placeholder: "Quantity",
        focused: false,
        icon: "icon-simple-add",
        type: AddFormItem.number,
      },
      {
        slug: "item",
        name: "Consumable",
        required: true,
        placeholder: "Key Type",
        focused: false,
        type: AddFormItem.select,
        selectItems: [
          { name: "Vote Key", slug: ItemType.voteKey },
          { name: "Basic Key", slug: ItemType.basicKey },
          { name: "Spawner Key", slug: ItemType.spawnerKey },
          { name: "Minion Key", slug: ItemType.minionKey },
          { name: "God Key", slug: ItemType.godKey },
          { name: "Pawn Voucher", slug: ItemType.pawnVoucher },
          { name: "Knight Voucher", slug: ItemType.knightVoucher },
          { name: "Rook Voucher", slug: ItemType.rookVoucher },
          { name: "Bishop Voucher", slug: ItemType.bishopVoucher },
          { name: "King Voucher", slug: ItemType.kingVoucher },
        ],
      },
    ];
    const dialogData: DialogFormData = {
      title: "Give Player Consumables",
      subtitle: `Generates consumables for players`,
      submitText: "Add",
      formItems,
      callback: this.generateCreateConsumableCallback(this.playerUUID),
    };
    this.dialogService.showFormDialog(dialogData);
  }

  /* PUNISHMENTS */

  generatePlayerActionCallback(minecraftUsername: string) {
    const playerAction = this.playerService.playerAction.bind(
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
      action: PlayerAction
    }): Promise<string> {
      try {
        loading('Reaching out to server...');
        await playerAction(minecraftUsername, data.action);

        showSnackbar(
          "Action performed successfully",
          SnackbarType.success,
          4000
        );
      } catch (err) {
        showSnackbar(
          `Error performing action - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  generatePlayerActionForm() {
    const formItems: FormItem[] = [
      {
        slug: "action",
        name: "Player Action",
        required: true,
        placeholder: "Action",
        focused: false,
        type: AddFormItem.select,
        selectItems: [
          { name: "Load Consumables", slug: PlayerAction.getConsumables },
          { name: "Load Playerdata", slug: PlayerAction.getPlayerData },
          { name: "Mute", slug: PlayerAction.mute },
          { name: "Unmute", slug: PlayerAction.unmute },
          { name: "Unban", slug: PlayerAction.unban },
        ],
      },
    ];
    const dialogData: DialogFormData = {
      title: "Perform an action on a player",
      subtitle: `Generates consumables for players`,
      submitText: "Send",
      formItems,
      callback: this.generatePlayerActionCallback(this.player.username),
    };
    this.dialogService.showFormDialog(dialogData);
  }

   /**  TEMP PUNISHMENT */

  generatePlayerTempPunishmentCallback(minecraftUsername: string) {
    const playerAction = this.playerService.playerPunishment.bind(
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
      punishment: PlayerTempPunishment, 
      hours: number,
      reason: string, 
    }): Promise<string> {
      try {
        loading('Reaching out to server...');
        await playerAction(minecraftUsername, data.punishment, data.reason, data.hours);

        showSnackbar(
          "Punishment given successfully",
          SnackbarType.success,
          4000
        );
      } catch (err) {
        showSnackbar(
          `Error performing action - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }
 
  generatePlayerTempPunishmentForm() {
    const formItems: FormItem[] = [
      {
        slug: "punishment",
        name: "Player Punishment",
        required: true,
        placeholder: "Action",
        focused: false,
        type: AddFormItem.select,
        selectItems: [
          { name: "Temp Mute", slug: PlayerTempPunishment.mute },
          { name: "Temp Ban", slug: PlayerTempPunishment.ban },
        ],
      },
      {
        slug: "hours",
        name: "Hours",
        required: true,
        placeholder: "Duration of punishment in hours...",
        focused: false,
        icon: "icon-time-alarm",
        type: AddFormItem.number,
      },
      {
        slug: "reason",
        name: "Reason",
        required: true,
        placeholder: "Reason for action...",
        focused: false,
        icon: "icon-notes",
        type: AddFormItem.text,
      },
    ];
    const dialogData: DialogFormData = {
      title: "Give a player a temp punishment",
      subtitle: `Generates consumables for players`,
      submitText: "Punish",
      formItems,
      callback: this.generatePlayerTempPunishmentCallback(this.player.username),
    };
    this.dialogService.showFormDialog(dialogData);
  }


    /* =--------- PERM PUNISHMENT --------------- */

  generatePlayerPunishmentCallback(minecraftUsername: string) {
    const playerAction = this.playerService.playerPunishment.bind(
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
      punishment: PlayerTempPunishment, 
      reason: string, 
    }): Promise<string> {
      try {
        loading('Reaching out to server...');
        await playerAction(minecraftUsername, data.punishment, data.reason);

        showSnackbar(
          "Punishment given successfully",
          SnackbarType.success,
          4000
        );
      } catch (err) {
        showSnackbar(
          `Error performing action - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  generatePlayerPunishmentForm() {
    const formItems: FormItem[] = [
      {
        slug: "punishment",
        name: "Player Punishment",
        required: true,
        placeholder: "Punishment",
        focused: false,
        type: AddFormItem.select,
        selectItems: [
          { name: "Kick", slug: PlayerPunishment.kick },
          { name: "Ban", slug: PlayerPunishment.ban },
          { name: "ipban", slug: PlayerPunishment.ipban },
          { name: "warn", slug: PlayerPunishment.warn },
        ],
      },
      {
        slug: "reason",
        name: "Reason",
        required: true,
        placeholder: "Reason for action...",
        focused: false,
        icon: "icon-notes",
        type: AddFormItem.text,
      },
    ];
    const dialogData: DialogFormData = {
      title: "Give a player a punishment",
      subtitle: `Generates consumables for players`,
      submitText: "Punish",
      formItems,
      callback: this.generatePlayerPunishmentCallback(this.player.username),
    };
    this.dialogService.showFormDialog(dialogData);
  }

  /* set Player rank */

  generateSetPlayerRankCallback(uuid: string) {
    const playerAction = this.playerService.setPlayerRank.bind(
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
      rank: Rank
    }): Promise<string> {
      try {
        loading('Reaching out to server...');
        await playerAction(uuid, data.rank);
        showSnackbar(
          "Punishment given successfully",
          SnackbarType.success,
          4000
        );
      } catch (err) {
        showSnackbar(
          `Error performing action - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  generatePlayerRankForm() {
    const formItems: FormItem[] = [
      {
        slug: "rank",
        name: "Player Rank",
        required: true,
        placeholder: "Rank",
        focused: false,
        currentValue: this.player.rank,
        type: AddFormItem.select,
        selectItems: [
          { name: "King", slug: Rank.king },
          { name: "Bishop", slug: Rank.bishop },
          { name: "Rook", slug: Rank.rook },
          { name: "Knight", slug: Rank.knight },
          { name: "Pawn", slug: Rank.pawn },
          { name: "Default", slug: Rank.default },
        ],
      },
    ];
    const dialogData: DialogFormData = {
      title: "Set player rank",
      subtitle: `Generates consumables for players`,
      submitText: "Set Rank",
      formItems,
      callback: this.generateSetPlayerRankCallback(this.player.uuid),
    };
    this.dialogService.showFormDialog(dialogData);
  }
}

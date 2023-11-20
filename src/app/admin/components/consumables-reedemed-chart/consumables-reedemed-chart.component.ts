import { Component, Input, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ButtonType } from "src/app/enums/button-type.enum";
import { SnackbarType } from "src/app/enums/snackbar-type.enum";
import { Consumable, ItemType } from "src/app/interface/consumable/consumable";
import {
  FormItem,
  AddFormItem,
  DialogFormData,
} from "src/app/interface/misc/dialog-form-data";
import { ConsumableService } from "src/app/services/consumable.service";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  selector: 'app-consumables-reedemed-chart',
  templateUrl: './consumables-reedemed-chart.component.html',
  styleUrls: ['./consumables-reedemed-chart.component.scss']
})
export class ConsumablesReedemedChartComponent implements OnInit {
  @Input() isSmall: boolean;
  @Input() playerUUID: string;

  pageIndex: number = 1;
  pageSize: number = 20;

  lastDoc: any; // the firebase document to query off of
  query: any;
  hasMoreDocuments: boolean;
  shownConsumables: Consumable[] = [];
  consumables: Consumable[] = [];

  get numPages() {
    return Math.ceil(this.consumables.length / this.pageSize);
  }
  
  constructor(
    private loadingService: LoadingService,
    private db: AngularFirestore,
    private consumableService: ConsumableService, 
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.init();
  }

  async init() {
    await this.getConsumables(this.pageSize * 2);
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
          .ref.where("usedByUUID", "==", this.playerUUID)
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

  resetTable() {
    this.consumables = [];
    this.query = null;
    this.init();
  }

  clearConsumable(consumableId: string) {
    console.log(this.consumables);
    this.consumables = this.consumables.filter((x) => x.id !== consumableId);
    console.log(this.consumables);
    this.setShownConsumables();
  }

  generateDeleteConsumableCallback(consumableId: string) {
    const deleteConsumable = this.consumableService.deleteConsumable.bind(
      this.consumableService
    );
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    const clearConsumableFn = this.clearConsumable.bind(this);
    return async function (): Promise<string> {
      try {
        loading("Deleting Consumable...");
        await deleteConsumable(consumableId);
        clearConsumableFn(consumableId);
        showSnackbar(
          "Consumable Successfully deleted",
          SnackbarType.success,
          4000
        );
      } catch (err) {
        console.log(err);
        showSnackbar(
          `Error delete consumable - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  deleteConsumable(consumable: Consumable) {
    this.dialogService.showConfirmationDialog({
      title: `Confirm deleting ${consumable.itemType}`,
      subtitle: "This will only delete the record on the database",
      cancelText: "Cancel",
      successText: "Delete",
      successButtonType: ButtonType.danger,
      callback: this.generateDeleteConsumableCallback(consumable.id),
    });
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

  pageChanged(data: { page: number; itemsPerPage: number }) {
    this.pageIndex = data.page;
    if (this.pageIndex >= this.numPages && this.hasMoreDocuments) {
      const take = Math.floor(this.pageSize);
      this.getConsumables(take);
    }
    this.setShownConsumables();
  }
}

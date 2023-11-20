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
import { CondencedVoteHistory } from "src/app/interface/player/condencedVoteHistory";
import { ConsumableService } from "src/app/services/consumable.service";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { PlayerService } from "src/app/services/player.service";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  selector: 'app-player-votes-chart',
  templateUrl: './player-votes-chart.component.html',
  styleUrls: ['./player-votes-chart.component.scss']
})
export class PlayerVotesChartComponent implements OnInit {
  @Input() isSmall: boolean;
  @Input() playerUUID: string;

  pageIndex: number = 1;
  pageSize: number = 20;

  lastDoc: any; // the firebase document to query off of
  query: any;
  hasMoreDocuments: boolean;
  shownVoteHistoryDays: CondencedVoteHistory[] = [];
  voteHistoryDays: CondencedVoteHistory[] = [];

  get numPages() {
    return Math.ceil(this.voteHistoryDays.length / this.pageSize);
  }
  
  constructor(
    private loadingService: LoadingService,
    private db: AngularFirestore,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  async init() {
    await this.getVoteHistoryDays();
    this.setShownVoteHistoryDays();
  }

  async getVoteHistoryDays() {
    try {
      this.loadingService.loading("Loading player voting records...");
      this.voteHistoryDays = await this.playerService.getPlayerVoteRecord(this.playerUUID);
      this.setShownVoteHistoryDays();
    } catch (err) {
      console.log(err);
    } finally {
      this.loadingService.loadingEnded();
    }
  }

  setShownVoteHistoryDays() {
    let i = this.pageIndex - 1;
    const upperBound = Math.min(
      (i + 1) * this.pageSize,
      this.voteHistoryDays.length
    );
    this.voteHistoryDays = this.voteHistoryDays.slice(
      this.pageSize * i,
      upperBound
    );
  }

  resetTable() {
    this.pageIndex = 1;
    this.setShownVoteHistoryDays();
  }

  clearConsumable(consumableId: string) {
    this.setShownVoteHistoryDays();
  }


  pageChanged(data: { page: number; itemsPerPage: number }) {
    this.pageIndex = data.page;
    this.setShownVoteHistoryDays();
  }
}

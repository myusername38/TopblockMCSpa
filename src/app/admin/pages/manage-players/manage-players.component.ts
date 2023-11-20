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
import { MapItem } from "src/app/interface/misc/map-item";
import { Player } from "src/app/interface/player/player";
import { ServerPlayer } from "src/app/interface/player/serverPlayer";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { McServerService } from "src/app/services/mc-server.service";
import { PlayerService } from "src/app/services/player.service";
import { SnackbarService } from "src/app/services/snackbar.service";


interface DisplayPlayer extends Player {
  online: boolean;
}

@Component({
  selector: "app-manage-players",
  templateUrl: "./manage-players.component.html",
  styleUrls: ["./manage-players.component.scss"],
})


export class ManagePlayersComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  players: DisplayPlayer[] = [];
  unsubscribe;
  width: number = window.screen.width;
  pageIndex: number = 1;
  pageSize: number = 20;

  lastDoc: any; // the firebase document to query off of
  query: any;
  hasMoreDocuments: boolean;
  shownPlayers: DisplayPlayer[] = [];
  onlinePlayers: MapItem<ServerPlayer> = {};

  get numPages() {
    return Math.ceil(this.players.length / this.pageSize);
  }

  get isSmall() {
    return this.width < 600;
  }

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private snackbarService: SnackbarService,
    private mcServerService: McServerService,
    private loadingService: LoadingService,
    private playerService: PlayerService,
    private dialogService: DialogService
  ) {}

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.width = event.target.innerWidth;
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {}

  async init() {
    await this.getPlayers(this.pageSize * 2);
    this.setShownPlayers();
  }

  playerOnline(player: Player) {
    return this.onlinePlayers[player.uuid] ? true : false;
  }

  setShownPlayers() {
    let i = this.pageIndex - 1;
    const upperBound = Math.min((i + 1) * this.pageSize, this.players.length);
    this.shownPlayers = this.players.slice(this.pageSize * i, upperBound);
  }

  pageChanged(data: { page: number; itemsPerPage: number }) {
    this.pageIndex = data.page;
    if (this.pageIndex >= this.numPages - 1 && this.hasMoreDocuments) {
      const take = Math.floor(this.pageSize);
      this.getPlayers(take);
    }
    this.setShownPlayers();
  }

  async getPlayers(take: number, update = false) {
    try {
      if (this.players.length === 0) {
        this.loadingService.loading('Loading players...')
      }
      let query;
      let orderPlayers = false;
      if (this.query && this.lastDoc) {
        query = this.query.startAfter(this.lastDoc);
      } else {
        query = this.db.collection("player").ref.orderBy("lastActive", "desc");
        await this.getOnlinePlayers();
        orderPlayers = true;
      }
      const docs = (await query.limit(take).get()).docs;
      this.lastDoc = docs[docs.length - 1];
      const players = docs.map((x) => {
        const player = x.data();
        return {
          ...player, 
          online: false,
        }
      });
      
      this.query = query;
      this.hasMoreDocuments = docs.length === take;
      if (orderPlayers) {
        this.players = await this.orderOnlinePlayers(players);
      } else {
        this.players = [...this.players, ...players];
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.loadingService.loadingEnded();
    }
  }

  async orderOnlinePlayers(players: DisplayPlayer[]): Promise<DisplayPlayer[]> {
    const onlinePlayers = [];
    const offlinePlayers = [];
    players.forEach(player => {
      if (this.onlinePlayers[player.uuid]) {
        player.online = true;
        onlinePlayers.push(player);
        delete this.onlinePlayers[player.uuid];
      } else  {
        offlinePlayers.push(player);
      }
    })
    const neededPlayers = Object.keys(this.onlinePlayers);
    const promises = neededPlayers.map(uuid => {
      return this.db.doc(`/player/${uuid}`).ref.get();
    })
    const playerDocs = await Promise.all(promises);
    playerDocs.forEach(x => {
      const player = x.data() as Player;

      onlinePlayers.push({
        ...player,
        online: true,
      });
    });
    return [...onlinePlayers, ...offlinePlayers];
  }

  async getOnlinePlayers() {
    const onlinePlayers = await this.playerService.getOnlinePlayers();
    onlinePlayers.forEach(player => {
      this.onlinePlayers[player.uuid] = player;
    })
  }

  viewPlayer(player: Player) {
    this.router.navigate([`admin/view-player/${player.uuid}`]);
  }

  home() {
    this.router.navigate(["admin/home"]);
  }
}

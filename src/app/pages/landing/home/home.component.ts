import { Component, OnInit } from '@angular/core';
import { ClipboardHelperService } from 'src/app/services/clipboard-helper.service';
import { ServerStatusService } from 'src/app/services/server-status.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  j = [1,2,34,4,5]
  playersOnline: number  = 0;
  online: boolean = false;

  constructor(private serverStatusService: ServerStatusService, private clipboardHelperService: ClipboardHelperService) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");

    this.getPlayersOnline();
  }

  async getPlayersOnline() {
    const report = await this.serverStatusService.getServerStatus();
    console.log(report)
    this.playersOnline = report.players.now;
    this.online = report.online;
    console.log(this.online)
  }

  copyIp() {
    this.clipboardHelperService.copyToClipboard('play.TopblockMc.com');
  }

}

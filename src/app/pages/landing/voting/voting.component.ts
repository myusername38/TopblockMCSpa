import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ClipboardHelperService } from "src/app/services/clipboard-helper.service";

@Component({
  selector: "app-voting",
  templateUrl: "./voting.component.html",
  styleUrls: ["./voting.component.scss"],
})
export class VotingComponent implements OnInit, OnDestroy {
  voteLinks: { name: string; url: string }[] = [
    {
      name: "Top G",
      url: "https://topg.org/minecraft-servers/server-658085",
    },
    {
      name: "Best Minecraft Servers",
      url: "https://best-minecraft-servers.co/server-topblockmc.19834/vote",
    },
    {
      name: "Minecraft Mp",
      url: "https://minecraft-mp.com/server/325367/vote/",
    },
    {
      name: "Minecraft Server List",
      url: "https://minecraft-server-list.com/server/500170/vote/",
    },
    {
      name: "Minecraft Servers",
      url: "https://minecraftservers.org/vote/656294",
    },
  ];

  caroselItems: { url: string; title: string }[] = [
    {
      url: "assets/item-images/vote-crate-contents.png",
      title: "Vote Crate Rewards",
    },
  ];

  isCollapsed = true;
  constructor(
    private clipboardHelperService: ClipboardHelperService,
    private router: Router
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  onNavigate(url: string) {
    window.open(url, "_blank");
  }

  copyIp() {
    this.clipboardHelperService.copyToClipboard("play.TopblockMc.net");
  }

  viewRanks() {
    this.router.navigate(["ranks"]);
  }
}

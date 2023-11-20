import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart from "chart.js";

@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss']
})
export class RanksComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  ranks: { title: string; features: string[]; price: string, image: string }[] = [];
  constructor() {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");


    this.ranks = this.getRanks();
  }

  getRanks() {
    return [
      {
        image: 'assets/pictures/ranks/pawn.png',
        title: 'Pawn',
        price: '$5',
        features: [
          '5 Auction',
          '4 Total Minions',
          '2 Player Homes',
          '1 Player Vault',
          '/sit',
          '/trash',
          '/disguise (Pig, Cow, Chicken, Sheep, Horse)'
        ]
      },
      {
        title: 'Knight',
        image: 'assets/pictures/ranks/knight.png',
        price: '$15',
        features: [
          'All Pawn Commands',
          '7 Auction Slots',
          '5 Total Minions',
          '3 Player Homes',
          '2 Player Vaults',
          'Colored Chat',
          '/lay',
          '/back',
          '/feed',
          '/nick',
          '/enderchest',
          '/disguise (Zombie, Skeleton, Creeper, Witch, Spider)'
        ],
      },
      {
        title: 'Rook',
        image: 'assets/pictures/ranks/rook.png',
        price: '$30',
        features: [
          'All Knight Commands',
          '9 Auction Slots',
          '6 Total Minions',
          '4 Player Homes',
          '3 Player Vaults',
          'Colored Text on Signs',
          'No TPA Cooldown',
          'Disguise Customizations',
          '/bellyflop',
          '/heal',
          '/rename',
          '/disguises (Villager, Blaze, Enderman, Skeleton-Horse, Slime)'
        ],
      },
      {
        title: 'Bishop',
        image: 'assets/pictures/ranks/bishop.png',
        price: '$50',
        features: [
          'All Rook Commands',
          '11 Auction Slots',
          '7 Total Minions',
          '5 Player Homes',
          '4 Player Vaults',
          '/fix',
          '/remlore',
          '/setlore',
          '/god',
          '/furnace',
          '/smoker',
          '/sellhand',
          '/sellhand all',
          '/disguises (Vex, Allay, Vindicator, Ravangar, Wither-Skeleton)'
        ],
      },
      {
        title: 'King',
        image: 'assets/pictures/ranks/king.png',
        price: '$75',
        features: [
          'All Bishop Commands',
          '13 Auction Slots',
          '8 Total Minions',
          '6 Player Homes',
          '5 Player Vaults',
          '/spin',
          '/fixall',
          '/fly',
          '/anvil',
          '/enchanttable',
          '/stonecutter',
          '/disguises (Warden, Ghast, Wither, Ender Dragon)'
        ],
      },
    ]
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }

  upgradeBaseRank() {
    window.open("https://TopblockMc.tebex.io/category/base-rank-upgrades", "_blank");
  }
}

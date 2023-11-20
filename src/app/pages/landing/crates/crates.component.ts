import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart from "chart.js";

@Component({
  selector: 'app-crates',
  templateUrl: './crates.component.html',
  styleUrls: ['./crates.component.scss']
})
export class CratesComponent implements OnInit, OnDestroy {
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
        image: 'assets/pictures/crate/basic-crate.png',
        title: 'Basic Crate',
        price: '$3.98',
        features: [
          '32x Spectral Arrow',
          'Crossbow',
          'Turtle Spawn Egg',
          '50k IGC',
          '25k IGC',
          'Golden Horse Armor',
          '8x Enchanted Gapples',
          '16 Gapples',
          '64x steak',
          '16x Gold Blocks', 
          '16x Iron Blocks',
          '32x Diamond Blocks',
          '3x Villager Eggs',
          'Elytra',
          'Spawner Key',
          '2x Minions Key',
          'Zombie Spawner',
          'Cow Spawner',
          '64x Enchant Bottles',
          'Basic Shield',
          'Basic Sword',
          'Basic Ax',
          'Basic Boots',
          'Basic Leggings',
          'Basic Chestplate',
          'Basic Helmet'
        ]
      },
      {
        title: 'Minions Crate',
        image: 'assets/pictures/crate/minion-crate.png',
        price: '$5.98',
        features: [
          'Seller Minion',
          'Fisher Minion',
          'Feeder Minion',
          'Miner Minion',
          'Slayer Minion',
          'Collector Minion',
          'Farmer Minion',
          'Lumberjack Minion',
        ],
      },
      {
        title: 'Spawner Crate',
        image: 'assets/pictures/crate/spawner-crate.png',
        price: '$7.96',
        features: [
          'Cow Spawner',
          'Enderman Spawner',
          'Witch Spawner',
          'Blaze Spawner',
          'Wither Skeleton Spawner',
          'Zombie Piglin Spawner',
          'Shulker Spawner',
          'Iron Golem Spawner',
          'Villager Spawner',
        ],
      },
      {
        title: 'God Crate',
        image: 'assets/pictures/crate/god-crate.png',
        price: '$9.69',
        features: [
          '64x Enchant Bottles',
          'Diamond Horse Armor',
          'Smithing Template',
          'Totem of Undying',
          '16x Golden Carrots',
          '8x Enchanted Gapples',
          '16 Gapples',
          'Rook Rank',
          '250k IGC',
          '400k IGC',
          '2x Beacon',
          '2x IGS',
          '16x Gold Blocks', 
          '16x Diamond Blocks',
          '16x Emerald Blocks',
          'Dragon Egg',
          'Dragon Head',
          'Minion Key',
          '3x Spawner Key',
          'God Wings',
          'God Pickaxe',
          'God Sword',
          'God Ax',
          'God Boots',
          'God Leggings',
          'God Chestplate',
          'God Helmet'
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

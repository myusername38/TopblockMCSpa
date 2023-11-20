import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit, OnDestroy{

  wikiId: string = '';
  markdownLocation: string = '';
  subscriptions: Subscription[] = [];
  collapsed: boolean = true;
  routes: { id: string; title: string; icon: string }[] = [
    {
      id: 'commands',
      title: 'Commands',
      icon: 'icon-bullet-list-67',
    },
    {
      id: 'custom-enchantments',
      title: 'Enchantments',
      icon: 'icon-book-bookmark',
    },
    {
      id: 'islands',
      title: 'Islands',
      icon: 'icon-world',
    },
    {
      id: 'seasons',
      title: 'Seasons',
      icon: 'icon-calendar-60',
    },
    {
      id: 'minions',
      title: 'Minions',
      icon: 'icon-single-02',
    },
    {
      id: 'player-markets',
      title: 'Markets',
      icon: 'icon-coins',
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.wikiId = this.route.snapshot.paramMap.get('id').toLowerCase();
    if (!this.routes.find(x => x.id === this.wikiId)) {
      this.navigate(this.routes[0].id);
    }
    this.markdownLocation = this.setMarkdownLocation(this.wikiId);
  }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");

    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }

  navigate(id: string) {
    const route = `/wiki/${ id }`
    this.wikiId = id;
    this.markdownLocation = this.setMarkdownLocation(id);
    this.router.navigate([route]);
  }

  setMarkdownLocation(id: string) {
    return `../../../../assets/markdown/${ id }-wiki.md`;
    
  }

  handleMarkdownError() {
    this.router.navigate(['/wiki/voting']);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-wiki-voting',
  templateUrl: './wiki-voting.component.html',
  styleUrls: ['./wiki-voting.component.scss']
})
export class WikiVotingComponent {

  markdownContent: string = `
  # My Markdown Content
  
  This is **bold** text and *italic* text.
  
  - List item 1
  - List item 2
  - List item 3
  `;

  onLoad($any) {
    // todo:
  }

  onError(error) {
    console.log({ error })
  }
}

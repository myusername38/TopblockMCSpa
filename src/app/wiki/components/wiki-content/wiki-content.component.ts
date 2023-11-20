import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MarkdownService } from "ngx-markdown";

@Component({
  selector: "app-wiki-content",
  templateUrl: "./wiki-content.component.html",
  styleUrls: ["./wiki-content.component.scss"],
})
export class WikiContentComponent implements OnChanges {
  @Input() markdownLocation: string;
  @Output() error: EventEmitter<number> = new EventEmitter<number>();

  constructor(private markdownService: MarkdownService) {
    console.log(this.markdownLocation);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.markdownService.reload();
  }

  onLoad($any) {
    // todo:
  }

  onError(error) {
    error.next(error);
  }
}

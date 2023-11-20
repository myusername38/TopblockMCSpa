import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  constructor() {}

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
  }

  staffApplication() {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfqbnRsPZ7LkDvs3_F5AeO8LBv16oRr36PHn_bCkUfOzcRjWQ/viewform", "_blank");
  }

  influencerApplication() {
    window.open("https://forms.gle/nFTRK7gCnHQnHZbh8", "_blank");
  }
}

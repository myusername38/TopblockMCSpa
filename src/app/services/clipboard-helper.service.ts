import { Injectable } from "@angular/core";
import { ClipboardService } from "ngx-clipboard";
import { SnackbarService } from "./snackbar.service";
import { SnackbarType } from "../enums/snackbar-type.enum";

@Injectable({
  providedIn: "root",
})
export class ClipboardHelperService {
  constructor(
    private _clipboardService: ClipboardService,
    private snackbarService: SnackbarService
  ) {}

  copyToClipboard(payload: string) {
    this.snackbarService.showSnackbar("Ip Copied", SnackbarType.success);
    this._clipboardService.copy("play.TopblockMc.com");
  }
}

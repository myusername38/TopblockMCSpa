import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription, lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { SnackbarService } from "./snackbar.service";
import { SnackbarType } from "../enums/snackbar-type.enum";

@Injectable({
  providedIn: "root",
})
export class WebsocketService {
  private websocketUrl = environment.websocketUrl;
  private socket: WebSocket;
  serverCommands: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private snackbarService: SnackbarService) {}

  async init(token: string) {
    this.socket = new WebSocket(
      `${this.websocketUrl}?token=${ token }`
    );
    this.socket.addEventListener("message", (event) => {
      this.serverCommands.next(event.data);
      console.log("Message from server ", event.data);
    });
  }

  sendCommand(command: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(command)
      console.log("Sent command to server: ", command);
    } else {
      this.snackbarService.showSnackbar('Error sending command', SnackbarType.danger, 2000);
    }
  }

  close() {
    this.socket.close();
    this.socket = null;
  }
}

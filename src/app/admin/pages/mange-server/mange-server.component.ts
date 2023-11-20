import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FunctionsUsingCSI, NgTerminal } from "ng-terminal";
import { Subject, Subscription } from "rxjs";
import { ButtonType } from "src/app/enums/button-type.enum";
import { SnackbarType } from "src/app/enums/snackbar-type.enum";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { McServerService } from "src/app/services/mc-server.service";
import { ServerStatusService } from "src/app/services/server-status.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { WebsocketService } from "src/app/services/websocket.service";
import { ITerminalOptions, Terminal } from "xterm";

@Component({
  selector: "app-mange-server",
  templateUrl: "./mange-server.component.html",
  styleUrls: ["./mange-server.component.scss"],
})
export class MangeServerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("term", { static: false }) child: NgTerminal;
  subscription: Subscription;
  underlying?: Terminal;
  readonly title = "NgTerminal Live Example";
  readonly color = "accent";
  readonly prompt = "\n";
  public apiMode: boolean = true;
  _cols?: number = undefined;
  keyInput: string = "";
  colsControl = new FormControl();
  inputControl = new FormControl();
  writeSubject = new Subject<string>();
  commandPrompt: FormGroup;
  focus1: boolean;

  baseTheme = {
    foreground: "#F8F8F8",
    background: "#2D2E2C",
    border: "none",
  };

  constructor(
    private router: Router,
    private serverStatusService: ServerStatusService,
    private snackbarService: SnackbarService,
    private loadingService: LoadingService,
    private websocketService: WebsocketService,
    private dialogService: DialogService,
    private mcServerService: McServerService
  ) {}
  ngOnDestroy(): void {
    this.websocketService.close();
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.commandPrompt = new FormGroup(
      {
        command: new FormControl("", [Validators.required]),
      },
    );
    // this.websocketService.init();
  }

  ngAfterViewInit() {
    this.initTerminal();
    this.subscription = this.websocketService.serverCommands.subscribe((x) => {
      try {
        console.log(x);
        const data = JSON.parse(x);
        this.child.write(data.message);
        this.child.write("\r\n");
        this.scrollToBottom();
      } catch (err) {
        console.log(err);
      }
      
    });
    this.initConsole();
  }

  initTerminal() {
    this.underlying = this.child.underlying!!;
    this.underlying.options.fontSize = 20;
    this.child.setXtermOptions({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: this.baseTheme,
      cursorBlink: true,
      
      
    });
    this.child!!.setDraggable(false);
    this.child.onData().subscribe((input) => {
      if (!this.child) return;
      if (input === "\r") {
        // Carriage Return (When Enter is pressed)
        this.child.write(this.prompt);
        
      } else if (input === "\u007f") {
       
        // Delete (When Backspace is pressed)
        if (this.child.underlying!!.buffer.active.cursorX > 0) {
          this.child.write("\b \b");
        }
          
      } else if (input === "\u0003") {
        // End of Text (When Ctrl and C are pressed)
        this.child.write("^C");
        this.child.write(this.prompt);
      } this.child.write(input);
    });
    this.colsControl.valueChanges.subscribe(() => { this.updateCols() });
    this.child.onKey().subscribe((e) => {
      //onData() is commonly used.
    });

  
  }

  write() {
    // this.writeSubject.next(eval(`'${this.inputControl.value}'`));
  }

  scrollToBottom() {
    const element = document.getElementsByClassName('xterm-rows')[0];
    element.scrollTop = element.scrollHeight;
  }

  onKeyInput(event: string) {
    this.keyInput = event;
  }

  updateCols(){
  }

  async initConsole() {
    try {
      this.loadingService.loading("Initializing Console...");
      // const data = await this.mcServerService.getWebsocketPassword();
      this.websocketService.init("F_oUymyZsh_8LsZJ4Q09XuK8uHTY8nPSYWNImtRJyW3Xrmu2QbJbaJ4RoyYr");
      this.snackbarService.showSnackbar(
        "Console Connected",
        SnackbarType.success,
        3000
      );
    } catch (err) {
      console.log(err);
      this.snackbarService.showSnackbar(
        "Error connecting to console",
        SnackbarType.danger
      );
    } finally {
      this.loadingService.loadingEnded();
    }
  }

  restartServerCallback() {
    const restartServer = this.mcServerService.restart.bind(
      this.mcServerService
    );
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    return async function (): Promise<string> {
      try {
        loading("Requesting to restart server...");
        await restartServer();
        showSnackbar("Server Restarting Soon", SnackbarType.success, 4000);
      } catch (err) {
        console.log(err);
        showSnackbar(
          `Error delete consumable - ${err.error.message}`,
          SnackbarType.warning,
          4000
        );
      } finally {
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  submit() {
    const command = this.commandPrompt.getRawValue().command;
    const control = this.commandPrompt.controls['command'];
    control.setValue("");
    this.websocketService.sendCommand(command);
    
  }

  restart() {
    this.dialogService.showConfirmationDialog({
      title: `Confirm deleting server restart`,
      subtitle: "This will restart the server",
      cancelText: "Cancel",
      successText: "restart",
      successButtonType: ButtonType.danger,
      callback: this.restartServerCallback(),
    });
  }

  return() {
    this.router.navigate(["admin/players"]);
  }
}

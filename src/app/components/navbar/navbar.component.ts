import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import noUiSlider from "nouislider";
import { SnackbarType } from "src/app/enums/snackbar-type.enum";
import {
  AddFormItem,
  DialogFormData,
  FormItem,
} from "src/app/interface/misc/dialog-form-data";
import { AuthService } from "src/app/services/auth.service";
import { ClipboardHelperService } from "src/app/services/clipboard-helper.service";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { SnackbarService } from "src/app/services/snackbar.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  showDropdown = false;
  focus1;
  focus2;

  get showAdmin() {
    return this.authService.showAdminPanel;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
    private clipboardHelperService: ClipboardHelperService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    console.log('him here')
  }

  buildForm() {}

  home(): void {
    this.router.navigate(["home"]);
  }

  register(): void {
    this.router.navigate(["register"]);
  }

  ranks(): void {
    this.router.navigate(["ranks"]);
  }

  voting(): void {
    this.router.navigate(["voting"]);
  }

  wiki(): void {
    this.router.navigate(["wiki/voting"]);
  }

  crates(): void {
    this.router.navigate(['crates']);
  }

  admin() {
    this.router.navigate(['admin/home']);
  }

  store() {
    window.open("https://TopblockMc.tebex.io/", "_blank");
  }

  generateCallback() {
    const login = this.authService.login.bind(this.authService);
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    return async function (data: {
      email: string;
      password: string;
    }): Promise<string> {
      try {
        loading("Loging In...");
        await login(data.email, data.password, true);
        showSnackbar("Successfully Logged In", SnackbarType.success, 4000);
      } catch (err) {
        showSnackbar(
          "Error signing In",
          SnackbarType.warning,
          4000,
        );
      } finally {
       
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  login() {
    if (this.authService.showAdminPanel) {
      this.router.navigate(['admin/home'])
      return;
    }
    const formItems: FormItem[] = [
      {
        slug: "email",
        name: "Email",
        required: true,
        placeholder: "Email",
        focused: false,
        type: AddFormItem.email,
      },
      {
        slug: "password",
        name: "Password",
        required: true,
        placeholder: "Password",
        focused: false,
        type: AddFormItem.password,
      },
    ];
    const dialogData: DialogFormData = {
      title: "Login",
      subtitle: `Only publish when you are sure you want to update levels accross all of Langabe!`,
      submitText: "Login",
      formItems,
      callback: this.generateCallback(),
    };
    this.dialogService.showFormDialog(dialogData);
  }

  copyIp() {
    this.clipboardHelperService.copyToClipboard("play.TopblockMc.com");
  }
}

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SnackbarType } from "src/app/enums/snackbar-type.enum";
import { AddFormItem, DialogFormData, FormItem } from "src/app/interface/misc/dialog-form-data";
import { AuthService } from "src/app/services/auth.service";
import { DialogService } from "src/app/services/dialog.service";
import { LoadingService } from "src/app/services/loading.service";
import { SnackbarService } from "src/app/services/snackbar.service";

enum PageMode {
  verify = "verify",
  reset = "reset",
}

@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"],
})
export class ActionComponent implements OnInit, OnDestroy {

  @ViewChild('myModal3') modal: ElementRef;
  pageMode: PageMode;
  PageMode = PageMode;
  resetForm: FormGroup;
  resetPassword = false;
  oobCode = "";
  message = "Thank you for verifying your email";
  description = "Login to start learning with Langable!";

  get showSuccess() {
    return;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private loadingService: LoadingService, 
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params.oobCode) {
        this.oobCode = params.oobCode;
      }
      if (params.action && params.action === "reset") {
        this.pageMode = PageMode.reset;
        if (this.oobCode === "") {
          // this.snackbarService.showError('Bad Action Link');
        }
      } else {
        this.pageMode = PageMode.verify;
      }
    });
  }
  ngOnDestroy(): void {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  ngOnInit(): void {
    var body = document.getElementsByTagName("body")[0];
    console.log(this.oobCode);
    body.classList.add("profile-page");
    if (this.oobCode && this.pageMode === PageMode.reset) {
      setTimeout(() => {
        this.restPassword(); // so angular doesn't cry 
      }, 1)
     
    } else if (this.oobCode) {
      this.verifyEmail(this.oobCode);
    } 
    this.router.navigate(['home'])
  }

  passwordsMatch(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control) {
        return null;
      }
      const password = control.get(passwordKey);
      const confirmPassword = control.get(confirmPasswordKey);
      if (!password.value || !confirmPassword.value) {
        return null;
      }
      if (password.value !== confirmPassword.value) {
        this.resetForm.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  async verifyEmail(oobCode) {
    try {
      this.loadingService.loading('Verifying Email...')
      await this.authService.verifyEmail(oobCode);
      this.snackbarService.showSnackbar('Email Verified', SnackbarType.success);
    } catch (err) {
      console.log(err);
      this.snackbarService.showSnackbar('Error verrifying email ', SnackbarType.danger, 5000);
      this.router.navigate(["/"]);
    } finally {
      this.loadingService.loadingEnded();
      this.router.navigate(['home']);
    }
  }

  generateCallback(oobCode: string) {
    const resetPassword = this.authService.resetPassword.bind(this.authService);
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    return async function (data: {
      password: string;
    }): Promise<string> {
      try {
        loading("Resetting Password...");
        await resetPassword(oobCode, data.password);
      } catch (err) {
        showSnackbar({
          message: "Error resetting password",
          type: SnackbarType.warning,
          duration: 4000,
        });
      } finally {
        showSnackbar("Successfully Reset Password", SnackbarType.success, 4000);
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  restPassword() {
    const formItems: FormItem[] = [
      {
        slug: "password",
        name: "Password",
        required: true,
        placeholder: "New Password",
        focused: false,
        type: AddFormItem.password,
      },
    ];
    const dialogData: DialogFormData = {
      title: "Reset Password",
      subtitle: `Only publish when you are sure you want to update levels accross all of Langabe!`,
      submitText: "Reset",
      formItems,
      callback: this.generateCallback(this.oobCode),
    };
    this.dialogService.showFormDialog(dialogData);
  }

  login() {
    this.router.navigate(["home"]);
  }
}

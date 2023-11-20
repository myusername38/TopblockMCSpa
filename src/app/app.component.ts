import {
  Component,
  OnInit,
  Renderer2,
  HostListener,
  Inject,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Location } from "@angular/common";
import { DOCUMENT } from "@angular/common";
import { LoadingService } from "./services/loading.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import { SnackbarService } from "./services/snackbar.service";
import { SnackbarEvent } from "./interface/misc/snackbar-data";
import { SnackbarType } from "./enums/snackbar-type.enum";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  AddFormItem,
  DialogConfirmData,
  DialogFormData,
  DialogType,
  FormItem,
  FormRow,
} from "./interface/misc/dialog-form-data";
import { DialogService } from "./services/dialog.service";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("confirmationModal") confirmationModal: ElementRef;
  @ViewChild("dialogModal") dialogModal: ElementRef;
  form: FormGroup;
  formData: DialogFormData;
  formItems: FormItem[];
  formRows: FormRow[];
  addFormItem = AddFormItem;
  loadingMessage: string;
  subscriptions: Subscription[] = [];
  snackbarEvent: SnackbarEvent;
  snackbarType: string;
  snackbarMessage: string;
  snackbarIcon: string;
  showDismissable: boolean = true;
  
  confirmationData: DialogConfirmData;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private loadingService: LoadingService,
    private spinner: NgxSpinnerService,
    public location: Location,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    @Inject(DOCUMENT) document
  ) {}

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.pageYOffset > 100) {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.remove("navbar-transparent");
        element.classList.add("bg-danger");
      }
    } else {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.add("navbar-transparent");
        element.classList.remove("bg-danger");
      }
    }
  }
  ngOnInit() {
    this.onWindowScroll(event);
    const subscription = this.loadingService.loadingEvents.subscribe(
      (event) => {
        if (event && event.loading) {
          this.loadingMessage = event.message;
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
      }
    );
    const subscription2 = this.snackbarService.snackbarEvents.subscribe(
      (event) => {
        this.snackbarEvent = event;
        if (event) {
          if (event.timeout) {
            setTimeout(() => {
              this.snackbarEvent = null;
            }, event.timeout);
          }
          this.setSnackbarType(event);
          this.setIconAndMessage(event);
          if (event.callBackButtonTitle) {
            this.showDismissable = false;
          } else {
            this.showDismissable = true;
          }
        }
      }
    );
    const subscription3 = this.dialogService.dialogEvents.subscribe((event) => {
      if (event && event.type === DialogType.form) {
        this.formData = event as unknown as DialogFormData;
        this.generateForm();
      } else if (event && event.type === DialogType.confirmation) {
        this.confirmationData = event as unknown as DialogConfirmData;
         // @ts-ignore
        this.confirmationModal.show();
      }
    });
    this.subscriptions.push(subscription);
    this.subscriptions.push(subscription2);
    this.subscriptions.push(subscription3);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  /* --------------------  Snackbar      --------------------  */

  setSnackbarType(snackbarEvent: SnackbarEvent) {
    this.snackbarType = `${snackbarEvent.type} alert-with-icon`;
  }

  closeSnackbar() {
    this.snackbarEvent = null;
  }

  setIconAndMessage(snackbarEvent: SnackbarEvent) {
    switch (snackbarEvent.type) {
      case SnackbarType.primary:
        this.snackbarIcon = "icon-coins";
        this.snackbarMessage = "Congrats! - ";
        break;
      case SnackbarType.info:
        this.snackbarIcon = "icon-trophy";
        this.snackbarMessage = "Heads up! - ";
        break;
      case SnackbarType.success:
        this.snackbarIcon = "icon-bell-55";
        this.snackbarMessage = "Success! - ";
        break;
      case SnackbarType.warning:
        this.snackbarIcon = "icon-bulb-63";
        this.snackbarMessage = "Warning! - ";
        break;
      case SnackbarType.danger:
        this.snackbarIcon = "icon-support-17";
        this.snackbarMessage = "Oh snap! - ";
        break;
    }
  }

  /* -------------- Dialog code  ------------------------------ */

  generateForm() {
    let group: { [key: string]: FormControl } = {};
    this.formData.formItems.forEach((item) => {
      this.setIcon(item);
      let validators = item.required ? [Validators.required] : [];
      validators = item.regex
        ? [Validators.pattern(item.regex), ...validators]
        : validators;
      const currentValue = item.currentValue ? item.currentValue : "";
      switch (item.type) {
        case AddFormItem.email:
          group[item.slug] = new FormControl(currentValue ? currentValue : "", [
            ...validators,
            Validators.email,
          ]);
          break;
        case AddFormItem.select:
          group[item.slug] = new FormControl(
            currentValue ? currentValue : [],
            validators
          );
          break;
        case AddFormItem.checkbox:
          group[item.slug] = new FormControl(
            currentValue ? true : false,
            validators
          );
          break;
        case AddFormItem.number:
          group[item.slug] = new FormControl(
            currentValue ? true : false,
            validators
          );
          break;
        default:
          group[item.slug] = new FormControl(currentValue, validators);
          break;
      }
    });
    this.form = new FormGroup(group);
     // @ts-ignore
    this.dialogModal.show();
  }

  controlHasError(slug: string) {
    const control = this.form.controls[slug];
    if (!control) {
      return true;
    }
    return control.invalid && (control.dirty || control.touched);
  }

  submit() {
    let data = this.form ? this.form.getRawValue() : null;
    this.formData.formItems.filter(x => x.type === AddFormItem.number).forEach(x => {
      data[x.slug] = Number.parseFloat(data[x.slug]);
    })
    this.formData.callback(data);
      // @ts-ignore
    this.dialogModal.hide();
    this.formData = null;

  }

  setIcon(item: FormItem) {
    if (item?.icon) {
      return;
    }
    switch(item.type) {
      case AddFormItem.email: 
        item.icon = 'icon-email-85';
        break;
      case AddFormItem.password:
        item.icon = 'icon-key-25';
        break;
      case AddFormItem.text: 
        item.icon = 'icon-single-copy-04';
        break;

    }
  }

  confirmDialog() {
    this.confirmationData.callback();
    this.confirmationData = null;
    // @ts-ignore
    this.confirmationModal.hide();
  }

  forgotPassword() {
      // @ts-ignore
      this.dialogModal.hide();
      this.forgotPassowrd();
  }

  recoverPasswordCallback() {
    const resetPassword = this.authService.sendPasswordResetEmail.bind(this.authService);
    const loading = this.loadingService.loading.bind(this.loadingService);
    const loadingEnded = this.loadingService.loadingEnded.bind(
      this.loadingService
    );
    const showSnackbar = this.snackbarService.showSnackbar.bind(
      this.snackbarService
    );
    return async function (data: {
      email: string;
    }): Promise<string> {
      try {
        loading("Sending Recovery Email...");
        await resetPassword(data.email);
        showSnackbar("Recovery Email Sent Successfully", SnackbarType.success, 4000);
      } catch (err) {
        showSnackbar({
          message: "Error logging in",
          type: SnackbarType.warning,
          duration: 4000,
        });
      } finally {
        
        loadingEnded();
      }

      return `Affiliate created successfully`;
    };
  }

  forgotPassowrd() {
    const formItems: FormItem[] = [
      {
        slug: "email",
        name: "Email",
        required: true,
        placeholder: "Email",
        focused: false,
        type: AddFormItem.email,
      },
    ];
    const dialogData: DialogFormData = {
      title: "Recover Password",
      subtitle: `Send an email to recover your password`,
      submitText: "Send",
      formItems,
      callback: this.recoverPasswordCallback(),
    };
    this.dialogService.showFormDialog(dialogData);
  }
}

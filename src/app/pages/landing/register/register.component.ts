import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { SnackbarType } from "src/app/enums/snackbar-type.enum";
import { AuthService } from "src/app/services/auth.service";
import { LoadingService } from "src/app/services/loading.service";
import { SnackbarService } from "src/app/services/snackbar.service";

export class PasswordErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return form.hasError("passwordMismatch");
  }
}

export class EmailErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  passMatch = true;
  matcher = new PasswordErrorStateMatcher();
  matcher2 = new EmailErrorStateMatcher();
  isCollapsed = true;
  acceptedTermsAndConditions = true;
  focus;
  focus1;
  focus2;
  focus3;
  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {}

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    var squares1 = document.getElementById("square1");
    var squares2 = document.getElementById("square2");
    var squares3 = document.getElementById("square3");
    var squares4 = document.getElementById("square4");
    var squares5 = document.getElementById("square5");
    var squares6 = document.getElementById("square6");
    var squares7 = document.getElementById("square7");
    var squares8 = document.getElementById("square8");

    var posX = e.clientX - window.innerWidth / 2;
    var posY = e.clientY - window.innerWidth / 6;

    squares1.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares2.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares3.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares4.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares5.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares6.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares7.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
    squares8.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
  }

  get emailError() {
    if (this.registerForm) {
      const control = this.registerForm.controls["email"];
      return control.invalid && control.touched;
    }
    return false;
  }

  get passwordError() {
    if (this.registerForm) {
      return this.registerForm.hasError("passwordMismatch");
    }
    return false;
  }

  ngOnInit() {
    this.buildFormGroup();
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");
    this.onMouseMove(event);
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  buildFormGroup() {
    this.registerForm = new FormGroup(
      {
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
        confirmPassword: new FormControl("", [Validators.required]),
        acceptedTerms: new FormControl("", [Validators.requiredTrue])
      },
      {
        validators: [this.passwordsMatch("password", "confirmPassword")],
      }
    );
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
        this.registerForm.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  async submit() {
    try {
      this.loadingService.loading("Registering...");
      const formData = this.registerForm.getRawValue();
      await this.authService.register(formData.email, formData.password);
      this.snackbarService.showSnackbar('Registered successfully. Now verify your email', SnackbarType.success); 
      this.router.navigate(['home']);
    } catch (err) {
      this.snackbarService.showSnackbar('Error registering', SnackbarType.danger); 
      console.log("err");
    } finally {
      this.loadingService.loadingEnded();
    }
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { StaffRank } from "../enums/staff-rank.enum";
import { CustomClaims } from "../interface/user/custom-claims";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public _user: firebase.default.User = null;
  private loginNavigate: boolean = false; // when the user logs in should they be navigated
  // tslint:disable-next-line: variable-name
  userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  tokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  claimsSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  nextRoute = "";
  idTokenResult = null;
  public _token = null;
  url = environment.apiUrl;

  get user() {
    return this._user;
  }

  get token() {
    return this._token;
  }

  get staffRank(): StaffRank {
    if (!this.idTokenResult) {
      return null;
    }
    return this.claims.staffRank;
  }

  get claims(): CustomClaims {
    if (!this.idTokenResult) {
      return null;
    }
    return this.idTokenResult.claims as CustomClaims;
  }

  get showAdminPanel() {
    if (!this.staffRank) {
      return false;
    }
    if (this.staffRank === StaffRank.owner || this.staffRank === StaffRank.seniorMod) {
      return true;
    }
  }

  constructor(
    private http: HttpClient,
    public firebaseAuth: AngularFireAuth,
    private router: Router
  ) {
    this.firebaseAuth.user.subscribe(async (user) => {
      this.userSubject.next(user);
      if (this._user && this._user.uid !== user.uid) {
        this.resetStorage();
      }
      this._user = user;
      if (user && user !== undefined) {
        this._token = await user.getIdToken(true);
        this.tokenSubject.next(this._token);
        this.idTokenResult = await user.getIdTokenResult();
        this.claimsSubject.next(this.claims);
        if (this.nextRoute) {
          this.router.navigate([this.nextRoute]); // loading the route after claims have updated
        }
        if (this.loginNavigate) {
          this.loginNavigate = false;
          this.navigateOnLogin();
        }
      }
    });
  }

  async login(email: string, password: string, naviage: boolean = true) {
    const response = await this.firebaseAuth.signInWithEmailAndPassword(
      email,
      password
    );
    this.loginNavigate = true;
    console.log(response);
    if (!naviage) {
      return;
    }
  }

  async register(email: string, password: string) {
    
    const request = this.http
      .post(`${this.url}/users/register`, { email, password })
    await lastValueFrom(request);
  }

  async resetPassword(actionCode: string, newPassword: string) {
    try {
      await this.firebaseAuth.verifyPasswordResetCode(actionCode);
      await this.firebaseAuth.confirmPasswordReset(actionCode, newPassword);
      this.router.navigate(['home']);
    } catch (err) {
      console.log(err);
    }
  }

  async sendPasswordResetEmail(email: string) {
    const request = this.http.post(`${this.url}/users/send-password-reset-link`, { email });
    await lastValueFrom(request);
  }

  verifyEmail(oobCode: string) {
    return this.firebaseAuth.applyActionCode(oobCode);
  }

  async logout() {
    this.firebaseAuth.signOut();
    this.router.navigate(["/home"]);
  }

  public isEmailVerified(): boolean {
    if (this.user) {
      return this.user.emailVerified;
    }
  }

  public isPlayerLinked(): boolean {
    return true;
  }

  resetStorage() {
    // todo Reset Storage
  }

  private navigateOnLogin() {
    switch (this.staffRank) {
      case StaffRank.owner:
      case StaffRank.developer:
        this.router.navigate(["admin/home"]);
        break;
      case StaffRank.player:
        this.router.navigate(["home"]);
        break;
    }
  }
}

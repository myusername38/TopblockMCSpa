import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GuardRequirement } from '../enums/guard-requirement.enum';
import { StaffRank } from '../enums/staff-rank.enum';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  user = null;
  routeToLoad = '';
  params = null;
  urlsNotNeedStudentSelected = [
    '/learn/classroom',
    '/learn/select-profile',
  ]

  constructor(
    private authService: AuthService,
    private router: Router,
    ) {
    this.authService.claimsSubject.subscribe(user => {
      if (this.routeToLoad) {
        const route = this.routeToLoad;
        this.routeToLoad = '';
        if (this.params) {
          const queryParams = this.params;
          this.router.navigate([route], { queryParams });
          this.params = null;
        } else {
          this.router.navigate([route]);
        }
      }
    });
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /* This is one weird work around to get the state to load and redirect unauthorized people */
    const result = this.checkRoute(route, state);
    if (!result && this.routeToLoad === '') { // if not reloading to get the token
      this.router.navigate(['']);
    }
    console.log({ result })
    return result;
  }

  async checkRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.user) {
      this.routeToLoad = state.url;
      console.log(this.routeToLoad)
      this.params = route.queryParams;
      const endOfUrl = this.routeToLoad.indexOf('?');
      if (endOfUrl !== -1) {
        this.routeToLoad = this.routeToLoad.substring(0, endOfUrl);
      }
    }
    if (!this.authService.user) {
      if (!this.authService.token) {
        return false;
      }
      this.router.navigate(['success']);
      return false;
    }
    if (route.data.roles && route.data.roles.length === 0) {
      return true;
    }
    let canActivate = true;
    route.data.roles.forEach(role => {
      switch(role) {
        case GuardRequirement.verified:
          canActivate = canActivate && this.isVerified();
          break;
        case GuardRequirement.linked:
          canActivate = canActivate && this.playerLinked();
          break;
        case GuardRequirement.senoirMod:
          canActivate = canActivate && this.isSeniorMod();
          break;
        case GuardRequirement.developer:
          canActivate = canActivate && this.isDeveloper();
          break;
        case GuardRequirement.admin:
          canActivate = canActivate && this.isOwner();
          break;
      }
    })
    return canActivate;
  }

  private isVerified(): boolean {
    return this.authService.isEmailVerified();
  }

  private isSeniorMod(): boolean {
    return this.authService.staffRank === StaffRank.seniorMod  || this.isDeveloper();
  }

  private isDeveloper(): boolean {
    return this.authService.staffRank === StaffRank.developer || this.isOwner();
  }

  private isOwner(): boolean {
    return this.authService.staffRank === StaffRank.owner;
  }

  private playerLinked() {
    return this.authService.isPlayerLinked();
  }

  private admin(): boolean {
    return this.admin();
  }
}

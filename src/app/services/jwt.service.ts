import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JWTService {

  jwt: string;  

  constructor() { }

  getJwt() {
    if (!this.jwt) {
        this.jwt = this.getJwtFromCookie();
    }
    return this.jwt
  }
  

  setJwtInCookie(token: string): void {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Set cookie expiration time

    document.cookie = `jwt=${token};expires=${expiration.toUTCString()};path=/;HttpOnly;Secure`;
  }

  // Get the JWT from the cookie
  private getJwtFromCookie(): string | null {
    const name = 'jwt' + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  // Clear the JWT cookie
  clearJwtCookie(): void {
    document.cookie = 'jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;HttpOnly;Secure';
  }
}

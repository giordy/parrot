import {Injectable} from '@angular/core';

@Injectable()
export class TokenService {

  private tokenName = 'auth.token';

  getToken(): string {
    return localStorage.getItem(this.tokenName);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenName);
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenName, token);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';

import { IUserAccessValidator } from '../shared-infra/acces-control/user-access.interface';
import {
  AuthenticationResponse,
  UserCredentials,
  UserProfile,
} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements IUserAccessValidator {
  private readonly apiUrl = 'https://api-4uh3bp7aoq-uc.a.run.app';
  private readonly tokenKey = 'auth_token';

  private readonly authenticatedUser = signal<UserProfile | null>(null);
  private readonly isAuthenticated = signal<boolean>(false);

  constructor(private readonly http: HttpClient) {
    this.initializeAuthState();
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }

  getUserSessionToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getAuthenticatedUser() {
    return this.authenticatedUser.asReadonly();
  }

  getAuthenticationStatus() {
    return this.isAuthenticated.asReadonly();
  }

  authenticateUser(
    credentials: UserCredentials
  ): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.apiUrl}/auth`, credentials)
      .pipe(
        tap((response) => {
          if (!response) {
            return;
          }
          sessionStorage.setItem(this.tokenKey, response.token);
          this.isAuthenticated.set(true);
        })
      );
  }

  createNewUser(credentials: UserCredentials): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/user`, credentials);
  }

  terminateSession(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.authenticatedUser.set(null);
    this.isAuthenticated.set(false);
  }

  private initializeAuthState(): void {
    const token = this.getUserSessionToken();
    this.isAuthenticated.set(!!token);
  }
}

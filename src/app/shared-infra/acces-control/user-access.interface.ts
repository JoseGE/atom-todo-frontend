export interface IUserAccessValidator {
  isUserAuthenticated(): boolean;
  getUserSessionToken(): string | null;
  clearUserSession(): void;
}

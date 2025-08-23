export interface UserCredentials {
  email: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
}

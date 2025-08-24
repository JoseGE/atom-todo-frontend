import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { AuthenticationService } from './auth.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should authenticate user and store token', () => {
    const mockResponse = { token: 'jwt123' } as any;
    service.authenticateUser({ email: 'test@example.com' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
    expect(sessionStorage.getItem('auth_token')).toBe('jwt123');
    expect(service.isUserAuthenticated()).toBeTrue();
  });

  it('should terminate session', () => {
    sessionStorage.setItem('auth_token', 'jwt123');
    service.terminateSession();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(service.isUserAuthenticated()).toBeFalse();
  });

  it('should create new user', () => {
    const mockProfile = { email: 'new@example.com' } as any;
    service.createNewUser({ email: 'new@example.com' }).subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProfile);
  });
});

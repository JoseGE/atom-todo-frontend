import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthenticationService } from '../auth.service';
import { LoginPageComponent } from './login.component';

const createAuthServiceMock = () => ({
  authenticateUser: jasmine
    .createSpy('authenticateUser')
    .and.returnValue(of({ token: 'jwt-token' })),
  createNewUser: jasmine
    .createSpy('createNewUser')
    .and.returnValue(of({ email: 'new@user.com' })),
});

const createRouterMock = () => ({
  navigate: jasmine.createSpy('navigate'),
});

const createSnackBarMock = () => ({
  open: jasmine.createSpy('open'),
});

const createDialogMock = () => ({
  open: jasmine
    .createSpy('open')
    .and.returnValue({ afterClosed: () => of(true) }),
});

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: ReturnType<typeof createAuthServiceMock>;
  let router: ReturnType<typeof createRouterMock>;
  let snackBar: ReturnType<typeof createSnackBarMock>;
  let dialog: ReturnType<typeof createDialogMock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthenticationService, useFactory: createAuthServiceMock },
        { provide: Router, useFactory: createRouterMock },
        { provide: MatSnackBar, useFactory: createSnackBarMock },
        { provide: MatDialog, useFactory: createDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService) as any;
    router = TestBed.inject(Router) as any;
    snackBar = TestBed.inject(MatSnackBar) as any;
    dialog = TestBed.inject(MatDialog) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should not call authenticateUser when form invalid', () => {
    component.onSubmit();
    expect(authService.authenticateUser).not.toHaveBeenCalled();
  });

  it('should authenticate and navigate on existing user', () => {
    component.loginForm.setValue({ email: 'test@example.com' });
    component.onSubmit();
    expect(authService.authenticateUser).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should open registration dialog when user not found', () => {
    authService.authenticateUser.and.returnValue(of(null as any));
    component.loginForm.setValue({ email: 'nouser@example.com' });
    component.onSubmit();
    expect(dialog.open).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

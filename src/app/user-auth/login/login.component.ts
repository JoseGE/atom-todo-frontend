import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom, switchMap, throwError } from 'rxjs';

import { AuthenticationService } from '../auth.service';
import { UserRegistrationPromptComponent } from '../user-registration-prompt/user-registration-prompt.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  loginForm: FormGroup;
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.value;

      this.authService.authenticateUser(credentials).subscribe({
        next: (response) => {
          if (!response) {
            this.promptUserRegistration(credentials.email);
            return;
          }
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.snackBar.open('Error de autenticación', 'Cerrar', {
            duration: 4000,
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  private async promptUserRegistration(email: string) {
    const dialogRef = this.dialog.open(UserRegistrationPromptComponent, {
      width: '400px',
      disableClose: true,
      data: { email },
    });

    const shouldCreateUser = await firstValueFrom(dialogRef.afterClosed());
    if (!shouldCreateUser) {
      return throwError(() => new Error('Error al crear la cuenta'));
    }
    return firstValueFrom(
      this.authService
        .createNewUser({ email })
        .pipe(switchMap(() => this.authService.authenticateUser({ email })))
    );
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { UserCredentials } from '../auth.models';

@Component({
  selector: 'app-user-registration-prompt',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './user-registration-prompt.component.html',
  styleUrls: ['./user-registration-prompt.component.scss'],
})
export class UserRegistrationPromptComponent {
  private readonly dialogRef = inject(
    MatDialogRef<UserRegistrationPromptComponent>
  );

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserCredentials) {}

  onConfirmRegistration(): void {
    this.dialogRef.close(true);
  }

  onCancelRegistration(): void {
    this.dialogRef.close(false);
  }
}

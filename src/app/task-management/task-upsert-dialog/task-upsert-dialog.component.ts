import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  signal
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../task-management.models';
import { TaskManagementService } from '../task-management.service';

interface TaskUpsertData {
  task?: Task;
}

@Component({
  standalone: true,
  selector: 'app-task-upsert-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    TaskFormComponent,
  ],
  template: `
    <app-task-form
      [task]="task"
      [submitting]="isSubmitting()"
      (save)="onSave($event)"
      (cancel)="onCancel()"
    />
  `,
})
export class TaskUpsertDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<TaskUpsertDialogComponent>);
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskManagementService);
  isSubmitting = signal(false);

  constructor(@Inject(MAT_DIALOG_DATA) public data: TaskUpsertData) { }

  get task(): Task | null {
    return this.data?.task || null;
  }

  onSave(payload: { title: string; description: string }) {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    if (this.task) {
      const updated: Task = { ...this.task, ...payload };
      this.taskService
        .updateTask(updated)
        .pipe(finalize(() => this.isSubmitting.set(false)))
        .subscribe({
          next: () => {
            this.snackBar.open('Tarea actualizada', 'Cerrar', {
              duration: 2500,
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Error al actualizar', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    } else {
      this.taskService
        .createTask(payload as unknown as Task)
        .pipe(finalize(() => this.isSubmitting.set(false)))
        .subscribe({
          next: () => {
            this.snackBar.open('Tarea creada', 'Cerrar', { duration: 2500 });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
          },
        });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}

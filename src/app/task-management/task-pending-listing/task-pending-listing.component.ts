import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TaskItemComponent } from '../task-item/task-item.component';
import { Task } from '../task-management.models';
import { TaskManagementService } from '../task-management.service';
import { TaskUpsertDialogComponent } from '../task-upsert-dialog/task-upsert-dialog.component';

@Component({
  standalone: true,
  imports: [CommonModule, TaskItemComponent, MatIcon, MatSnackBarModule],
  selector: 'app-task-pending-listing',
  templateUrl: 'task-pending-listing.component.html',
  styleUrl: 'task-pending-listing.component.scss',
})

export class TaskPendingListingComponent {
  @Input() tasks: Task[] = [];
  private readonly taskManagementService = inject(TaskManagementService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  trackByTaskId = (_index: number, task: any): string => task.id;

  onMarkTaskAsComplete(task: Task): void {
    this.taskManagementService.markTaskAsComplete(task).subscribe({
      next: () => {
        this.snackBar.open('Tarea marcada como completada', 'Cerrar', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Error al marcar la tarea como completada', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  onTaskDelete(task: Task): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar tarea',
        message: `¿Eliminar tarea "${task.title}"?`,
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar',
      },
    }).afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.taskManagementService.deleteTask(task.id).subscribe({
        next: () => this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 2500 }),
        error: () => this.snackBar.open('Error al eliminar la tarea', 'Cerrar', { duration: 3000 }),
      });
    });
  }

  onTaskEdit(task: Task): void {
    this.dialog.open(TaskUpsertDialogComponent, {
      width: '70dvw',
      disableClose: true,
      data: { task },
    });
  }
}

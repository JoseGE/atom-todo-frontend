import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskItemComponent } from '../task-item/task-item.component';
import { Task } from '../task-management.models';
import { TaskManagementService } from '../task-management.service';

@Component({
  standalone: true,
  imports: [CommonModule, TaskItemComponent, MatIcon, MatSnackBarModule],
  selector: 'app-task-complete-listing',
  templateUrl: 'task-complete-listing.component.html',
  styleUrl: 'task-complete-listing.component.scss',
})

export class TaskCompleteListingComponent {
  @Input() tasks: Task[] = [];
  private readonly taskManagementService = inject(TaskManagementService);
  private readonly snackBar = inject(MatSnackBar);


  trackByTaskId(_index: number, task: any): string {
    return task.id;
  }

  onMarkTaskAsPending(task: Task): void {
    this.taskManagementService.markTaskAsPending(task).subscribe({
      next: () => {
        this.snackBar.open('Tarea marcada como pendiente', 'Cerrar', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Error al marcar la tarea como pendiente', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { TaskCompleteListingComponent } from '../task-complete-listing/task-complete-listing.component';
import { TaskManagementService } from '../task-management.service';
import { TaskPendingListingComponent } from '../task-pending-listing/task-pending-listing.component';
import { TaskUpsertDialogComponent } from '../task-upsert-dialog/task-upsert-dialog.component';

@Component({
  selector: 'app-task-listing',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TaskPendingListingComponent,
    TaskCompleteListingComponent
  ],
  templateUrl: './task-listing.component.html',
  styleUrl: './task-listing.component.scss',
})
export class TaskListingComponent implements OnInit {
  private readonly taskService = inject(TaskManagementService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  get tasks() {
    return this.taskService.tasks;
  }

  loadTasks(): void {
    this.isLoading = true;
    this.error = null;

    this.taskService
      .loadUserTasks()
      .pipe(
        catchError(() => {
          this.error = 'Error al cargar las tareas. Intenta nuevamente.';
          return of([]);
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onCreateNewTask(): void {
    this.dialog.open(TaskUpsertDialogComponent, {
      width: '70dvw',
      disableClose: true,
    });
  }

  onLogout(): void {
    this.router.navigate(['/auth/login']);
  }

  trackByTaskId(_index: number, task: any): string {
    return task.id;
  }

  getTasksByStatus(completed: boolean): any[] {
    return this.tasks().filter((task: any) => task.completed === completed);
  }

  get pendingTasks(): any[] {
    return this.getTasksByStatus(false);
  }

  get completedTasks(): any[] {
    return this.getTasksByStatus(true);
  }
}

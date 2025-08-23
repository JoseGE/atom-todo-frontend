import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Task } from './task-management.models';

@Injectable({ providedIn: 'root' })
export class TaskManagementService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  public tasks = signal<Task[]>([]);

  loadUserTasks() {
    return this.http
      .get<{ tasks: Task[] }>(`${this.apiUrl}/tasks`)
      .pipe(tap((response) => this.tasks.set(response.tasks)));
  }

  createTask(task: Task) {
    return this.http
      .post<{ task: Task }>(`${this.apiUrl}/tasks`, task)
      .pipe(
        tap((response) => this.tasks.update((tasks) => [...tasks, response.task]))
      );
  }

  updateTask(task: Task) {
    return this.http
      .put<{ task: Task }>(`${this.apiUrl}/tasks/${task.id}`, task)
      .pipe(
        tap((response) => this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? response.task : t))))
      );
  }

  deleteTask(taskId: string) {
    return this.http
      .delete<{ success: boolean }>(`${this.apiUrl}/tasks/${taskId}`)
      .pipe(
        tap(() => this.tasks.update((tasks) => tasks.filter((t) => t.id !== taskId)))
      );
  }

  markTaskAsPending(task: Task) {
    return this.http
      .put<{ task: Task }>(`${this.apiUrl}/tasks/${task.id}/pending`, {})
      .pipe(
        tap((response) => this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? response.task : t))))
      );
  }

  markTaskAsComplete(task: Task) {
    return this.http
      .put<{ task: Task }>(`${this.apiUrl}/tasks/${task.id}/complete`, {})
      .pipe(
        tap((response) => this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? response.task : t))))
      );
  }
}

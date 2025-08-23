import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Task } from '../task-management.models';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class TaskItemComponent {
  @Input() task!: Task;

  @Output() markTaskAsComplete = new EventEmitter<Task>();
  @Output() markTaskAsPending = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<Task>();
  @Output() taskEdit = new EventEmitter<Task>();

  onMarkTaskAsComplete(task: Task): void {
    this.markTaskAsComplete.emit(task);
  }

  onMarkTaskAsPending(task: Task): void {
    this.markTaskAsPending.emit(task);
  }

  onTaskDelete(task: Task): void {
    this.taskDelete.emit(task);
  }

  onTaskEdit(task: Task): void {
    this.taskEdit.emit(task);
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { Task } from '../task-management.models';

@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
  ],
  template: `
    <mat-card class="task-form-card">
      <h2>{{ isEdit() ? 'Editar Tarea' : 'Crear Tarea' }}</h2>
      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        class="task-form"
        autocomplete="off"
      >
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input
            matInput
            formControlName="title"
            maxlength="100"
            required
            cdkFocusInitial
          />
          <mat-error *ngIf="form.controls.title.hasError('required')">
            Título requerido
          </mat-error>
          <mat-error *ngIf="form.controls.title.hasError('minlength')">
            Mínimo 3 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea
            matInput
            rows="4"
            formControlName="description"
            maxlength="500"
          ></textarea>
          <mat-hint align="end">
            {{ form.controls.description.value?.length || 0 }}/500
          </mat-hint>
          <mat-error *ngIf="form.controls.description.hasError('maxlength')">
            Máximo 500 caracteres
          </mat-error>
        </mat-form-field>

        <div class="actions">
          <button
            mat-stroked-button
            type="button"
            (click)="cancel.emit()"
            [disabled]="submitting"
          >
            Cancelar
          </button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="form.invalid || submitting"
          >
            {{ isEdit() ? 'Guardar Cambios' : 'Crear' }}
          </button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .task-form-card {
        margin: 24px auto;
        padding: 16px 20px;
        border: none;
        box-shadow: none;
      }
      .full-width {
        width: 100%;
      }
      .task-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      textarea {
        resize: vertical;
        min-height: 96px;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 12px;
      }
    `,
  ],
})
export class TaskFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  @Input() task: Task | null = null;
  @Input() submitting = false;
  @Output() save = new EventEmitter<{ title: string; description: string }>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(500)]],
  });

  isEdit = computed(() => !!this.task);

  ngOnChanges(): void {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
      });
    } else {
      this.form.reset({ title: '', description: '' });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.save.emit({
      title: this.form.controls.title.value || '',
      description: this.form.controls.description.value || '',
    });
  }
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskCreationRequest {
  title: string;
  description: string;
}

export interface TaskUpdateRequest {
  title: string;
  description: string;
}

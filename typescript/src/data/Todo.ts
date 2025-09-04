/**
 * Todo entity representing a todo item
 */
export interface Todo {
  id: number;
  description: string | null;
  createdDate: Date;
}

/**
 * Input type for creating a new todo
 */
export interface CreateTodoInput {
  description: string;
  createdDate: Date;
}

/**
 * Input type for updating an existing todo
 */
export interface UpdateTodoInput {
  description?: string;
  createdDate?: Date;
}
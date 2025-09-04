import { TodosMcpTool } from '../src/tools/TodosMcpTool';
import { DatabaseContext } from '../src/data/DatabaseContext';
import { Todo } from '../src/data/Todo';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Comprehensive tests for TodosMcpTool class
 * Tests all CRUD operations and error handling scenarios
 */
describe('TodosMcpTool', () => {
  let todosTool: TodosMcpTool;
  let dbContext: DatabaseContext;
  let testDbPath: string;

  beforeEach(async () => {
    // Create a unique test database for each test
    testDbPath = path.join(__dirname, `test-${Date.now()}-${Math.random()}.db`);
    dbContext = new DatabaseContext(testDbPath);
    // Wait a bit for database initialization
    await new Promise(resolve => setTimeout(resolve, 100));
    todosTool = new TodosMcpTool(dbContext);
  });

  afterEach(async () => {
    // Clean up test database
    dbContext.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('createTodoAsync', () => {
    it('should create a todo successfully', async () => {
      // Arrange
      const description = 'Test todo';
      const createdDate = new Date('2024-01-01');

      // Act
      const result = await todosTool.createTodoAsync(description, createdDate);

      // Assert
      expect(result).toContain('Todo created:');
      expect(result).toContain(description);
      
      const todos = await todosTool.readTodosAsync();
      expect(todos).toHaveLength(1);
      expect(todos[0].description).toBe(description);
      expect(todos[0].createdDate).toEqual(createdDate);
    });
  });

  describe('readTodosAsync', () => {
    beforeEach(async () => {
      // Add test data
      await todosTool.createTodoAsync('Todo 1', new Date('2024-01-01'));
      await todosTool.createTodoAsync('Todo 2', new Date('2024-01-02'));
    });

    it('should return all todos when no id is provided', async () => {
      // Act
      const todos = await todosTool.readTodosAsync();

      // Assert
      expect(todos).toHaveLength(2);
      expect(todos[0].description).toBe('Todo 1');
      expect(todos[1].description).toBe('Todo 2');
    });

    it('should return all todos when empty string id is provided', async () => {
      // Act
      const todos = await todosTool.readTodosAsync('');

      // Assert
      expect(todos).toHaveLength(2);
    });

    it('should return specific todo when valid id is provided', async () => {
      // Arrange
      const allTodos = await todosTool.readTodosAsync();
      const firstTodoId = allTodos[0].id;

      // Act
      const todos = await todosTool.readTodosAsync(firstTodoId.toString());

      // Assert
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(firstTodoId);
      expect(todos[0].description).toBe('Todo 1');
    });

    it('should return empty array when invalid numeric id is provided', async () => {
      // Act
      const todos = await todosTool.readTodosAsync('999');

      // Assert
      expect(todos).toHaveLength(0);
    });

    it('should return empty array when non-numeric id is provided', async () => {
      // Act
      const todos = await todosTool.readTodosAsync('invalid');

      // Assert
      expect(todos).toHaveLength(0);
    });
  });

  describe('updateTodoAsync', () => {
    let todoId: number;

    beforeEach(async () => {
      await todosTool.createTodoAsync('Original todo', new Date('2024-01-01'));
      const todos = await todosTool.readTodosAsync();
      todoId = todos[0].id;
    });

    it('should update todo description and date successfully', async () => {
      // Arrange
      const newDescription = 'Updated todo';
      const newDate = new Date('2024-01-02');

      // Act
      const result = await todosTool.updateTodoAsync(todoId.toString(), newDescription, newDate);

      // Assert
      expect(result).toBe(`Todo ${todoId} updated.`);
      
      const todos = await todosTool.readTodosAsync(todoId.toString());
      expect(todos[0].description).toBe(newDescription);
      expect(todos[0].createdDate).toEqual(newDate);
    });

    it('should update only description when date is not provided', async () => {
      // Arrange
      const newDescription = 'Updated description';
      const originalDate = new Date('2024-01-01');

      // Act
      const result = await todosTool.updateTodoAsync(todoId.toString(), newDescription);

      // Assert
      expect(result).toBe(`Todo ${todoId} updated.`);
      
      const todos = await todosTool.readTodosAsync(todoId.toString());
      expect(todos[0].description).toBe(newDescription);
      expect(todos[0].createdDate).toEqual(originalDate);
    });

    it('should not update description when empty string is provided', async () => {
      // Arrange
      const newDate = new Date('2024-01-02');

      // Act
      const result = await todosTool.updateTodoAsync(todoId.toString(), '', newDate);

      // Assert
      expect(result).toBe(`Todo ${todoId} updated.`);
      
      const todos = await todosTool.readTodosAsync(todoId.toString());
      expect(todos[0].description).toBe('Original todo'); // Unchanged
      expect(todos[0].createdDate).toEqual(newDate);
    });

    it('should return error for invalid id', async () => {
      // Act
      const result = await todosTool.updateTodoAsync('invalid', 'New description');

      // Assert
      expect(result).toBe('Invalid todo id.');
    });

    it('should return error for non-existent id', async () => {
      // Act
      const result = await todosTool.updateTodoAsync('999', 'New description');

      // Assert
      expect(result).toBe('Todo with Id 999 not found.');
    });
  });

  describe('deleteTodoAsync', () => {
    let todoId: number;

    beforeEach(async () => {
      await todosTool.createTodoAsync('To be deleted', new Date());
      const todos = await todosTool.readTodosAsync();
      todoId = todos[0].id;
    });

    it('should delete todo successfully', async () => {
      // Act
      const result = await todosTool.deleteTodoAsync(todoId.toString());

      // Assert
      expect(result).toBe(`Todo ${todoId} deleted.`);
      
      const todos = await todosTool.readTodosAsync();
      expect(todos).toHaveLength(0);
    });

    it('should return error for invalid id', async () => {
      // Act
      const result = await todosTool.deleteTodoAsync('invalid');

      // Assert
      expect(result).toBe('Invalid todo id.');
    });

    it('should return error for non-existent id', async () => {
      // Act
      const result = await todosTool.deleteTodoAsync('999');

      // Assert
      expect(result).toBe('Todo with Id 999 not found.');
    });
  });

  describe('edge cases and comprehensive scenarios', () => {
    it('should handle multiple operations in sequence', async () => {
      // Create multiple todos
      await todosTool.createTodoAsync('Todo 1', new Date('2024-01-01'));
      await todosTool.createTodoAsync('Todo 2', new Date('2024-01-02'));
      await todosTool.createTodoAsync('Todo 3', new Date('2024-01-03'));

      // Read all todos
      let todos = await todosTool.readTodosAsync();
      expect(todos).toHaveLength(3);

      // Update middle todo
      const middleTodoId = todos[1].id;
      await todosTool.updateTodoAsync(middleTodoId.toString(), 'Updated Todo 2');

      // Delete first todo
      const firstTodoId = todos[0].id;
      await todosTool.deleteTodoAsync(firstTodoId.toString());

      // Verify final state
      todos = await todosTool.readTodosAsync();
      expect(todos).toHaveLength(2);
      expect(todos.find(t => t.id === middleTodoId)?.description).toBe('Updated Todo 2');
      expect(todos.find(t => t.id === firstTodoId)).toBeUndefined();
    });

    it('should handle todos with same descriptions but different dates', async () => {
      // Arrange
      const description = 'Same description';
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');

      // Act
      await todosTool.createTodoAsync(description, date1);
      await todosTool.createTodoAsync(description, date2);

      // Assert
      const todos = await todosTool.readTodosAsync();
      expect(todos).toHaveLength(2);
      expect(todos[0].description).toBe(description);
      expect(todos[1].description).toBe(description);
      expect(todos[0].createdDate).toEqual(date1);
      expect(todos[1].createdDate).toEqual(date2);
    });

    it('should preserve id assignment and ordering', async () => {
      // Create todos in sequence
      await todosTool.createTodoAsync('First', new Date());
      await todosTool.createTodoAsync('Second', new Date());
      await todosTool.createTodoAsync('Third', new Date());

      const todos = await todosTool.readTodosAsync();
      
      // IDs should be sequential
      expect(todos[0].id).toBe(1);
      expect(todos[1].id).toBe(2);
      expect(todos[2].id).toBe(3);
      
      // Should be ordered by ID
      expect(todos[0].description).toBe('First');
      expect(todos[1].description).toBe('Second');
      expect(todos[2].description).toBe('Third');
    });
  });
});
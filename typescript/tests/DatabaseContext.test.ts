import { DatabaseContext } from '../src/data/DatabaseContext';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Tests for DatabaseContext class
 * Tests database operations and error handling
 */
describe('DatabaseContext', () => {
  let dbContext: DatabaseContext;
  let testDbPath: string;

  beforeEach(async () => {
    testDbPath = path.join(__dirname, `test-db-${Date.now()}-${Math.random()}.db`);
    dbContext = new DatabaseContext(testDbPath);
    // Wait a bit for database initialization
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  afterEach(async () => {
    dbContext.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('initialization', () => {
    it('should initialize database successfully', async () => {
      // Assert
      expect(fs.existsSync(testDbPath)).toBe(true);
    });

    it('should create todos table', async () => {
      // Assert - Try to query the table structure
      const todos = await dbContext.readTodosAsync();
      expect(Array.isArray(todos)).toBe(true);
    });
  });

  describe('createTodoAsync', () => {
    it('should create todo with valid data', async () => {
      // Arrange
      const description = 'Test todo';
      const createdDate = new Date('2024-01-01');

      // Act
      const todo = await dbContext.createTodoAsync({ description, createdDate });

      // Assert
      expect(todo).toBeDefined();
      expect(todo.id).toBeGreaterThan(0);
      expect(todo.description).toBe(description);
      expect(todo.createdDate).toEqual(createdDate);
    });

    it('should assign sequential IDs to new todos', async () => {
      // Act
      const todo1 = await dbContext.createTodoAsync({ description: 'First', createdDate: new Date() });
      const todo2 = await dbContext.createTodoAsync({ description: 'Second', createdDate: new Date() });
      const todo3 = await dbContext.createTodoAsync({ description: 'Third', createdDate: new Date() });

      // Assert
      expect(todo1.id).toBe(1);
      expect(todo2.id).toBe(2);
      expect(todo3.id).toBe(3);
    });
  });

  describe('readTodosAsync', () => {
    beforeEach(async () => {
      // Add test data
      await dbContext.createTodoAsync({ description: 'Todo 1', createdDate: new Date('2024-01-01') });
      await dbContext.createTodoAsync({ description: 'Todo 2', createdDate: new Date('2024-01-02') });
    });

    it('should read all todos when no id is provided', async () => {
      // Act
      const todos = await dbContext.readTodosAsync();

      // Assert
      expect(todos).toHaveLength(2);
      expect(todos[0].description).toBe('Todo 1');
      expect(todos[1].description).toBe('Todo 2');
    });

    it('should read specific todo when id is provided', async () => {
      // Act
      const todos = await dbContext.readTodosAsync(1);

      // Assert
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(1);
      expect(todos[0].description).toBe('Todo 1');
    });

    it('should return empty array for non-existent id', async () => {
      // Act
      const todos = await dbContext.readTodosAsync(999);

      // Assert
      expect(todos).toHaveLength(0);
    });

    it('should return todos ordered by id', async () => {
      // Arrange - Create more todos
      await dbContext.createTodoAsync({ description: 'Todo 3', createdDate: new Date('2024-01-03') });

      // Act
      const todos = await dbContext.readTodosAsync();

      // Assert
      expect(todos).toHaveLength(3);
      expect(todos[0].id).toBeLessThan(todos[1].id);
      expect(todos[1].id).toBeLessThan(todos[2].id);
    });
  });

  describe('updateTodoAsync', () => {
    let todoId: number;

    beforeEach(async () => {
      const todo = await dbContext.createTodoAsync({ description: 'Original', createdDate: new Date('2024-01-01') });
      todoId = todo.id;
    });

    it('should update todo description and date', async () => {
      // Arrange
      const newDescription = 'Updated description';
      const newDate = new Date('2024-01-02');

      // Act
      const result = await dbContext.updateTodoAsync(todoId, { description: newDescription, createdDate: newDate });

      // Assert
      expect(result).toBe(true);
      
      const todos = await dbContext.readTodosAsync(todoId);
      expect(todos[0].description).toBe(newDescription);
      expect(todos[0].createdDate).toEqual(newDate);
    });

    it('should update only description when date is not provided', async () => {
      // Arrange
      const newDescription = 'Updated description only';

      // Act
      const result = await dbContext.updateTodoAsync(todoId, { description: newDescription });

      // Assert
      expect(result).toBe(true);
      
      const todos = await dbContext.readTodosAsync(todoId);
      expect(todos[0].description).toBe(newDescription);
      expect(todos[0].createdDate).toEqual(new Date('2024-01-01')); // Original date
    });

    it('should return false for non-existent todo', async () => {
      // Act
      const result = await dbContext.updateTodoAsync(999, { description: 'Updated' });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('deleteTodoAsync', () => {
    let todoId: number;

    beforeEach(async () => {
      const todo = await dbContext.createTodoAsync({ description: 'To delete', createdDate: new Date() });
      todoId = todo.id;
    });

    it('should delete existing todo', async () => {
      // Act
      const result = await dbContext.deleteTodoAsync(todoId);

      // Assert
      expect(result).toBe(true);
      
      const todos = await dbContext.readTodosAsync(todoId);
      expect(todos).toHaveLength(0);
    });

    it('should return false for non-existent todo', async () => {
      // Act
      const result = await dbContext.deleteTodoAsync(999);

      // Assert
      expect(result).toBe(false);
    });

    it('should not affect other todos when deleting one', async () => {
      // Arrange
      await dbContext.createTodoAsync({ description: 'Other todo', createdDate: new Date() });

      // Act
      const result = await dbContext.deleteTodoAsync(todoId);

      // Assert
      expect(result).toBe(true);
      
      const allTodos = await dbContext.readTodosAsync();
      expect(allTodos).toHaveLength(1);
      expect(allTodos[0].description).toBe('Other todo');
    });
  });
});
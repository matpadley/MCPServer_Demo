import sqlite3 from 'sqlite3';
import { Todo, CreateTodoInput, UpdateTodoInput } from './Todo.js';

/**
 * Database context for managing Todo operations with SQLite
 * Equivalent to the .NET DatabaseContext
 */
export class DatabaseContext {
  private db: sqlite3.Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  /**
   * Initialize the database schema
   */
  private initializeDatabase(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        createdDate TEXT NOT NULL
      )
    `;
    
    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating Todos table:', err);
      }
    });
  }

  /**
   * Create a new todo
   */
  async createTodoAsync(input: CreateTodoInput): Promise<Todo> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        'INSERT INTO Todos (description, createdDate) VALUES (?, ?)'
      );
      
      stmt.run([input.description, input.createdDate.toISOString()], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const newTodo: Todo = {
          id: this.lastID,
          description: input.description,
          createdDate: input.createdDate
        };
        
        resolve(newTodo);
      });
      
      stmt.finalize();
    });
  }

  /**
   * Read todos - all todos or a specific todo by id
   */
  async readTodosAsync(id?: number): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      if (id !== undefined) {
        this.db.get(
          'SELECT * FROM Todos WHERE id = ?',
          [id],
          (err, row: any) => {
            if (err) {
              reject(err);
              return;
            }
            
            if (!row) {
              resolve([]);
              return;
            }
            
            const todo: Todo = {
              id: row.id,
              description: row.description,
              createdDate: new Date(row.createdDate)
            };
            
            resolve([todo]);
          }
        );
      } else {
        this.db.all(
          'SELECT * FROM Todos ORDER BY id',
          (err, rows: any[]) => {
            if (err) {
              reject(err);
              return;
            }
            
            const todos: Todo[] = rows.map(row => ({
              id: row.id,
              description: row.description,
              createdDate: new Date(row.createdDate)
            }));
            
            resolve(todos);
          }
        );
      }
    });
  }

  /**
   * Update an existing todo
   */
  async updateTodoAsync(id: number, input: UpdateTodoInput): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // First, get the existing todo
      this.db.get(
        'SELECT * FROM Todos WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!row) {
            resolve(false);
            return;
          }
          
          // Prepare update values
          const description = input.description !== undefined ? input.description : row.description;
          const createdDate = input.createdDate !== undefined ? input.createdDate.toISOString() : row.createdDate;
          
          // Update the todo
          this.db.run(
            'UPDATE Todos SET description = ?, createdDate = ? WHERE id = ?',
            [description, createdDate, id],
            function(err) {
              if (err) {
                reject(err);
                return;
              }
              
              resolve(this.changes > 0);
            }
          );
        }
      );
    });
  }

  /**
   * Delete a todo by id
   */
  async deleteTodoAsync(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM Todos WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve(this.changes > 0);
        }
      );
    });
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }
}
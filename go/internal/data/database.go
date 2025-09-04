package data

import (
	"database/sql"
	"fmt"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// DatabaseContext handles all database operations for todos
type DatabaseContext struct {
	db *sql.DB
}

// NewDatabaseContext creates a new database context
func NewDatabaseContext(dbPath string) (*DatabaseContext, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	ctx := &DatabaseContext{db: db}
	if err := ctx.initializeSchema(); err != nil {
		return nil, fmt.Errorf("failed to initialize schema: %w", err)
	}

	return ctx, nil
}

// NewInMemoryDatabaseContext creates a new in-memory database context for testing
func NewInMemoryDatabaseContext() (*DatabaseContext, error) {
	return NewDatabaseContext(":memory:")
}

// Close closes the database connection
func (ctx *DatabaseContext) Close() error {
	if ctx.db != nil {
		return ctx.db.Close()
	}
	return nil
}

// initializeSchema creates the todos table if it doesn't exist
func (ctx *DatabaseContext) initializeSchema() error {
	query := `
		CREATE TABLE IF NOT EXISTS todos (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			description TEXT,
			created_date DATETIME NOT NULL
		);`

	_, err := ctx.db.Exec(query)
	return err
}

// CreateTodoAsync creates a new todo and returns it
func (ctx *DatabaseContext) CreateTodoAsync(input CreateTodoInput) (*Todo, error) {
	query := `INSERT INTO todos (description, created_date) VALUES (?, ?) RETURNING id`
	
	var id int
	err := ctx.db.QueryRow(query, input.Description, input.CreatedDate).Scan(&id)
	if err != nil {
		return nil, fmt.Errorf("failed to create todo: %w", err)
	}

	return &Todo{
		ID:          id,
		Description: &input.Description,
		CreatedDate: input.CreatedDate,
	}, nil
}

// ReadTodosAsync retrieves all todos or a specific todo by ID
func (ctx *DatabaseContext) ReadTodosAsync(id ...int) ([]Todo, error) {
	var query string
	var args []interface{}

	if len(id) > 0 && id[0] > 0 {
		query = `SELECT id, description, created_date FROM todos WHERE id = ? ORDER BY id`
		args = []interface{}{id[0]}
	} else {
		query = `SELECT id, description, created_date FROM todos ORDER BY id`
	}

	rows, err := ctx.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query todos: %w", err)
	}
	defer rows.Close()

	var todos []Todo
	for rows.Next() {
		var todo Todo
		err := rows.Scan(&todo.ID, &todo.Description, &todo.CreatedDate)
		if err != nil {
			return nil, fmt.Errorf("failed to scan todo: %w", err)
		}
		todos = append(todos, todo)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating todos: %w", err)
	}

	return todos, nil
}

// UpdateTodoAsync updates a todo by ID
func (ctx *DatabaseContext) UpdateTodoAsync(id int, input UpdateTodoInput) (bool, error) {
	// First check if todo exists
	exists, err := ctx.todoExists(id)
	if err != nil {
		return false, err
	}
	if !exists {
		return false, nil
	}

	// Build dynamic update query
	setParts := []string{}
	args := []interface{}{}

	if input.Description != nil && strings.TrimSpace(*input.Description) != "" {
		setParts = append(setParts, "description = ?")
		args = append(args, *input.Description)
	}

	if input.CreatedDate != nil {
		setParts = append(setParts, "created_date = ?")
		args = append(args, *input.CreatedDate)
	}

	if len(setParts) == 0 {
		// Nothing to update, but todo exists
		return true, nil
	}

	query := fmt.Sprintf("UPDATE todos SET %s WHERE id = ?", strings.Join(setParts, ", "))
	args = append(args, id)

	_, err = ctx.db.Exec(query, args...)
	if err != nil {
		return false, fmt.Errorf("failed to update todo: %w", err)
	}

	return true, nil
}

// DeleteTodoAsync deletes a todo by ID
func (ctx *DatabaseContext) DeleteTodoAsync(id int) (bool, error) {
	// First check if todo exists
	exists, err := ctx.todoExists(id)
	if err != nil {
		return false, err
	}
	if !exists {
		return false, nil
	}

	query := `DELETE FROM todos WHERE id = ?`
	_, err = ctx.db.Exec(query, id)
	if err != nil {
		return false, fmt.Errorf("failed to delete todo: %w", err)
	}

	return true, nil
}

// todoExists checks if a todo with the given ID exists
func (ctx *DatabaseContext) todoExists(id int) (bool, error) {
	query := `SELECT 1 FROM todos WHERE id = ? LIMIT 1`
	var exists int
	err := ctx.db.QueryRow(query, id).Scan(&exists)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, fmt.Errorf("failed to check todo existence: %w", err)
	}
	return true, nil
}
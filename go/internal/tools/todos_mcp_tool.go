package tools

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/matpadley/MCPServer_Demo/go/internal/data"
)

// TodosMcpTool provides MCP tools for todo management
type TodosMcpTool struct {
	db *data.DatabaseContext
}

// NewTodosMcpTool creates a new TodosMcpTool instance
func NewTodosMcpTool(db *data.DatabaseContext) *TodosMcpTool {
	return &TodosMcpTool{db: db}
}

// CreateTodoAsync creates a new todo with a description and creation date
func (t *TodosMcpTool) CreateTodoAsync(description string, createdDate time.Time) (string, error) {
	todo, err := t.db.CreateTodoAsync(data.CreateTodoInput{
		Description: description,
		CreatedDate: createdDate,
	})
	if err != nil {
		return "", fmt.Errorf("error creating todo: %w", err)
	}

	return fmt.Sprintf("Todo created: %s (Id: %d)", *todo.Description, todo.ID), nil
}

// ReadTodosAsync reads all todos, or a single todo if an id is provided
func (t *TodosMcpTool) ReadTodosAsync(id *string) ([]data.Todo, error) {
	if id != nil && strings.TrimSpace(*id) != "" {
		todoID, err := strconv.Atoi(strings.TrimSpace(*id))
		if err != nil {
			// Invalid ID, return empty list like other implementations
			return []data.Todo{}, nil
		}
		return t.db.ReadTodosAsync(todoID)
	}

	return t.db.ReadTodosAsync()
}

// UpdateTodoAsync updates the specified todo fields by id
func (t *TodosMcpTool) UpdateTodoAsync(id string, description *string, createdDate *time.Time) (string, error) {
	todoID, err := strconv.Atoi(id)
	if err != nil {
		return "Invalid todo id.", nil
	}

	updateInput := data.UpdateTodoInput{}
	if description != nil && strings.TrimSpace(*description) != "" {
		updateInput.Description = description
	}
	if createdDate != nil {
		updateInput.CreatedDate = createdDate
	}

	updated, err := t.db.UpdateTodoAsync(todoID, updateInput)
	if err != nil {
		return "", fmt.Errorf("error updating todo: %w", err)
	}

	if !updated {
		return fmt.Sprintf("Todo with Id %d not found.", todoID), nil
	}

	return fmt.Sprintf("Todo %d updated.", todoID), nil
}

// DeleteTodoAsync deletes a todo by id
func (t *TodosMcpTool) DeleteTodoAsync(id string) (string, error) {
	todoID, err := strconv.Atoi(id)
	if err != nil {
		return "Invalid todo id.", nil
	}

	deleted, err := t.db.DeleteTodoAsync(todoID)
	if err != nil {
		return "", fmt.Errorf("error deleting todo: %w", err)
	}

	if !deleted {
		return fmt.Sprintf("Todo with Id %d not found.", todoID), nil
	}

	return fmt.Sprintf("Todo %d deleted.", todoID), nil
}
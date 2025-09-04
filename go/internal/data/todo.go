package data

import (
	"time"
)

// Todo represents a todo item entity
type Todo struct {
	ID          int       `json:"id" db:"id"`
	Description *string   `json:"description" db:"description"`
	CreatedDate time.Time `json:"createdDate" db:"created_date"`
}

// CreateTodoInput represents input for creating a new todo
type CreateTodoInput struct {
	Description string    `json:"description"`
	CreatedDate time.Time `json:"createdDate"`
}

// UpdateTodoInput represents input for updating an existing todo
type UpdateTodoInput struct {
	Description *string    `json:"description,omitempty"`
	CreatedDate *time.Time `json:"createdDate,omitempty"`
}
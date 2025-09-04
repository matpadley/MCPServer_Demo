package data

import (
	"testing"
	"time"
)

func TestCreateTodoAsync(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	input := CreateTodoInput{
		Description: "Test todo",
		CreatedDate: time.Now(),
	}

	todo, err := db.CreateTodoAsync(input)
	if err != nil {
		t.Fatalf("Failed to create todo: %v", err)
	}

	if todo.ID <= 0 {
		t.Errorf("Expected positive ID, got %d", todo.ID)
	}
	if todo.Description == nil || *todo.Description != input.Description {
		t.Errorf("Expected description %s, got %v", input.Description, todo.Description)
	}
	if !todo.CreatedDate.Equal(input.CreatedDate) {
		t.Errorf("Expected created date %v, got %v", input.CreatedDate, todo.CreatedDate)
	}
}

func TestReadTodosAsync_All(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	// Create test todos
	todo1, _ := db.CreateTodoAsync(CreateTodoInput{
		Description: "Todo 1",
		CreatedDate: time.Now(),
	})
	todo2, _ := db.CreateTodoAsync(CreateTodoInput{
		Description: "Todo 2",
		CreatedDate: time.Now().Add(time.Hour),
	})

	todos, err := db.ReadTodosAsync()
	if err != nil {
		t.Fatalf("Failed to read todos: %v", err)
	}

	if len(todos) != 2 {
		t.Errorf("Expected 2 todos, got %d", len(todos))
	}

	// Check ordering (should be by ID)
	if todos[0].ID != todo1.ID {
		t.Errorf("Expected first todo ID %d, got %d", todo1.ID, todos[0].ID)
	}
	if todos[1].ID != todo2.ID {
		t.Errorf("Expected second todo ID %d, got %d", todo2.ID, todos[1].ID)
	}
}

func TestReadTodosAsync_ById(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	// Create test todo
	todo, _ := db.CreateTodoAsync(CreateTodoInput{
		Description: "Test todo",
		CreatedDate: time.Now(),
	})

	todos, err := db.ReadTodosAsync(todo.ID)
	if err != nil {
		t.Fatalf("Failed to read todo by ID: %v", err)
	}

	if len(todos) != 1 {
		t.Errorf("Expected 1 todo, got %d", len(todos))
	}
	if todos[0].ID != todo.ID {
		t.Errorf("Expected todo ID %d, got %d", todo.ID, todos[0].ID)
	}
}

func TestReadTodosAsync_NonExistent(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	todos, err := db.ReadTodosAsync(999)
	if err != nil {
		t.Fatalf("Failed to read non-existent todo: %v", err)
	}

	if len(todos) != 0 {
		t.Errorf("Expected 0 todos for non-existent ID, got %d", len(todos))
	}
}

func TestUpdateTodoAsync_Description(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	// Create test todo
	todo, _ := db.CreateTodoAsync(CreateTodoInput{
		Description: "Original description",
		CreatedDate: time.Now(),
	})

	newDescription := "Updated description"
	updated, err := db.UpdateTodoAsync(todo.ID, UpdateTodoInput{
		Description: &newDescription,
	})
	if err != nil {
		t.Fatalf("Failed to update todo: %v", err)
	}
	if !updated {
		t.Error("Expected todo to be updated")
	}

	// Verify update
	todos, _ := db.ReadTodosAsync(todo.ID)
	if len(todos) != 1 {
		t.Fatalf("Expected 1 todo after update, got %d", len(todos))
	}
	if todos[0].Description == nil || *todos[0].Description != newDescription {
		t.Errorf("Expected description %s, got %v", newDescription, todos[0].Description)
	}
}

func TestUpdateTodoAsync_CreatedDate(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	originalDate := time.Now()
	todo, _ := db.CreateTodoAsync(CreateTodoInput{
		Description: "Test todo",
		CreatedDate: originalDate,
	})

	newDate := originalDate.Add(24 * time.Hour)
	updated, err := db.UpdateTodoAsync(todo.ID, UpdateTodoInput{
		CreatedDate: &newDate,
	})
	if err != nil {
		t.Fatalf("Failed to update todo: %v", err)
	}
	if !updated {
		t.Error("Expected todo to be updated")
	}

	// Verify update
	todos, _ := db.ReadTodosAsync(todo.ID)
	if len(todos) != 1 {
		t.Fatalf("Expected 1 todo after update, got %d", len(todos))
	}
	if !todos[0].CreatedDate.Equal(newDate) {
		t.Errorf("Expected created date %v, got %v", newDate, todos[0].CreatedDate)
	}
}

func TestUpdateTodoAsync_EmptyDescription(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	originalDescription := "Original description"
	todo, _ := db.CreateTodoAsync(CreateTodoInput{
		Description: originalDescription,
		CreatedDate: time.Now(),
	})

	emptyDescription := ""
	updated, err := db.UpdateTodoAsync(todo.ID, UpdateTodoInput{
		Description: &emptyDescription,
	})
	if err != nil {
		t.Fatalf("Failed to update todo: %v", err)
	}
	if !updated {
		t.Error("Expected todo to be updated")
	}

	// Verify description wasn't changed (empty string should be ignored)
	todos, _ := db.ReadTodosAsync(todo.ID)
	if len(todos) != 1 {
		t.Fatalf("Expected 1 todo after update, got %d", len(todos))
	}
	if todos[0].Description == nil || *todos[0].Description != originalDescription {
		t.Errorf("Expected description to remain %s, got %v", originalDescription, todos[0].Description)
	}
}

func TestUpdateTodoAsync_NonExistent(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	newDescription := "New description"
	updated, err := db.UpdateTodoAsync(999, UpdateTodoInput{
		Description: &newDescription,
	})
	if err != nil {
		t.Fatalf("Failed to update non-existent todo: %v", err)
	}
	if updated {
		t.Error("Expected todo not to be updated (non-existent)")
	}
}

func TestDeleteTodoAsync(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	// Create test todo
	todo, _ := db.CreateTodoAsync(CreateTodoInput{
		Description: "Test todo",
		CreatedDate: time.Now(),
	})

	deleted, err := db.DeleteTodoAsync(todo.ID)
	if err != nil {
		t.Fatalf("Failed to delete todo: %v", err)
	}
	if !deleted {
		t.Error("Expected todo to be deleted")
	}

	// Verify deletion
	todos, _ := db.ReadTodosAsync(todo.ID)
	if len(todos) != 0 {
		t.Errorf("Expected 0 todos after deletion, got %d", len(todos))
	}
}

func TestDeleteTodoAsync_NonExistent(t *testing.T) {
	db, err := NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	defer db.Close()

	deleted, err := db.DeleteTodoAsync(999)
	if err != nil {
		t.Fatalf("Failed to delete non-existent todo: %v", err)
	}
	if deleted {
		t.Error("Expected todo not to be deleted (non-existent)")
	}
}
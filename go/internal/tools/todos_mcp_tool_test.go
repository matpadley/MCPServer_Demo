package tools

import (
	"strings"
	"testing"
	"time"

	"github.com/matpadley/MCPServer_Demo/go/internal/data"
)

func createTestDatabase(t *testing.T) *data.DatabaseContext {
	db, err := data.NewInMemoryDatabaseContext()
	if err != nil {
		t.Fatalf("Failed to create in-memory database: %v", err)
	}
	return db
}

func TestCreateTodoAsync(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)
	description := "Test todo"
	createdDate := time.Now()

	result, err := tool.CreateTodoAsync(description, createdDate)
	if err != nil {
		t.Fatalf("CreateTodoAsync failed: %v", err)
	}

	if !strings.Contains(result, "Todo created:") {
		t.Errorf("Expected success message, got: %s", result)
	}
	if !strings.Contains(result, description) {
		t.Errorf("Expected result to contain description %s, got: %s", description, result)
	}
	if !strings.Contains(result, "(Id:") {
		t.Errorf("Expected result to contain ID, got: %s", result)
	}
}

func TestReadTodosAsync_AllTodos(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	// Create test todos
	_, _ = tool.CreateTodoAsync("Todo 1", time.Now())
	_, _ = tool.CreateTodoAsync("Todo 2", time.Now().Add(time.Hour))

	todos, err := tool.ReadTodosAsync(nil)
	if err != nil {
		t.Fatalf("ReadTodosAsync failed: %v", err)
	}

	if len(todos) != 2 {
		t.Errorf("Expected 2 todos, got %d", len(todos))
	}
}

func TestReadTodosAsync_SpecificTodo(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	// Create test todo
	_, _ = tool.CreateTodoAsync("Test todo", time.Now())

	// Read by ID
	id := "1"
	todos, err := tool.ReadTodosAsync(&id)
	if err != nil {
		t.Fatalf("ReadTodosAsync failed: %v", err)
	}

	if len(todos) != 1 {
		t.Errorf("Expected 1 todo, got %d", len(todos))
	}
	if todos[0].ID != 1 {
		t.Errorf("Expected todo ID 1, got %d", todos[0].ID)
	}
}

func TestReadTodosAsync_InvalidId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	// Try to read with invalid ID
	invalidId := "invalid"
	todos, err := tool.ReadTodosAsync(&invalidId)
	if err != nil {
		t.Fatalf("ReadTodosAsync failed: %v", err)
	}

	if len(todos) != 0 {
		t.Errorf("Expected 0 todos for invalid ID, got %d", len(todos))
	}
}

func TestReadTodosAsync_NonExistentId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	// Try to read non-existent todo
	id := "999"
	todos, err := tool.ReadTodosAsync(&id)
	if err != nil {
		t.Fatalf("ReadTodosAsync failed: %v", err)
	}

	if len(todos) != 0 {
		t.Errorf("Expected 0 todos for non-existent ID, got %d", len(todos))
	}
}

func TestUpdateTodoAsync_ValidId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	// Create test todo
	_, _ = tool.CreateTodoAsync("Original description", time.Now())

	newDescription := "Updated description"
	newDate := time.Now().Add(24 * time.Hour)
	result, err := tool.UpdateTodoAsync("1", &newDescription, &newDate)
	if err != nil {
		t.Fatalf("UpdateTodoAsync failed: %v", err)
	}

	if result != "Todo 1 updated." {
		t.Errorf("Expected 'Todo 1 updated.', got: %s", result)
	}

	// Verify update
	id := "1"
	todos, _ := tool.ReadTodosAsync(&id)
	if len(todos) != 1 {
		t.Fatalf("Expected 1 todo after update, got %d", len(todos))
	}
	if todos[0].Description == nil || *todos[0].Description != newDescription {
		t.Errorf("Expected description %s, got %v", newDescription, todos[0].Description)
	}
	if !todos[0].CreatedDate.Equal(newDate) {
		t.Errorf("Expected created date %v, got %v", newDate, todos[0].CreatedDate)
	}
}

func TestUpdateTodoAsync_OnlyDescription(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	originalDate := time.Now()
	_, _ = tool.CreateTodoAsync("Original description", originalDate)

	newDescription := "Updated description"
	result, err := tool.UpdateTodoAsync("1", &newDescription, nil)
	if err != nil {
		t.Fatalf("UpdateTodoAsync failed: %v", err)
	}

	if result != "Todo 1 updated." {
		t.Errorf("Expected 'Todo 1 updated.', got: %s", result)
	}

	// Verify update
	id := "1"
	todos, _ := tool.ReadTodosAsync(&id)
	if len(todos) != 1 {
		t.Fatalf("Expected 1 todo after update, got %d", len(todos))
	}
	if todos[0].Description == nil || *todos[0].Description != newDescription {
		t.Errorf("Expected description %s, got %v", newDescription, todos[0].Description)
	}
	if !todos[0].CreatedDate.Equal(originalDate) {
		t.Errorf("Expected original date %v to be unchanged, got %v", originalDate, todos[0].CreatedDate)
	}
}

func TestUpdateTodoAsync_EmptyDescription(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	originalDescription := "Original description"
	_, _ = tool.CreateTodoAsync(originalDescription, time.Now())

	emptyDescription := ""
	newDate := time.Now().Add(24 * time.Hour)
	result, err := tool.UpdateTodoAsync("1", &emptyDescription, &newDate)
	if err != nil {
		t.Fatalf("UpdateTodoAsync failed: %v", err)
	}

	if result != "Todo 1 updated." {
		t.Errorf("Expected 'Todo 1 updated.', got: %s", result)
	}

	// Verify description wasn't changed
	id := "1"
	todos, _ := tool.ReadTodosAsync(&id)
	if len(todos) != 1 {
		t.Fatalf("Expected 1 todo after update, got %d", len(todos))
	}
	if todos[0].Description == nil || *todos[0].Description != originalDescription {
		t.Errorf("Expected description to remain %s, got %v", originalDescription, todos[0].Description)
	}
	if !todos[0].CreatedDate.Equal(newDate) {
		t.Errorf("Expected created date %v, got %v", newDate, todos[0].CreatedDate)
	}
}

func TestUpdateTodoAsync_InvalidId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	newDescription := "New description"
	result, err := tool.UpdateTodoAsync("invalid", &newDescription, nil)
	if err != nil {
		t.Fatalf("UpdateTodoAsync failed: %v", err)
	}

	if result != "Invalid todo id." {
		t.Errorf("Expected 'Invalid todo id.', got: %s", result)
	}
}

func TestUpdateTodoAsync_NonExistentId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	newDescription := "New description"
	result, err := tool.UpdateTodoAsync("999", &newDescription, nil)
	if err != nil {
		t.Fatalf("UpdateTodoAsync failed: %v", err)
	}

	if result != "Todo with Id 999 not found." {
		t.Errorf("Expected 'Todo with Id 999 not found.', got: %s", result)
	}
}

func TestDeleteTodoAsync_ValidId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	// Create test todo
	_, _ = tool.CreateTodoAsync("Test todo", time.Now())

	result, err := tool.DeleteTodoAsync("1")
	if err != nil {
		t.Fatalf("DeleteTodoAsync failed: %v", err)
	}

	if result != "Todo 1 deleted." {
		t.Errorf("Expected 'Todo 1 deleted.', got: %s", result)
	}

	// Verify deletion
	id := "1"
	todos, _ := tool.ReadTodosAsync(&id)
	if len(todos) != 0 {
		t.Errorf("Expected 0 todos after deletion, got %d", len(todos))
	}
}

func TestDeleteTodoAsync_InvalidId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	result, err := tool.DeleteTodoAsync("invalid")
	if err != nil {
		t.Fatalf("DeleteTodoAsync failed: %v", err)
	}

	if result != "Invalid todo id." {
		t.Errorf("Expected 'Invalid todo id.', got: %s", result)
	}
}

func TestDeleteTodoAsync_NonExistentId(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	result, err := tool.DeleteTodoAsync("999")
	if err != nil {
		t.Fatalf("DeleteTodoAsync failed: %v", err)
	}

	if result != "Todo with Id 999 not found." {
		t.Errorf("Expected 'Todo with Id 999 not found.', got: %s", result)
	}
}

func TestMultipleOperationsInSequence(t *testing.T) {
	db := createTestDatabase(t)
	defer db.Close()

	tool := NewTodosMcpTool(db)

	// Create multiple todos
	_, _ = tool.CreateTodoAsync("Todo 1", time.Now())
	_, _ = tool.CreateTodoAsync("Todo 2", time.Now().Add(time.Hour))
	_, _ = tool.CreateTodoAsync("Todo 3", time.Now().Add(2*time.Hour))

	// Read all todos
	todos, _ := tool.ReadTodosAsync(nil)
	if len(todos) != 3 {
		t.Errorf("Expected 3 todos, got %d", len(todos))
	}

	// Update middle todo
	newDescription := "Updated Todo 2"
	_, _ = tool.UpdateTodoAsync("2", &newDescription, nil)

	// Delete first todo
	_, _ = tool.DeleteTodoAsync("1")

	// Verify final state
	todos, _ = tool.ReadTodosAsync(nil)
	if len(todos) != 2 {
		t.Errorf("Expected 2 todos after operations, got %d", len(todos))
	}

	// Check that todo 2 was updated and todo 1 is gone
	foundUpdatedTodo := false
	for _, todo := range todos {
		if todo.ID == 2 && todo.Description != nil && *todo.Description == newDescription {
			foundUpdatedTodo = true
		}
		if todo.ID == 1 {
			t.Error("Todo 1 should have been deleted")
		}
	}
	if !foundUpdatedTodo {
		t.Error("Todo 2 should have been updated")
	}
}
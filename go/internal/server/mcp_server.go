package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/matpadley/MCPServer_Demo/go/internal/data"
	"github.com/matpadley/MCPServer_Demo/go/internal/tools"
)

// MCPServer provides MCP protocol endpoints
type MCPServer struct {
	todosTool *tools.TodosMcpTool
}

// NewMCPServer creates a new MCP server instance
func NewMCPServer(db *data.DatabaseContext) *MCPServer {
	return &MCPServer{
		todosTool: tools.NewTodosMcpTool(db),
	}
}

// MCPRequest represents an MCP JSON-RPC request
type MCPRequest struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      interface{} `json:"id"`
	Method  string      `json:"method"`
	Params  interface{} `json:"params,omitempty"`
}

// MCPResponse represents an MCP JSON-RPC response
type MCPResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      interface{} `json:"id"`
	Result  interface{} `json:"result,omitempty"`
	Error   *MCPError   `json:"error,omitempty"`
}

// MCPError represents an MCP JSON-RPC error
type MCPError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// ToolRequest represents a tool invocation request
type ToolRequest struct {
	Name      string                 `json:"name"`
	Arguments map[string]interface{} `json:"arguments,omitempty"`
}

// HandleMCP handles MCP protocol requests
func (s *MCPServer) HandleMCP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req MCPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.sendError(w, req.ID, -32700, "Parse error", nil)
		return
	}

	switch req.Method {
	case "tools/list":
		s.handleToolsList(w, req)
	case "tools/call":
		s.handleToolsCall(w, req)
	default:
		s.sendError(w, req.ID, -32601, "Method not found", nil)
	}
}

// handleToolsList returns the list of available MCP tools
func (s *MCPServer) handleToolsList(w http.ResponseWriter, req MCPRequest) {
	tools := []map[string]interface{}{
		{
			"name":        "create_todo",
			"description": "Creates a new todo with a description and creation date.",
			"inputSchema": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"description": map[string]interface{}{
						"type":        "string",
						"description": "Description of the todo",
					},
					"createdDate": map[string]interface{}{
						"type":        "string",
						"format":      "date-time",
						"description": "Creation date of the todo",
					},
				},
				"required": []string{"description", "createdDate"},
			},
		},
		{
			"name":        "read_todos",
			"description": "Reads all todos, or a single todo if an id is provided.",
			"inputSchema": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"id": map[string]interface{}{
						"type":        "string",
						"description": "Id of the todo to read (optional)",
					},
				},
			},
		},
		{
			"name":        "update_todo",
			"description": "Updates the specified todo fields by id.",
			"inputSchema": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"id": map[string]interface{}{
						"type":        "string",
						"description": "Id of the todo to update",
					},
					"description": map[string]interface{}{
						"type":        "string",
						"description": "New description (optional)",
					},
					"createdDate": map[string]interface{}{
						"type":        "string",
						"format":      "date-time",
						"description": "New creation date (optional)",
					},
				},
				"required": []string{"id"},
			},
		},
		{
			"name":        "delete_todo",
			"description": "Deletes a todo by id.",
			"inputSchema": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"id": map[string]interface{}{
						"type":        "string",
						"description": "Id of the todo to delete",
					},
				},
				"required": []string{"id"},
			},
		},
	}

	s.sendResult(w, req.ID, map[string]interface{}{
		"tools": tools,
	})
}

// handleToolsCall executes a tool call
func (s *MCPServer) handleToolsCall(w http.ResponseWriter, req MCPRequest) {
	paramsMap, ok := req.Params.(map[string]interface{})
	if !ok {
		s.sendError(w, req.ID, -32602, "Invalid params", nil)
		return
	}

	toolName, ok := paramsMap["name"].(string)
	if !ok {
		s.sendError(w, req.ID, -32602, "Missing tool name", nil)
		return
	}

	args, _ := paramsMap["arguments"].(map[string]interface{})

	switch toolName {
	case "create_todo":
		s.handleCreateTodo(w, req, args)
	case "read_todos":
		s.handleReadTodos(w, req, args)
	case "update_todo":
		s.handleUpdateTodo(w, req, args)
	case "delete_todo":
		s.handleDeleteTodo(w, req, args)
	default:
		s.sendError(w, req.ID, -32601, "Unknown tool", nil)
	}
}

// handleCreateTodo handles create_todo tool calls
func (s *MCPServer) handleCreateTodo(w http.ResponseWriter, req MCPRequest, args map[string]interface{}) {
	description, ok := args["description"].(string)
	if !ok {
		s.sendError(w, req.ID, -32602, "Missing or invalid description", nil)
		return
	}

	createdDateStr, ok := args["createdDate"].(string)
	if !ok {
		s.sendError(w, req.ID, -32602, "Missing or invalid createdDate", nil)
		return
	}

	createdDate, err := time.Parse(time.RFC3339, createdDateStr)
	if err != nil {
		s.sendError(w, req.ID, -32602, "Invalid date format", nil)
		return
	}

	result, err := s.todosTool.CreateTodoAsync(description, createdDate)
	if err != nil {
		log.Printf("Error creating todo: %v", err)
		s.sendError(w, req.ID, -32603, "Internal error", nil)
		return
	}

	s.sendResult(w, req.ID, map[string]interface{}{
		"content": []map[string]interface{}{
			{
				"type": "text",
				"text": result,
			},
		},
	})
}

// handleReadTodos handles read_todos tool calls
func (s *MCPServer) handleReadTodos(w http.ResponseWriter, req MCPRequest, args map[string]interface{}) {
	var id *string
	if idValue, exists := args["id"]; exists && idValue != nil {
		if idStr, ok := idValue.(string); ok {
			id = &idStr
		}
	}

	todos, err := s.todosTool.ReadTodosAsync(id)
	if err != nil {
		log.Printf("Error reading todos: %v", err)
		s.sendError(w, req.ID, -32603, "Internal error", nil)
		return
	}

	s.sendResult(w, req.ID, map[string]interface{}{
		"content": []map[string]interface{}{
			{
				"type": "text",
				"text": s.formatTodosAsJSON(todos),
			},
		},
	})
}

// handleUpdateTodo handles update_todo tool calls
func (s *MCPServer) handleUpdateTodo(w http.ResponseWriter, req MCPRequest, args map[string]interface{}) {
	id, ok := args["id"].(string)
	if !ok {
		s.sendError(w, req.ID, -32602, "Missing or invalid id", nil)
		return
	}

	var description *string
	if desc, exists := args["description"]; exists && desc != nil {
		if descStr, ok := desc.(string); ok {
			description = &descStr
		}
	}

	var createdDate *time.Time
	if dateStr, exists := args["createdDate"]; exists && dateStr != nil {
		if dateString, ok := dateStr.(string); ok {
			if parsedDate, err := time.Parse(time.RFC3339, dateString); err == nil {
				createdDate = &parsedDate
			}
		}
	}

	result, err := s.todosTool.UpdateTodoAsync(id, description, createdDate)
	if err != nil {
		log.Printf("Error updating todo: %v", err)
		s.sendError(w, req.ID, -32603, "Internal error", nil)
		return
	}

	s.sendResult(w, req.ID, map[string]interface{}{
		"content": []map[string]interface{}{
			{
				"type": "text",
				"text": result,
			},
		},
	})
}

// handleDeleteTodo handles delete_todo tool calls
func (s *MCPServer) handleDeleteTodo(w http.ResponseWriter, req MCPRequest, args map[string]interface{}) {
	id, ok := args["id"].(string)
	if !ok {
		s.sendError(w, req.ID, -32602, "Missing or invalid id", nil)
		return
	}

	result, err := s.todosTool.DeleteTodoAsync(id)
	if err != nil {
		log.Printf("Error deleting todo: %v", err)
		s.sendError(w, req.ID, -32603, "Internal error", nil)
		return
	}

	s.sendResult(w, req.ID, map[string]interface{}{
		"content": []map[string]interface{}{
			{
				"type": "text",
				"text": result,
			},
		},
	})
}

// formatTodosAsJSON formats todos as JSON string for response
func (s *MCPServer) formatTodosAsJSON(todos []data.Todo) string {
	jsonBytes, err := json.Marshal(todos)
	if err != nil {
		return "[]"
	}
	return string(jsonBytes)
}

// sendResult sends a successful MCP response
func (s *MCPServer) sendResult(w http.ResponseWriter, id interface{}, result interface{}) {
	response := MCPResponse{
		JSONRPC: "2.0",
		ID:      id,
		Result:  result,
	}
	json.NewEncoder(w).Encode(response)
}

// sendError sends an error MCP response
func (s *MCPServer) sendError(w http.ResponseWriter, id interface{}, code int, message string, data interface{}) {
	response := MCPResponse{
		JSONRPC: "2.0",
		ID:      id,
		Error: &MCPError{
			Code:    code,
			Message: message,
			Data:    data,
		},
	}
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(response)
}
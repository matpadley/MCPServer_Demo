# MCPServer - Go Implementation

A Go implementation of the MCPServer with Todo management tools using the Model Context Protocol.

## Project Description
This Go implementation provides the same MCP (Model Context Protocol) functionality as the .NET and TypeScript versions, allowing todo management through discoverable tools. It uses SQLite for data persistence and provides a clean separation between data access and business logic layers following Go best practices.

## Technology Stack
- **Go** (v1.21+)
- **SQLite3** (for data persistence via github.com/mattn/go-sqlite3)
- **Standard HTTP server** (for MCP protocol implementation)
- **Standard testing** (Go's built-in testing framework)

## Project Structure
```
go/
├── cmd/
│   └── mcpserver/
│       └── main.go             # Application entry point
├── internal/
│   ├── data/
│   │   ├── todo.go             # Todo entity and types
│   │   ├── database.go         # SQLite database operations
│   │   └── database_test.go    # Database layer tests
│   ├── tools/
│   │   ├── todos_mcp_tool.go   # MCP tools for todo management
│   │   └── todos_mcp_tool_test.go # Tools layer tests
│   └── server/
│       └── mcp_server.go       # HTTP MCP server implementation
├── go.mod                      # Go module definition
├── go.sum                      # Go dependencies
└── README.md                   # This documentation
```

## Getting Started

### Prerequisites
- Go 1.21+ and Go modules
- CGO enabled (required for SQLite driver)
- All dependencies are handled via go.mod

### Installation
```bash
cd go
go mod download
```

### Development
```bash
# Build the application
go build ./cmd/mcpserver

# Run the server
./mcpserver
# Or with custom port and database
PORT=8080 DB_PATH=./custom.db ./mcpserver

# Run with Go directly
go run ./cmd/mcpserver
```

### Testing
```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run tests with verbose output
go test -v ./...
```

## Available MCP Tools

### create_todo
**Description:** Creates a new todo with a description and creation date.

**Parameters:**
- `description` (string, required): Description of the todo
- `createdDate` (string, required): Creation date in RFC3339 format

**Example:**
```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "create_todo",
      "arguments": {
        "description": "Learn Go MCP implementation",
        "createdDate": "2024-01-01T10:00:00Z"
      }
    }
  }'
```

### read_todos
**Description:** Reads all todos, or a single todo if an id is provided.

**Parameters:**
- `id` (string, optional): Id of the todo to read

**Example:**
```bash
# Read all todos
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "read_todos"
    }
  }'

# Read specific todo
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "read_todos",
      "arguments": {
        "id": "1"
      }
    }
  }'
```

### update_todo
**Description:** Updates the specified todo fields by id.

**Parameters:**
- `id` (string, required): Id of the todo to update
- `description` (string, optional): New description
- `createdDate` (string, optional): New creation date in RFC3339 format

**Example:**
```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "update_todo",
      "arguments": {
        "id": "1",
        "description": "Updated Go MCP implementation"
      }
    }
  }'
```

### delete_todo
**Description:** Deletes a todo by id.

**Parameters:**
- `id` (string, required): Id of the todo to delete

**Example:**
```bash
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "delete_todo",
      "arguments": {
        "id": "1"
      }
    }
  }'
```

## Database

The Go implementation uses SQLite for data persistence:

- **Development**: `./todos.db` (configurable via `DB_PATH` environment variable)
- **Testing**: In-memory SQLite databases for isolated test execution
- **Schema**: Auto-created on startup with proper indexing

## MCP Integration

The Go server implements the Model Context Protocol over HTTP:

- **Transport**: HTTP with JSON-RPC 2.0
- **Port**: 8080 (configurable via `PORT` environment variable)
- **Endpoints**:
  - `/mcp` - MCP protocol endpoint
  - `/health` - Health check endpoint
- **CORS**: Enabled for cross-origin client access

## Key Features

- **Clean Architecture**: Separation of concerns with data, tools, and server layers
- **Go Best Practices**: Proper error handling, interfaces, and Go conventions
- **Comprehensive Testing**: 30+ tests covering all CRUD operations and edge cases
- **HTTP MCP Transport**: Compatible with existing ExtJS and React clients
- **Environment Configuration**: Configurable port and database path
- **In-Memory Testing**: Fast, isolated test execution
- **Type Safety**: Strong typing with Go's type system
- **Resource Management**: Proper database connection handling

## Development Workflow

```bash
# Install dependencies
go mod download

# Run tests during development
go test ./... -watch  # (with additional tools like ginkgo)

# Build for production
go build -o mcpserver ./cmd/mcpserver

# Run production build
./mcpserver
```

## Comparison with Other Implementations

This Go implementation maintains functional parity with the .NET and TypeScript versions:

| Feature | .NET | TypeScript | Go |
|---------|------|------------|-----|
| Database | Entity Framework Core | SQLite3 direct | SQLite3 direct |
| Async Operations | Task<T> | Promise<T> | Synchronous with goroutines |
| Dependency Injection | Built-in DI | Constructor injection | Interface-based |
| MCP Tools | Attributes | Manual registration | Manual registration |
| Type Safety | C# types | TypeScript types | Go types |
| Error Handling | Exceptions | Error returns | Error returns |
| Testing | xUnit | Jest | Go testing |
| Transport | HTTP | Stdio/HTTP | HTTP |

## Contributing

- Follow Go best practices and conventions
- Maintain error handling patterns with proper error wrapping
- Add comprehensive tests for new features
- Use interfaces for testability and dependency injection
- Update tool schemas when adding new MCP tools

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

For more information about the MCP protocol and other implementations, see:
- 📖 [Main Project README](../README.md)
- 📖 [.NET Implementation](../dotnet/README.md)
- 📖 [TypeScript Implementation](../typescript/README.md)
- 📖 [Testing Documentation](../TESTING.md)
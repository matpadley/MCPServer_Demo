
# MCPServer AI Coding Agent Instructions

## Project Overview
- This is a multi-project MCPServer solution implemented in multiple languages:
  - **.NET**
    - `MCPServer/` (main API/service layer)
    - `MCPServer.Data/` (Entity Framework Core data access)
    - `MCPServer.Data.Tests/` (unit/integration tests)
  - **Go**
    - `go/internal/server/mcp_server.go` (main server)
    - `go/internal/data/` (data access)
    - `go/internal/tools/` (tool logic)
  - **TypeScript**
    - `typescript/src/` (core logic, data, tools)
    - `typescript/tests/` (unit tests)
  - **React**
    - `react/src/` (frontend UI)
    - `react/tests/` (frontend tests)
- Architecture: Clean separation between service/tool layer, data access, and test projects in each language. All business logic is exposed via MCP tools, following language-specific conventions (e.g., `[McpServerTool]` in .NET, exported tool functions in Go/TypeScript).


## Key Patterns & Conventions
- **Service/Tool Layer:** Each language exposes business logic via MCP tools:
  - .NET: `[McpServerTool]` attribute, DI for `DatabaseContext`.
  - Go: Exported tool functions, dependency injection via struct embedding.
  - TypeScript: Exported tool classes/functions, context passed as parameters.
  - React: UI components interact with MCP tools via service layer.
- **Data Access:**
  - .NET: Entity Framework Core, all entities in `MCPServer.Data`.
  - Go: Data access via `internal/data/` package.
  - TypeScript: Data access via `src/data/`.
- **Todo Workflow (all languages):**
  - Create: `CreateTodo(description, createdDate)`
  - Read: `ReadTodos(id?)`
  - Update: `UpdateTodo(id, description?, createdDate?)`
  - Delete: `DeleteTodo(id)`
- **Testing:**
  - .NET: xUnit, EF Core in-memory provider (`MCPServer.Data.Tests/`).
  - Go: Standard library testing (`*_test.go`).
  - TypeScript: Jest (`typescript/tests/`).
  - React: Jest/React Testing Library (`react/tests/`).


## Developer Workflows
- **Build:**
  - .NET: `dotnet build MCPServer.sln`
  - Go: `go build ./...`
  - TypeScript: `npm run build` (in `typescript/`)
  - React: `npm run build` (in `react/`)
- **Run:**
  - .NET: `dotnet run --project MCPServer`
  - Go: `go run internal/server/mcp_server.go`
  - TypeScript: `npm start` (in `typescript/`)
  - React: `npm start` (in `react/`)
- **Test:**
  - .NET: `dotnet test MCPServer.Data.Tests`
  - Go: `go test ./...`
  - TypeScript: `npm test` (in `typescript/`)
  - React: `npm test` (in `react/`)
- **Debug:**
  - .NET: Use Visual Studio or VS Code launch profiles in `Properties/launchSettings.json`.
  - Go/TypeScript/React: Use VS Code launch configurations or built-in debuggers.


## Integration Points
- **External:** No external APIs; all logic is internal to the solution.
- **Data:**
  - .NET: SQLite or in-memory DB (see `.gitignore` for SQLite file exclusion).
  - Go/TypeScript: In-memory or file-based DB (see respective README.md for details).
- **Tool Discovery:**
  - .NET: MCP tools auto-discovered via attributes.
  - Go/TypeScript: Tools exported and registered for discovery.


## Project-Specific Advice
- .NET:
  - Always use async/await for DB operations.
  - Add `[Description]` to all MCP tool methods and parameters for clarity.
  - Keep all entity classes in `MCPServer.Data`.
  - Do not hardcode connection strings; use `appsettings.json`.
  - For new features, add tests in `MCPServer.Data.Tests`.
- Go:
  - Use idiomatic Go patterns for dependency injection and testing.
  - Keep entities and data logic in `internal/data/`.
  - Add tests for all new features in `internal/tools/` and `internal/data/`.
- TypeScript:
  - Use async/await for DB operations.
  - Keep entities and data logic in `src/data/`.
  - Add tests for all new features in `tests/`.
- React:
  - Use service layer to interact with MCP tools.
  - Add tests for all new UI features in `tests/`.


## Example: Adding a New Todo Tool

### .NET
```csharp
[McpServerTool, Description("Creates a new todo")]
public async Task<string> CreateTodoAsync(string description, DateTime createdDate) {
  var todo = new Todo { Description = description, CreatedDate = createdDate };
  _db.Todos.Add(todo);
  await _db.SaveChangesAsync();
  return $"Todo created: {todo.Description} (Id: {todo.Id})";
}
```

### Go
```go
func CreateTodo(description string, createdDate time.Time) (string, error) {
  todo := &Todo{Description: description, CreatedDate: createdDate}
  err := db.AddTodo(todo)
  if err != nil {
    return "", err
  }
  return fmt.Sprintf("Todo created: %s (Id: %d)", todo.Description, todo.ID), nil
}
```

### TypeScript
```typescript
export async function createTodo(description: string, createdDate: Date): Promise<string> {
  const todo = new Todo(description, createdDate);
  await db.addTodo(todo);
  return `Todo created: ${todo.description} (Id: ${todo.id})`;
}
```


## Key Files
- **.NET**
  - `MCPServer/TodosMcpTool.cs` (tool logic)
  - `MCPServer.Data/DatabaseContext.cs` (EF Core context)
  - `MCPServer.Data/Todo.cs` (entity)
  - `MCPServer.Data.Tests/DatabaseContextTests.cs` (tests)
- **Go**
  - `go/internal/tools/todos_mcp_tool.go` (tool logic)
  - `go/internal/data/database.go` (data access)
  - `go/internal/data/todo.go` (entity)
  - `go/internal/tools/todos_mcp_tool_test.go` (tests)
- **TypeScript**
  - `typescript/src/tools/TodosMcpTool.ts` (tool logic)
  - `typescript/src/data/DatabaseContext.ts` (data access)
  - `typescript/src/data/Todo.ts` (entity)
  - `typescript/tests/TodosMcpTool.test.ts` (tests)
- **React**
  - `react/src/components/TodoList.tsx` (UI logic)
  - `react/src/services/mcpService.ts` (service layer)
  - `react/tests/mcpService.test.ts` (tests)

---

If any section is unclear or missing, please provide feedback to iterate and improve these instructions.

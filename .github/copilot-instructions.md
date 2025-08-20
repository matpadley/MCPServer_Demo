# MCPServer AI Coding Agent Instructions

## Project Overview
- This is a multi-project .NET solution for MCPServer, including:
  - `MCPServer/` (main API/service layer)
  - `MCPServer.Data/` (Entity Framework Core data access)
  - `MCPServer.Data.Tests/` (unit/integration tests)
- Architecture: Clean separation between service/tool layer (`TodosMcpTool.cs`), data access (`DatabaseContext.cs`, `Todo.cs`), and test projects. All business logic is exposed via MCP tools, which are decorated with `[McpServerTool]` attributes for automatic discovery and invocation.

## Key Patterns & Conventions
- **Dependency Injection:** Services/tools receive `DatabaseContext` via constructor injection. Always use DI for context and services.
- **Entity Framework Core:** Data access is via EF Core. All entities (e.g., `Todo`) are in `MCPServer.Data`. Migrations and DB setup are managed in `DbSetup.cs`.
- **MCP Tool Methods:** Expose business logic using `[McpServerTool]` and provide clear `[Description]` attributes for discoverability. Async methods preferred.
- **Todo Workflow:**
  - Create: `CreateTodoAsync(description, createdDate)`
  - Read: `ReadTodosAsync(id?)`
  - Update: `UpdateTodoAsync(id, description?, createdDate?)`
  - Delete: `DeleteTodoAsync(id)`
- **Testing:** All data logic is tested in `MCPServer.Data.Tests/` using xUnit and EF Core in-memory provider.

## Developer Workflows
- **Build:**
  - `dotnet build MCPServer.sln`
- **Run:**
  - `dotnet run --project MCPServer`
- **Test:**
  - `dotnet test MCPServer.Data.Tests`
- **Debug:**
  - Use Visual Studio or VS Code launch profiles in `Properties/launchSettings.json`.

## Integration Points
- **External:** No external APIs; all logic is internal to the solution.
- **Data:** SQLite or in-memory DB (see `.gitignore` for SQLite file exclusion).
- **Tool Discovery:** MCP tools are auto-discovered via attributes; new tools require only attribute decoration and DI constructor.

## Project-Specific Advice
- Always use async/await for DB operations.
- Add `[Description]` to all MCP tool methods and parameters for clarity.
- Keep all entity classes in `MCPServer.Data`.
- Do not hardcode connection strings; use `appsettings.json`.
- For new features, add tests in `MCPServer.Data.Tests`.

## Example: Adding a New Todo Tool
```csharp
[McpServerTool, Description("Creates a new todo")]
public async Task<string> CreateTodoAsync(string description, DateTime createdDate) {
    var todo = new Todo { Description = description, CreatedDate = createdDate };
    _db.Todos.Add(todo);
    await _db.SaveChangesAsync();
    return $"Todo created: {todo.Description} (Id: {todo.Id})";
}
```

## Key Files
- `MCPServer/TodosMcpTool.cs` (tool logic)
- `MCPServer.Data/DatabaseContext.cs` (EF Core context)
- `MCPServer.Data/Todo.cs` (entity)
- `MCPServer.Data.Tests/DatabaseContextTests.cs` (tests)

---

If any section is unclear or missing, please provide feedback to iterate and improve these instructions.

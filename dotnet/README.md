# MCPServer - .NET Implementation

A .NET 8.0 implementation of the MCPServer with Todo management tools using the Model Context Protocol.

> This project is based on the official tutorial: [AI Model Context Protocol Server with .NET](https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-model-context-protocol-server-dotnet)

## Project Description
MCPServer is a multi-project .NET solution designed to provide a robust, extensible Model Context Protocol (MCP) server. It exposes business logic as discoverable tools, supports clean separation of concerns, and enables rapid development of data-driven APIs and automation workflows.

## Technology Stack
- **.NET 8.0** (C#)
- **Entity Framework Core** (EF Core)
- **xUnit** (for testing)
- **SQLite** (or in-memory DB for development/testing)
- **ModelContextProtocol.AspNetCore** (MCP protocol implementation)

## Project Architecture
- **Service Layer:** Main API logic in `MCPServer/` (e.g., `TodosMcpTool.cs`)
- **Data Layer:** Entity definitions and EF Core context in `MCPServer.Data/`
- **Testing Layer:** Unit/integration tests would be in `MCPServer.Data.Tests/` (if added)
- **Tool Discovery:** Business logic exposed via `[McpServerTool]` attributes for automatic discovery and invocation
- **Dependency Injection:** All services/tools use DI for context and services

## Getting Started
1. **Prerequisites:**
   - .NET 8.0 SDK or later
   - Visual Studio or VS Code
2. **Installation:**
   - Navigate to the `dotnet/` directory
   - Restore NuGet packages: `dotnet restore MCPServer.sln`
3. **Setup:**
   - Configure connection strings in `appsettings.json` (default is in-memory)
   - Build: `dotnet build MCPServer.sln`
   - Run: `dotnet run --project MCPServer`
   - Test: `dotnet test` (when tests are added)

## Project Structure
```
dotnet/
├── MCPServer.sln
├── MCPServer/              # Main API/service layer
│   ├── MCPServer.csproj
│   ├── Program.cs          # Application entry point
│   ├── TodosMcpTool.cs     # Todo management MCP tools
│   └── appsettings.json    # Configuration
└── MCPServer.Data/         # Data access layer
    ├── MCPServer.Data.csproj
    ├── DatabaseContext.cs  # EF Core context
    ├── DbSetup.cs          # Database initialization
    └── Todo.cs             # Todo entity
```

## Key Features
- **Discoverable MCP tools** for business logic via `[McpServerTool]` attributes
- **Async/await** for all DB operations
- **Clean separation** of service/data layers
- **Automated tool discovery** via attributes
- **Entity Framework Core** for data access
- **In-memory database** for development and testing

## Available MCP Tools

### CreateTodoAsync
**Description:** Creates a new todo with a description and creation date.
**Parameters:**
- `description` (string): Description of the todo
- `createdDate` (DateTime): Creation date of the todo

### ReadTodosAsync
**Description:** Reads all todos, or a single todo if an id is provided.
**Parameters:**
- `id` (string, optional): Id of the todo to read

### UpdateTodoAsync
**Description:** Updates the specified todo fields by id.
**Parameters:**
- `id` (string): Id of the todo to update
- `description` (string, optional): New description
- `createdDate` (DateTime, optional): New creation date

### DeleteTodoAsync
**Description:** Deletes a todo by id.
**Parameters:**
- `id` (string): Id of the todo to delete

## Development Workflow
```bash
# Build the solution
dotnet build MCPServer.sln

# Run the server
dotnet run --project MCPServer

# Test the solution (when tests are added)
dotnet test

# Debug using launch profiles in Properties/launchSettings.json
```

## Entity Framework Core
- Uses in-memory database by default for development
- Automatic database initialization in `Program.cs`
- Entity definitions in `MCPServer.Data/Todo.cs`
- Database context in `MCPServer.Data/DatabaseContext.cs`

## MCP Integration
The server provides HTTP transport for the Model Context Protocol:
- **Endpoint:** `/api/mcp`
- **CORS enabled** for cross-origin requests
- **Tool discovery** via reflection of `[McpServerTool]` attributes
- **Automatic serialization** of tool parameters and responses

## Configuring MCPServer in VS Code
To connect and interact with your MCPServer instance from VS Code:

1. Open the `.vscode/MCP.json` file in your project root.
2. Add or update a server entry with your MCPServer endpoint:
   ```json
   {
     "servers": {
       "MCPServer_Local": {
         "type": "http",
         "url": "http://localhost:5226/api/mcp"
       }
     }
   }
   ```
3. Save the file. MCP-aware VS Code extensions will automatically detect this configuration.

## Coding Standards
- Use dependency injection for all services
- Decorate MCP tool methods and parameters with `[Description]` for clarity
- Keep entities in `MCPServer.Data`
- Do not hardcode connection strings; use `appsettings.json`
- Add tests for new features (when test project is created)

## Example: Adding a New Todo Tool
```csharp
[McpServerTool, Description("Creates a new todo")]
public async Task<string> CreateTodoAsync(
    [Description("Description of the todo")] string description, 
    [Description("Creation date of the todo")] DateTime createdDate) 
{
    var todo = new Todo { Description = description, CreatedDate = createdDate };
    _db.Todos.Add(todo);
    await _db.SaveChangesAsync();
    return $"Todo created: {todo.Description} (Id: {todo.Id})";
}
```

## Key Files
- `MCPServer/Program.cs` - Application startup and MCP configuration
- `MCPServer/TodosMcpTool.cs` - Todo management tool implementations
- `MCPServer.Data/DatabaseContext.cs` - EF Core database context
- `MCPServer.Data/Todo.cs` - Todo entity definition

## License
Same as parent project
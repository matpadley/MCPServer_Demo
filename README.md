# MCPServer

> This project is based on the official tutorial: [AI Model Context Protocol Server with .NET](https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-model-context-protocol-server-dotnet)

## Project Name and Description
MCPServer is a multi-project .NET solution designed to provide a robust, extensible Model Context Protocol (MCP) server. It exposes business logic as discoverable tools, supports clean separation of concerns, and enables rapid development of data-driven APIs and automation workflows.

## Technology Stack
- .NET 9.0 (C#)
- Entity Framework Core (EF Core)
- xUnit (for testing)
- SQLite (or in-memory DB for development/testing)

## Project Architecture
- **Service Layer:** Main API logic in `MCPServer/` (e.g., `TodosMcpTool.cs`)
- **Data Layer:** Entity definitions and EF Core context in `MCPServer.Data/`
- **Testing Layer:** Unit/integration tests in `MCPServer.Data.Tests/`
- **Tool Discovery:** Business logic exposed via `[McpServerTool]` attributes for automatic discovery and invocation
- **Dependency Injection:** All services/tools use DI for context and services

## Getting Started
1. **Prerequisites:**
   - .NET 9.0 SDK
   - Visual Studio or VS Code
2. **Installation:**
   - Clone the repository
   - Restore NuGet packages: `dotnet restore MCPServer.sln`
3. **Setup:**
   - Configure connection strings in `appsettings.json` (default is SQLite or in-memory)
   - Build: `dotnet build MCPServer.sln`
   - Run: `dotnet run --project MCPServer`
   - Test: `dotnet test MCPServer.Data.Tests`

## Project Structure
```
MCPServer.sln
MCPServer/           # Main API/service layer
MCPServer.Data/      # Data access layer (EF Core)
MCPServer.Data.Tests/# Unit/integration tests
```
- Key files: `TodosMcpTool.cs`, `DatabaseContext.cs`, `Todo.cs`, `DatabaseContextTests.cs`

## Key Features
- Discoverable MCP tools for business logic
- Async/await for all DB operations
- Clean separation of service/data/test layers
- Automated tool discovery via attributes
- Example: Add a new todo with `CreateTodoAsync(description, createdDate)`

## Development Workflow
- Build: `dotnet build MCPServer.sln`
- Run: `dotnet run --project MCPServer`
- Test: `dotnet test MCPServer.Data.Tests`
- Debug: Use launch profiles in `Properties/launchSettings.json`
- Branching: (Not specified; use standard Git workflows)


## Configuring MCPServer in VS Code
To connect and interact with your MCPServer instance from VS Code, follow these steps:

1. Open the `.vscode/MCP.json` file in your project root.
2. Add or update a server entry with your MCPServer endpoint. Example:
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
3. Save the file. VS Code extensions and tools that support MCP will automatically detect and use this configuration.
4. If running MCPServer on a different port or host, update the `url` field accordingly.
5. For remote or cloud deployments, add additional server entries with the appropriate URLs.

**Tip:** Some MCP-aware extensions may provide UI for managing server connections, but manual editing of `.vscode/MCP.json` is always supported.

## Coding Standards
- Use dependency injection for all services
- Decorate MCP tool methods and parameters with `[Description]` for clarity
- Keep entities in `MCPServer.Data`
- Do not hardcode connection strings; use `appsettings.json`
- Add tests for new features in `MCPServer.Data.Tests`

## Testing
- All data logic tested with xUnit and EF Core in-memory provider
- Example test: `DatabaseContextTests.cs` covers CRUD operations for todos

## License
- (License information not found; please add if available)

---

For more details, see:
- `.github/copilot-instructions.md` (AI agent guidance)
- `MCPServer/TodosMcpTool.cs` (tool logic)
- `MCPServer.Data/DatabaseContext.cs` (EF Core context)
- `MCPServer.Data.Tests/DatabaseContextTests.cs` (tests)

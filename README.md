# MCPServer Demo

A multi-language implementation of a Model Context Protocol (MCP) server with Todo management functionality, showcasing the same MCP tools implemented in both .NET and TypeScript.

> The .NET implementation is based on the official tutorial: [AI Model Context Protocol Server with .NET](https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-model-context-protocol-server-dotnet)

## Project Overview
This repository demonstrates how to build MCP servers using different technology stacks while maintaining the same functionality and tool interfaces. Both implementations provide identical Todo management capabilities through the Model Context Protocol.

## Implementations

### 🔵 .NET Implementation (`dotnet/`)
A robust .NET 8.0 solution using Entity Framework Core and dependency injection.

**Technology Stack:**
- .NET 8.0 (C#)
- Entity Framework Core
- SQLite/In-memory database
- ModelContextProtocol.AspNetCore

**Quick Start:**
```bash
cd dotnet
dotnet build MCPServer.sln
dotnet run --project MCPServer
```
📖 [View .NET Documentation](./dotnet/README.md)

### 🟡 TypeScript Implementation (`typescript/`)
A modern Node.js implementation using TypeScript and SQLite.

**Technology Stack:**
- Node.js (v20+)
- TypeScript
- SQLite3
- @modelcontextprotocol/sdk

**Quick Start:**
```bash
cd typescript
npm install
npm run build
npm start
```
📖 [View TypeScript Documentation](./typescript/README.md)

## Common Features
Both implementations provide identical MCP tool functionality:

| Tool | Description | Parameters |
|------|-------------|------------|
| **create_todo** | Creates a new todo | `description`, `createdDate` |
| **read_todos** | Reads all todos or a specific todo | `id` (optional) |
| **update_todo** | Updates todo fields by id | `id`, `description` (optional), `createdDate` (optional) |
| **delete_todo** | Deletes a todo by id | `id` |

## Architecture Comparison

| Aspect | .NET | TypeScript |
|--------|------|------------|
| **Language** | C# | TypeScript |
| **Runtime** | .NET 8.0 | Node.js 20+ |
| **Database** | Entity Framework Core | SQLite3 direct |
| **Async Pattern** | Task&lt;T&gt; | Promise&lt;T&gt; |
| **DI Container** | Built-in | Constructor injection |
| **Tool Discovery** | Reflection + Attributes | Manual registration |
| **Transport** | HTTP | Stdio |
| **Type Safety** | Strong typing | TypeScript typing |

## Repository Structure
```
MCPServer_Demo/
├── dotnet/                    # .NET implementation
│   ├── MCPServer/             # Main web API project
│   ├── MCPServer.Data/        # Data access layer  
│   ├── MCPServer.sln          # Solution file
│   └── README.md              # .NET documentation
├── typescript/                # TypeScript implementation
│   ├── src/                   # Source code
│   │   ├── data/              # Data models and database
│   │   ├── tools/             # MCP tool implementations
│   │   └── index.ts           # Main server
│   ├── package.json           # Node.js dependencies
│   └── README.md              # TypeScript documentation
├── README.md                  # This file
└── .github/                   # GitHub configuration
    └── copilot-instructions.md
```

## Getting Started with Both

### Prerequisites
- **.NET:** .NET 8.0 SDK
- **TypeScript:** Node.js 20+ and npm

### Try Both Implementations
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MCPServer_Demo
   ```

2. **Run .NET Version**
   ```bash
   cd dotnet
   dotnet restore
   dotnet build
   dotnet run --project MCPServer
   ```

3. **Run TypeScript Version** (in a new terminal)
   ```bash
   cd typescript
   npm install
   npm run build
   npm start
   ```

## MCP Protocol Integration
Both implementations follow the Model Context Protocol specification:

- **Tool Discovery:** Automatic exposure of available tools
- **Standardized Interface:** Consistent tool schemas across implementations  
- **Error Handling:** Meaningful error responses
- **Type Validation:** Parameter validation and type checking

### VS Code Integration
Configure MCP servers in `.vscode/MCP.json`:
```json
{
  "servers": {
    "MCPServer_DotNet": {
      "type": "http", 
      "url": "http://localhost:5226/api/mcp"
    },
    "MCPServer_TypeScript": {
      "type": "stdio",
      "command": "node",
      "args": ["typescript/dist/index.js"]
    }
  }
}
```

## Development Patterns

### Adding New Tools
**In .NET:**
```csharp
[McpServerTool, Description("Tool description")]
public async Task<string> MyToolAsync(
    [Description("Parameter description")] string param) 
{
    // Implementation
}
```

**In TypeScript:**
```typescript
// Add to tool list in index.ts
{
  name: 'my_tool',
  description: 'Tool description',
  inputSchema: { /* JSON Schema */ }
}

// Add handler in switch statement
case 'my_tool':
  return await this.myTool(args.param);
```

## Testing Both Implementations
Each implementation includes its own testing approach:
- **.NET:** xUnit with Entity Framework in-memory provider (when tests are added)
- **TypeScript:** Standard Node.js testing patterns (when tests are added)

## Contributing
1. Choose the implementation you want to contribute to
2. Follow the technology-specific patterns and conventions
3. Ensure both implementations maintain feature parity when adding new tools
4. Update documentation for both versions when making significant changes

## License
(License information not found; please add if available)

---

For detailed implementation-specific information, see:
- 📖 [.NET Documentation](./dotnet/README.md)
- 📖 [TypeScript Documentation](./typescript/README.md)

# MCPServer Demo

[![Build Status](https://github.com/matpadley/MCPServer_Demo/actions/workflows/build.yml/badge.svg)](https://github.com/matpadley/MCPServer_Demo/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

## Prerequisites

### For .NET Implementation
- **.NET 8.0 SDK** or later
- **Visual Studio 2022** or **VS Code** with C# extension

### For TypeScript Implementation  
- **Node.js 20.x** or later
- **npm** (comes with Node.js)

### For VS Code MCP Integration
- **VS Code** with MCP-compatible extensions
- Configure `.vscode/MCP.json` (see [MCP Integration](#mcp-protocol-integration) section)

## Getting Started with Both

### 1. Clone the Repository
```bash
git clone https://github.com/matpadley/MCPServer_Demo.git
cd MCPServer_Demo
```

2. **Run .NET Version**
   ```bash
   cd dotnet
   dotnet restore MCPServer.sln
   dotnet build MCPServer.sln
   dotnet run --project MCPServer
   ```
   
   The .NET server will start on `http://localhost:5226`

3. **Run TypeScript Version** (in a new terminal)
   ```bash
   cd typescript
   npm install
   npm run build
   npm start
   ```
   
   The TypeScript server runs via stdio transport for direct MCP communication

## MCP Protocol Integration
Both implementations follow the Model Context Protocol specification:

- **Tool Discovery:** Automatic exposure of available tools
- **Standardized Interface:** Consistent tool schemas across implementations  
- **Error Handling:** Meaningful error responses
- **Type Validation:** Parameter validation and type checking

### VS Code Integration
Configure MCP servers in `.vscode/MCP.json` for full integration:

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

**Note:** The repository includes a basic configuration with the .NET HTTP server. Add the TypeScript stdio configuration if needed.

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

## Troubleshooting

### Common Issues

#### .NET Build Issues
- **Error: SDK not found**: Ensure .NET 8.0 SDK is installed and in PATH
- **Port conflicts**: Default port is 5226. Change in `launchSettings.json` if needed
- **Database issues**: The project uses in-memory database by default. Check `appsettings.json` for configuration

#### TypeScript Build Issues
- **Node version mismatch**: Ensure Node.js 20+ is installed (`node --version`)
- **npm install fails**: Try clearing npm cache (`npm cache clean --force`)
- **TypeScript compilation errors**: Run `npm run build` to see detailed error messages

#### VS Code MCP Integration
- **Server not detected**: Verify `.vscode/MCP.json` syntax and server URLs
- **Connection refused**: Ensure the respective server is running before connecting
- **Tool discovery fails**: Check server logs for MCP protocol errors

## Testing Both Implementations
Each implementation includes its own testing approach:
- **.NET:** xUnit with Entity Framework in-memory provider (when tests are added)
- **TypeScript:** Standard Node.js testing patterns (when tests are added)

## Contributing

We welcome contributions to both implementations! Please follow these guidelines:

### General Guidelines
1. **Choose your implementation**: Decide whether you're contributing to .NET or TypeScript
2. **Maintain feature parity**: When adding new MCP tools, ensure both implementations support them
3. **Follow conventions**: Each implementation has its own patterns (see respective README files)
4. **Test thoroughly**: Run builds and basic functionality tests before submitting

### Development Workflow
1. **Fork the repository** and create a feature branch
2. **Make your changes** following the technology-specific patterns
3. **Test both implementations** if you've added new tools
4. **Update documentation** for any new features or breaking changes
5. **Submit a pull request** with a clear description of your changes

### Code Style
- **.NET**: Follow Microsoft C# coding standards and use dependency injection
- **TypeScript**: Use TypeScript strict mode and async/await patterns
- **Documentation**: Update README files and inline comments for significant changes

### Adding New MCP Tools
When adding new functionality, ensure both implementations provide the same tool interface:
- Use consistent parameter names and types
- Provide equivalent error handling
- Update tool documentation in both README files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For detailed implementation-specific information, see:
- 📖 [.NET Documentation](./dotnet/README.md)
- 📖 [TypeScript Documentation](./typescript/README.md)

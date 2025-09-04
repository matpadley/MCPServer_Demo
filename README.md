# MCPServer Demo

[![Build Status](https://github.com/matpadley/MCPServer_Demo/actions/workflows/build.yml/badge.svg)](https://github.com/matpadley/MCPServer_Demo/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive multi-language implementation demonstrating Model Context Protocol (MCP) servers and clients with Todo management functionality, showcasing MCP implementations in .NET, TypeScript, ExtJS, and React.

> The .NET implementation is based on the official tutorial: [AI Model Context Protocol Server with .NET](https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-model-context-protocol-server-dotnet)

## Project Overview
This repository demonstrates how to build MCP servers and clients using different technology stacks while maintaining the same functionality and tool interfaces. The server implementations provide identical Todo management capabilities through the Model Context Protocol, while the client implementations showcase different frontend approaches to consuming MCP services.

## Implementations

### 🖥️ Server Implementations

#### 🔵 .NET Implementation (`dotnet/`)
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

#### 🟡 TypeScript Implementation (`typescript/`)
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

### 🖼️ Client Implementations

#### 🟠 ExtJS Client (`extjs/`)
A professional ExtJS application demonstrating MCP client integration.

**Technology Stack:**
- ExtJS 7.x
- Modern JavaScript (ES6+)
- HTTP MCP transport
- Professional UI components

**Quick Start:**
```bash
cd extjs
python3 -m http.server 8080
# Open http://localhost:8080
```
📖 [View ExtJS Documentation](./extjs/README.md)

#### ⚛️ React Client (`react/`)
A modern React TypeScript client with Material-UI design.

**Technology Stack:**
- React 18+
- TypeScript
- Material-UI (MUI)
- Vite build system

**Quick Start:**
```bash
cd react
npm install
npm run dev
# Open http://localhost:3000
```
📖 [View React Documentation](./react/README.md)

## Common Features
All implementations provide the same MCP tool functionality:

| Tool | Description | Parameters |
|------|-------------|------------|
| **create_todo** | Creates a new todo | `description`, `createdDate` |
| **read_todos** | Reads all todos or a specific todo | `id` (optional) |
| **update_todo** | Updates todo fields by id | `id`, `description` (optional), `createdDate` (optional) |
| **delete_todo** | Deletes a todo by id | `id` |

### Server vs Client Comparison

| Type | Purpose | Communication | Examples |
|------|---------|---------------|----------|
| **Servers** | Expose MCP tools and data | Receive MCP requests | .NET, TypeScript |
| **Clients** | Consume MCP tools | Send MCP requests | ExtJS, React |

## Architecture Comparison

| Aspect | .NET | TypeScript | ExtJS | React |
|--------|------|------------|-------|-------|
| **Type** | Server | Server | Client | Client |
| **Language** | C# | TypeScript | JavaScript | TypeScript |
| **Runtime** | .NET 8.0 | Node.js 20+ | Browser | Browser |
| **Database** | Entity Framework Core | SQLite3 direct | HTTP calls to MCP | HTTP calls to MCP |
| **Async Pattern** | Task&lt;T&gt; | Promise&lt;T&gt; | Promises | Promises |
| **DI Container** | Built-in | Constructor injection | Manual | React Context |
| **Tool Discovery** | Reflection + Attributes | Manual registration | MCP calls | MCP calls |
| **Transport** | HTTP | Stdio | HTTP | HTTP |
| **UI Framework** | N/A | N/A | ExtJS | Material-UI |
| **Type Safety** | Strong typing | TypeScript typing | Runtime | TypeScript typing |

## Repository Structure
```
MCPServer_Demo/
├── dotnet/                     # .NET server implementation
│   ├── MCPServer/              # Main web API project
│   ├── MCPServer.Data/         # Data access layer  
│   ├── MCPServer.sln           # Solution file
│   └── README.md               # .NET documentation
├── typescript/                 # TypeScript server implementation
│   ├── src/                    # Source code
│   │   ├── data/               # Data models and database
│   │   ├── tools/              # MCP tool implementations
│   │   └── index.ts            # Main server
│   ├── package.json            # Node.js dependencies
│   └── README.md               # TypeScript documentation
├── extjs/                      # ExtJS client implementation
│   ├── app.js                  # Complete ExtJS application
│   ├── index.html              # HTML page with ExtJS CDN
│   ├── package.json            # Package configuration
│   └── README.md               # ExtJS documentation
├── react/                      # React client implementation
│   ├── src/                    # React source code
│   │   ├── components/         # React UI components
│   │   ├── services/           # MCP service layer
│   │   ├── types/              # TypeScript definitions
│   │   └── App.tsx             # Main React app
│   ├── package.json            # React dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── README.md               # React documentation
├── README.md                   # This file
└── .github/                    # GitHub configuration
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

### For ExtJS Client
- **Web Server** (Python's built-in server, Node.js http-server, etc.)
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### For React Client
- **Node.js 18.x** or later
- **npm** or **yarn**
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### For VS Code MCP Integration
- **VS Code** with MCP-compatible extensions
- Configure `.vscode/MCP.json` (see [MCP Integration](#mcp-protocol-integration) section)

## Getting Started with All Implementations

### 1. Clone the Repository
```bash
git clone https://github.com/matpadley/MCPServer_Demo.git
cd MCPServer_Demo
```

### 2. Run Server Implementations

**Start .NET Server:**
```bash
cd dotnet
dotnet restore MCPServer.sln
dotnet build MCPServer.sln
dotnet run --project MCPServer
```
The .NET server will start on `http://localhost:5226`

**Start TypeScript Server (in a new terminal):**
```bash
cd typescript
npm install
npm run build
npm start
```
The TypeScript server runs via stdio transport for direct MCP communication

### 3. Run Client Implementations

**Start ExtJS Client (in a new terminal):**
```bash
cd extjs
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

**Start React Client (in a new terminal):**
```bash
cd react
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

### 4. Explore the Full Stack
- **Servers**: Both .NET and TypeScript provide the same MCP tools
- **Clients**: Both ExtJS and React can connect to either server
- **Protocol**: All implementations use the standard MCP protocol

## MCP Protocol Integration
All implementations follow the Model Context Protocol specification:

- **Tool Discovery:** Automatic exposure of available tools
- **Standardized Interface:** Consistent tool schemas across implementations  
- **Error Handling:** Meaningful error responses
- **Type Validation:** Parameter validation and type checking

### Full Stack Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   ExtJS Client  │    │  React Client   │
│  (Browser UI)   │    │ (Browser UI)    │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          │      HTTP/JSON-RPC   │
          │                      │
    ┌─────▼──────────────────────▼─────┐
    │         MCP Protocol Layer        │
    └─────┬──────────────────────┬─────┘
          │                      │
          │                      │
┌─────────▼───────┐    ┌─────────▼───────┐
│  .NET Server    │    │TypeScript Server│
│ (Entity Framework)   │   (SQLite3)     │
└─────────────────┘    └─────────────────┘
```

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

**In ExtJS Client:**
```javascript
// Add new method to MCPService
async callMyTool(param) {
  return await this.callTool('my_tool', { param });
}

// Add UI component and handler
onMyToolClick: async function() {
  const result = await TodoApp.service.MCPService.callMyTool(value);
  // Update UI with result
}
```

**In React Client:**
```typescript
// Add method to MCPService
async callMyTool(param: string): Promise<any> {
  return await this.callTool('my_tool', { param });
}

// Add React component
const MyToolComponent: React.FC = () => {
  const handleClick = async () => {
    const result = await mcpService.callMyTool(value);
    // Update state
  };
  return <Button onClick={handleClick}>My Tool</Button>;
};
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

#### ExtJS Client Issues
- **ExtJS not loading**: Check internet connection for CDN access, or download ExtJS locally
- **MCP connection failed**: Verify server URL configuration in `app.js`
- **CORS errors**: Ensure the MCP server has CORS configured for the client origin

#### React Client Issues
- **React app won't start**: Check Node.js version (requires 18+) and run `npm install`
- **Vite proxy errors**: Verify proxy configuration in `vite.config.ts`
- **Material-UI theme issues**: Check theme configuration in `main.tsx`

#### VS Code MCP Integration
- **Server not detected**: Verify `.vscode/MCP.json` syntax and server URLs
- **Connection refused**: Ensure the respective server is running before connecting
- **Tool discovery fails**: Check server logs for MCP protocol errors

#### Client-Server Communication
- **CORS errors**: Ensure MCP servers have CORS enabled for client origins
- **Network timeouts**: Check network connectivity and server response times
- **Tool call failures**: Verify tool parameters match server expectations

## Testing All Implementations
Each implementation includes its own testing approach:
- **.NET:** xUnit with Entity Framework in-memory provider (when tests are added)
- **TypeScript:** Standard Node.js testing patterns (when tests are added)
- **ExtJS:** Browser-based testing with manual verification
- **React:** Jest and React Testing Library integration (when tests are added)

## Contributing

We welcome contributions to all implementations! Please follow these guidelines:

### General Guidelines
1. **Choose your implementation**: Decide whether you're contributing to servers (.NET, TypeScript) or clients (ExtJS, React)
2. **Maintain feature parity**: When adding new MCP tools, ensure all implementations support them
3. **Follow conventions**: Each implementation has its own patterns (see respective README files)
4. **Test thoroughly**: Run builds and basic functionality tests before submitting

### Development Workflow
1. **Fork the repository** and create a feature branch
2. **Make your changes** following the technology-specific patterns
3. **Test all implementations** if you've added new tools or features
4. **Update documentation** for any new features or breaking changes
5. **Submit a pull request** with a clear description of your changes

### Code Style
- **.NET**: Follow Microsoft C# coding standards and use dependency injection
- **TypeScript**: Use TypeScript strict mode and async/await patterns
- **ExtJS**: Follow ExtJS MVC patterns and component lifecycle
- **React**: Use functional components, hooks, and TypeScript best practices
- **Documentation**: Update README files and inline comments for significant changes

### Adding New MCP Tools
When adding new functionality, ensure all implementations provide the same tool interface:
- Use consistent parameter names and types across server implementations
- Provide equivalent error handling in both servers
- Update client implementations to support new tools
- Update tool documentation in all README files

### Client-Specific Contributions
- **ExtJS**: Follow ExtJS component patterns and use proper MVC architecture
- **React**: Use modern React patterns with hooks and functional components
- **UI/UX**: Maintain consistent user experience across both client implementations
- **Responsive Design**: Ensure both clients work well on different screen sizes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For detailed implementation-specific information, see:
- 📖 [.NET Documentation](./dotnet/README.md)
- 📖 [TypeScript Documentation](./typescript/README.md)
- 📖 [ExtJS Documentation](./extjs/README.md)
- 📖 [React Documentation](./react/README.md)

# MCPServer - TypeScript Implementation

A TypeScript/Node.js implementation of the MCPServer with Todo management tools using the Model Context Protocol.

## Project Description
This TypeScript implementation provides the same MCP (Model Context Protocol) functionality as the .NET version, allowing todo management through discoverable tools. It uses SQLite for data persistence and provides a clean separation between data access and business logic layers.

## Technology Stack
- **Node.js** (v20+)
- **TypeScript** (compiled to ES2020)
- **SQLite3** (for data persistence)
- **@modelcontextprotocol/sdk** (MCP protocol implementation)

## Project Structure
```
typescript/
├── src/
│   ├── data/
│   │   ├── Todo.ts              # Todo entity and types
│   │   └── DatabaseContext.ts   # SQLite database operations
│   ├── tools/
│   │   └── TodosMcpTool.ts      # MCP tools for todo management
│   └── index.ts                 # Main MCP server implementation
├── dist/                        # Compiled JavaScript output
├── package.json                 # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- All dependencies are handled via npm

### Installation
```bash
cd typescript
npm install
```

### Development
```bash
# Build the TypeScript code
npm run build

# Run in development mode with auto-reload
npm run dev

# Run the compiled version
npm start
```

## Available MCP Tools

### create_todo
**Description:** Creates a new todo with a description and creation date.
**Parameters:**
- `description` (string): Description of the todo
- `createdDate` (string): Creation date in ISO 8601 format

**Example:**
```javascript
{
  "name": "create_todo",
  "arguments": {
    "description": "Learn TypeScript MCP patterns",
    "createdDate": "2024-01-15T10:00:00Z"
  }
}
```

### read_todos
**Description:** Reads all todos, or a single todo if an id is provided.
**Parameters:**
- `id` (string, optional): Id of the todo to read

**Example:**
```javascript
// Get all todos
{ "name": "read_todos", "arguments": {} }

// Get specific todo
{ "name": "read_todos", "arguments": { "id": "1" } }
```

### update_todo
**Description:** Updates the specified todo fields by id.
**Parameters:**
- `id` (string): Id of the todo to update
- `description` (string, optional): New description
- `createdDate` (string, optional): New creation date in ISO 8601 format

**Example:**
```javascript
{
  "name": "update_todo",
  "arguments": {
    "id": "1",
    "description": "Updated description"
  }
}
```

### delete_todo
**Description:** Deletes a todo by id.
**Parameters:**
- `id` (string): Id of the todo to delete

**Example:**
```javascript
{
  "name": "delete_todo",
  "arguments": { "id": "1" }
}
```

## Database
- Uses SQLite with in-memory database by default
- Automatic table creation on startup
- All operations are asynchronous and return Promises
- Equivalent schema to the .NET Entity Framework implementation

## MCP Integration
This server implements the Model Context Protocol and can be used with MCP-compatible clients:

1. **Stdio Transport:** The server communicates via stdin/stdout
2. **Tool Discovery:** Automatically exposes all todo management tools
3. **Error Handling:** Provides meaningful error messages for invalid operations
4. **Type Safety:** Full TypeScript type checking for all operations

## Key Features
- **Async/Await:** All database operations use async/await patterns
- **Type Safety:** Strong TypeScript typing throughout the codebase
- **Error Handling:** Comprehensive error handling with meaningful messages
- **Tool Discovery:** MCP tools are automatically discoverable
- **Clean Architecture:** Separation of data access, business logic, and MCP protocol handling

## Development Workflow
```bash
# Install dependencies
npm install

# Development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Comparison with .NET Version
This TypeScript implementation maintains functional parity with the .NET version:

| Feature | .NET | TypeScript |
|---------|------|------------|
| Database | Entity Framework Core | SQLite3 direct |
| Async Operations | Task&lt;T&gt; | Promise&lt;T&gt; |
| Dependency Injection | Built-in DI | Constructor injection |
| MCP Tools | Attributes | Manual registration |
| Type Safety | C# types | TypeScript types |

## Contributing
- Follow TypeScript best practices
- Maintain async/await patterns for all database operations
- Add comprehensive error handling for new features
- Update tool schemas when adding new MCP tools

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
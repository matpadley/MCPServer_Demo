# MCPServer ExtJS Client

A modern ExtJS client application for interacting with MCPServer implementations, providing a rich user interface for Todo management through the Model Context Protocol.

## Overview

This ExtJS client demonstrates how frontend applications can consume MCP (Model Context Protocol) servers. It provides a full-featured Todo management interface that connects to either the .NET or TypeScript MCPServer implementations.

## Features

- **Rich UI Components**: ExtJS grid, forms, and toolbars for professional Todo management
- **Real-time MCP Integration**: Direct communication with MCP servers via HTTP
- **Connection Status**: Visual indicators for server connectivity
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for Todos
- **Error Handling**: User-friendly error messages and connection management
- **Responsive Design**: Professional ExtJS Neptune theme

## Prerequisites

- **Web Server**: Any HTTP server (Python's built-in server works great)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge
- **MCPServer**: Either .NET or TypeScript implementation running

## Quick Start

### 1. Start an MCP Server
First, ensure one of the MCP servers is running:

**Option A: .NET Server**
```bash
cd ../dotnet
dotnet run --project MCPServer
# Server runs on http://localhost:5226
```

**Option B: TypeScript Server**
```bash
cd ../typescript
npm start
# Note: TypeScript uses stdio transport, so you'll need to adapt for HTTP
```

### 2. Start the ExtJS Client
```bash
cd extjs
python3 -m http.server 8080
# Or use any web server of your choice
```

### 3. Open in Browser
Navigate to: `http://localhost:8080`

## Application Structure

```
extjs/
├── index.html              # Main HTML page with ExtJS CDN
├── app.js                  # Complete application code
├── package.json            # Node.js package info
└── README.md              # This documentation
```

## MCP Integration

The ExtJS client integrates with MCP servers through the following components:

### MCPService (Singleton)
Handles all Model Context Protocol communication:
- **Tool Invocation**: Calls MCP tools via JSON-RPC 2.0
- **Connection Management**: Monitors server connectivity
- **Error Handling**: Provides meaningful error messages

### Available MCP Tools
The client uses these MCP tools from the server:

| Tool | Description | Parameters |
|------|-------------|------------|
| `create_todo` | Creates a new todo | `description`, `createdDate` |
| `read_todos` | Retrieves all todos | None |
| `update_todo` | Updates a todo | `id`, `description` (optional) |
| `delete_todo` | Deletes a todo | `id` |

### Data Flow
1. **UI Action**: User interacts with ExtJS components
2. **MCP Call**: Application calls MCPService methods
3. **JSON-RPC**: Service sends JSON-RPC 2.0 requests to MCP server
4. **Response**: Server returns results via MCP protocol
5. **UI Update**: ExtJS components reflect the changes

## Key Components

### Todo Model
ExtJS data model defining Todo structure:
```javascript
Ext.define('TodoApp.model.Todo', {
    extend: 'Ext.data.Model',
    fields: ['id', 'description', 'createdDate', 'completed']
});
```

### Todo Grid
Main interface for displaying and managing todos:
- **Columns**: ID, Description, Created Date, Actions
- **Actions**: Complete/Undo, Delete buttons
- **Refresh**: Manual reload from MCP server

### Add Todo Form
Simple form for creating new todos:
- **Description Field**: Required text input
- **Add Button**: Calls `create_todo` MCP tool
- **Validation**: Client-side form validation

### Connection Status
Visual indicator showing MCP server connectivity:
- **Green**: Connected and responsive
- **Red**: Disconnected or unreachable

## Configuration

### Server URL
Update the MCP server URL in `app.js`:
```javascript
Ext.define('TodoApp.service.MCPService', {
    config: {
        serverUrl: 'http://localhost:5226/api/mcp', // Change this URL
        // ...
    }
});
```

### ExtJS Version
The application uses ExtJS 7.5.0 from Sencha's CDN. To use a different version, update the CDN links in `index.html`.

## Troubleshooting

### Common Issues

#### ExtJS Not Loading
- **Problem**: Blank page or console errors about ExtJS
- **Solution**: Check internet connection for CDN access, or download ExtJS locally

#### MCP Server Connection Failed
- **Problem**: "Disconnected from MCP Server" status
- **Solutions**:
  - Verify MCP server is running (`http://localhost:5226` for .NET)
  - Check server URL configuration in `app.js`
  - Ensure CORS is enabled on the MCP server

#### No Todos Loading
- **Problem**: Grid remains empty despite server connection
- **Solutions**:
  - Check browser console for JavaScript errors
  - Verify MCP tool responses match expected format
  - Test MCP tools directly with a REST client

#### CORS Errors
- **Problem**: Browser blocks requests due to CORS policy
- **Solution**: Ensure the MCP server has CORS configured for `http://localhost:8080`

### Debug Tips

1. **Browser Console**: Check for JavaScript errors and network requests
2. **Network Tab**: Monitor MCP API calls and responses
3. **MCP Server Logs**: Review server-side error messages
4. **Test Connection**: Use the "Test Connection" button to verify MCP connectivity

## Development

### Adding New Features

#### New MCP Tool
1. Add tool definition to the MCP server
2. Create a new method in `MCPService`
3. Add UI components (buttons, forms) to invoke the tool
4. Update the grid or forms to display results

#### Custom Styling
Add CSS rules to the `<style>` section in `index.html`:
```css
.my-custom-class {
    /* Custom styles */
}
```

#### Additional Views
Create new ExtJS components and add them to the viewport layout.

### ExtJS Patterns Used

- **MVC Architecture**: Models, Views, and Controllers
- **Data Binding**: Store and Model integration
- **Event Handling**: Controller methods for user interactions
- **Component Lifecycle**: Proper component creation and destruction

## Integration with Other Implementations

This ExtJS client works with any MCP server that implements the standard MCP protocol:

- **✅ .NET MCPServer**: Full compatibility via HTTP transport
- **⚠️ TypeScript MCPServer**: Requires HTTP adapter (currently uses stdio)
- **🔄 Future Servers**: Any MCP-compliant server implementation

## Performance Notes

- **ExtJS CDN**: First load requires internet connection
- **Data Loading**: Todos are loaded on-demand, not cached
- **Real-time Updates**: Manual refresh required (no auto-refresh)
- **Memory Usage**: ExtJS components are properly cleaned up

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

---

For more information about the MCP protocol and server implementations, see:
- 📖 [Main Project README](../README.md)
- 📖 [.NET Implementation](../dotnet/README.md)
- 📖 [TypeScript Implementation](../typescript/README.md)
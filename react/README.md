# MCPServer React Client

A modern React TypeScript client application for interacting with MCPServer implementations, providing an intuitive Material-UI interface for Todo management through the Model Context Protocol.

## Overview

This React client demonstrates how modern frontend applications can consume MCP (Model Context Protocol) servers. It provides a polished, responsive Todo management interface that connects to either the .NET or TypeScript MCPServer implementations.

## Features

- **Modern React Architecture**: TypeScript, hooks, and functional components
- **Material-UI Design**: Professional, accessible UI components
- **Real-time MCP Integration**: Direct communication with MCP servers via HTTP
- **Connection Management**: Visual status indicators and automatic retry logic
- **Data Grid**: Advanced todo management with sorting, pagination, and actions
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript Safety**: Full type checking and IntelliSense support

## Prerequisites

- **Node.js 18+**: For running the React development server
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

**Option B: TypeScript Server with HTTP adapter**
```bash
cd ../typescript
npm start
# Note: May require HTTP adapter for React client connectivity
```

### 2. Install Dependencies
```bash
cd react
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to: `http://localhost:3000`

## Application Structure

```
react/
├── src/
│   ├── components/          # React UI components
│   │   ├── AddTodoForm.tsx  # Todo creation form
│   │   ├── TodoList.tsx     # Data grid for todos
│   │   └── ConnectionIndicator.tsx # Connection status
│   ├── services/            # Business logic
│   │   └── mcpService.ts    # MCP protocol client
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Shared interfaces
│   ├── App.tsx              # Main application component
│   └── main.tsx             # React entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This documentation
```

## Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.2+ |
| **TypeScript** | Type Safety | 5.2+ |
| **Material-UI** | UI Components | 5.14+ |
| **Vite** | Build Tool | 5.0+ |
| **MUI X Data Grid** | Advanced Table | 6.18+ |

## MCP Integration

The React client integrates with MCP servers through a dedicated service layer:

### MCPService Class
Handles all Model Context Protocol communication:
- **HTTP Transport**: Communicates via JSON-RPC 2.0 over HTTP
- **Tool Invocation**: Calls MCP tools with typed parameters
- **Error Handling**: Provides meaningful error messages with proper typing
- **Connection Testing**: Monitors server availability

### Available MCP Tools
The client uses these MCP tools from the server:

| Tool | Description | Parameters | Return Type |
|------|-------------|------------|-------------|
| `create_todo` | Creates a new todo | `description: string`, `createdDate: string` | Success message |
| `read_todos` | Retrieves all todos | None | Array of todos |
| `update_todo` | Updates a todo | `id: number`, `description?: string` | Success message |
| `delete_todo` | Deletes a todo | `id: number` | Success message |

### Data Flow
1. **User Interaction**: User interacts with Material-UI components
2. **Component State**: React components manage local UI state
3. **Service Call**: Components call MCPService methods
4. **MCP Communication**: Service sends JSON-RPC requests to MCP server
5. **Response Handling**: Service processes MCP responses and returns typed data
6. **UI Update**: Components update based on service responses

## Key Components

### App.tsx
Main application shell providing:
- **App Bar**: Title and connection status indicator
- **Layout**: Responsive container with proper spacing
- **Connection Management**: Monitors and displays MCP server connectivity
- **Error Handling**: Global error states and recovery actions

### AddTodoForm.tsx
Todo creation interface featuring:
- **Controlled Inputs**: React-managed form state
- **Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during MCP calls
- **Error Recovery**: Clear error messaging and retry options

### TodoList.tsx
Advanced todo management with:
- **Data Grid**: MUI X Data Grid with sorting and pagination
- **Actions**: Complete/incomplete and delete operations
- **Status Indicators**: Visual completion status
- **Refresh Control**: Manual data reload capability

### ConnectionIndicator.tsx
Real-time connection status showing:
- **Visual Status**: Color-coded connection state
- **Last Updated**: Timestamp of last connection check
- **Error Details**: Specific error messages when disconnected

### MCPService.ts
Centralized MCP communication handling:
- **Singleton Pattern**: Single instance for consistent state
- **Type Safety**: Full TypeScript typing for all MCP interactions
- **Error Handling**: Comprehensive error catching and transformation
- **Request Management**: Automatic request ID generation

## Configuration

### Server URL
Update the MCP server URL in `mcpService.ts`:
```typescript
// Default uses Vite proxy to localhost:5226
const mcpService = new MCPService('/api/mcp');

// Or specify a full URL
const mcpService = new MCPService('http://localhost:5226/api/mcp');
```

### Proxy Configuration
The Vite configuration includes a proxy for development:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5226',
      changeOrigin: true
    }
  }
}
```

### Theme Customization
Modify the Material-UI theme in `main.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    // Add your custom colors
  }
});
```

## Build and Deployment

### Development Build
```bash
npm run dev          # Start development server with hot reload
```

### Production Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Static Deployment
The built application in `dist/` can be deployed to any static hosting service:
- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Upload to gh-pages branch
- **AWS S3**: Upload to S3 bucket with static hosting

## Troubleshooting

### Common Issues

#### React App Won't Start
- **Problem**: `npm run dev` fails or shows errors
- **Solutions**:
  - Run `npm install` to ensure dependencies are installed
  - Check Node.js version (`node --version` - requires 18+)
  - Clear npm cache: `npm cache clean --force`

#### MCP Server Connection Failed
- **Problem**: Connection indicator shows "Disconnected"
- **Solutions**:
  - Verify MCP server is running (`http://localhost:5226` for .NET)
  - Check proxy configuration in `vite.config.ts`
  - Ensure CORS is enabled on the MCP server
  - Test server directly: `curl http://localhost:5226/api/mcp`

#### No Todos Loading
- **Problem**: Todo list remains empty despite server connection
- **Solutions**:
  - Open browser console and check for JavaScript errors
  - Verify MCP tool responses in Network tab
  - Test MCP tools directly with a REST client
  - Check todo data parsing logic in `TodoList.tsx`

#### TypeScript Compilation Errors
- **Problem**: Build fails with TypeScript errors
- **Solutions**:
  - Run `npm run build` to see detailed error messages
  - Check `tsconfig.json` configuration
  - Ensure all dependencies have proper type definitions
  - Update TypeScript version if needed

#### Material-UI Theme Issues
- **Problem**: Components don't match expected styling
- **Solutions**:
  - Verify Material-UI version compatibility
  - Check theme configuration in `main.tsx`
  - Clear browser cache and hard reload
  - Inspect element styles in browser dev tools

### Debug Tips

1. **Browser Console**: Always check for JavaScript errors and warnings
2. **Network Tab**: Monitor MCP API calls and responses
3. **React DevTools**: Install React Developer Tools browser extension
4. **MCP Server Logs**: Check server-side logs for error details
5. **Component State**: Use React DevTools to inspect component state and props

## Performance Considerations

- **Bundle Size**: Material-UI is tree-shakable, but check bundle analyzer for optimization
- **Data Loading**: Todos are loaded on-demand, consider caching for large datasets
- **Real-time Updates**: Currently manual refresh, consider WebSocket for real-time updates
- **Memory Usage**: Data Grid properly handles large datasets with virtualization

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

## Integration with Other Implementations

This React client works with any MCP server that implements the standard MCP protocol:

- **✅ .NET MCPServer**: Full compatibility via HTTP transport
- **⚠️ TypeScript MCPServer**: Requires HTTP adapter (currently uses stdio)
- **🔄 Future Servers**: Any MCP-compliant server implementation

## Development Patterns

### Adding New MCP Tools

1. **Update Types**: Add new interfaces in `src/types/index.ts`
2. **Extend Service**: Add new methods to `MCPService` class
3. **Create Components**: Build React components for the new functionality
4. **Update UI**: Integrate components into the main application

### Custom Components

```typescript
// Example custom component
import React from 'react';
import { Paper, Typography } from '@mui/material';

interface CustomComponentProps {
  data: any;
}

export const CustomComponent: React.FC<CustomComponentProps> = ({ data }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">{data.title}</Typography>
      {/* Component content */}
    </Paper>
  );
};
```

### State Management

For complex applications, consider adding:
- **React Context**: For global state management
- **Redux Toolkit**: For complex state logic
- **React Query**: For server state caching
- **Zustand**: For simple global state

---

For more information about the MCP protocol and server implementations, see:
- 📖 [Main Project README](../README.md)
- 📖 [.NET Implementation](../dotnet/README.md)
- 📖 [TypeScript Implementation](../typescript/README.md)
- 📖 [ExtJS Implementation](../extjs/README.md)
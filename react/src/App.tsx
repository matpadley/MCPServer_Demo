import { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Alert
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { ConnectionIndicator } from './components/ConnectionIndicator';
import { ConnectionStatus } from './types';
import { mcpService } from './services/mcpService';

function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    lastChecked: new Date()
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const checkConnection = async () => {
    try {
      const connected = await mcpService.testConnection();
      setConnectionStatus({
        connected,
        lastChecked: new Date(),
        error: connected ? undefined : 'Unable to reach MCP server'
      });
    } catch (error) {
      setConnectionStatus({
        connected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Connection test failed'
      });
    }
  };

  const handleTodoAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTestConnection = async () => {
    await checkConnection();
  };

  // Initial connection check
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MCPServer React Client
          </Typography>
          <ConnectionIndicator status={connectionStatus} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {!connectionStatus.connected && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleTestConnection}
                startIcon={<Settings />}
              >
                Test Connection
              </Button>
            }
          >
            Unable to connect to MCP server. Make sure the server is running on http://localhost:5226
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Todo Management
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This React application demonstrates how to build a frontend client that interacts with 
            MCP (Model Context Protocol) servers. It provides a modern interface for managing todos 
            through the MCP protocol.
          </Typography>
        </Box>

        <AddTodoForm onTodoAdded={handleTodoAdded} />
        <TodoList refreshTrigger={refreshTrigger} />

        <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            About This Demo
          </Typography>
          <Typography variant="body2" paragraph>
            This React client connects to MCPServer implementations via HTTP and demonstrates:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Real-time MCP tool invocation</li>
            <li>Modern React patterns with TypeScript</li>
            <li>Material-UI component library</li>
            <li>Error handling and connection management</li>
            <li>Responsive design and user experience</li>
          </ul>
        </Box>
      </Container>
    </>
  );
}

export default App;
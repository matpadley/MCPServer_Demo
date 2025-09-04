import { mcpService } from '../src/services/mcpService';

// Mock fetch globally
global.fetch = jest.fn();

describe('MCPService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the request ID counter for consistent testing
    (mcpService as any).requestId = 1;
  });

  describe('callTool', () => {
    it('should make successful MCP tool call', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          result: 'Todo created: Test todo (Id: 1)'
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await mcpService.callTool('create_todo', {
        description: 'Test todo',
        createdDate: '2024-01-01T00:00:00.000Z'
      });

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'create_todo',
            arguments: {
              description: 'Test todo',
              createdDate: '2024-01-01T00:00:00.000Z'
            }
          }
        })
      });
      expect(result).toBe('Todo created: Test todo (Id: 1)');
    });

    it('should handle HTTP errors', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(mcpService.callTool('create_todo', { description: 'Test' }))
        .rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle MCP errors', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          error: {
            code: -32602,
            message: 'Invalid params'
          }
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(mcpService.callTool('create_todo', {}))
        .rejects.toThrow('Invalid params');
    });

    it('should handle MCP errors without message', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          error: {
            code: -32602
          }
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(mcpService.callTool('create_todo', {}))
        .rejects.toThrow('MCP tool call failed');
    });

    it('should increment request IDs', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          result: 'success'
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await mcpService.callTool('tool1', {});
      await mcpService.callTool('tool2', {});

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2);
      
      const firstCall = (fetch as jest.Mock).mock.calls[0];
      const firstBody = JSON.parse(firstCall[1].body);
      expect(firstBody.id).toBe(1);

      const secondCall = (fetch as jest.Mock).mock.calls[1];
      const secondBody = JSON.parse(secondCall[1].body);
      expect(secondBody.id).toBe(2);
    });
  });

  describe('listTools', () => {
    it('should list available MCP tools', async () => {
      // Arrange
      const mockTools = [
        {
          name: 'create_todo',
          description: 'Creates a new todo',
          inputSchema: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              createdDate: { type: 'string', format: 'date-time' }
            },
            required: ['description', 'createdDate']
          }
        },
        {
          name: 'read_todos',
          description: 'Reads all todos or a specific todo by id',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            }
          }
        }
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          result: {
            tools: mockTools
          }
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const tools = await mcpService.listTools();

      // Assert
      expect(fetch).toHaveBeenCalledWith('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {}
        })
      });
      expect(tools).toEqual(mockTools);
    });

    it('should handle empty tools list', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          result: {}
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const tools = await mcpService.listTools();

      // Assert
      expect(tools).toEqual([]);
    });

    it('should handle HTTP errors', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(mcpService.listTools())
        .rejects.toThrow('HTTP 404: Not Found');
    });

    it('should handle MCP errors', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          error: {
            code: -32601,
            message: 'Method not found'
          }
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(mcpService.listTools())
        .rejects.toThrow('Method not found');
    });
  });

  describe('testConnection', () => {
    it('should return true when connection is successful', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          result: { tools: [] }
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const isConnected = await mcpService.testConnection();

      // Assert
      expect(isConnected).toBe(true);
    });

    it('should return false when connection fails', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Server Error'
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Mock console.error to prevent test output pollution
      const originalError = console.error;
      console.error = jest.fn();

      // Act
      const isConnected = await mcpService.testConnection();

      // Assert
      expect(isConnected).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Connection test failed:',
        expect.any(Error)
      );

      // Restore console.error
      console.error = originalError;
    });

    it('should return false when network request fails', async () => {
      // Arrange
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock console.error to prevent test output pollution
      const originalError = console.error;
      console.error = jest.fn();

      // Act
      const isConnected = await mcpService.testConnection();

      // Assert
      expect(isConnected).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Connection test failed:',
        expect.any(Error)
      );

      // Restore console.error
      console.error = originalError;
    });
  });

  describe('comprehensive integration scenarios', () => {
    it('should handle complete Todo workflow', async () => {
      // Mock the responses for a complete workflow
      const responses = [
        // Create todo
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            jsonrpc: '2.0',
            id: 1,
            result: 'Todo created: Test todo (Id: 1)'
          })
        },
        // Read todos
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            jsonrpc: '2.0',
            id: 2,
            result: [
              {
                id: 1,
                description: 'Test todo',
                createdDate: '2024-01-01T00:00:00.000Z'
              }
            ]
          })
        },
        // Update todo
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            jsonrpc: '2.0',
            id: 3,
            result: 'Todo 1 updated.'
          })
        },
        // Delete todo
        {
          ok: true,
          json: jest.fn().mockResolvedValue({
            jsonrpc: '2.0',
            id: 4,
            result: 'Todo 1 deleted.'
          })
        }
      ];

      (fetch as jest.Mock)
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2])
        .mockResolvedValueOnce(responses[3]);

      // Act - Complete workflow
      const createResult = await mcpService.callTool('create_todo', {
        description: 'Test todo',
        createdDate: '2024-01-01T00:00:00.000Z'
      });

      const readResult = await mcpService.callTool('read_todos', {});

      const updateResult = await mcpService.callTool('update_todo', {
        id: '1',
        description: 'Updated todo'
      });

      const deleteResult = await mcpService.callTool('delete_todo', {
        id: '1'
      });

      // Assert
      expect(createResult).toBe('Todo created: Test todo (Id: 1)');
      expect(readResult).toEqual([
        {
          id: 1,
          description: 'Test todo',
          createdDate: '2024-01-01T00:00:00.000Z'
        }
      ]);
      expect(updateResult).toBe('Todo 1 updated.');
      expect(deleteResult).toBe('Todo 1 deleted.');

      expect(fetch).toHaveBeenCalledTimes(4);
    });

    it('should handle different server URL configurations', async () => {
      // Arrange
      const customService = new (mcpService.constructor as any)('http://localhost:3000/mcp');
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          jsonrpc: '2.0',
          id: 1,
          result: 'success'
        })
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await customService.callTool('test_tool', {});

      // Assert
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/mcp', expect.any(Object));
    });
  });
});
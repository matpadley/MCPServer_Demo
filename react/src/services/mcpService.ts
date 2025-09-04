import { MCPResponse, MCPTool } from '../types';

class MCPService {
  private serverUrl: string;
  private requestId: number = 1;

  constructor(serverUrl: string = '/api/mcp') {
    this.serverUrl = serverUrl;
  }

  async callTool(toolName: string, parameters: Record<string, any>): Promise<any> {
    const request = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: parameters
      }
    };

    const response = await fetch(this.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: MCPResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'MCP tool call failed');
    }

    return data.result;
  }

  async listTools(): Promise<MCPTool[]> {
    const request = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/list',
      params: {}
    };

    const response = await fetch(this.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: MCPResponse<{ tools: MCPTool[] }> = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Failed to list tools');
    }

    return data.result?.tools || [];
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.listTools();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const mcpService = new MCPService();
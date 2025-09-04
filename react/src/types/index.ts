export interface Todo {
  id: number;
  description: string;
  createdDate: string;
  completed?: boolean;
}

export interface MCPResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ConnectionStatus {
  connected: boolean;
  lastChecked: Date;
  error?: string;
}
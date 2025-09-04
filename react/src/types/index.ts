export interface Todo {
  id: number;
  description: string;
  createdDate: string;
  completed?: boolean;
}

export interface MCPResponse<T = unknown> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
  data?: unknown;
  };
}


export interface MCPToolCall {
  name: string;
  arguments: Record<string, unknown>;
}


export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ConnectionStatus {
  connected: boolean;
  lastChecked: Date;
  error?: string;
}
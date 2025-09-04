#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const DatabaseContext_js_1 = require("./data/DatabaseContext.js");
const TodosMcpTool_js_1 = require("./tools/TodosMcpTool.js");
/**
 * TypeScript MCP Server - equivalent to the .NET MCPServer
 * Provides todo management tools via the Model Context Protocol
 */
class MCPServerApp {
    constructor() {
        this.server = new index_js_1.Server({
            name: 'mcpserver-typescript',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Initialize database and tools
        this.db = new DatabaseContext_js_1.DatabaseContext(); // Uses in-memory SQLite
        this.todosTool = new TodosMcpTool_js_1.TodosMcpTool(this.db);
        this.setupHandlers();
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'create_todo',
                        description: 'Creates a new todo with a description and creation date.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                description: {
                                    type: 'string',
                                    description: 'Description of the todo',
                                },
                                createdDate: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Creation date of the todo (ISO 8601 format)',
                                },
                            },
                            required: ['description', 'createdDate'],
                        },
                    },
                    {
                        name: 'read_todos',
                        description: 'Reads all todos, or a single todo if an id is provided.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Id of the todo to read (optional)',
                                },
                            },
                        },
                    },
                    {
                        name: 'update_todo',
                        description: 'Updates the specified todo fields by id.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Id of the todo to update',
                                },
                                description: {
                                    type: 'string',
                                    description: 'New description (optional)',
                                },
                                createdDate: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'New creation date (optional, ISO 8601 format)',
                                },
                            },
                            required: ['id'],
                        },
                    },
                    {
                        name: 'delete_todo',
                        description: 'Deletes a todo by id.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Id of the todo to delete',
                                },
                            },
                            required: ['id'],
                        },
                    },
                ],
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'create_todo': {
                        const description = args?.description;
                        const createdDateStr = args?.createdDate;
                        const createdDate = new Date(createdDateStr);
                        const result = await this.todosTool.createTodoAsync(description, createdDate);
                        return {
                            content: [{ type: 'text', text: result }],
                        };
                    }
                    case 'read_todos': {
                        const id = args?.id;
                        const todos = await this.todosTool.readTodosAsync(id);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(todos, null, 2),
                                },
                            ],
                        };
                    }
                    case 'update_todo': {
                        const id = args?.id;
                        const description = args?.description;
                        const createdDateStr = args?.createdDate;
                        const createdDate = createdDateStr ? new Date(createdDateStr) : undefined;
                        const result = await this.todosTool.updateTodoAsync(id, description, createdDate);
                        return {
                            content: [{ type: 'text', text: result }],
                        };
                    }
                    case 'delete_todo': {
                        const id = args?.id;
                        const result = await this.todosTool.deleteTodoAsync(id);
                        return {
                            content: [{ type: 'text', text: result }],
                        };
                    }
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('TypeScript MCP Server running on stdio');
    }
    async shutdown() {
        this.db.close();
        await this.server.close();
    }
}
// Handle shutdown gracefully
const server = new MCPServerApp();
process.on('SIGINT', async () => {
    await server.shutdown();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await server.shutdown();
    process.exit(0);
});
// Start the server
server.run().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

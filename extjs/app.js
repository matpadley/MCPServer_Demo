// Todo Model
Ext.define('TodoApp.model.Todo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'description', type: 'string' },
        { name: 'createdDate', type: 'date', dateFormat: 'c' },
        { name: 'completed', type: 'boolean', defaultValue: false }
    ]
});

// Todo Store with MCP integration
Ext.define('TodoApp.store.Todos', {
    extend: 'Ext.data.Store',
    model: 'TodoApp.model.Todo',
    autoLoad: false,
    
    proxy: {
        type: 'ajax',
        api: {
            read: '/api/todos',
            create: '/api/todos',
            update: '/api/todos',
            destroy: '/api/todos'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});

// MCP Service for handling Model Context Protocol communication
Ext.define('TodoApp.service.MCPService', {
    singleton: true,
    
    config: {
        serverUrl: 'http://localhost:5226/api/mcp',
        connected: false
    },
    
    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },
    
    async callTool(toolName, parameters) {
        try {
            const response = await fetch(this.getServerUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'tools/call',
                    params: {
                        name: toolName,
                        arguments: parameters
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message || 'MCP tool call failed');
            }
            
            this.setConnected(true);
            return data.result;
            
        } catch (error) {
            console.error('MCP call failed:', error);
            this.setConnected(false);
            throw error;
        }
    },
    
    async listTools() {
        try {
            const response = await fetch(this.getServerUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'tools/list',
                    params: {}
                })
            });
            
            const data = await response.json();
            return data.result?.tools || [];
            
        } catch (error) {
            console.error('Failed to list MCP tools:', error);
            return [];
        }
    }
});

// Main Todo Application
Ext.define('TodoApp.Application', {
    extend: 'Ext.app.Application',
    
    name: 'TodoApp',
    
    launch: function() {
        // Create the main viewport
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [{
                region: 'north',
                xtype: 'toolbar',
                height: 60,
                items: [{
                    xtype: 'component',
                    html: '<h2>MCPServer ExtJS Client</h2>',
                    flex: 1
                }, {
                    xtype: 'component',
                    itemId: 'connectionStatus',
                    html: '<div class="mcp-status disconnected">Disconnected from MCP Server</div>'
                }]
            }, {
                region: 'center',
                xtype: 'panel',
                layout: 'border',
                items: [{
                    region: 'north',
                    xtype: 'form',
                    title: 'Add New Todo',
                    height: 120,
                    bodyPadding: 10,
                    items: [{
                        xtype: 'textfield',
                        name: 'description',
                        fieldLabel: 'Description',
                        allowBlank: false,
                        anchor: '100%'
                    }],
                    buttons: [{
                        text: 'Add Todo',
                        formBind: true,
                        handler: 'onAddTodo'
                    }]
                }, {
                    region: 'center',
                    xtype: 'grid',
                    title: 'Todo List',
                    itemId: 'todoGrid',
                    store: Ext.create('TodoApp.store.Todos'),
                    columns: [{
                        text: 'ID',
                        dataIndex: 'id',
                        width: 50
                    }, {
                        text: 'Description',
                        dataIndex: 'description',
                        flex: 1,
                        renderer: function(value, metaData, record) {
                            if (record.get('completed')) {
                                metaData.tdCls = 'todo-completed';
                            }
                            return value;
                        }
                    }, {
                        text: 'Created Date',
                        dataIndex: 'createdDate',
                        width: 160,
                        renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s')
                    }, {
                        text: 'Actions',
                        width: 150,
                        renderer: function(value, metaData, record) {
                            const completed = record.get('completed');
                            return `
                                <button onclick="TodoApp.toggleTodo(${record.get('id')})" class="x-btn x-btn-default-small">
                                    ${completed ? 'Undo' : 'Complete'}
                                </button>
                                <button onclick="TodoApp.deleteTodo(${record.get('id')})" class="x-btn x-btn-default-small" style="margin-left: 5px;">
                                    Delete
                                </button>
                            `;
                        }
                    }],
                    tbar: [{
                        text: 'Refresh',
                        handler: 'onRefreshTodos'
                    }, '->', {
                        text: 'Test Connection',
                        handler: 'onTestConnection'
                    }]
                }]
            }],
            
            controller: {
                // Add todo handler
                onAddTodo: async function(btn) {
                    const form = btn.up('form');
                    const values = form.getForm().getValues();
                    
                    if (!values.description) {
                        Ext.Msg.alert('Error', 'Please enter a description');
                        return;
                    }
                    
                    try {
                        const result = await TodoApp.service.MCPService.callTool('create_todo', {
                            description: values.description,
                            createdDate: new Date().toISOString()
                        });
                        
                        Ext.Msg.alert('Success', 'Todo created successfully');
                        form.getForm().reset();
                        this.onRefreshTodos();
                        
                    } catch (error) {
                        Ext.Msg.alert('Error', 'Failed to create todo: ' + error.message);
                    }
                },
                
                // Refresh todos handler
                onRefreshTodos: async function() {
                    try {
                        const result = await TodoApp.service.MCPService.callTool('read_todos', {});
                        const grid = Ext.ComponentQuery.query('#todoGrid')[0];
                        const store = grid.getStore();
                        
                        // Parse the result and load into store
                        let todos = [];
                        if (typeof result.content === 'string') {
                            // Try to parse JSON from the content
                            const content = result.content;
                            if (content.includes('[') && content.includes(']')) {
                                const jsonMatch = content.match(/\[[\s\S]*\]/);
                                if (jsonMatch) {
                                    todos = JSON.parse(jsonMatch[0]);
                                }
                            }
                        }
                        
                        store.loadData(todos);
                        this.updateConnectionStatus(true);
                        
                    } catch (error) {
                        console.error('Failed to refresh todos:', error);
                        this.updateConnectionStatus(false);
                        Ext.Msg.alert('Error', 'Failed to load todos: ' + error.message);
                    }
                },
                
                // Test connection handler
                onTestConnection: async function() {
                    try {
                        const tools = await TodoApp.service.MCPService.listTools();
                        this.updateConnectionStatus(true);
                        
                        const toolNames = tools.map(t => t.name).join(', ');
                        Ext.Msg.alert('Success', `Connected! Available tools: ${toolNames}`);
                        
                    } catch (error) {
                        this.updateConnectionStatus(false);
                        Ext.Msg.alert('Error', 'Connection failed: ' + error.message);
                    }
                },
                
                // Update connection status in UI
                updateConnectionStatus: function(connected) {
                    const status = Ext.ComponentQuery.query('#connectionStatus')[0];
                    if (status) {
                        const html = connected ? 
                            '<div class="mcp-status connected">Connected to MCP Server</div>' :
                            '<div class="mcp-status disconnected">Disconnected from MCP Server</div>';
                        status.setHtml(html);
                    }
                }
            }
        });
        
        // Initialize the app
        this.checkConnection();
    },
    
    async checkConnection() {
        try {
            await TodoApp.service.MCPService.listTools();
            const controller = Ext.ComponentQuery.query('viewport')[0].getController();
            controller.updateConnectionStatus(true);
            controller.onRefreshTodos();
        } catch (error) {
            console.log('Initial connection check failed - server may not be running');
        }
    }
});

// Global functions for button handlers
window.TodoApp = {
    toggleTodo: async function(id) {
        try {
            // For simplicity, we'll just mark as completed by updating description
            await TodoApp.service.MCPService.callTool('update_todo', {
                id: id,
                description: `[COMPLETED] Todo ${id}`
            });
            
            const controller = Ext.ComponentQuery.query('viewport')[0].getController();
            controller.onRefreshTodos();
            
        } catch (error) {
            Ext.Msg.alert('Error', 'Failed to update todo: ' + error.message);
        }
    },
    
    deleteTodo: async function(id) {
        Ext.Msg.confirm('Delete Todo', 'Are you sure you want to delete this todo?', async function(btn) {
            if (btn === 'yes') {
                try {
                    await TodoApp.service.MCPService.callTool('delete_todo', { id: id });
                    
                    const controller = Ext.ComponentQuery.query('viewport')[0].getController();
                    controller.onRefreshTodos();
                    
                } catch (error) {
                    Ext.Msg.alert('Error', 'Failed to delete todo: ' + error.message);
                }
            }
        });
    }
};

// Launch the application
Ext.application('TodoApp.Application');
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosMcpTool = void 0;
/**
 * MCP Tools for Todo management - TypeScript equivalent of TodosMcpTool.cs
 */
class TodosMcpTool {
    constructor(db) {
        this.db = db;
    }
    /**
     * Creates a new todo with a description and creation date.
     */
    async createTodoAsync(description, createdDate) {
        try {
            const todo = await this.db.createTodoAsync({
                description,
                createdDate
            });
            return `Todo created: ${todo.description} (Id: ${todo.id})`;
        }
        catch (error) {
            return `Error creating todo: ${error}`;
        }
    }
    /**
     * Reads all todos, or a single todo if an id is provided.
     */
    async readTodosAsync(id) {
        try {
            if (id && id.trim() !== '') {
                const todoId = parseInt(id, 10);
                if (isNaN(todoId)) {
                    return [];
                }
                return await this.db.readTodosAsync(todoId);
            }
            return await this.db.readTodosAsync();
        }
        catch (error) {
            console.error('Error reading todos:', error);
            return [];
        }
    }
    /**
     * Updates the specified todo fields by id.
     */
    async updateTodoAsync(id, description, createdDate) {
        try {
            const todoId = parseInt(id, 10);
            if (isNaN(todoId)) {
                return 'Invalid todo id.';
            }
            const updateInput = {};
            if (description !== undefined && description.trim() !== '') {
                updateInput.description = description;
            }
            if (createdDate !== undefined) {
                updateInput.createdDate = createdDate;
            }
            const updated = await this.db.updateTodoAsync(todoId, updateInput);
            if (!updated) {
                return `Todo with Id ${todoId} not found.`;
            }
            return `Todo ${todoId} updated.`;
        }
        catch (error) {
            return `Error updating todo: ${error}`;
        }
    }
    /**
     * Deletes a todo by id.
     */
    async deleteTodoAsync(id) {
        try {
            const todoId = parseInt(id, 10);
            if (isNaN(todoId)) {
                return 'Invalid todo id.';
            }
            const deleted = await this.db.deleteTodoAsync(todoId);
            if (!deleted) {
                return `Todo with Id ${todoId} not found.`;
            }
            return `Todo ${todoId} deleted.`;
        }
        catch (error) {
            return `Error deleting todo: ${error}`;
        }
    }
}
exports.TodosMcpTool = TodosMcpTool;

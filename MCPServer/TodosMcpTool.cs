using MCPServer.Data;
using System.ComponentModel;
using ModelContextProtocol.Server;
using Microsoft.EntityFrameworkCore;

namespace MCPServer
{
    [McpServerToolType]
    public class TodosMcpTool
    {
        private readonly DatabaseContext _db;

        public TodosMcpTool(DatabaseContext db)
        {
            _db = db;
        }

        [McpServerTool, Description("Creates a new todo with a description and creation date.")]
        public async Task<string> CreateTodoAsync(
            [Description("Description of the todo")] string description,
            [Description("Creation date of the todo")] DateTime createdDate)
        {
            var todo = new Todo
            {
                Description = description,
                CreatedDate = createdDate
            };
            _db.Todos.Add(todo);
            await _db.SaveChangesAsync();
            return $"Todo created: {todo.Description} (Id: {todo.Id})";
        }

        [McpServerTool, Description("Reads all todos, or a single todo if an id is provided.")]
        public async Task<List<Todo>> ReadTodosAsync(
            [Description("Id of the todo to read (optional)")] string? id = null)
        {
            if (!string.IsNullOrWhiteSpace(id) && int.TryParse(id, out int todoId))
            {
                var todo = await _db.Todos.FindAsync(todoId);
                if (todo == null) return new List<Todo>();
                return new List<Todo> { todo };
            }
            var todos = await _db.Todos.OrderBy(t => t.Id).ToListAsync();
            return todos;
        }

        [McpServerTool, Description("Updates the specified todo fields by id.")]
        public async Task<string> UpdateTodoAsync(
            [Description("Id of the todo to update")] string id,
            [Description("New description (optional)")] string? description = null,
            [Description("New creation date (optional)")] DateTime? createdDate = null)
        {
            if (!int.TryParse(id, out int todoId))
                return "Invalid todo id.";
            var todo = await _db.Todos.FindAsync(todoId);
            if (todo == null) return $"Todo with Id {todoId} not found.";
            if (!string.IsNullOrWhiteSpace(description)) todo.Description = description;
            if (createdDate.HasValue) todo.CreatedDate = createdDate.Value;
            await _db.SaveChangesAsync();
            return $"Todo {todo.Id} updated.";
        }

        [McpServerTool, Description("Deletes a todo by id.")]
        public async Task<string> DeleteTodoAsync(
            [Description("Id of the todo to delete")] string id)
        {
            if (!int.TryParse(id, out int todoId))
                return "Invalid todo id.";
            var todo = await _db.Todos.FindAsync(todoId);
            if (todo == null) return $"Todo with Id {todoId} not found.";
            _db.Todos.Remove(todo);
            await _db.SaveChangesAsync();
            return $"Todo {todo.Id} deleted.";
        }
    }
}

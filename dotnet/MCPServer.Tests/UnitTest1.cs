using Xunit;
using Microsoft.EntityFrameworkCore;
using MCPServer.Data;
using MCPServer;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MCPServer.Tests;

/// <summary>
/// Comprehensive tests for TodosMcpTool class
/// Tests all CRUD operations and error handling scenarios
/// </summary>
public class TodosMcpToolTests
{
    /// <summary>
    /// Creates an in-memory database context for testing
    /// </summary>
    private DatabaseContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        
        return new DatabaseContext(options);
    }

    [Fact]
    public async Task CreateTodoAsync_ShouldCreateTodoSuccessfully()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        var description = "Test todo";
        var createdDate = DateTime.Now;

        // Act
        var result = await tool.CreateTodoAsync(description, createdDate);

        // Assert
        Assert.Contains("Todo created:", result);
        Assert.Contains(description, result);
        
        var todo = context.Todos.First();
        Assert.Equal(description, todo.Description);
        Assert.Equal(createdDate, todo.CreatedDate);
    }

    [Fact]
    public async Task ReadTodosAsync_WithoutId_ShouldReturnAllTodos()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        
        // Add test data
        context.Todos.AddRange(
            new Todo { Description = "Todo 1", CreatedDate = DateTime.Now },
            new Todo { Description = "Todo 2", CreatedDate = DateTime.Now.AddDays(-1) }
        );
        await context.SaveChangesAsync();

        // Act
        var todos = await tool.ReadTodosAsync();

        // Assert
        Assert.Equal(2, todos.Count);
        Assert.Equal("Todo 1", todos[0].Description);
        Assert.Equal("Todo 2", todos[1].Description);
    }

    [Fact]
    public async Task ReadTodosAsync_WithValidId_ShouldReturnSpecificTodo()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        
        // Add test data
        var todo = new Todo { Description = "Test todo", CreatedDate = DateTime.Now };
        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        // Act
        var todos = await tool.ReadTodosAsync(todo.Id.ToString());

        // Assert
        Assert.Single(todos);
        Assert.Equal("Test todo", todos[0].Description);
        Assert.Equal(todo.Id, todos[0].Id);
    }

    [Fact]
    public async Task ReadTodosAsync_WithInvalidId_ShouldReturnEmptyList()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);

        // Act
        var todos = await tool.ReadTodosAsync("999");

        // Assert
        Assert.Empty(todos);
    }

    [Fact]
    public async Task ReadTodosAsync_WithNonNumericId_ShouldReturnAllTodos()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        
        context.Todos.Add(new Todo { Description = "Test todo", CreatedDate = DateTime.Now });
        await context.SaveChangesAsync();

        // Act
        var todos = await tool.ReadTodosAsync("invalid");

        // Assert
        Assert.Single(todos);
    }

    [Fact]
    public async Task UpdateTodoAsync_WithValidId_ShouldUpdateTodoSuccessfully()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        
        var todo = new Todo { Description = "Original description", CreatedDate = DateTime.Now };
        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        var newDescription = "Updated description";
        var newDate = DateTime.Now.AddDays(1);

        // Act
        var result = await tool.UpdateTodoAsync(todo.Id.ToString(), newDescription, newDate);

        // Assert
        Assert.Contains($"Todo {todo.Id} updated", result);
        
        var updatedTodo = await context.Todos.FindAsync(todo.Id);
        Assert.Equal(newDescription, updatedTodo!.Description);
        Assert.Equal(newDate, updatedTodo.CreatedDate);
    }

    [Fact]
    public async Task UpdateTodoAsync_WithOnlyDescription_ShouldUpdateDescriptionOnly()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        
        var originalDate = DateTime.Now;
        var todo = new Todo { Description = "Original description", CreatedDate = originalDate };
        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        var newDescription = "Updated description";

        // Act
        var result = await tool.UpdateTodoAsync(todo.Id.ToString(), newDescription);

        // Assert
        Assert.Contains($"Todo {todo.Id} updated", result);
        
        var updatedTodo = await context.Todos.FindAsync(todo.Id);
        Assert.Equal(newDescription, updatedTodo!.Description);
        Assert.Equal(originalDate, updatedTodo.CreatedDate); // Should remain unchanged
    }

    [Fact]
    public async Task UpdateTodoAsync_WithInvalidId_ShouldReturnErrorMessage()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);

        // Act
        var result = await tool.UpdateTodoAsync("invalid", "New description");

        // Assert
        Assert.Equal("Invalid todo id.", result);
    }

    [Fact]
    public async Task UpdateTodoAsync_WithNonExistentId_ShouldReturnNotFoundMessage()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);

        // Act
        var result = await tool.UpdateTodoAsync("999", "New description");

        // Assert
        Assert.Equal("Todo with Id 999 not found.", result);
    }

    [Fact]
    public async Task DeleteTodoAsync_WithValidId_ShouldDeleteTodoSuccessfully()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        
        var todo = new Todo { Description = "To be deleted", CreatedDate = DateTime.Now };
        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        // Act
        var result = await tool.DeleteTodoAsync(todo.Id.ToString());

        // Assert
        Assert.Contains($"Todo {todo.Id} deleted", result);
        
        var deletedTodo = await context.Todos.FindAsync(todo.Id);
        Assert.Null(deletedTodo);
    }

    [Fact]
    public async Task DeleteTodoAsync_WithInvalidId_ShouldReturnErrorMessage()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);

        // Act
        var result = await tool.DeleteTodoAsync("invalid");

        // Assert
        Assert.Equal("Invalid todo id.", result);
    }

    [Fact]
    public async Task DeleteTodoAsync_WithNonExistentId_ShouldReturnNotFoundMessage()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);

        // Act
        var result = await tool.DeleteTodoAsync("999");

        // Assert
        Assert.Equal("Todo with Id 999 not found.", result);
    }

    [Fact]
    public async Task UpdateTodoAsync_WithEmptyDescription_ShouldNotUpdateDescription()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);
        
        var originalDescription = "Original description";
        var todo = new Todo { Description = originalDescription, CreatedDate = DateTime.Now };
        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        // Act
        var result = await tool.UpdateTodoAsync(todo.Id.ToString(), "");

        // Assert
        Assert.Contains($"Todo {todo.Id} updated", result);
        
        var updatedTodo = await context.Todos.FindAsync(todo.Id);
        Assert.Equal(originalDescription, updatedTodo!.Description); // Should remain unchanged
    }

    [Fact]
    public async Task CreateTodoAsync_WithDifferentDates_ShouldCreateMultipleTodos()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var tool = new TodosMcpTool(context);

        // Act
        await tool.CreateTodoAsync("Todo 1", DateTime.Now);
        await tool.CreateTodoAsync("Todo 2", DateTime.Now.AddDays(-1));
        await tool.CreateTodoAsync("Todo 3", DateTime.Now.AddDays(1));

        // Assert
        var todos = await tool.ReadTodosAsync();
        Assert.Equal(3, todos.Count);
        Assert.All(todos, t => Assert.NotNull(t.Description));
        Assert.All(todos, t => Assert.True(t.Id > 0));
    }
}
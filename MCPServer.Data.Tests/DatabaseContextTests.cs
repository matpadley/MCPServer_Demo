using System;
using System.Threading.Tasks;
using MCPServer.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace MCPServer.Data.Tests
{
    public class DatabaseContextTests
    {
        [Fact]
        public async Task AddTodo_SavesAndReadsTodo()
        {
            var services = new ServiceCollection();
            services.AddInMemoryDatabase();
            var provider = services.BuildServiceProvider();
            var db = provider.GetRequiredService<DatabaseContext>();

            db.Todos.Add(new Todo { Description = "Test todo", CreatedDate = DateTime.UtcNow });
            await db.SaveChangesAsync();

            var todos = await db.Todos.ToListAsync();
            Assert.Single(todos);
            Assert.Equal("Test todo", todos[0].Description);
        }
    }
}

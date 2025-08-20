using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MCPServer.Data
{
    public static class DbSetup
    {
        public static void AddInMemoryDatabase(this IServiceCollection services, string dbName = "TestDb")
        {
            services.AddDbContext<DatabaseContext>(options =>
                options.UseInMemoryDatabase(dbName));
        }
    }
}

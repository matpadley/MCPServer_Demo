using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMcpServer()
    .WithHttpTransport() // With streamable HTTP
    .WithToolsFromAssembly(); // Add all classes marked with [McpServerToolType]

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<MCPServer.Data.DatabaseContext>(options =>
    options.UseInMemoryDatabase("MCPServerDb"));

var app = builder.Build();

app.UseCors(); // Ensure CORS middleware is applied before endpoint mapping
app.MapMcp("/api/mcp");

await app.RunAsync();
using System;
using System.ComponentModel.DataAnnotations;

namespace MCPServer.Data
{
    public class Todo
    {
        [Key]
        public int Id { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

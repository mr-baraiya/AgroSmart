using AgroSmartBeackend.Models;
using AgroSmartBeackend.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// Register essential ASP.NET Core services
// ------------------------------------------------------------
builder.Services.AddControllers();                      // Add controller support
builder.Services.AddEndpointsApiExplorer();             // Enable minimal API explorer
builder.Services.AddSwaggerGen();                       // Enable Swagger for API docs

// ------------------------------------------------------------
// Enable CORS for React frontend (localhost:5173)
// ------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy => policy.WithOrigins("http://localhost:5173")   // Frontend dev server
                        .AllowAnyHeader()                      // Allow all headers
                        .AllowAnyMethod());                    // Allow GET, POST, PUT, DELETE, etc.
});

// ------------------------------------------------------------
// Register FluentValidation services
// ------------------------------------------------------------
builder.Services.AddFluentValidationAutoValidation();   // Enable automatic model validation
builder.Services.AddValidatorsFromAssembly(typeof(UserValidator).Assembly); // Register all validators in the same assembly as UserValidator
//builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();

// ------------------------------------------------------------
// Register Entity Framework DbContext with SQL Server
// ------------------------------------------------------------
builder.Services.AddDbContext<AgroSmartContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("myConnectionString"))
);

// ------------------------------------------------------------
// Build the app
// ------------------------------------------------------------
var app = builder.Build();

// ------------------------------------------------------------
// Middleware pipeline configuration
// ------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();           // Enable Swagger in development
    app.UseSwaggerUI();         // Swagger UI endpoint
}

app.UseHttpsRedirection();      // Redirect HTTP to HTTPS
app.UseCors("AllowLocalhost");  // Enable CORS for React frontend
app.UseAuthorization();         // Use authorization middleware
app.MapControllers();           // Map attribute-routed controllers

app.Run();                      // Start the app


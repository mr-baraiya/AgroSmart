using AgroSmartBeackend.Models;
using AgroSmartBeackend.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// Register essential ASP.NET Core services
// ------------------------------------------------------------
builder.Services.AddControllers();                      // Add controller support
builder.Services.AddEndpointsApiExplorer();             // Enable minimal API explorer
builder.Services.AddSwaggerGen();                       // Enable Swagger for API docs

// ------------------------------------------------------------
// Enable CORS for both development and production frontends
// ------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendOrigins",
        policy => policy
            .WithOrigins(
                "http://localhost:5173",                          // React Vite dev server (local development)
                "https://myagrosmart.netlify.app",               // Previous Netlify deployment
                "https://ecoagrosmart.netlify.app"               // New Netlify domain (must include this!)
            )
            .AllowAnyHeader()                                    // Allow all request headers
            .AllowAnyMethod()                                    // Allow GET, POST, PUT, DELETE, etc.
            .AllowCredentials());                                // Optional: allow sending credentials (e.g., cookies)
});

// ------------------------------------------------------------
// Register Entity Framework DbContext with SQL Server
// ------------------------------------------------------------
builder.Services.AddDbContext<AgroSmartContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("myConnectionString"))
);

// ------------------------------------------------------------
// Register FluentValidation services
// ------------------------------------------------------------
builder.Services.AddFluentValidationAutoValidation();                 // Enable automatic model validation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();     // Register validators from this assembly

// ------------------------------------------------------------
// Build the app
// ------------------------------------------------------------
var app = builder.Build();

// ------------------------------------------------------------
// Middleware pipeline configuration
// ------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();       // Enable Swagger middleware for API testing (development only)
    app.UseSwaggerUI();     // Swagger UI endpoint
}

// ------------------------------------------------------------
// Required for Render deployment to bind to correct port
// ------------------------------------------------------------
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    app.Urls.Add($"http://0.0.0.0:{port}");
}

// ------------------------------------------------------------
// Support forwarded headers for Render/Docker reverse proxy
// ------------------------------------------------------------
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto
});

// ------------------------------------------------------------
// Enable HTTPS redirection in production
// ------------------------------------------------------------
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection(); // Force HTTPS only in production
}

// ------------------------------------------------------------
// Apply CORS policy for frontend clients (local + Netlify)
// Order matters: must come after UseRouting() and before UseAuthorization()
// ------------------------------------------------------------
app.UseRouting();                              // Enable endpoint routing
app.UseCors("AllowFrontendOrigins");           // Apply the correct CORS policy
app.UseAuthorization();                        // Apply authorization middleware

// ------------------------------------------------------------
// Map controller routes (API endpoints)
// ------------------------------------------------------------
app.MapControllers();                          // Route incoming HTTP requests to controllers

// ------------------------------------------------------------
// Start the application
// ------------------------------------------------------------
app.Run();                                      // Launch the app

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
                "http://localhost:5173",                      // React Vite dev server
                "https://ecoagrosmart.netlify.app/"             // Netlify production frontend
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());                             // Optional: allow cookies, tokens
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
builder.Services.AddFluentValidationAutoValidation(); // Enable automatic model validation
builder.Services.AddValidatorsFromAssemblyContaining<Program>(); // Register validators

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

// ------------------------------------------------------------
// Required for Render deployment to bind to correct port
// ------------------------------------------------------------
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    app.Urls.Add($"http://0.0.0.0:{port}");
}

// ------------------------------------------------------------
// Support forwarded headers from Render/Docker reverse proxy
// ------------------------------------------------------------
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto
});

// ------------------------------------------------------------
// Enable HTTPS redirection in production only
// ------------------------------------------------------------
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// ------------------------------------------------------------
// Enable CORS for frontend clients (localhost + Netlify)
// ------------------------------------------------------------
app.UseCors("AllowFrontendOrigins");

app.UseAuthorization();         // Use authorization middleware
app.MapControllers();           // Map attribute-routed controllers

app.Run();                      // Start the app

//using AgroSmartBeackend.Models;
//using AgroSmartBeackend.Validators;
//using FluentValidation;
//using FluentValidation.AspNetCore;
//using Microsoft.AspNetCore.HttpOverrides;
//using Microsoft.EntityFrameworkCore;

//var builder = WebApplication.CreateBuilder(args);

//// ------------------------------------------------------------
//// Register essential ASP.NET Core services
//// ------------------------------------------------------------
//builder.Services.AddControllers();                      // Add controller support
//builder.Services.AddEndpointsApiExplorer();             // Enable minimal API explorer
//builder.Services.AddSwaggerGen();                       // Enable Swagger for API docs

//// ------------------------------------------------------------
//// Enable CORS for React frontend (localhost:5173)
//// ------------------------------------------------------------
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowLocalhost",
//        policy => policy.WithOrigins("http://localhost:5173")   // Frontend dev server
//                        .AllowAnyHeader()                      // Allow all headers
//                        .AllowAnyMethod());                    // Allow GET, POST, PUT, DELETE, etc.
//});

//// ------------------------------------------------------------
//// Register Entity Framework DbContext with SQL Server
//// ------------------------------------------------------------
//builder.Services.AddDbContext<AgroSmartContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("myConnectionString"))
//);

//// ------------------------------------------------------------
//// Register FluentValidation services
//// ------------------------------------------------------------
//builder.Services.AddFluentValidationAutoValidation(); // Enable automatic model validation
////Use this when validators are in the same project as your main app
//builder.Services.AddValidatorsFromAssemblyContaining<Program>(); // Register validators from the assembly containing Program.cs

////Use this when validators are in another class library/project
////builder.Services.AddValidatorsFromAssembly(typeof(UserValidator).Assembly);
////builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>(); // Register validators from the assembly containing UserValidator

//// ------------------------------------------------------------
//// Build the app
//// ------------------------------------------------------------
//var app = builder.Build();

//// ------------------------------------------------------------
//// Middleware pipeline configuration
//// ------------------------------------------------------------
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();           // Enable Swagger in development
//    app.UseSwaggerUI();         // Swagger UI endpoint
//}

//// ------------------------------------------------------------
//// Required for Render deployment to bind to the correct port
//// ------------------------------------------------------------
//var port = Environment.GetEnvironmentVariable("PORT");
//if (!string.IsNullOrEmpty(port))
//{
//    app.Urls.Add($"http://0.0.0.0:{port}");
//}

////FORWARD HEADERS FOR RENDER/Docker PROXY SUPPORT
//app.UseForwardedHeaders(new ForwardedHeadersOptions
//{
//    ForwardedHeaders = ForwardedHeaders.XForwardedProto
//});

//// ENABLE HTTPS REDIRECTION ONLY IN PRODUCTION
//if (!app.Environment.IsDevelopment())
//{
//    app.UseHttpsRedirection();
//}

//app.UseCors("AllowLocalhost");  // Enable CORS for React frontend
//app.UseAuthorization();         // Use authorization middleware
//app.MapControllers();           // Map attribute-routed controllers

//app.Run();                      // Start the app
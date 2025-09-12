using AgroSmartBeackend.Models;
using AgroSmartBeackend.Services;
using AgroSmartBeackend.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// Load JWT settings from configuration (appsettings.json)
// ------------------------------------------------------------
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];

// ------------------------------------------------------------
// Add JWT Authentication
// ------------------------------------------------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

// ------------------------------------------------------------
// Register essential ASP.NET Core services
// ------------------------------------------------------------
builder.Services.AddControllers();                      // Add controller support
builder.Services.AddEndpointsApiExplorer();             // Enable minimal API explorer

// ------------------------------------------------------------
// Swagger configuration with JWT Authentication support
// ------------------------------------------------------------
builder.Services.AddSwaggerGen(options =>
{
    // Register the Swagger document (API metadata)
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "AgroSmart API",
        Version = "v1",
        Description = "AgroSmart Backend API with JWT Authentication support"
    });

    // Define the JWT Bearer scheme for Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",                         // Header name
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http, // Type: HTTP scheme
        Scheme = "Bearer",                              // Scheme keyword
        BearerFormat = "JWT",                           // Token format
        In = Microsoft.OpenApi.Models.ParameterLocation.Header, // Token passed in headers
        Description = "Enter 'Bearer {your JWT token}'" // Helper text in Swagger UI
    });

    // Apply JWT Bearer scheme as a global requirement
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {} // No specific scopes required
        }
    });
});
// ------------------------------------------------------------
// Enable CORS for both development and production frontends
// ------------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendOrigins",
        policy => policy
            .WithOrigins(
                "http://localhost:5173",
                "https://ecoagrosmart.netlify.app",
                "https://agrosmart.me",
                "https://www.agrosmart.me"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
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
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// ------------------------------------------------------------
// Register EmailService for dependency injection
// ------------------------------------------------------------
builder.Services.AddScoped<IEmailService, EmailService>();

// ------------------------------------------------------------
// Build the app
// ------------------------------------------------------------
var app = builder.Build();

// ------------------------------------------------------------
// Middleware pipeline configuration
// ------------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    app.Urls.Add($"http://0.0.0.0:{port}");
}

// ------------------------------------------------------------
// Required headers for Render/Docker deployment
// ------------------------------------------------------------
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto
});

// ------------------------------------------------------------
// Redirect to HTTPS in production
// ------------------------------------------------------------
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// ------------------------------------------------------------
// Middleware order is important!
// ------------------------------------------------------------
app.UseRouting();

// ------------------------------------------------------------
// Enable serving of static files (wwwroot or custom path)
// ------------------------------------------------------------

app.UseStaticFiles();

app.UseCors("AllowFrontendOrigins");

app.UseAuthentication(); // Add Authentication before Authorization
app.UseAuthorization();

app.MapControllers();
app.Run();
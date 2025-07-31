# Use official .NET 8 SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything and restore as distinct layers
COPY . ./
RUN dotnet restore "./AgroSmartBeackend.csproj"

# Build and publish the app
RUN dotnet publish "./AgroSmartBeackend.csproj" -c Release -o /app/out

# Use official .NET 8 ASP.NET runtime image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/out .

# Set the entrypoint
ENTRYPOINT ["dotnet", "AgroSmartBeackend.dll"]

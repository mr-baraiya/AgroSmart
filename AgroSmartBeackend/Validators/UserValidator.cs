using AgroSmartBeackend.Models;
using FluentValidation;

namespace AgroSmartBeackend.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(u => u.FullName)
                .NotNull().WithMessage("Full name is required.")
                .NotEmpty().WithMessage("Full name is required.")
                .Length(3, 100).WithMessage("Full name must be between 3 to 100 characters.")
                .NotEqual("Admin").WithMessage("Full name cannot be 'Admin'.");

            RuleFor(u => u.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(u => u.PasswordHash)
                .NotEmpty().WithMessage("Password is required.")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$")
                .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, and one digit.");

            RuleFor(u => u.Role)
                .NotEmpty().WithMessage("Role is required.")
                .Must(role => role == "User" || role == "Admin")
                .WithMessage("Role must be either 'User' or 'Admin'.");

            RuleFor(u => u.Phone)
                .Matches(@"^\d{10}$")
                .When(u => !string.IsNullOrEmpty(u.Phone))
                .WithMessage("Phone must be a 10-digit number.");

            RuleFor(u => u.Address)
                .MaximumLength(200)
                .When(u => !string.IsNullOrEmpty(u.Address))
                .WithMessage("Address must be under 200 characters.");

            RuleFor(u => u.CreatedAt)
                .NotEmpty().WithMessage("CreatedAt is required.");

            RuleFor(u => u.UpdatedAt)
                .NotEmpty().WithMessage("UpdatedAt is required.");

        }
    }
}

using AgroSmartBeackend.Models;
using FluentValidation;
using System.Text.RegularExpressions;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Email or Phone is required.")
            .Must(BeValidEmailOrPhone).WithMessage("Identifier must be a valid email or phone number.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Role is required.")
            .Must(role => role == "Admin" || role == "User")
            .WithMessage("Role must be either 'Admin' or 'User'.");
    }

    private bool BeValidEmailOrPhone(string identifier)
    {
        return IsValidEmail(identifier) || IsValidPhone(identifier);
    }

    private bool IsValidEmail(string email)
    {
        return Regex.IsMatch(email,
            @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
            RegexOptions.IgnoreCase);
    }

    private bool IsValidPhone(string phone)
    {
        return Regex.IsMatch(phone,
            @"^[6-9]\d{9}$"); // basic 10-digit Indian mobile number pattern
    }
}

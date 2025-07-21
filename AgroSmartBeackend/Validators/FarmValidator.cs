using FluentValidation;
using AgroSmartBeackend.Models;

public class FarmValidator : AbstractValidator<Farm>
{
    public FarmValidator()
    {
        RuleFor(x => x.FarmName)
            .NotEmpty().WithMessage("Farm name is required.")
            .MaximumLength(150).WithMessage("Farm name cannot exceed 150 characters.");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required.")
            .MaximumLength(250).WithMessage("Location cannot exceed 250 characters.");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90.")
            .When(x => x.Latitude.HasValue);

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180.")
            .When(x => x.Longitude.HasValue);

        RuleFor(x => x.TotalAcres)
            .GreaterThan(0).WithMessage("Total acres must be a positive number.")
            .When(x => x.TotalAcres.HasValue);

        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("User ID must be a valid positive integer.");

        RuleFor(x => x.CreatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("CreatedAt cannot be a future date.");

        RuleFor(x => x.UpdatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("UpdatedAt cannot be a future date.");
    }
}

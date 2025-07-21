using FluentValidation;
using AgroSmartBeackend.Models;

public class FieldValidator : AbstractValidator<Field>
{
    public FieldValidator()
    {
        RuleFor(x => x.FieldName)
            .NotEmpty().WithMessage("Field name is required.")
            .MaximumLength(150).WithMessage("Field name cannot exceed 150 characters.");

        RuleFor(x => x.SizeAcres)
            .GreaterThan(0).WithMessage("Size (in acres) must be a positive value.");

        RuleFor(x => x.SoilType)
            .MaximumLength(100).WithMessage("Soil type cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.SoilType));

        RuleFor(x => x.IrrigationType)
            .MaximumLength(100).WithMessage("Irrigation type cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.IrrigationType));

        RuleFor(x => x.FarmId)
            .GreaterThan(0).WithMessage("Farm ID must be a valid positive integer.");

        RuleFor(x => x.CreatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("CreatedAt cannot be in the future.");

        RuleFor(x => x.UpdatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("UpdatedAt cannot be in the future.");
    }
}

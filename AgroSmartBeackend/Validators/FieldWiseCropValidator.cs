using FluentValidation;
using AgroSmartBeackend.Models;

public class FieldWiseCropValidator : AbstractValidator<FieldWiseCrop>
{
    public FieldWiseCropValidator()
    {
        RuleFor(x => x.FieldId)
            .GreaterThan(0).WithMessage("Field ID must be a valid positive integer.");

        RuleFor(x => x.CropId)
            .GreaterThan(0).WithMessage("Crop ID must be a valid positive integer.");

        RuleFor(x => x.PlantedDate)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today)).WithMessage("Planted date cannot be in the future.");

        RuleFor(x => x.ExpectedHarvestDate.Value)
            .GreaterThan(x => x.PlantedDate).WithMessage("Expected harvest date must be after the planted date.")
            .When(x => x.ExpectedHarvestDate.HasValue);

        RuleFor(x => x.ActualHarvestDate.Value)
            .GreaterThanOrEqualTo(x => x.PlantedDate).WithMessage("Actual harvest date must be after the planted date.")
            .When(x => x.ActualHarvestDate.HasValue);

        RuleFor(x => x.CurrentGrowthStage)
            .MaximumLength(100).WithMessage("Growth stage cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.CurrentGrowthStage));

        RuleFor(x => x.PlantedArea)
            .GreaterThan(0).WithMessage("Planted area must be a positive value.")
            .When(x => x.PlantedArea.HasValue);

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .MaximumLength(50).WithMessage("Status cannot exceed 50 characters.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));

        RuleFor(x => x.CreatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("CreatedAt cannot be in the future.");

        RuleFor(x => x.UpdatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("UpdatedAt cannot be in the future.");
    }
}

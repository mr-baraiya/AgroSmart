using FluentValidation;
using AgroSmartBeackend.Models;

public class SensorReadingValidator : AbstractValidator<SensorReading>
{
    public SensorReadingValidator()
    {
        RuleFor(x => x.SensorId)
            .GreaterThan(0).WithMessage("Sensor ID must be a valid positive integer.");

        RuleFor(x => x.Value)
            .GreaterThanOrEqualTo(0).WithMessage("Sensor reading value must be non-negative.");

        RuleFor(x => x.Unit)
            .MaximumLength(20).WithMessage("Unit cannot exceed 20 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Unit));

        RuleFor(x => x.QualityScore)
            .InclusiveBetween(0, 100).WithMessage("Quality score must be between 0 and 100.")
            .When(x => x.QualityScore.HasValue);

        RuleFor(x => x.ReadingTime)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Reading time cannot be in the future.");
    }
}

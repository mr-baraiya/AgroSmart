using FluentValidation;
using AgroSmartBeackend.Models;

public class SensorValidator : AbstractValidator<Sensor>
{
    public SensorValidator()
    {
        RuleFor(x => x.SensorType)
            .NotEmpty().WithMessage("Sensor type is required.")
            .MaximumLength(100).WithMessage("Sensor type cannot exceed 100 characters.");

        RuleFor(x => x.Manufacturer)
            .MaximumLength(100).WithMessage("Manufacturer name cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Manufacturer));

        RuleFor(x => x.Model)
            .MaximumLength(100).WithMessage("Model cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Model));

        RuleFor(x => x.SerialNumber)
            .MaximumLength(100).WithMessage("Serial number cannot exceed 100 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.SerialNumber));

        RuleFor(x => x.FieldId)
            .GreaterThan(0).WithMessage("Field ID must be a valid positive integer.");

        RuleFor(x => x.InstallationDate)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Installation date cannot be in the future.")
            .When(x => x.InstallationDate.HasValue);

        RuleFor(x => x.LastCalibrated)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Last calibration date cannot be in the future.")
            .When(x => x.LastCalibrated.HasValue);

        RuleFor(x => x.CalibrationInterval)
            .GreaterThan(0).WithMessage("Calibration interval must be a positive number.")
            .When(x => x.CalibrationInterval.HasValue);

        RuleFor(x => x.LatestValue)
            .GreaterThanOrEqualTo(0).WithMessage("Latest sensor value must be non-negative.")
            .When(x => x.LatestValue.HasValue);

        RuleFor(x => x.LatestUnit)
            .MaximumLength(20).WithMessage("Latest unit cannot exceed 20 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.LatestUnit));

        RuleFor(x => x.LatestQualityScore)
            .InclusiveBetween(0, 100).WithMessage("Latest quality score must be between 0 and 100.")
            .When(x => x.LatestQualityScore.HasValue);

        RuleFor(x => x.LastReadingTime)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Last reading time cannot be in the future.")
            .When(x => x.LastReadingTime.HasValue);

        RuleFor(x => x.CreatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("CreatedAt cannot be a future date.");
    }
}

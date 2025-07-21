using FluentValidation;
using AgroSmartBeackend.Models;

public class ScheduleValidator : AbstractValidator<Schedule>
{
    public ScheduleValidator()
    {
        RuleFor(x => x.FieldId)
            .GreaterThan(0).WithMessage("Field ID must be a valid positive integer.");

        RuleFor(x => x.ScheduleType)
            .NotEmpty().WithMessage("Schedule type is required.")
            .MaximumLength(100).WithMessage("Schedule type cannot exceed 100 characters.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.ScheduledDate)
            .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Scheduled date must be today or in the future.");

        RuleFor(x => x.Duration)
            .GreaterThan(0).WithMessage("Duration must be a positive number.")
            .When(x => x.Duration.HasValue);

        RuleFor(x => x.EstimatedCost)
            .GreaterThanOrEqualTo(0).WithMessage("Estimated cost cannot be negative.")
            .When(x => x.EstimatedCost.HasValue);

        RuleFor(x => x.Priority)
            .NotEmpty().WithMessage("Priority is required.")
            .Must(p => new[] { "Low", "Medium", "High", "Critical" }.Contains(p))
            .WithMessage("Priority must be one of: Low, Medium, High, Critical.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .MaximumLength(50).WithMessage("Status cannot exceed 50 characters.");

        RuleFor(x => x.CreatedBy)
            .GreaterThan(0).WithMessage("CreatedBy must be a valid user ID.");

        RuleFor(x => x.CreatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("CreatedAt cannot be a future date.");

        RuleFor(x => x.UpdatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("UpdatedAt cannot be a future date.");
    }
}

using FluentValidation;
using AgroSmartBeackend.Models;

public class SmartInsightValidator : AbstractValidator<SmartInsight>
{
    public SmartInsightValidator()
    {
        RuleFor(x => x.InsightType)
            .NotEmpty().WithMessage("Insight type is required.")
            .MaximumLength(100).WithMessage("Insight type cannot exceed 100 characters.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required.")
            .MaximumLength(1000).WithMessage("Message cannot exceed 1000 characters.");

        RuleFor(x => x.Priority)
            .MaximumLength(50).WithMessage("Priority cannot exceed 50 characters.")
            .Must(p => string.IsNullOrEmpty(p) || new[] { "Low", "Medium", "High", "Critical" }.Contains(p))
            .WithMessage("Priority must be one of: Low, Medium, High, Critical.");

        RuleFor(x => x.Status)
            .MaximumLength(50).WithMessage("Status cannot exceed 50 characters.");

        RuleFor(x => x.SourceType)
            .MaximumLength(100).WithMessage("Source type cannot exceed 100 characters.");

        RuleFor(x => x.SourceId)
            .GreaterThan(0).When(x => x.SourceId.HasValue)
            .WithMessage("SourceId must be a positive number.");

        RuleFor(x => x.TargetUserId)
            .GreaterThan(0).WithMessage("Target user ID must be a valid positive integer.");

        RuleFor(x => x.ValidUntil)
            .GreaterThan(DateTime.UtcNow).When(x => x.ValidUntil.HasValue)
            .WithMessage("ValidUntil must be in the future.");

        RuleFor(x => x.CreatedAt)
            .LessThanOrEqualTo(DateTime.UtcNow).When(x => x.CreatedAt.HasValue)
            .WithMessage("CreatedAt cannot be a future date.");
    }
}

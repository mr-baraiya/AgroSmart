using AgroSmartBeackend.Models;
using FluentValidation;

namespace AgroSmartBeackend.Validators
{
    public class WeatherDatumValidator : AbstractValidator<WeatherDatum>
    {
        public WeatherDatumValidator()
        {
            RuleFor(w => w.Location)
                .NotEmpty().WithMessage("Location is required.")
                .MaximumLength(100).WithMessage("Location must not exceed 100 characters.");

            RuleFor(w => w.Latitude)
                .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90.");

            RuleFor(w => w.Longitude)
                .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180.");

            RuleFor(w => w.Temperature)
                .GreaterThanOrEqualTo(-100).When(w => w.Temperature.HasValue)
                .WithMessage("Temperature must be greater than or equal to -100°C.")
                .LessThanOrEqualTo(100).When(w => w.Temperature.HasValue)
                .WithMessage("Temperature must be less than or equal to 100°C.");

            RuleFor(w => w.Humidity)
                .InclusiveBetween(0, 100).When(w => w.Humidity.HasValue)
                .WithMessage("Humidity must be between 0 and 100 percent.");

            RuleFor(w => w.Pressure)
                .GreaterThan(0).When(w => w.Pressure.HasValue)
                .WithMessage("Pressure must be a positive value.");

            RuleFor(w => w.WindSpeed)
                .GreaterThanOrEqualTo(0).When(w => w.WindSpeed.HasValue)
                .WithMessage("Wind speed must be non-negative.");

            RuleFor(w => w.WeatherDescription)
                .MaximumLength(255).When(w => !string.IsNullOrEmpty(w.WeatherDescription))
                .WithMessage("Weather description must not exceed 255 characters.");

            RuleFor(w => w.ForecastDate)
                .NotEmpty().WithMessage("Forecast date is required.")
                .LessThanOrEqualTo(DateTime.UtcNow.AddDays(10))
                .WithMessage("Forecast date cannot be more than 10 days ahead.");

            RuleFor(w => w.DataType)
                .NotEmpty().WithMessage("Data type is required.")
                .Must(type => type == "Forecast" || type == "Current")
                .WithMessage("Data type must be either 'Forecast' or 'Current'.");

            RuleFor(w => w.RetrievedAt)
                .NotEmpty().WithMessage("RetrievedAt timestamp is required.")
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("RetrievedAt cannot be in the future.");
        }
    }
}

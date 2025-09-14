# AGMARKNET API Setup Instructions

## Getting Your API Key

1. **Visit the official website**: Go to [https://data.gov.in/](https://data.gov.in/)

2. **Register an account**:
   - Click on "Register" in the top right corner
   - Fill out the registration form with your details
   - Verify your email address

3. **Request API access**:
   - Navigate to the "API" section
   - Look for "AGMARKNET" or "Agricultural Marketing" datasets
   - Request access to the dataset: `9ef84268-d588-465a-a308-a864a43d0070`

4. **Get your API key**:
   - Once approved, you'll receive an API key
   - Copy this key to your `.env` file

## Configuration

Update your `.env` file:
```
REACT_APP_AGMARKNET_API_KEY=your_actual_api_key_here
```

## API Endpoint Details

- **Base URL**: `https://api.data.gov.in/resource/`
- **Dataset ID**: `9ef84268-d588-465a-a308-a864a43d0070`
- **Format**: JSON
- **Parameters**:
  - `api-key`: Your API key
  - `format`: json
  - `limit`: Number of records (max 50 recommended)

## Sample API Response

```json
{
  "records": [
    {
      "commodity": "Rice",
      "state": "Punjab",
      "district": "Amritsar",
      "market": "Amritsar",
      "min_price": "2000",
      "max_price": "2200",
      "modal_price": "2100",
      "arrival_date": "2025-09-14"
    }
  ]
}
```

## Troubleshooting

- **403 Forbidden**: Check if your API key is valid and properly configured
- **Rate Limiting**: The API may have rate limits, consider caching responses
- **CORS Issues**: If testing locally, you might need to configure CORS or use a proxy

## Features Implemented

✅ Real-time mandi price fetching
✅ Responsive table design with Tailwind CSS
✅ Search and filter functionality
✅ Loading, error, and empty states
✅ Price formatting with Indian currency
✅ Date formatting
✅ Mobile-responsive design
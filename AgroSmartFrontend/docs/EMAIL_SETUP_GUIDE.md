# EmailJS Setup Guide for AgroSmart Contact Form

## Overview
The contact form is now configured to automatically send emails using EmailJS service. Follow these steps to complete the setup.

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the authentication process
5. Note down your **Service ID** (e.g., `service_xyz123`)

## Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. **Template Name**: AgroSmart Contact Form
4. **Template Content**: Use this exact structure:

**Subject Line:**
```
New Contact from AgroSmart - {{subject}}
```

**Email Body (HTML):**
```html
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Subject:</strong> {{subject}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>
<p><em>This message was sent through the AgroSmart contact form.</em></p>
<p><em>Reply directly to this email to respond to the sender.</em></p>
```

5. **Settings Tab:**
   - Set "To Email" to: `vvbaraiya32@gmail.com`
   - Set "Reply To" to: `{{from_email}}`
   - Set "From Name" to: `AgroSmart Contact Form`

6. **Save the template** and copy the **Template ID** (it will look like `template_xxxxxxx`)
7. **Test the template** using the test button

## Step 4: Get Your Public Key
1. Go to "Account" → "General"
2. Find your **Public Key** (User ID) (e.g., `user_def456`)

## Step 5: Update Configuration
1. Open your `.env` file in the project root
2. Add your EmailJS credentials as environment variables:

```env
# EmailJS Configuration
VITE_EMAILJS_USER_ID=user_def456        # Your Public Key
VITE_EMAILJS_SERVICE_ID=service_xyz123   # Your Service ID  
VITE_EMAILJS_TEMPLATE_ID=template_abc789 # Your Template ID
```

3. The `src/config/emailConfig.js` file will automatically read these values:

```javascript
export const EMAIL_CONFIG = {
  USER_ID: import.meta.env.VITE_EMAILJS_USER_ID,
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID
};
```

## Step 6: Test the Form
1. Start your development server: `npm run dev`
2. Navigate to the Contact Us page
3. Fill out and submit the form
4. Check your email (vvbaraiya32@gmail.com) for the message

## Template Variables Used
The following variables are automatically populated:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email  
- `{{phone}}` - Sender's phone number (optional)
- `{{subject}}` - Email subject
- `{{message}}` - Email message
- `{{to_email}}` - Your email (vvbaraiya32@gmail.com)

## Important Notes
- EmailJS free plan allows 200 emails/month
- Emails will be sent from your connected email service
- The sender's email is included for easy replies
- Form validation ensures all fields are filled
- Loading states and success/error messages are handled

## Troubleshooting
If emails aren't sending:

### "Template ID not found" Error
1. **Check Template ID**: Go to https://dashboard.emailjs.com/admin/templates
2. **Verify Template Exists**: Make sure you have created a template
3. **Copy Correct ID**: The Template ID looks like `template_xxxxxxx`
4. **Update .env file**: Replace `YOUR_TEMPLATE_ID_HERE` with your actual template ID
5. **Restart Dev Server**: Run `npm run dev` again after updating .env

### Other Common Issues
1. Check browser console for errors
2. Verify all credentials in .env file
3. Ensure email service is properly connected
4. Check EmailJS dashboard for usage limits
5. Make sure template variables match exactly

### Testing Steps
1. Open browser console (F12)
2. Submit contact form
3. Check console for detailed error messages
4. Verify EmailJS dashboard for email logs

## Security Note
The current setup uses environment variables for better security:
- Environment variables keep credentials out of your source code
- EmailJS User ID (Public Key) is safe to expose in frontend
- `.env` file should be in your `.gitignore` to prevent credential exposure
- EmailJS has built-in spam protection and rate limiting
- For production, ensure `.env` variables are properly configured on your hosting platform

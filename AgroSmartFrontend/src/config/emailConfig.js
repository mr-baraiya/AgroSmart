// EmailJS Configuration
// To use this service:
// 1. Sign up at https://www.emailjs.com/
// 2. Create a service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Get your User ID, Service ID, and Template ID
// 5. Replace the values below with your actual credentials

export const EMAIL_CONFIG = {
  // Get from environment variables for security
  USER_ID: import.meta.env.VITE_EMAILJS_USER_ID,
  
  // Replace with your EmailJS Service ID
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  
  // Replace with your EmailJS Template ID
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID
};

// Instructions for setup:
// 1. Go to https://www.emailjs.com/ and create an account
// 2. Add an email service (Gmail recommended)
// 3. Create an email template with these template variables:
//    - {{from_name}} - sender's name
//    - {{from_email}} - sender's email
//    - {{phone}} - sender's phone (optional)
//    - {{subject}} - email subject
//    - {{message}} - email message
//    - {{to_email}} - your email (vvbaraiya32@gmail.com)
// 4. Get your Public Key from Account settings
// 5. Add these environment variables to your .env file:
//    - VITE_EMAILJS_USER_ID=your_public_key
//    - VITE_EMAILJS_SERVICE_ID=your_service_id
//    - VITE_EMAILJS_TEMPLATE_ID=your_template_id

// EmailJS Configuration Verification Script
// Run this in browser console to test your EmailJS setup

// Check if environment variables are loaded
console.log('=== EmailJS Configuration Check ===');
console.log('USER_ID:', import.meta.env.VITE_EMAILJS_USER_ID);
console.log('SERVICE_ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
console.log('TEMPLATE_ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID);

// Check if all values are set
const missingVars = [];
if (!import.meta.env.VITE_EMAILJS_USER_ID || import.meta.env.VITE_EMAILJS_USER_ID === 'YOUR_TEMPLATE_ID_HERE') {
  missingVars.push('VITE_EMAILJS_USER_ID');
}
if (!import.meta.env.VITE_EMAILJS_SERVICE_ID) {
  missingVars.push('VITE_EMAILJS_SERVICE_ID');
}
if (!import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID_HERE') {
  missingVars.push('VITE_EMAILJS_TEMPLATE_ID');
}

if (missingVars.length > 0) {
  console.error('❌ Missing or invalid environment variables:', missingVars);
  console.log('📝 Please update your .env file with correct values');
} else {
  console.log('✅ All environment variables are set');
}

// Quick test function
window.testEmailJS = async function() {
  try {
    const emailjs = (await import('@emailjs/browser')).default;
    const { EMAIL_CONFIG } = await import('./src/config/emailConfig.js');
    
    const testParams = {
      from_name: 'Test User',
      from_email: 'test@example.com',
      phone: '1234567890',
      subject: 'Test Email',
      message: 'This is a test message from EmailJS verification',
      to_email: 'vvbaraiya32@gmail.com'
    };
    
    console.log('🧪 Sending test email...');
    const result = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      testParams,
      EMAIL_CONFIG.USER_ID
    );
    
    console.log('✅ Test email sent successfully!', result);
    return result;
  } catch (error) {
    console.error('❌ Test email failed:', error);
    throw error;
  }
};

console.log('💡 Run testEmailJS() in console to send a test email');

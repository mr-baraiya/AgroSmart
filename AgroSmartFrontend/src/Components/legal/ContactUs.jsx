import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../../config/emailConfig';
import Header from '../common/Header';

export default function ContactUs() {
  const location = useLocation();
  const isInactiveAccountRequest = location.state?.reason === 'account_inactive';
  const userEmail = location.state?.userEmail || '';
  const userName = location.state?.userName || '';
  
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: '',
    subject: isInactiveAccountRequest ? 'Account Activation Request' : '',
    message: isInactiveAccountRequest 
      ? `Hello Admin,\n\nI am unable to access my account as it appears to be inactive. Please activate my account so I can continue using AgroSmart.\n\nAccount Details:\nEmail: ${userEmail}\nName: ${userName}\n\nThank you for your assistance.`
      : ''
  });

  // Update form data when location state changes
  useEffect(() => {
    if (isInactiveAccountRequest) {
      setFormData(prev => ({
        ...prev,
        name: userName,
        email: userEmail,
        subject: 'Account Activation Request',
        message: `Hello Admin,\n\nI am unable to access my account as it appears to be inactive. Please activate my account so I can continue using AgroSmart.\n\nAccount Details:\nEmail: ${userEmail}\nName: ${userName}\n\nThank you for your assistance.`
      }));
    }
  }, [isInactiveAccountRequest, userEmail, userName]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all fields.',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: 'Sending Message...',
      text: 'Please wait while we send your message.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Check if EmailJS is configured
      if (EMAIL_CONFIG.USER_ID === 'YOUR_EMAILJS_USER_ID' || 
          EMAIL_CONFIG.SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' || 
          EMAIL_CONFIG.TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID') {
        
        // EmailJS not configured - show instructions
        Swal.fire({
          icon: 'info',
          title: 'Email Service Setup Required',
          html: `
            <div class="text-left">
              <p class="mb-4">To enable automatic email sending, please complete the EmailJS setup:</p>
              <ol class="list-decimal list-inside space-y-2 text-sm">
                <li>Visit <a href="https://www.emailjs.com/" target="_blank" class="text-blue-600 underline">emailjs.com</a> and create an account</li>
                <li>Add an email service (Gmail recommended)</li>
                <li>Create an email template with variables: from_name, from_email, subject, message</li>
                <li>Update the config file with your credentials</li>
              </ol>
              <p class="mt-4 text-sm text-gray-600">Your message details have been logged to console for now.</p>
            </div>
          `,
          confirmButtonColor: '#16a34a',
          confirmButtonText: 'Got it'
        });

        // Log the form data for development
        console.log('Contact Form Submission:', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          subject: formData.subject,
          message: formData.message,
          timestamp: new Date().toISOString()
        });
        
      } else {
        // EmailJS is configured - send email
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || 'Not provided',
          subject: formData.subject,
          message: formData.message,
          to_email: 'vvbaraiya32@gmail.com', // Your email
          reply_to: formData.email
        };

        await emailjs.send(
          EMAIL_CONFIG.SERVICE_ID,
          EMAIL_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAIL_CONFIG.USER_ID
        );

        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully!',
          text: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
          confirmButtonColor: '#16a34a'
        });
      }
      
      // Reset form (but keep inactive account data if applicable)
      if (isInactiveAccountRequest) {
        setFormData({
          name: userName,
          email: userEmail,
          phone: '',
          subject: 'Account Activation Request',
          message: `Hello Admin,\n\nI am unable to access my account as it appears to be inactive. Please activate my account so I can continue using AgroSmart.\n\nAccount Details:\nEmail: ${userEmail}\nName: ${userName}\n\nThank you for your assistance.`
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
      
    } catch (error) {
      console.error('Email sending error:', error);
      
      let errorMessage = 'There was an error sending your message. Please try again or contact us directly.';
      
      // Check for specific EmailJS errors
      if (error.text && error.text.includes('template ID not found')) {
        errorMessage = 'Email configuration error: Template not found. Please contact the administrator.';
      } else if (error.text && error.text.includes('service ID not found')) {
        errorMessage = 'Email configuration error: Service not found. Please contact the administrator.';
      } else if (error.text && error.text.includes('user ID not found')) {
        errorMessage = 'Email configuration error: User ID not found. Please contact the administrator.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send Message',
        text: errorMessage,
        footer: 'You can also email us directly at: vvbaraiya32@gmail.com',
        confirmButtonColor: '#16a34a'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <Header />
      
      {/* Add top padding to account for fixed header */}
      <div className="pt-20"></div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-12 h-12 text-white mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions about AgroSmart? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Inactive Account Alert */}
        {isInactiveAccountRequest && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Account Activation Required</h3>
                <p className="text-red-700 mb-4">
                  Your account is currently inactive and you cannot access the system. 
                  Please fill out the form below to request account activation from our administrators.
                </p>
                <div className="bg-red-100 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    <strong>What happens next?</strong><br />
                    • Our admin team will review your request<br />
                    • We'll activate your account within 24 hours<br />
                    • You'll receive an email confirmation when your account is active
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-8 h-8 text-green-600 mr-3" />
              Get in Touch
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Connect with our team for support, partnerships, or any questions about AgroSmart.
            </p>

            <div className="space-y-8">
              <div className="group hover:bg-green-50 rounded-xl p-4 transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-3 group-hover:bg-green-200 transition-colors">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Email</h3>
                    <div className="space-y-1 mt-2">
                      <p className="text-green-600 font-medium hover:text-green-700 cursor-pointer">
                        vvbaraiya32@gmail.com
                      </p>
                      <p className="text-green-600 font-medium hover:text-green-700 cursor-pointer">
                        support@agrosmart.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group hover:bg-blue-50 rounded-xl p-4 transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 group-hover:bg-blue-200 transition-colors">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Phone</h3>
                    <div className="space-y-1 mt-2">
                      <p className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                        +91 73833 59679
                      </p>
                      <p className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                        +91 12345 67890
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group hover:bg-purple-50 rounded-xl p-4 transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-3 group-hover:bg-purple-200 transition-colors">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Address</h3>
                    <div className="text-purple-600 font-medium mt-2">
                      <p>123 Farm Tech Lane</p>
                      <p>Agricultural Valley, Kaniyad</p>
                      <p>Botad, Gujarat, India 364710</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group hover:bg-orange-50 rounded-xl p-4 transition-all duration-300">
                <div className="flex items-start">
                  <div className="bg-orange-100 rounded-full p-3 group-hover:bg-orange-200 transition-colors">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Business Hours (IST)</h3>
                    <div className="text-orange-600 font-medium mt-2 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 5:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Send className="w-7 h-7 text-green-600 mr-3" />
              {isInactiveAccountRequest ? 'Request Account Activation' : 'Send us a Message'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5 mr-2" />
                {isInactiveAccountRequest ? 'Request Account Activation' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

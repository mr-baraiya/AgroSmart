import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../../config/emailConfig';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 text-lg mb-8">
              Have questions about AgroSmart? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">vvbaraiya32@gmail.com</p>
                  <p className="text-gray-600">support@agrosmart.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 73833 59679</p>
                  <p className="text-gray-600">+91 12345 67890</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    123 Farm Tech Lane<br />
                    Agricultural Valley, Kaniyad<br />
                    Botad, Gujarat, India 364710
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-green-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Business Hours (IST)</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 5:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

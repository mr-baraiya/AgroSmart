import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h2>
            <p className="text-gray-600">Last updated: August 24, 2025</p>
            <p className="text-gray-600 mt-2">Effective Date: August 24, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Acceptance of Terms</h3>
              </div>
              <p className="text-gray-700 mb-4">
                By accessing and using AgroSmart's precision farming platform, you accept and agree to be bound 
                by the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Scale className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Use License</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use AgroSmart's platform for personal or commercial 
                agricultural purposes. This is the grant of a license, not a transfer of title, and under this license you may:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the platform for legitimate farming and agricultural operations</li>
                <li>Access and analyze your farm data and insights</li>
                <li>Connect IoT devices and sensors to the platform</li>
                <li>Share data with authorized personnel and consultants</li>
              </ul>
              <p className="text-gray-700 mt-4">
                This license shall automatically terminate if you violate any of these restrictions and may be 
                terminated by AgroSmart at any time.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Disclaimer</h3>
              </div>
              <p className="text-gray-700 mb-4">
                The information on AgroSmart's platform is provided on an 'as is' basis. To the fullest extent 
                permitted by law, this Company:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Excludes all representations and warranties relating to this platform and its contents</li>
                <li>Excludes all liability for damages arising out of or in connection with your use of this platform</li>
                <li>Does not guarantee the accuracy of weather predictions or agricultural insights</li>
                <li>Recommends consulting with agricultural professionals for critical farming decisions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Responsibilities</h3>
              <p className="text-gray-700 mb-4">As a user of AgroSmart, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information when creating your account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the platform in compliance with all applicable laws and regulations</li>
                <li>Not interfere with or disrupt the integrity or performance of the platform</li>
                <li>Not attempt to gain unauthorized access to other users' data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Ownership and Usage</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of all data you input into the AgroSmart platform. However, by using our services, you grant us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>The right to process your data to provide our services</li>
                <li>Permission to use aggregated, anonymized data for research and improvement</li>
                <li>The ability to backup and store your data for service continuity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Availability</h3>
              <p className="text-gray-700 mb-4">
                While we strive to maintain high availability, AgroSmart does not guarantee uninterrupted service. 
                We may temporarily suspend access for maintenance, updates, or unforeseen circumstances.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Modifications</h3>
              <p className="text-gray-700 mb-4">
                AgroSmart may revise these terms of service at any time without notice. By using this platform, 
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:vvbaraiya32@gmail.com" className="text-green-600 hover:text-green-700">vvbaraiya32@gmail.com</a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Support:</strong> <a href="mailto:vvbaraiya32@gmail.com" className="text-green-600 hover:text-green-700">vvbaraiya32@gmail.com</a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Address:</strong> 123 Farm Tech Lane, Agricultural Valley, Kaniyad, Botad, Gujarat, India 364710
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Users, Database } from "lucide-react";

export default function PrivacyPolicy() {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dynamic last updated date
  const lastUpdated = new Date("2025-08-24").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
              <Shield className="w-6 h-6 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
            <p className="text-gray-600">Last updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section id="information-collection" className="mb-8">
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Information We Collect
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                At AgroSmart, we collect information you provide directly to us,
                such as when you create an account, use our services, or contact
                us for support. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Personal information (name, email address, phone number)</li>
                <li>Farm and agricultural data you input into our platform</li>
                <li>Sensor data from connected IoT devices</li>
                <li>Usage information and analytics data</li>
              </ul>
            </section>

            <section id="usage" className="mb-8">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  How We Use Your Information
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Generate agricultural insights and recommendations</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section id="security" className="mb-8">
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Data Security</h3>
              </div>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
            </section>

            <section id="sharing" className="mb-8">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Information Sharing
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With trusted service providers who assist in our operations</li>
              </ul>
            </section>

            <section id="rights" className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your Rights
              </h3>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section id="contact">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:vvbaraiya32@gmail.com"
                    className="text-green-600 hover:text-green-700"
                  >
                    vvbaraiya32@gmail.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Address:</strong> 123 Farm Tech Lane, Agricultural Valley,
                  Kaniyad, Botad, Gujarat, India 364710
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

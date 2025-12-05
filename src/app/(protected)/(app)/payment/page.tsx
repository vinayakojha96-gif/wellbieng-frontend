"use client";

import PaymentButton from "./paymentButton";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-14 px-6 flex justify-center">
      <div className="max-w-4xl w-full">
        
        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-900">
            Complete Your Payment
          </h1>
          <p className="text-gray-600 mt-2 text-lg leading-relaxed max-w-2xl">
            Secure your Wanderfly wellbeing service using Razorpay. 
            Choose your preferred plan and complete your payment safely.
          </p>
        </div>

        {/* PRICING CARDS — EXACT STYLE FROM ONE-PAGER */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          {/* STARTER */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">🌱 Starter</h2>
            <p className="text-gray-500 mb-4">
              ₹99/user • Up to 25 users • Free plan available
            </p>

            <ul className="text-gray-700 space-y-2 mb-6 leading-relaxed">
              <li>✓ Daily check-ins</li>
              <li>✓ Slack integration</li>
              <li>✓ 3 micro-interventions/week</li>
              <li>✓ Basic dashboard</li>
              <li>✓ “Healthy HRs” community</li>
            </ul>

            <PaymentButton amount={99} />
          </div>

          {/* GROWTH */}
          <div className="bg-white border border-teal-500 shadow-md rounded-2xl p-6 relative">
            <span className="absolute top-0 right-0 bg-teal-600 text-white text-sm px-3 py-1 rounded-bl-xl rounded-tr-2xl font-medium">
              ⭐ Most Popular
            </span>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">🚀 Growth</h2>
            <p className="text-gray-500 mb-4">
              ₹299/user • Min 50 users • Billed annually
            </p>

            <ul className="text-gray-700 space-y-2 mb-6 leading-relaxed">
              <li>✓ Everything in Starter</li>
              <li>✓ Manager dashboards</li>
              <li>✓ Predictive analytics</li>
              <li>✓ Unlimited interventions</li>
              <li>✓ Google Workspace sync</li>
              <li>✓ Dedicated support</li>
            </ul>

            <PaymentButton amount={299} />
          </div>

          {/* ENTERPRISE */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">🏢 Enterprise</h2>
            <p className="text-gray-500 mb-4">
              Custom Pricing • Starting ₹599/user
            </p>

            <ul className="text-gray-700 space-y-2 mb-6 leading-relaxed">
              <li>✓ Everything in Growth</li>
              <li>✓ Burnout risk model</li>
              <li>✓ SSO & HRIS integration</li>
              <li>✓ Data residency options</li>
              <li>✓ Dedicated CSM</li>
              <li>✓ Co-branded reports</li>
            </ul>

            <PaymentButton amount={599} />
          </div>
        </div>

        {/* SECURITY MESSAGE */}
        <p className="text-gray-500 text-center text-sm">
          🔒 Payments are securely processed via Razorpay. Your data remains private & encrypted.
        </p>
      </div>
    </div>
  );
}

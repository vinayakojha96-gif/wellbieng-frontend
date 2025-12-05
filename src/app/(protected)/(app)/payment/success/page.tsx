"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-10 max-w-lg w-full text-center animate-fadeIn">

        {/* SUCCESS ICON */}
        <CheckCircle className="w-20 h-20 text-teal-600 mx-auto mb-6 drop-shadow-sm" />

        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Payment Successful!
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Thank you for choosing Wanderfly Wellbeing.  
          Your payment has been securely processed.
        </p>

        {/* NEXT STEPS BOX */}
        <div className="bg-gray-100 rounded-xl p-6 text-left mb-10">
          <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
          <ul className="text-gray-600 space-y-2 leading-relaxed">
            <li>✓ Your selected plan has been activated</li>
            <li>✓ A confirmation email will arrive shortly</li>
            <li>✓ You now have access to premium wellbeing features</li>
            <li>✓ Admin dashboard reflects updated subscription status</li>
          </ul>
        </div>

        {/* CTA BUTTON */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 
                     text-white font-medium px-8 py-3 rounded-lg shadow-sm
                     transition-all duration-200"
        >
          Go to Dashboard <ArrowRight size={18} />
        </Link>

        <p className="text-gray-400 text-sm mt-6">
          Need help? Contact our support team anytime.
        </p>
      </div>
    </div>
  );
}

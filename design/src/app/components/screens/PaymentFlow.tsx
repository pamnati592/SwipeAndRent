import React from 'react';
import { Check, CreditCard, Lock } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function PaymentFlow() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">05. Payment Flow - After Approval</h2>
      <p className="text-neutral-400 mb-6">Payment screen appears after lender approves the request</p>
      
      <div className="flex gap-6 flex-wrap">
        {/* Request Approved - Proceed to Payment */}
        <PhoneFrame title="Request Approved">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Request Approved!</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              The lender has approved your rental request
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Item</span>
                  <span>Professional Camera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Dates</span>
                  <span>Mar 5-8, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total</span>
                  <span className="font-bold">$135</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Proceed to Payment
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                View Details
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Payment Screen */}
        <PhoneFrame title="Payment Screen">
          <div className="flex flex-col h-full bg-neutral-850">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Complete Payment</h2>
              <p className="text-sm text-neutral-400">Secure checkout</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Item Summary */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-400 mb-3">Rental Summary</div>
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Professional Camera</div>
                    <div className="text-sm text-neutral-400">Canon EOS R5</div>
                    <div className="text-xs text-neutral-500 mt-1">Mar 5-8 · 3 days</div>
                  </div>
                </div>

                <div className="border-t border-neutral-600 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Daily rate</span>
                    <span>$45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Days</span>
                    <span>× 3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Service fee</span>
                    <span>$15</span>
                  </div>
                  <div className="border-t border-neutral-600 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-xl">$150</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-400 mb-3">Payment Method</div>
                
                <button className="w-full bg-neutral-650 border-2 border-neutral-600 rounded-lg p-4 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-neutral-400" />
                    <div className="text-left">
                      <div className="font-medium text-sm">•••• 4242</div>
                      <div className="text-xs text-neutral-400">Expires 12/25</div>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400">Change</span>
                </button>

                <button className="w-full h-10 bg-neutral-650 border border-neutral-600 rounded-lg text-sm">
                  + Add New Card
                </button>
              </div>

              {/* Security Note */}
              <div className="bg-neutral-700 rounded-lg p-3 border border-neutral-600 flex items-center gap-3">
                <Lock className="w-5 h-5 text-green-400" />
                <div className="text-xs text-neutral-400">
                  Your payment is secure and encrypted
                </div>
              </div>

              {/* Terms */}
              <div className="text-xs text-neutral-500">
                By completing this payment, you agree to the rental terms and conditions. Payment will be held securely until pickup confirmation.
              </div>
            </div>

            {/* Action Button */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <button className="w-full h-12 bg-green-900 text-green-300 rounded-lg font-medium">
                Pay $150
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Payment Processing */}
        <PhoneFrame title="Processing Payment">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-neutral-700 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 border-4 border-neutral-500 border-t-transparent rounded-full animate-spin" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Processing...</h2>
            <p className="text-sm text-neutral-400 text-center">
              Please wait while we process your payment
            </p>
          </div>
        </PhoneFrame>

        {/* Payment Success */}
        <PhoneFrame title="Payment Complete">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Your rental is now confirmed
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-green-400 font-medium">Active Rental</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pickup Date</span>
                  <span>Mar 5, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Return Date</span>
                  <span>Mar 8, 2026</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                View Rental Details
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Message Lender
              </button>
            </div>

            <div className="mt-6 text-xs text-neutral-500 text-center">
              You'll receive pickup instructions from the lender soon
            </div>
          </div>
        </PhoneFrame>

        {/* Payment Failed */}
        <PhoneFrame title="Payment Failed">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-red-900 rounded-full flex items-center justify-center mb-6">
              <div className="text-5xl">!</div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              We couldn't process your payment
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm">
                <div className="text-red-400 mb-2">Error: Insufficient funds</div>
                <div className="text-neutral-400">
                  Please use a different payment method or add funds to your card.
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Try Different Card
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Cancel Rental
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Transaction Flow Diagram */}
        <PhoneFrame title="Payment Flow">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <h3 className="text-lg font-bold mb-6">Payment Sequence</h3>

            <div className="space-y-3 w-full max-w-xs">
              <div className="bg-neutral-700 rounded-lg p-3 border-2 border-green-900">
                <div className="text-sm font-bold mb-1">1. Request Approved</div>
                <div className="text-xs text-neutral-400">Lender accepts</div>
              </div>

              <div className="flex justify-center">
                <div className="text-2xl">↓</div>
              </div>

              <div className="bg-neutral-700 rounded-lg p-3 border-2 border-neutral-600">
                <div className="text-sm font-bold mb-1">2. Payment Screen</div>
                <div className="text-xs text-neutral-400">Enter payment info</div>
              </div>

              <div className="flex justify-center">
                <div className="text-2xl">↓</div>
              </div>

              <div className="bg-neutral-700 rounded-lg p-3 border-2 border-neutral-600">
                <div className="text-sm font-bold mb-1">3. Processing</div>
                <div className="text-xs text-neutral-400">Secure payment</div>
              </div>

              <div className="flex justify-center">
                <div className="text-2xl">↓</div>
              </div>

              <div className="bg-neutral-700 rounded-lg p-3 border-2 border-blue-900">
                <div className="text-sm font-bold mb-1 text-blue-400">4. Active Rental</div>
                <div className="text-xs text-neutral-400">Ready for pickup</div>
              </div>
            </div>

            <div className="mt-6 text-xs text-neutral-500 text-center max-w-xs">
              Payment is held securely until pickup confirmation
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

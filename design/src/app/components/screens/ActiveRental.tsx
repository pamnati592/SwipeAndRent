import React from 'react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function ActiveRental() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">07. Active Rental - Lifecycle States</h2>
      <p className="text-neutral-400 mb-6">Complete rental lifecycle from request to completion</p>
      
      <div className="flex gap-6 flex-wrap">
        {/* State 1: Request Sent */}
        <PhoneFrame title="State: Request Sent">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="w-16 h-16 bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏱️</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Request Sent</h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Waiting for lender approval
            </p>
            <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
              <div className="text-xs text-neutral-500">STATUS</div>
              <div className="font-bold text-yellow-400">PENDING APPROVAL</div>
            </div>
          </div>
        </PhoneFrame>

        {/* State 2: Pending Approval */}
        <PhoneFrame title="State: Pending Approval">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="w-16 h-16 bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Pending Approval</h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Lender is reviewing your request
            </p>
            <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
              <div className="text-xs text-neutral-500">TIMELINE</div>
              <div className="text-sm mt-2">Sent: 10 minutes ago</div>
              <div className="text-xs text-neutral-400 mt-1">Usually responds in 2 hours</div>
            </div>
          </div>
        </PhoneFrame>

        {/* State 3: Approved */}
        <PhoneFrame title="State: Approved">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Approved</h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Ready for payment
            </p>
            <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4">
              <div className="text-xs text-neutral-500">STATUS</div>
              <div className="font-bold text-green-400">APPROVED</div>
            </div>
            <button className="w-full h-12 bg-green-900 text-green-300 rounded-lg font-medium">
              Proceed to Payment
            </button>
          </div>
        </PhoneFrame>

        {/* State 4: Payment Pending */}
        <PhoneFrame title="State: Payment Pending">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Payment Pending</h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Complete payment to confirm
            </p>
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-3 mb-4">
              <div className="text-sm text-yellow-300 font-medium">⚠️ Payment Required</div>
              <div className="text-xs text-yellow-200 mt-1">
                Complete payment within 24 hours or booking will be cancelled
              </div>
            </div>
            <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
              Complete Payment
            </button>
          </div>
        </PhoneFrame>

        {/* State 5: Active Rental */}
        <PhoneFrame title="State: Active Rental">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Active Rental</h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Currently in use
            </p>
            <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4 space-y-3">
              <div>
                <div className="text-xs text-neutral-500">STATUS</div>
                <div className="font-bold text-green-400">ACTIVE</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">RETURN DATE</div>
                <div className="text-sm">Mar 8, 2026 - 6:00 PM</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">TIME REMAINING</div>
                <div className="text-sm">2 days, 14 hours</div>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Message Lender
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium text-red-400">
                Report Issue
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* State 6: Return Day */}
        <PhoneFrame title="State: Return Day">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="w-16 h-16 bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏰</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Return Day</h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Due today
            </p>
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-4 mb-4">
              <div className="text-sm text-yellow-300 font-medium mb-2">⚠️ Return Due Today</div>
              <div className="text-xs text-yellow-200">
                Please return by 6:00 PM to avoid late fees ($15/day)
              </div>
            </div>
            <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4">
              <div className="text-xs text-neutral-500">RETURN LOCATION</div>
              <div className="text-sm mt-1">123 Main St</div>
              <div className="text-xs text-neutral-400 mt-1">Same as pickup</div>
            </div>
            <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
              Start Return Process
            </button>
          </div>
        </PhoneFrame>

        {/* State 7: Completed */}
        <PhoneFrame title="State: Completed">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Completed</h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Transaction finished
            </p>
            <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Status</span>
                <span className="text-green-400 font-medium">Completed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Rental Period</span>
                <span>Mar 5-8, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Total Paid</span>
                <span className="font-bold">$150</span>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Rate Experience
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                View Receipt
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Lifecycle Flow Diagram */}
        <PhoneFrame title="Rental Lifecycle">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <h3 className="text-lg font-bold mb-6">Complete Lifecycle</h3>

            <div className="space-y-2 w-full max-w-xs">
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-3">
                <div className="text-xs font-bold text-yellow-400">1. REQUEST SENT</div>
              </div>
              <div className="text-center text-xs">↓</div>
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-3">
                <div className="text-xs font-bold text-yellow-400">2. PENDING APPROVAL</div>
              </div>
              <div className="text-center text-xs">↓</div>
              <div className="bg-green-900 bg-opacity-30 border border-green-800 rounded-lg p-3">
                <div className="text-xs font-bold text-green-400">3. APPROVED</div>
              </div>
              <div className="text-center text-xs">↓</div>
              <div className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg p-3">
                <div className="text-xs font-bold text-blue-400">4. PAYMENT PENDING</div>
              </div>
              <div className="text-center text-xs">↓</div>
              <div className="bg-green-900 bg-opacity-30 border border-green-800 rounded-lg p-3">
                <div className="text-xs font-bold text-green-400">5. ACTIVE RENTAL</div>
              </div>
              <div className="text-center text-xs">↓</div>
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-3">
                <div className="text-xs font-bold text-yellow-400">6. RETURN DAY</div>
              </div>
              <div className="text-center text-xs">↓</div>
              <div className="bg-green-900 bg-opacity-30 border border-green-800 rounded-lg p-3">
                <div className="text-xs font-bold text-green-400">7. COMPLETED</div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

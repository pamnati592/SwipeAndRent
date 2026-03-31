import React from 'react';
import { Check, Download } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function CompletedTransactions() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">10. Completed Transactions</h2>
      <p className="text-neutral-400 mb-6">View past rentals, purchases, and ratings</p>
      
      <div className="flex gap-6 flex-wrap">
        {/* Completed Transactions List */}
        <PhoneFrame title="Transaction History">
          <div className="flex flex-col h-full bg-neutral-850">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Completed</h2>
              <p className="text-sm text-neutral-400">Your transaction history</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 px-4 py-3 border-b border-neutral-700">
              <button className="px-4 py-2 bg-neutral-600 rounded-lg text-sm font-medium">
                All
              </button>
              <button className="px-4 py-2 bg-neutral-700 rounded-lg text-sm">
                Rentals
              </button>
              <button className="px-4 py-2 bg-neutral-700 rounded-lg text-sm">
                Purchases
              </button>
            </div>

            {/* Transaction List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Transaction Item 1 */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    📷
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">Professional Camera</div>
                    <div className="text-sm text-neutral-400">Canon EOS R5</div>
                    <div className="text-xs text-neutral-500 mt-1">Mar 5-8, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">$150</div>
                    <div className="text-xs text-green-400">Rental</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-600">
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Check className="w-3 h-3 text-green-400" />
                    <span>Completed</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-yellow-400">⭐ 5.0</span>
                    <span className="text-neutral-500 ml-1">Rated</span>
                  </div>
                </div>
              </div>

              {/* Transaction Item 2 */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🎮
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">Gaming Console</div>
                    <div className="text-sm text-neutral-400">PlayStation 5</div>
                    <div className="text-xs text-neutral-500 mt-1">Feb 20-23, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">$120</div>
                    <div className="text-xs text-green-400">Rental</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-600">
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Check className="w-3 h-3 text-green-400" />
                    <span>Completed</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-yellow-400">⭐ 4.5</span>
                    <span className="text-neutral-500 ml-1">Rated</span>
                  </div>
                </div>
              </div>

              {/* Transaction Item 3 */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🔧
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">Power Drill Set</div>
                    <div className="text-sm text-neutral-400">DeWalt 20V</div>
                    <div className="text-xs text-neutral-500 mt-1">Feb 10, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">$180</div>
                    <div className="text-xs text-blue-400">Purchase</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-600">
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Check className="w-3 h-3 text-green-400" />
                    <span>Completed</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-yellow-400">⭐ 5.0</span>
                    <span className="text-neutral-500 ml-1">Rated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Transaction Details */}
        <PhoneFrame title="Transaction Details">
          <div className="flex flex-col h-full bg-neutral-850">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Transaction Details</h2>
                <p className="text-sm text-neutral-400">Rental #R-2847</p>
              </div>
              <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Item Info */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Professional Camera</div>
                    <div className="text-sm text-neutral-400">Canon EOS R5</div>
                    <div className="text-xs text-neutral-500 mt-1">⭐ 4.9 · 23 rentals</div>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 space-y-2">
                <div className="text-xs text-neutral-500 mb-2">RENTAL DETAILS</div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Start Date</span>
                  <span>Mar 5, 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">End Date</span>
                  <span>Mar 8, 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Duration</span>
                  <span>3 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Pickup Method</span>
                  <span>In Person</span>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 space-y-2">
                <div className="text-xs text-neutral-500 mb-2">PAYMENT</div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Daily Rate</span>
                  <span>$45 × 3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Service Fee</span>
                  <span>$15</span>
                </div>
                <div className="border-t border-neutral-600 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Paid</span>
                    <span className="font-bold text-lg">$150</span>
                  </div>
                </div>
              </div>

              {/* Lender Info */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-500 mb-3">LENDER</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-600 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-neutral-400">⭐ 4.8 (45 reviews)</div>
                  </div>
                </div>
              </div>

              {/* Your Rating */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-500 mb-2">YOUR RATING</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl text-yellow-400">⭐ 5.0</span>
                </div>
                <div className="text-sm text-neutral-300">
                  "Great camera and very helpful lender. Everything went smoothly!"
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700 space-y-2">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium text-red-400">
                Report Issue (30 days)
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Ratings Given */}
        <PhoneFrame title="Ratings Given">
          <div className="flex flex-col h-full bg-neutral-850">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Your Ratings</h2>
              <p className="text-sm text-neutral-400">Reviews you've given</p>
            </div>

            {/* Ratings List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Rating 1 */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl text-yellow-400">⭐ 5.0</span>
                  <span className="text-xs text-neutral-500">Mar 8, 2026</span>
                </div>
                <div className="font-medium mb-2">Professional Camera</div>
                <div className="text-sm text-neutral-300 mb-3">
                  "Great camera and very helpful lender. Everything went smoothly!"
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-600">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full" />
                  <div className="text-sm text-neutral-400">Lender: John Doe</div>
                </div>
              </div>

              {/* Rating 2 */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl text-yellow-400">⭐ 4.5</span>
                  <span className="text-xs text-neutral-500">Feb 23, 2026</span>
                </div>
                <div className="font-medium mb-2">Gaming Console</div>
                <div className="text-sm text-neutral-300 mb-3">
                  "Console worked perfectly. Minor delay in pickup but overall good experience."
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-600">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full" />
                  <div className="text-sm text-neutral-400">Lender: Sarah Chen</div>
                </div>
              </div>

              {/* Rating 3 */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl text-yellow-400">⭐ 5.0</span>
                  <span className="text-xs text-neutral-500">Feb 10, 2026</span>
                </div>
                <div className="font-medium mb-2">Power Drill Set</div>
                <div className="text-sm text-neutral-300 mb-3">
                  "Purchased in excellent condition. Fast shipping and great communication!"
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-600">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full" />
                  <div className="text-sm text-neutral-400">Seller: Mike Johnson</div>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Reopen Issue (Limited Time) */}
        <PhoneFrame title="Reopen Issue Option">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Report an Issue</h2>
            <p className="text-sm text-neutral-400 mb-6">
              For completed transaction #R-2847
            </p>

            <div className="flex-1">
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-4 mb-6">
                <div className="text-sm text-yellow-300 font-medium mb-1">⚠️ Limited Time</div>
                <div className="text-xs text-yellow-200">
                  You can report issues up to 30 days after completion
                </div>
                <div className="text-xs text-yellow-200 mt-2">
                  <strong>25 days remaining</strong>
                </div>
              </div>

              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4">
                <div className="font-medium mb-2">Professional Camera</div>
                <div className="text-sm text-neutral-400">Completed: Mar 8, 2026</div>
              </div>

              <div className="text-sm text-neutral-400 mb-4">
                If you discovered an issue after completing the transaction, you can still report it.
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full h-12 bg-red-900 text-red-300 rounded-lg font-medium">
                Report Post-Completion Issue
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

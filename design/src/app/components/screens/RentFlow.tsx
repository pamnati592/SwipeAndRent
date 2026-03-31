import React from 'react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function RentFlow() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">04. Rent Flow - Swipe to Request</h2>
      <p className="text-neutral-400 mb-6">Complete rental request flow after swiping right</p>
      
      <div className="flex gap-6 flex-wrap">
        {/* Step 1: Select Dates */}
        <PhoneFrame title="Step 1: Select Dates">
          <div className="flex flex-col h-full bg-neutral-850">
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Select Rental Period</h2>
              <p className="text-sm text-neutral-400">Professional Camera - $45/day</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4">
                <div className="text-center text-sm mb-4 font-medium">March 2026</div>
                
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs text-neutral-400">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => (
                    <button
                      key={i}
                      className={`aspect-square ${
                        i >= 4 && i <= 7
                          ? 'bg-green-900 border-2 border-green-700'
                          : 'bg-neutral-650'
                      } rounded-lg text-sm flex items-center justify-center`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-400">Start Date</span>
                  <span>Mar 5, 2026</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-neutral-400">End Date</span>
                  <span>Mar 8, 2026</span>
                </div>
                <div className="border-t border-neutral-600 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total (3 days)</span>
                    <span className="font-bold text-lg">$135</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Continue
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Step 2: Add Message (Editable) */}
        <PhoneFrame title="Step 2: Add Message">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Message to Lender</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Introduce yourself and explain how you'll use the item
            </p>

            <div className="flex-1">
              <div className="mb-4">
                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-neutral-650 rounded-lg flex items-center justify-center text-xl">
                      📷
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium">Professional Camera</div>
                      <div className="text-xs text-neutral-400">Mar 5-8 · 3 days</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total</span>
                      <span className="font-bold">$135</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Your Message</label>
                <textarea
                  placeholder="Hi! I'd like to rent your camera for a weekend photoshoot..."
                  className="w-full h-32 bg-neutral-700 border border-neutral-600 rounded-xl p-3 text-sm resize-none"
                  defaultValue="Hi! I'd like to rent your camera for a weekend photoshoot. I have experience with professional cameras and will take great care of it."
                />
              </div>

              <div className="mt-4 bg-neutral-700 rounded-lg p-3 border border-neutral-600">
                <div className="text-xs text-neutral-400 mb-2">Pickup Location</div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="text-sm">Meet at lender's location</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">2.3 km away · Free</div>
              </div>
            </div>

            <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium mt-4">
              Continue to Review
            </button>
          </div>
        </PhoneFrame>

        {/* Step 3: Review & Submit */}
        <PhoneFrame title="Step 3: Review & Submit">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Review Request</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Check details before submitting
            </p>

            <div className="flex-1 space-y-4">
              {/* Item Card */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex gap-3 mb-3">
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
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Dates</span>
                  <span>Mar 5-8, 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Duration</span>
                  <span>3 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Pickup</span>
                  <span>In person</span>
                </div>
                <div className="border-t border-neutral-600 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">$135</span>
                  </div>
                </div>
              </div>

              {/* Your Message Preview */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-400 mb-2">Your Message</div>
                <div className="text-sm">
                  Hi! I'd like to rent your camera for a weekend photoshoot. I have experience with professional cameras and will take great care of it.
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-3">
                <div className="text-sm text-yellow-300">
                  Payment will be requested after lender approves
                </div>
              </div>
            </div>

            <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium mt-4">
              Submit Request
            </button>
          </div>
        </PhoneFrame>

        {/* State: Request Sent (Pending) */}
        <PhoneFrame title="State: Pending Approval">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-yellow-900 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Request Sent</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Waiting for lender approval
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Item</span>
                  <span>Professional Camera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Dates</span>
                  <span>Mar 5-8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-yellow-400">Pending</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-500 text-center mb-4">
              Lenders typically respond within 2 hours.<br/>
              You'll be notified when they respond.
            </div>

            <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium text-red-400">
              Cancel Request
            </button>
          </div>
        </PhoneFrame>

        {/* State: Request Rejected */}
        <PhoneFrame title="State: Request Rejected">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-red-900 rounded-full flex items-center justify-center mb-6">
              <div className="text-5xl">✕</div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Request Declined</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              The lender is unable to fulfill this request
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm">
                <div className="font-medium mb-2">Reason (optional)</div>
                <div className="text-neutral-400">
                  "The item is already booked for those dates. Sorry!"
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Find Similar Items
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Back to Feed
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

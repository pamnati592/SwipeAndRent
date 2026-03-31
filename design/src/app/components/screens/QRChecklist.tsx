import React from 'react';
import { Check } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function QRChecklist() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">06. QR Checklist System - Handoff Confirmation</h2>
      <p className="text-neutral-400 mb-6">QR scanning and condition checklist for pickup and return</p>
      
      <div className="flex gap-6 flex-wrap">
        {/* Start Rental - QR Display */}
        <PhoneFrame title="Pickup Day - QR Code">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Start Rental</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Show this QR code to the lender
            </p>

            <div className="flex-1 flex flex-col items-center justify-center">
              {/* QR Code */}
              <div className="w-64 h-64 bg-white rounded-2xl p-4 mb-6 flex items-center justify-center">
                <div className="w-full h-full bg-neutral-900" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 8px, #000000 8px, #000000 16px), repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, #000000 8px, #000000 16px)',
                  backgroundSize: '16px 16px'
                }} />
              </div>

              <div className="text-center mb-6">
                <div className="font-bold mb-1">Rental ID: #R-2847</div>
                <div className="text-sm text-neutral-400">Professional Camera</div>
              </div>

              <div className="w-full bg-neutral-700 rounded-lg p-4 border border-neutral-600">
                <div className="text-xs text-neutral-400 mb-2">Pickup Details</div>
                <div className="text-sm space-y-1">
                  <div>📍 123 Main St, Apartment 4B</div>
                  <div>⏰ Today, 2:00 PM</div>
                  <div>👤 John Doe (Lender)</div>
                </div>
              </div>
            </div>

            <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
              Scan Lender's QR Instead
            </button>
          </div>
        </PhoneFrame>

        {/* After QR Scan - Checklist Screen */}
        <PhoneFrame title="Pickup Checklist">
          <div className="flex flex-col h-full bg-neutral-850">
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Pickup Checklist</h2>
              <p className="text-sm text-neutral-400">Confirm item condition</p>
            </div>

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
                  </div>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-neutral-300">Item Condition</div>

                <button className="w-full bg-neutral-700 border-2 border-green-900 rounded-lg p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Item is in good condition</span>
                    <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">No visible damage or issues</div>
                </button>

                <button className="w-full bg-neutral-700 border-2 border-green-900 rounded-lg p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">All accessories included</span>
                    <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">Lens, battery, charger, bag</div>
                </button>

                <button className="w-full bg-neutral-700 border-2 border-green-900 rounded-lg p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Item matches description</span>
                    <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">Correct model and features</div>
                </button>
              </div>

              {/* Photo Upload */}
              <div>
                <div className="text-sm font-medium text-neutral-300 mb-2">Visual Confirmation</div>
                <button className="w-full h-32 bg-neutral-700 border-2 border-dashed border-neutral-600 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-sm text-neutral-400">Take Photo (Optional)</div>
                </button>
              </div>

              {/* Both Users Must Confirm */}
              <div className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg p-3">
                <div className="text-sm text-blue-300 font-medium mb-1">⚠️ Both parties must confirm</div>
                <div className="text-xs text-blue-200">
                  Both renter and lender must review and confirm this checklist
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-800 border-t border-neutral-700 space-y-2">
              <button className="w-full h-12 bg-green-900 text-green-300 rounded-lg font-medium">
                Confirm Pickup (Renter)
              </button>
              <div className="text-xs text-neutral-500 text-center">
                Waiting for lender confirmation...
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Both Confirmed - Rental Active */}
        <PhoneFrame title="Pickup Confirmed">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Pickup Complete!</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Rental is now active
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Return Date</span>
                  <span>Mar 8, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Time Remaining</span>
                  <span>3 days</span>
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
          </div>
        </PhoneFrame>

        {/* Return Day - QR Code */}
        <PhoneFrame title="Return Day - QR Code">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Return Rental</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Show this QR code to complete the return
            </p>

            <div className="flex-1 flex flex-col items-center justify-center">
              {/* QR Code */}
              <div className="w-64 h-64 bg-white rounded-2xl p-4 mb-6 flex items-center justify-center">
                <div className="w-full h-full bg-neutral-900" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 8px, #000000 8px, #000000 16px), repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, #000000 8px, #000000 16px)',
                  backgroundSize: '16px 16px'
                }} />
              </div>

              <div className="text-center mb-6">
                <div className="font-bold mb-1">Return ID: #R-2847</div>
                <div className="text-sm text-neutral-400">Professional Camera</div>
              </div>

              <div className="w-full bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg p-4 mb-4">
                <div className="text-sm text-yellow-300 font-medium mb-1">⏰ Due Today</div>
                <div className="text-xs text-yellow-200">
                  Please return by 6:00 PM to avoid late fees
                </div>
              </div>
            </div>

            <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
              Scan Lender's QR Instead
            </button>
          </div>
        </PhoneFrame>

        {/* Return Checklist */}
        <PhoneFrame title="Return Checklist">
          <div className="flex flex-col h-full bg-neutral-850">
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Return Checklist</h2>
              <p className="text-sm text-neutral-400">Compare with pickup condition</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Condition Comparison */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-400 mb-2">Pickup Condition</div>
                <div className="text-sm space-y-1 text-neutral-300">
                  <div>✓ Good condition</div>
                  <div>✓ All accessories</div>
                  <div>✓ Matches description</div>
                </div>
              </div>

              {/* Return Checklist Items */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-neutral-300">Return Condition</div>

                <button className="w-full bg-neutral-700 border-2 border-green-900 rounded-lg p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Item returned in good condition</span>
                    <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">No new damage</div>
                </button>

                <button className="w-full bg-neutral-700 border-2 border-green-900 rounded-lg p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">All accessories returned</span>
                    <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">Nothing missing</div>
                </button>

                <button className="w-full bg-neutral-700 border-2 border-green-900 rounded-lg p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Item is clean</span>
                    <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">Ready for next renter</div>
                </button>
              </div>

              {/* Photo Comparison */}
              <div>
                <div className="text-sm font-medium text-neutral-300 mb-2">Visual Confirmation</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Pickup</div>
                    <div className="w-full aspect-square bg-neutral-700 rounded-lg border border-neutral-600 flex items-center justify-center">
                      <span className="text-2xl">📸</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 mb-1">Return</div>
                    <button className="w-full aspect-square bg-neutral-700 border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📸</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-800 border-t border-neutral-700 space-y-2">
              <button className="w-full h-12 bg-green-900 text-green-300 rounded-lg font-medium">
                Confirm Return (Lender)
              </button>
              <div className="text-xs text-neutral-500 text-center">
                Waiting for renter confirmation...
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Return Confirmed - Transaction Complete */}
        <PhoneFrame title="Return Confirmed">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Return Complete!</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Transaction successfully completed
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-green-400 font-medium">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Rental Period</span>
                  <span>Mar 5-8, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Cost</span>
                  <span className="font-bold">$150</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Rate Your Experience
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                View Receipt
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

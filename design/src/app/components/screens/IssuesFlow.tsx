import React from 'react';
import { AlertTriangle, Camera } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function IssuesFlow() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">08. Issues & Incident Reporting</h2>
      <p className="text-neutral-400 mb-6">Report problems during active rental or return</p>
      
      <div className="flex gap-6 flex-wrap">
        {/* Report Issue Button Location */}
        <PhoneFrame title="Access Point - Active Rental">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Active Rental</h2>
            <p className="text-sm text-neutral-400 mb-6">Professional Camera</p>

            <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Return Date</span>
                  <span>Mar 8, 2026</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Message Lender
              </button>
              <button className="w-full h-12 bg-neutral-700 border-2 border-red-900 rounded-lg font-medium text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Issue Type Selection */}
        <PhoneFrame title="Select Issue Type">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Report an Issue</h2>
            <p className="text-sm text-neutral-400 mb-6">
              What kind of problem are you experiencing?
            </p>

            <div className="space-y-3 flex-1">
              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left hover:border-red-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💔</span>
                  <span className="font-bold">Damaged Item</span>
                </div>
                <div className="text-xs text-neutral-400">Item was damaged during use</div>
              </button>

              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left hover:border-red-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔍</span>
                  <span className="font-bold">Missing Part</span>
                </div>
                <div className="text-xs text-neutral-400">Accessory or component missing</div>
              </button>

              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left hover:border-red-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">❌</span>
                  <span className="font-bold">Not as Described</span>
                </div>
                <div className="text-xs text-neutral-400">Item differs from listing</div>
              </button>

              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left hover:border-red-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⚙️</span>
                  <span className="font-bold">Not Working Properly</span>
                </div>
                <div className="text-xs text-neutral-400">Item has functionality issues</div>
              </button>

              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left hover:border-red-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📝</span>
                  <span className="font-bold">Other</span>
                </div>
                <div className="text-xs text-neutral-400">Describe your issue</div>
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Issue Details Form */}
        <PhoneFrame title="Describe Issue">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Damaged Item</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Please provide details about the damage
            </p>

            <div className="flex-1 space-y-4">
              {/* Rental Info */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-500 mb-2">REPORTING FOR</div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-neutral-650 rounded-lg flex items-center justify-center text-xl">
                    📷
                  </div>
                  <div>
                    <div className="font-medium text-sm">Professional Camera</div>
                    <div className="text-xs text-neutral-400">Rental #R-2847</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Description</label>
                <textarea
                  placeholder="Describe what happened..."
                  className="w-full h-32 bg-neutral-700 border border-neutral-600 rounded-xl p-3 text-sm resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Add Photos (Optional)</label>
                <button className="w-full h-32 bg-neutral-700 border-2 border-dashed border-neutral-600 rounded-xl flex flex-col items-center justify-center">
                  <Camera className="w-8 h-8 text-neutral-500 mb-2" />
                  <span className="text-sm text-neutral-400">Upload Photos</span>
                </button>
              </div>

              {/* Notice */}
              <div className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg p-3">
                <div className="text-xs text-blue-300">
                  Our support team will review your report and contact you within 24 hours.
                </div>
              </div>
            </div>

            <button className="w-full h-12 bg-red-900 text-red-300 rounded-lg font-medium mt-4">
              Submit Report
            </button>
          </div>
        </PhoneFrame>

        {/* Issue Submitted */}
        <PhoneFrame title="Issue Submitted">
          <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
            <div className="w-24 h-24 bg-yellow-900 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Issue Reported</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              We've received your report
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Report ID</span>
                  <span className="font-mono">#ISS-4729</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-yellow-400">Under Review</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Response Time</span>
                  <span>Within 24 hours</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                View Report Details
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Back to Rental
              </button>
            </div>

            <div className="mt-6 text-xs text-neutral-500 text-center">
              You'll receive a notification when support responds
            </div>
          </div>
        </PhoneFrame>

        {/* Issue Resolution */}
        <PhoneFrame title="Issue Resolved">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <h2 className="text-xl font-bold mb-2">Issue Update</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Your issue has been resolved
            </p>

            <div className="flex-1 space-y-4">
              {/* Issue Info */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-green-400">Resolved</div>
                    <div className="text-xs text-neutral-400">Report #ISS-4729</div>
                  </div>
                </div>
              </div>

              {/* Resolution Details */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-500 mb-2">RESOLUTION</div>
                <div className="text-sm">
                  After reviewing your report and speaking with the lender, we've determined this was normal wear and tear. No charges will be applied to your account.
                </div>
              </div>

              {/* Support Response */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-xs text-neutral-500 mb-2">SUPPORT TEAM</div>
                <div className="text-sm mb-2">
                  "Thank you for reporting this issue. We've verified the damage was minor and the item remains functional. The lender has agreed no additional charges are needed."
                </div>
                <div className="text-xs text-neutral-400 mt-2">- Support Team, 2 hours ago</div>
              </div>
            </div>

            <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
              Close Report
            </button>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

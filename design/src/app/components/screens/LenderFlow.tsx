import React, { useState } from 'react';
import { Camera, Video, Check, Clock, X, MessageCircle } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function LenderFlow() {
  const [currentScreen, setCurrentScreen] = useState('add-item');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">05. Lender POV</h2>
      
      <div className="flex gap-6 flex-wrap">
        {/* Add New Item Form */}
        <PhoneFrame title="Add New Item" active={currentScreen === 'add-item'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-lg font-bold">List New Item</h2>
              <p className="text-sm text-neutral-400">Share what you have</p>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Images */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Photos</label>
                <div className="grid grid-cols-4 gap-2">
                  <button className="aspect-square bg-neutral-700 border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center hover:bg-neutral-650">
                    <Camera className="w-6 h-6 text-neutral-500" />
                  </button>
                  <div className="aspect-square bg-neutral-650 rounded-lg" />
                  <div className="aspect-square bg-neutral-650 rounded-lg" />
                  <div className="aspect-square bg-neutral-650 rounded-lg" />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Professional Camera"
                  className="w-full h-10 bg-neutral-700 border border-neutral-600 rounded-lg px-3 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Description *</label>
                <textarea
                  placeholder="Describe your item, condition, included accessories..."
                  className="w-full h-24 bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-sm resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Category *</label>
                <select className="w-full h-10 bg-neutral-700 border border-neutral-600 rounded-lg px-3 text-sm">
                  <option>Select category</option>
                  <option>Photography</option>
                  <option>Camping</option>
                  <option>Tools</option>
                  <option>Electronics</option>
                </select>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-neutral-400 mb-2 block">Daily Rate *</label>
                  <div className="flex items-center bg-neutral-700 border border-neutral-600 rounded-lg px-3 h-10">
                    <span className="text-neutral-500 mr-1">$</span>
                    <input
                      type="number"
                      placeholder="45"
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400 mb-2 block">Sale Price</label>
                  <div className="flex items-center bg-neutral-700 border border-neutral-600 rounded-lg px-3 h-10">
                    <span className="text-neutral-500 mr-1">$</span>
                    <input
                      type="number"
                      placeholder="1200"
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Calendar */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Availability</label>
                <button 
                  onClick={() => setCurrentScreen('calendar')}
                  className="w-full h-10 bg-neutral-700 border border-neutral-600 rounded-lg px-3 text-sm flex items-center justify-between hover:bg-neutral-650"
                >
                  <span className="text-neutral-400">Set available dates</span>
                  <span>→</span>
                </button>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Location *</label>
                <input
                  type="text"
                  placeholder="City or ZIP code"
                  className="w-full h-10 bg-neutral-700 border border-neutral-600 rounded-lg px-3 text-sm"
                />
              </div>

              {/* Verification Video */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Verification Video *</label>
                <button 
                  onClick={() => setCurrentScreen('record-video')}
                  className="w-full h-24 bg-neutral-700 border-2 border-dashed border-neutral-600 rounded-lg flex flex-col items-center justify-center hover:bg-neutral-650"
                >
                  <Video className="w-8 h-8 text-neutral-500 mb-2" />
                  <span className="text-sm text-neutral-400">Record Video</span>
                </button>
                <p className="text-xs text-neutral-500 mt-2">
                  Show the item from all angles (15-30 seconds)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <button 
                onClick={() => setCurrentScreen('pending-verification')}
                className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Calendar Selection */}
        <PhoneFrame title="Set Availability" active={currentScreen === 'calendar'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-lg font-bold">Available Dates</h2>
              <p className="text-sm text-neutral-400">Mark when item can be rented</p>
            </div>

            {/* Calendar */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4">
                <div className="text-center text-sm mb-4">February 2026</div>
                
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-center text-xs text-neutral-400">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }, (_, i) => (
                    <button
                      key={i}
                      className={`aspect-square rounded-lg text-sm flex items-center justify-center ${
                        i % 3 === 0 ? 'bg-green-900 text-green-300' : 'bg-neutral-650 hover:bg-neutral-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-900 rounded" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-neutral-650 rounded" />
                  <span>Unavailable</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <button 
                onClick={() => setCurrentScreen('add-item')}
                className="w-full h-12 bg-neutral-600 rounded-lg font-medium"
              >
                Save Availability
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Record Verification Video */}
        <PhoneFrame title="Record Video" active={currentScreen === 'record-video'}>
          <div className="flex flex-col items-center justify-center h-full p-6 bg-black">
            {/* Camera Viewfinder */}
            <div className="w-full aspect-[3/4] bg-neutral-800 rounded-2xl mb-6 flex items-center justify-center border-2 border-neutral-700">
              <Video className="w-16 h-16 text-neutral-600" />
            </div>

            <div className="w-full space-y-4">
              <div className="text-center text-sm text-neutral-400 mb-4">
                Show all sides of your item
              </div>

              <div className="flex items-center justify-center gap-6">
                <button className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setCurrentScreen('add-item')}
                  className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center border-4 border-red-700"
                >
                  <div className="w-16 h-16 bg-red-600 rounded-full" />
                </button>
                <button className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center">
                  ↻
                </button>
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Pending Verification */}
        <PhoneFrame title="Pending Verification" active={currentScreen === 'pending-verification'}>
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-24 h-24 bg-yellow-900 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-yellow-400 animate-pulse" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Under Review</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              We're verifying your item listing
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Item details submitted</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-neutral-500 border-t-neutral-300 rounded-full animate-spin" />
                  <span>Verification in progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-neutral-600 rounded-full" />
                  <span className="text-neutral-500">Ready to list</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Edit Listing
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium text-red-400">
                Cancel Submission
              </button>
            </div>

            <p className="text-xs text-neutral-500 text-center mt-6">
              Typically takes 2-4 hours
            </p>
          </div>
        </PhoneFrame>

        {/* Rental Request Received */}
        <PhoneFrame title="Request Received" active={currentScreen === 'request-received'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 bg-blue-950 border-b border-blue-900">
              <h2 className="text-lg font-bold">New Rental Request</h2>
              <p className="text-sm text-blue-200">Decision required</p>
            </div>

            {/* Request Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Timer */}
              <div className="bg-yellow-950 border border-yellow-900 rounded-xl p-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                <div className="flex-1">
                  <div className="font-medium text-yellow-400">Respond within 1 hour</div>
                  <div className="text-xs text-yellow-200">43 minutes remaining</div>
                </div>
              </div>

              {/* Item */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm text-neutral-400 mb-2">Item Requested</div>
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <div>
                    <h3 className="font-bold">Professional Camera</h3>
                    <p className="text-sm text-neutral-400">Feb 23-26 (3 days)</p>
                    <p className="text-sm font-bold mt-1">$135 total</p>
                  </div>
                </div>
              </div>

              {/* Renter Profile */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm text-neutral-400 mb-3">Renter Profile</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-neutral-600 rounded-full" />
                  <div className="flex-1">
                    <div className="font-bold">Sarah Johnson</div>
                    <div className="text-sm text-neutral-400">Member since 2024</div>
                  </div>
                </div>

                {/* Ratings */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Overall Rating</span>
                    <span className="font-medium">⭐ 4.9 (12 reviews)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Reliability</span>
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Communication</span>
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Item Care</span>
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm text-neutral-400 mb-2">Message</div>
                <p className="text-sm">
                  "Hi! I'm planning a photoshoot this weekend and would love to rent your camera. I have experience with professional equipment and will take great care of it."
                </p>
              </div>

              {/* Pickup Method */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm text-neutral-400 mb-2">Pickup Method</div>
                <div className="text-sm">📍 In-person pickup</div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700 space-y-2">
              <button 
                onClick={() => setCurrentScreen('request-approved-lender')}
                className="w-full h-12 bg-green-900 hover:bg-green-800 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Approve Request</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('request-rejected-lender')}
                className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-neutral-650"
              >
                <X className="w-5 h-5" />
                <span>Decline Request</span>
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Request Approved - Lender View */}
        <PhoneFrame title="Request Approved" active={currentScreen === 'request-approved-lender'}>
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Request Approved</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Sarah has been notified
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Rental Period</span>
                <span>Feb 23-26</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Earnings</span>
                <span className="font-bold text-green-400">$135</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Platform fee (10%)</span>
                <span>-$13.50</span>
              </div>
              <div className="border-t border-neutral-600 pt-2 flex justify-between font-bold">
                <span>You Receive</span>
                <span className="text-green-400">$121.50</span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Message Renter</span>
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                View Rental Details
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Request Rejected - Lender View */}
        <PhoneFrame title="Request Declined" active={currentScreen === 'request-rejected-lender'}>
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-24 h-24 bg-neutral-700 rounded-full flex items-center justify-center mb-6">
              <X className="w-12 h-12 text-neutral-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Request Declined</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Sarah has been notified
            </p>

            <div className="w-full space-y-2">
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                View Other Requests
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Back to Dashboard
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Purchase Notification */}
        <PhoneFrame title="Item Sold" active={currentScreen === 'purchase-notification'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 bg-green-950 border-b border-green-900">
              <h2 className="text-lg font-bold">Item Sold!</h2>
              <p className="text-sm text-green-200">Purchase confirmed</p>
            </div>

            {/* Sale Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Item */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">Professional Camera</h3>
                    <p className="text-sm text-neutral-400">Canon EOS R5</p>
                    <p className="text-lg font-bold mt-1 text-green-400">$1,200</p>
                  </div>
                </div>
              </div>

              {/* Buyer */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm text-neutral-400 mb-3">Buyer</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-600 rounded-full" />
                  <div>
                    <div className="font-bold">Mike Thompson</div>
                    <div className="text-sm text-neutral-400">⭐ 4.7 (8 reviews)</div>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm text-neutral-400 mb-3">Earnings Breakdown</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sale Price</span>
                    <span>$1,200</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Platform Fee (5%)</span>
                    <span>-$60</span>
                  </div>
                  <div className="border-t border-neutral-600 pt-2 flex justify-between font-bold">
                    <span>You Receive</span>
                    <span className="text-green-400 text-lg">$1,140</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-950 border border-blue-900 rounded-xl p-4">
                <div className="text-sm font-medium mb-2 text-blue-300">Next Steps</div>
                <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Coordinate pickup with buyer</li>
                  <li>Package item securely</li>
                  <li>Confirm handoff in app</li>
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700 space-y-2">
              <button 
                onClick={() => setCurrentScreen('purchase-chat')}
                className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message Buyer</span>
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                View Transaction
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

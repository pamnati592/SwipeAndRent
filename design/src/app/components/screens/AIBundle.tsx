import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function AIBundle() {
  const [currentScreen, setCurrentScreen] = useState('input');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">04. AI Smart Bundle Flow</h2>
      
      <div className="flex gap-6 flex-wrap">
        {/* AI Input Screen */}
        <PhoneFrame title="AI Planner Input" active={currentScreen === 'input'}>
          <div className="flex flex-col h-full p-6">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Event Planner</h2>
                  <p className="text-sm text-neutral-400">Smart bundle suggestions</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="mb-6">
                <label className="text-sm text-neutral-400 mb-2 block">
                  What are you planning?
                </label>
                <textarea
                  placeholder="e.g., I'm hosting a BBQ party for 20 people this weekend"
                  className="w-full h-32 bg-neutral-700 border-2 border-neutral-600 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-neutral-500"
                  defaultValue=""
                />
              </div>

              {/* Example Prompts */}
              <div className="space-y-2">
                <div className="text-xs text-neutral-400 mb-3">Quick ideas:</div>
                <button className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-left text-sm hover:bg-neutral-650">
                  🏕️ Weekend camping trip
                </button>
                <button className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-left text-sm hover:bg-neutral-650">
                  🎂 Birthday party at home
                </button>
                <button className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-left text-sm hover:bg-neutral-650">
                  📸 Professional photoshoot
                </button>
                <button className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-left text-sm hover:bg-neutral-650">
                  🏠 Home renovation project
                </button>
              </div>
            </div>

            <button 
              onClick={() => setCurrentScreen('loading')}
              className="w-full h-12 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Generate Bundle
            </button>
          </div>
        </PhoneFrame>

        {/* Loading State */}
        <PhoneFrame title="AI Processing" active={currentScreen === 'loading'}>
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="w-12 h-12 text-purple-300" />
            </div>

            <h2 className="text-xl font-bold mb-2">Creating Your Bundle</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Finding the perfect items for your event...
            </p>

            <div className="w-full space-y-2">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-sm">Analyzing your event</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-sm">Finding nearby items</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-neutral-500 border-t-neutral-300 rounded-full animate-spin" />
                <span className="text-sm">Optimizing bundle</span>
              </div>
            </div>

            <button 
              onClick={() => setCurrentScreen('result')}
              className="mt-8 text-sm text-neutral-400 underline"
            >
              Skip to results
            </button>
          </div>
        </PhoneFrame>

        {/* Bundle Result */}
        <PhoneFrame title="AI Bundle Result" active={currentScreen === 'result'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 bg-gradient-to-br from-purple-900 to-blue-900 border-b border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-300" />
                <h2 className="text-lg font-bold">Your BBQ Party Bundle</h2>
              </div>
              <p className="text-sm text-purple-200">5 items recommended</p>
            </div>

            {/* Bundle Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                { name: 'BBQ Grill Set', category: 'Professional grade', price: 35, emoji: '🔥' },
                { name: 'Outdoor Speaker', category: 'Bluetooth 200W', price: 25, emoji: '🔊' },
                { name: 'Folding Tables (2x)', category: '6-person capacity', price: 20, emoji: '🪑' },
                { name: 'Cooler Box', category: '50L capacity', price: 15, emoji: '🧊' },
                { name: 'Party Lights', category: 'LED string lights', price: 10, emoji: '💡' },
              ].map((item, idx) => (
                <div key={idx} className="bg-neutral-700 rounded-xl p-3 border border-neutral-600 flex gap-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-xs text-neutral-400">{item.category}</p>
                    <p className="text-sm font-bold mt-1">${item.price}/day</p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <div className="bg-neutral-700 rounded-xl p-4 mb-3 border border-neutral-600">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-400">Bundle Total (3 days)</span>
                  <span className="font-bold">$315</span>
                </div>
                <div className="flex justify-between text-xs text-green-400">
                  <span>vs. Buying New</span>
                  <span>Save $1,240 (80%)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setCurrentScreen('rent-all')}
                  className="h-11 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg font-medium text-sm hover:opacity-90"
                >
                  Rent All
                </button>
                <button className="h-11 bg-neutral-700 border border-neutral-600 rounded-lg font-medium text-sm hover:bg-neutral-650">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Individual Selection */}
        <PhoneFrame title="Select Individual Items" active={currentScreen === 'select-individual'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-lg font-bold">Customize Bundle</h2>
              <p className="text-sm text-neutral-400">Select items to rent</p>
            </div>

            {/* Items with Checkboxes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[
                { name: 'BBQ Grill Set', price: 35, checked: true },
                { name: 'Outdoor Speaker', price: 25, checked: true },
                { name: 'Folding Tables', price: 20, checked: false },
                { name: 'Cooler Box', price: 15, checked: true },
                { name: 'Party Lights', price: 10, checked: false },
              ].map((item, idx) => (
                <label key={idx} className="bg-neutral-700 rounded-xl p-4 border-2 border-neutral-600 flex items-center gap-3 cursor-pointer hover:border-neutral-500">
                  <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-neutral-400">${item.price}/day</div>
                  </div>
                  <div className="text-sm font-bold">${item.price * 3}</div>
                </label>
              ))}
            </div>

            {/* Action */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-neutral-400">3 items selected</span>
                <span className="font-bold">$225 (3 days)</span>
              </div>
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550">
                Continue with Selected
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Rent All Confirmation */}
        <PhoneFrame title="Bundle Checkout" active={currentScreen === 'rent-all'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-lg font-bold">Confirm Bundle Rental</h2>
              <p className="text-sm text-neutral-400">BBQ Party Bundle</p>
            </div>

            {/* Rental Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Date Selection */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm font-medium mb-3">Rental Period</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-neutral-400 mb-1">Start</div>
                    <div className="text-sm">Feb 23, 2026</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400 mb-1">End</div>
                    <div className="text-sm">Feb 26, 2026</div>
                  </div>
                </div>
              </div>

              {/* Pickup Method */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm font-medium mb-3">Pickup Method</div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="text-sm">Coordinated Pickup (Free)</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">Meet at lender's location</div>
              </div>

              {/* Bundle Summary */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm font-medium mb-3">Bundle Items (5)</div>
                <div className="space-y-2 text-sm">
                  {['BBQ Grill Set', 'Outdoor Speaker', 'Folding Tables', 'Cooler Box', 'Party Lights'].map((item) => (
                    <div key={item} className="flex justify-between text-neutral-400">
                      <span>{item}</span>
                      <span>✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multiple Owners Notice */}
              <div className="bg-yellow-950 border border-yellow-900 rounded-xl p-4">
                <div className="text-sm font-medium mb-1 text-yellow-400">Multiple Owners</div>
                <p className="text-xs text-yellow-200">
                  Items from 3 different owners. You'll coordinate pickup with each.
                </p>
              </div>
            </div>

            {/* Checkout */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <div className="bg-neutral-700 rounded-xl p-4 mb-3 border border-neutral-600">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Subtotal (3 days)</span>
                  <span className="font-medium">$315</span>
                </div>
                <div className="flex justify-between mb-2 text-sm text-neutral-400">
                  <span>Service Fee</span>
                  <span>$15</span>
                </div>
                <div className="border-t border-neutral-600 pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">$330</span>
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('bundle-confirmed')}
                className="w-full h-12 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg font-medium hover:opacity-90"
              >
                Request Bundle Rental
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Bundle Confirmed */}
        <PhoneFrame title="Bundle Requested" active={currentScreen === 'bundle-confirmed'}>
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-purple-300" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Bundle Requested!</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              We've sent requests to all 3 owners
            </p>

            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6 space-y-3">
              <div className="text-sm font-medium mb-2">Request Status</div>
              {[
                { owner: 'John D.', items: '3 items', status: 'pending' },
                { owner: 'Sarah M.', items: '1 item', status: 'pending' },
                { owner: 'Mike R.', items: '1 item', status: 'pending' },
              ].map((req, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{req.owner}</div>
                    <div className="text-xs text-neutral-400">{req.items}</div>
                  </div>
                  <div className="text-xs text-yellow-400">Pending</div>
                </div>
              ))}
            </div>

            <div className="w-full space-y-2">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550">
                View All Requests
              </button>
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                Back to Home
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
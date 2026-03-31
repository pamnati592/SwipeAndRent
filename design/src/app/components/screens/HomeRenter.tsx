import React, { useState } from 'react';
import { Home, Sparkles, Heart, MessageCircle, User, MapPin, SlidersHorizontal, Info } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function HomeRenter() {
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">02. Home Feed (Renter POV)</h2>
      
      <div className="flex gap-6 flex-wrap">
        {/* Main Home Feed */}
        <PhoneFrame title="Main Feed" active={currentScreen === 'home'}>
          <div className="flex flex-col h-full">
            {/* Top Bar with Filters */}
            <div className="px-4 pb-4 space-y-3 bg-neutral-800 border-b border-neutral-700">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-10 bg-neutral-700 border border-neutral-600 rounded-lg px-3 text-sm focus:outline-none"
                  />
                  <p className="text-xs text-neutral-500 mt-1 px-1">
                    Search by city / product
                  </p>
                </div>
                <button className="w-10 h-10 bg-neutral-700 border border-neutral-600 rounded-lg flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2">
                <select className="flex-1 h-10 bg-neutral-700 border border-neutral-600 rounded-lg px-3 text-sm">
                  <option>All Categories</option>
                  <option>Photography</option>
                  <option>Camping</option>
                  <option>Tools</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <input
                  type="range"
                  min="1"
                  max="50"
                  defaultValue="10"
                  className="flex-1"
                />
                <input
                  type="number"
                  defaultValue="10"
                  className="w-16 h-8 bg-neutral-700 border border-neutral-600 rounded px-2 text-sm text-center"
                />
              </div>
            </div>

            {/* Card Feed */}
            <div className="flex-1 relative overflow-hidden">
              {/* Card Stack */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {/* Back Card */}
                <div className="absolute w-full max-w-[320px] h-[480px] bg-neutral-750 rounded-2xl transform scale-95 opacity-50" />
                
                {/* Main Card */}
                <div 
                  onClick={() => setCurrentScreen('card-detail')}
                  className="relative w-full max-w-[320px] h-[480px] bg-neutral-700 rounded-2xl border-2 border-neutral-600 overflow-hidden cursor-pointer hover:border-neutral-500 transition-colors"
                >
                  {/* Image Placeholder */}
                  <div className="h-64 bg-neutral-650 flex items-center justify-center border-b border-neutral-600">
                    <div className="text-6xl text-neutral-600">📷</div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg">Professional Camera</h3>
                      <p className="text-sm text-neutral-400">Canon EOS R5</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold">$45/day</div>
                        <div className="text-sm text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>2.3 km away</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Swipe Indicators */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center">
                      <span className="text-2xl">←</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center">
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="h-20 bg-neutral-800 border-t border-neutral-700 flex items-center justify-around px-4">
              <button className="flex flex-col items-center gap-1 text-neutral-300">
                <Home className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-neutral-500">
                <Sparkles className="w-6 h-6" />
                <span className="text-xs">AI Planner</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-neutral-500">
                <Heart className="w-6 h-6" />
                <span className="text-xs">Wishlist</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-neutral-500">
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs">Chats</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-neutral-500">
                <User className="w-6 h-6" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Swipe Left State */}
        <PhoneFrame title="Swipe Left (Skip)" active={currentScreen === 'swipe-left'}>
          <div className="flex flex-col h-full">
            <div className="px-4 pb-4 space-y-3 bg-neutral-800 border-b border-neutral-700">
              <div className="h-10 bg-neutral-700 rounded-lg flex items-center px-3">
                <span className="text-sm text-neutral-400">Filters...</span>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {/* Card being swiped away */}
                <div className="relative w-full max-w-[320px] h-[480px] bg-neutral-700 rounded-2xl border-2 border-red-900 overflow-hidden transform -rotate-12 -translate-x-32 opacity-50">
                  <div className="h-64 bg-neutral-650" />
                  <div className="absolute inset-0 bg-red-950 bg-opacity-50 flex items-center justify-center">
                    <div className="text-6xl">×</div>
                  </div>
                </div>

                {/* Next card appearing */}
                <div className="absolute w-full max-w-[320px] h-[480px] bg-neutral-700 rounded-2xl border-2 border-neutral-600 overflow-hidden">
                  <div className="h-64 bg-neutral-650 flex items-center justify-center">
                    <div className="text-6xl text-neutral-600">🎮</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Gaming Console</h3>
                    <p className="text-sm text-neutral-400">PlayStation 5</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-20 bg-neutral-800 border-t border-neutral-700" />
          </div>
        </PhoneFrame>

        {/* Swipe Right State */}
        <PhoneFrame title="Swipe Right (Action)" active={currentScreen === 'swipe-right'}>
          <div className="flex flex-col h-full">
            <div className="px-4 pb-4 space-y-3 bg-neutral-800 border-b border-neutral-700">
              <div className="h-10 bg-neutral-700 rounded-lg" />
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {/* Card being swiped */}
                <div className="relative w-full max-w-[320px] h-[480px] bg-neutral-700 rounded-2xl border-2 border-green-900 overflow-hidden transform rotate-12 translate-x-32 opacity-50">
                  <div className="h-64 bg-neutral-650 flex items-center justify-center">
                    <div className="text-6xl text-neutral-600">📷</div>
                  </div>
                  <div className="absolute inset-0 bg-green-950 bg-opacity-50 flex items-center justify-center">
                    <div className="text-6xl">✓</div>
                  </div>
                </div>
              </div>

              {/* Action Sheet Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              
              {/* Bottom Sheet */}
              <div className="absolute bottom-0 left-0 right-0 bg-neutral-800 rounded-t-3xl p-6 space-y-3">
                <div className="w-12 h-1 bg-neutral-600 rounded-full mx-auto mb-4" />
                
                <h3 className="font-bold text-lg mb-4">Professional Camera</h3>

                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="w-full h-14 bg-neutral-700 border-2 border-neutral-600 rounded-xl font-medium hover:bg-neutral-650 transition-colors"
                >
                  Purchase
                </button>

                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="w-full h-14 bg-neutral-700 border-2 border-neutral-600 rounded-xl font-medium hover:bg-neutral-650 transition-colors"
                >
                  Rent
                </button>

                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="w-full h-14 bg-neutral-700 border-2 border-neutral-600 rounded-xl font-medium hover:bg-neutral-650 transition-colors"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>

            <div className="h-20 bg-neutral-800 border-t border-neutral-700" />
          </div>
        </PhoneFrame>

        {/* Card Detail View */}
        <PhoneFrame title="Card Details" active={currentScreen === 'card-detail'}>
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Back Button */}
            <div className="px-4 py-3 flex items-center gap-3">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center"
              >
                ←
              </button>
              <h3 className="font-bold">Item Details</h3>
            </div>

            {/* Image */}
            <div className="h-64 bg-neutral-700 flex items-center justify-center border-y border-neutral-600">
              <div className="text-6xl text-neutral-600">📷</div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 flex-1">
              <div>
                <h2 className="text-xl font-bold">Professional Camera</h2>
                <p className="text-sm text-neutral-400">Canon EOS R5</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">$45/day</div>
                  <div className="text-sm text-neutral-400">2.3 km away</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Description</div>
                <div className="text-sm text-neutral-400 leading-relaxed">
                  Professional full-frame mirrorless camera. Perfect for photography enthusiasts. Includes lens kit and accessories.
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Owner</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-600" />
                  <div>
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-xs text-neutral-400">⭐ 4.8 (23 reviews)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-2 bg-neutral-800 border-t border-neutral-700">
              <button 
                onClick={() => setCurrentScreen('swipe-right')}
                className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550"
              >
                Interested
              </button>
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium"
              >
                Skip
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Home, Sparkles, Heart, MessageCircle, User, Info, MapPin, ArrowRight, RefreshCw } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function SwipeFlow() {
  const [currentScreen, setCurrentScreen] = useState('swipe-main');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">03. Swipe Actions - Tinder-Style Carousel</h2>
      <p className="text-neutral-400 mb-6">Gesture-first interface with stacked cards, swipe interactions, and visual feedback</p>
      
      {/* Section Navigation */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setCurrentScreen('swipe-main')}
          className={`px-4 py-2 rounded text-sm ${currentScreen === 'swipe-main' ? 'bg-neutral-600' : 'bg-neutral-700'}`}
        >
          01_Swipe_Core
        </button>
        <button
          onClick={() => setCurrentScreen('swipe-states')}
          className={`px-4 py-2 rounded text-sm ${currentScreen === 'swipe-states' ? 'bg-neutral-600' : 'bg-neutral-700'}`}
        >
          02_Swipe_States
        </button>
        <button
          onClick={() => setCurrentScreen('swipe-action')}
          className={`px-4 py-2 rounded text-sm ${currentScreen === 'swipe-action' ? 'bg-neutral-600' : 'bg-neutral-700'}`}
        >
          03_Swipe_Right_Action
        </button>
        <button
          onClick={() => setCurrentScreen('end-state')}
          className={`px-4 py-2 rounded text-sm ${currentScreen === 'end-state' ? 'bg-neutral-600' : 'bg-neutral-700'}`}
        >
          04_End_State
        </button>
      </div>

      {/* 01. MAIN SWIPE SCREEN */}
      {currentScreen === 'swipe-main' && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-neutral-200">01. Main Swipe Screen</h3>
          <p className="text-sm text-neutral-400 mb-6">Full-screen stacked card carousel - swipe-first interface</p>
          
          <div className="flex gap-6 flex-wrap">
            {/* Main Swipe Interface */}
            <PhoneFrame title="Main Swipe Interface">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                {/* Card Stack Container */}
                <div className="flex-1 relative p-6 pt-8">
                  {/* Card 3 - Furthest Back */}
                  <div 
                    className="absolute left-8 right-8 top-16 h-[500px] bg-neutral-700 rounded-3xl border-2 border-neutral-650 opacity-30 transform scale-90"
                    style={{ zIndex: 1 }}
                  />

                  {/* Card 2 - Middle */}
                  <div 
                    className="absolute left-6 right-6 top-12 h-[500px] bg-neutral-700 rounded-3xl border-2 border-neutral-600 opacity-60 transform scale-95"
                    style={{ zIndex: 2 }}
                  />

                  {/* Card 1 - Active (Top) */}
                  <div 
                    className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-neutral-600 shadow-2xl"
                    style={{ zIndex: 3 }}
                  >
                    {/* Large Image Placeholder */}
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center border-b-2 border-neutral-600">
                      <div className="text-8xl">📷</div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold">Professional Camera</h3>
                        <p className="text-sm text-neutral-400">Canon EOS R5</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">$45<span className="text-base text-neutral-400">/day</span></div>
                          <div className="text-sm text-neutral-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>2.3 km away</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Swipe Hint Text */}
                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-neutral-500 z-10">
                    ← Swipe left to skip • Swipe right to interact →
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="h-20 bg-neutral-850 border-t border-neutral-700 flex items-center justify-around px-4">
                  <button className="flex flex-col items-center gap-1 text-neutral-300">
                    <Home className="w-6 h-6" />
                    <span className="text-xs">Home</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-neutral-500">
                    <Heart className="w-6 h-6" />
                    <span className="text-xs">Saved</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-neutral-500">
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs">Chat</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-neutral-500">
                    <User className="w-6 h-6" />
                    <span className="text-xs">Profile</span>
                  </button>
                </div>

                {/* Floating AI Button */}
                <button className="absolute top-16 right-6 w-14 h-14 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full shadow-lg flex items-center justify-center z-20">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                </button>
              </div>
            </PhoneFrame>

            {/* With Quick Action Buttons */}
            <PhoneFrame title="Quick Action Alternative">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8">
                  {/* Card Stack */}
                  <div className="absolute left-8 right-8 top-16 h-[500px] bg-neutral-700 rounded-3xl opacity-30 transform scale-90" />
                  <div className="absolute left-6 right-6 top-12 h-[500px] bg-neutral-700 rounded-3xl opacity-60 transform scale-95" />
                  
                  {/* Active Card with Floating Buttons */}
                  <div className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-neutral-600 shadow-2xl">
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center border-b-2 border-neutral-600 relative">
                      <div className="text-8xl">📷</div>

                      {/* Floating Quick Actions on Image */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button className="w-12 h-12 bg-neutral-800 border-2 border-neutral-600 rounded-full flex items-center justify-center hover:bg-neutral-750 shadow-lg">
                          <span className="text-xl">❤️</span>
                        </button>
                        <button className="w-12 h-12 bg-neutral-800 border-2 border-neutral-600 rounded-full flex items-center justify-center hover:bg-neutral-750 shadow-lg">
                          <span className="text-xl">🛒</span>
                        </button>
                        <button className="w-12 h-12 bg-neutral-800 border-2 border-neutral-600 rounded-full flex items-center justify-center hover:bg-neutral-750 shadow-lg">
                          <span className="text-xl">📅</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-xl font-bold">Professional Camera</h3>
                      <div className="text-2xl font-bold">$45<span className="text-base text-neutral-400">/day</span></div>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-neutral-500 z-10">
                    Swipe gesture is still primary interaction
                  </div>
                </div>

                {/* Note Badge */}
                <div className="absolute top-16 left-6 bg-yellow-900 border border-yellow-800 rounded-lg px-3 py-2 z-20 text-xs max-w-[180px]">
                  <div className="font-medium text-yellow-300">Alternative UI</div>
                  <div className="text-yellow-200 text-xs">Buttons are secondary</div>
                </div>
              </div>
            </PhoneFrame>

            {/* Card Layering Explanation */}
            <PhoneFrame title="3-Card Stack System">
              <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-8">
                <h3 className="text-lg font-bold mb-4">Card Layering</h3>
                
                <div className="relative w-64 h-80 mb-8">
                  {/* Card 3 */}
                  <div className="absolute inset-0 bg-neutral-700 rounded-2xl border-2 border-neutral-600 transform translate-y-4 scale-90 opacity-40">
                    <div className="p-4 text-center">
                      <div className="text-sm text-neutral-400">Card 3</div>
                      <div className="text-xs text-neutral-500 mt-1">scale: 0.90</div>
                      <div className="text-xs text-neutral-500">opacity: 0.30</div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="absolute inset-0 bg-neutral-700 rounded-2xl border-2 border-neutral-600 transform translate-y-2 scale-95 opacity-70">
                    <div className="p-4 text-center">
                      <div className="text-sm text-neutral-300">Card 2</div>
                      <div className="text-xs text-neutral-400 mt-1">scale: 0.95</div>
                      <div className="text-xs text-neutral-400">opacity: 0.60</div>
                    </div>
                  </div>

                  {/* Card 1 - Active */}
                  <div className="absolute inset-0 bg-neutral-750 rounded-2xl border-2 border-neutral-500 shadow-2xl">
                    <div className="p-4 text-center">
                      <div className="text-base font-bold">Card 1</div>
                      <div className="text-sm text-green-400 mt-1">ACTIVE</div>
                      <div className="text-xs text-neutral-400 mt-1">scale: 1.00</div>
                      <div className="text-xs text-neutral-400">opacity: 1.00</div>
                      <div className="text-xs text-green-400 mt-2">← Swipeable →</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 text-center max-w-xs">
                  Visual depth creates intuitive stack metaphor and shows content pipeline
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      )}

      {/* 02. SWIPE INTERACTION STATES */}
      {currentScreen === 'swipe-states' && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-neutral-200">02. Swipe Interaction States</h3>
          <p className="text-sm text-neutral-400 mb-6">Rotation, labels, and motion feedback during gesture</p>
          
          <div className="flex gap-6 flex-wrap">
            {/* A. Neutral State */}
            <PhoneFrame title="A. Neutral (Centered)">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8">
                  <div className="absolute left-8 right-8 top-16 h-[500px] bg-neutral-700 rounded-3xl opacity-30 transform scale-90" />
                  <div className="absolute left-6 right-6 top-12 h-[500px] bg-neutral-700 rounded-3xl opacity-60 transform scale-95" />
                  
                  {/* Centered Card */}
                  <div className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-neutral-600 shadow-2xl">
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center">
                      <div className="text-8xl">📷</div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold">Professional Camera</h3>
                      <div className="text-2xl font-bold mt-2">$45<span className="text-base text-neutral-400">/day</span></div>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-neutral-500">
                    Ready to swipe
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-blue-900 border border-blue-800 rounded-lg px-3 py-1 text-xs text-blue-300">
                  State: Neutral
                </div>
              </div>
            </PhoneFrame>

            {/* B. Swipe Left In Progress */}
            <PhoneFrame title="B. Swipe Left (Skip)">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8">
                  {/* Next cards moving forward */}
                  <div className="absolute left-7 right-7 top-14 h-[500px] bg-neutral-700 rounded-3xl opacity-50 transform scale-92" />
                  <div className="absolute left-5 right-5 top-10 h-[500px] bg-neutral-700 rounded-3xl opacity-80 transform scale-97" />
                  
                  {/* Card Rotating Left */}
                  <div 
                    className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-red-900 shadow-2xl"
                    style={{ 
                      transform: 'rotate(-15deg) translateX(-80px) translateY(20px)',
                      opacity: 0.7
                    }}
                  >
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center">
                      <div className="text-8xl">📷</div>
                    </div>

                    {/* RED SKIP OVERLAY */}
                    <div className="absolute inset-0 bg-red-950 bg-opacity-60 rounded-3xl flex items-center justify-center">
                      <div className="transform rotate-[15deg]">
                        <div className="text-6xl font-bold text-red-400 border-4 border-red-400 px-8 py-4 rounded-2xl">
                          SKIP
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-red-400">
                    Swiping left...
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-red-900 border border-red-800 rounded-lg px-3 py-1 text-xs text-red-300">
                  ← Swipe in progress
                </div>
              </div>
            </PhoneFrame>

            {/* C. Swipe Right In Progress */}
            <PhoneFrame title="C. Swipe Right (Interested)">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8">
                  {/* Next cards moving forward */}
                  <div className="absolute left-7 right-7 top-14 h-[500px] bg-neutral-700 rounded-3xl opacity-50 transform scale-92" />
                  <div className="absolute left-5 right-5 top-10 h-[500px] bg-neutral-700 rounded-3xl opacity-80 transform scale-97" />
                  
                  {/* Card Rotating Right */}
                  <div 
                    className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-green-900 shadow-2xl"
                    style={{ 
                      transform: 'rotate(15deg) translateX(80px) translateY(20px)',
                      opacity: 0.7
                    }}
                  >
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center">
                      <div className="text-8xl">📷</div>
                    </div>

                    {/* GREEN INTERESTED OVERLAY */}
                    <div className="absolute inset-0 bg-green-950 bg-opacity-60 rounded-3xl flex items-center justify-center">
                      <div className="transform rotate-[-15deg]">
                        <div className="text-5xl font-bold text-green-400 border-4 border-green-400 px-6 py-3 rounded-2xl">
                          INTERESTED
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-green-400">
                    Swiping right...
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-green-900 border border-green-800 rounded-lg px-3 py-1 text-xs text-green-300">
                  Swipe in progress →
                </div>
              </div>
            </PhoneFrame>

            {/* D. Card Dismissed */}
            <PhoneFrame title="D. Card Dismissed">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8">
                  {/* New stack positions */}
                  <div className="absolute left-8 right-8 top-16 h-[500px] bg-neutral-700 rounded-3xl opacity-30 transform scale-90" />
                  <div className="absolute left-6 right-6 top-12 h-[500px] bg-neutral-700 rounded-3xl opacity-60 transform scale-95" />
                  
                  {/* Card flying off */}
                  <div 
                    className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-red-900"
                    style={{ 
                      transform: 'rotate(-25deg) translateX(-400px) translateY(100px)',
                      opacity: 0
                    }}
                  />

                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-neutral-500">
                    Card dismissed
                  </div>
                </div>
              </div>
            </PhoneFrame>

            {/* E. Next Card Revealed */}
            <PhoneFrame title="E. Next Card Active">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8">
                  {/* New stack */}
                  <div className="absolute left-8 right-8 top-16 h-[500px] bg-neutral-700 rounded-3xl opacity-30 transform scale-90" />
                  <div className="absolute left-6 right-6 top-12 h-[500px] bg-neutral-700 rounded-3xl opacity-60 transform scale-95" />
                  
                  {/* New Active Card */}
                  <div className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-neutral-600 shadow-2xl">
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center border-b-2 border-neutral-600">
                      <div className="text-8xl">🎮</div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-xl font-bold">Gaming Console</h3>
                      <div className="text-2xl font-bold">$35<span className="text-base text-neutral-400">/day</span></div>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-neutral-500">
                    ← Swipe left to skip • Swipe right to interact →
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-blue-900 border border-blue-800 rounded-lg px-3 py-1 text-xs text-blue-300">
                  New card ready
                </div>
              </div>
            </PhoneFrame>

            {/* Gesture Flow Diagram */}
            <PhoneFrame title="Gesture Flow">
              <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
                <h3 className="text-lg font-bold mb-8">Swipe Sequence</h3>

                <div className="space-y-4 w-full max-w-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-24 bg-neutral-700 rounded-xl border-2 border-neutral-600 flex items-center justify-center text-2xl">
                      📷
                    </div>
                    <div>
                      <div className="font-bold text-sm">1. Centered</div>
                      <div className="text-xs text-neutral-400">Ready to swipe</div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-24 bg-neutral-700 rounded-xl border-2 border-red-800 flex items-center justify-center text-2xl transform -rotate-12">
                      📷
                    </div>
                    <div>
                      <div className="font-bold text-sm">2. Gesture Active</div>
                      <div className="text-xs text-neutral-400">Rotation + label</div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-24 bg-neutral-700 rounded-xl opacity-30 flex items-center justify-center text-2xl">
                      📷
                    </div>
                    <div>
                      <div className="font-bold text-sm">3. Dismissed</div>
                      <div className="text-xs text-neutral-400">Flies off screen</div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-24 bg-neutral-700 rounded-xl border-2 border-neutral-600 flex items-center justify-center text-2xl">
                      🎮
                    </div>
                    <div>
                      <div className="font-bold text-sm">4. Next Card</div>
                      <div className="text-xs text-neutral-400">New item active</div>
                    </div>
                  </div>
                </div>
              </div>
            </PhoneFrame>

            {/* Swipe Threshold Zones */}
            <PhoneFrame title="Swipe Zones">
              <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
                <h3 className="text-lg font-bold mb-6">Gesture Recognition</h3>

                <div className="relative w-full max-w-[300px] h-[400px] mb-6">
                  {/* Left Zone */}
                  <div className="absolute left-0 top-0 bottom-0 w-[30%] bg-red-950 bg-opacity-30 border-2 border-red-800 border-dashed rounded-l-2xl flex items-center justify-center">
                    <div className="text-center transform -rotate-90">
                      <div className="text-sm font-bold text-red-400">SKIP</div>
                      <div className="text-xs text-red-300 mt-1">← 30%</div>
                    </div>
                  </div>

                  {/* Center Zone */}
                  <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <div className="text-xs text-neutral-400">Neutral</div>
                    </div>
                  </div>

                  {/* Right Zone */}
                  <div className="absolute right-0 top-0 bottom-0 w-[30%] bg-green-950 bg-opacity-30 border-2 border-green-800 border-dashed rounded-r-2xl flex items-center justify-center">
                    <div className="text-center transform rotate-90">
                      <div className="text-sm font-bold text-green-400">LIKE</div>
                      <div className="text-xs text-green-300 mt-1">30% →</div>
                    </div>
                  </div>

                  {/* Arrows */}
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-2xl text-red-400">←</div>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-2xl text-green-400">→</div>
                </div>

                <div className="text-xs text-neutral-500 text-center max-w-xs space-y-1">
                  <div>Threshold: 30% of screen width</div>
                  <div>Feedback: Immediate on drag</div>
                  <div>Trigger: Release in zone</div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      )}

      {/* 03. SWIPE RIGHT TO RENTER CHAT */}
      {currentScreen === 'swipe-action' && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-neutral-200">03. Swipe Right → Rent → Chat with Lender</h3>
          <p className="text-sm text-neutral-400 mb-6">Complete flow from swipe gesture to renter-lender communication</p>
          
          <div className="flex gap-6 flex-wrap">
            {/* Frame 1: Swipe Right Complete */}
            <PhoneFrame title="1. Swipe Right Complete">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8">
                  <div className="absolute left-8 right-8 top-16 h-[500px] bg-neutral-700 rounded-3xl opacity-30 transform scale-90" />
                  <div className="absolute left-6 right-6 top-12 h-[500px] bg-neutral-700 rounded-3xl opacity-60 transform scale-95" />
                  
                  <div 
                    className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl border-2 border-green-900 shadow-2xl"
                    style={{ 
                      transform: 'rotate(15deg) translateX(80px) translateY(20px)',
                      opacity: 0.7
                    }}
                  >
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center">
                      <div className="text-8xl">📷</div>
                    </div>
                    <div className="absolute inset-0 bg-green-950 bg-opacity-60 rounded-3xl flex items-center justify-center">
                      <div className="text-5xl font-bold text-green-400 border-4 border-green-400 px-6 py-3 rounded-2xl transform rotate-[-15deg]">
                        INTERESTED
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-green-900 border border-green-800 rounded-lg px-3 py-1 text-xs text-green-300">
                  Swipe complete →
                </div>
              </div>
            </PhoneFrame>

            {/* Frame 2: Action Sheet */}
            <PhoneFrame title="2. Select Action">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                <div className="flex-1 relative p-6 pt-8 opacity-40">
                  <div className="absolute left-8 right-8 top-16 h-[500px] bg-neutral-700 rounded-3xl opacity-20" />
                  <div className="absolute left-6 right-6 top-12 h-[500px] bg-neutral-700 rounded-3xl opacity-40" />
                  <div className="absolute left-4 right-4 top-8 h-[500px] bg-neutral-750 rounded-3xl">
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center">
                      <div className="text-8xl">📷</div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

                <div className="absolute bottom-0 left-0 right-0 bg-neutral-800 rounded-t-3xl p-6 z-20">
                  <div className="w-12 h-1 bg-neutral-600 rounded-full mx-auto mb-6" />
                  
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-lg mb-1">Professional Camera</h3>
                    <p className="text-sm text-neutral-400">$45/day · 2.3 km away</p>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full h-14 bg-neutral-700 border-2 border-neutral-600 rounded-xl font-medium flex items-center justify-center gap-3">
                      <span className="text-2xl">💰</span>
                      <span>Purchase</span>
                    </button>
                    <button className="w-full h-14 bg-neutral-700 border-2 border-green-900 rounded-xl font-medium flex items-center justify-center gap-3">
                      <span className="text-2xl">📅</span>
                      <span>Rent</span>
                    </button>
                    <button className="w-full h-14 bg-neutral-700 border-2 border-neutral-600 rounded-xl font-medium flex items-center justify-center gap-3">
                      <span className="text-2xl">❤️</span>
                      <span>Wishlist</span>
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-blue-900 border border-blue-800 rounded-lg px-3 py-2 text-xs text-blue-300 max-w-[140px] z-30">
                  User selects "Rent" →
                </div>
              </div>
            </PhoneFrame>

            {/* Frame 3: Select Dates */}
            <PhoneFrame title="3. Select Dates">
              <div className="flex flex-col h-full bg-neutral-850">
                <div className="px-4 py-4 border-b border-neutral-700">
                  <h2 className="text-xl font-bold">Select Rental Period</h2>
                  <p className="text-sm text-neutral-400">Professional Camera - $45/day</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-4">
                    <div className="text-center text-sm mb-4 font-medium">February 2026</div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-xs text-neutral-400">{day}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }, (_, i) => (
                        <button
                          key={i}
                          className={`aspect-square ${
                            i === 22 || i === 23 || i === 24 || i === 25
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
                      <span className="text-neutral-400">Start</span>
                      <span>Feb 23</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-neutral-400">End</span>
                      <span>Feb 26</span>
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

            {/* Frame 4: Add Message */}
            <PhoneFrame title="4. Add Message">
              <div className="flex flex-col h-full bg-neutral-850 p-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Message to Lender</h2>
                  <p className="text-sm text-neutral-400 mb-6">Add any questions or requests (optional)</p>

                  <div className="mb-6">
                    <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                      <div className="text-xs text-neutral-400 mb-2">Pickup Location</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📍</span>
                        <span className="text-sm">Meet at lender's location</span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">2.3 km away · Free</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-neutral-400 mb-2 block">Your Message (Optional)</label>
                    <textarea
                      placeholder="Any questions or special requests..."
                      className="w-full h-24 bg-neutral-700 border border-neutral-600 rounded-xl p-3 text-sm resize-none"
                    />
                  </div>
                </div>

                <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium mt-4">
                  Submit Rental Request
                </button>
              </div>
            </PhoneFrame>

            {/* Frame 5: Request Pending */}
            <PhoneFrame title="5. Request Pending">
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
                      <span>Feb 23-26</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total</span>
                      <span className="font-bold">$135</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 text-center">
                  Lenders typically respond within 2 hours
                </div>
              </div>
            </PhoneFrame>

            {/* Frame 6: Request Approved */}
            <PhoneFrame title="6. Request Approved!">
              <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
                <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <div className="text-5xl">✓</div>
                </div>

                <h2 className="text-2xl font-bold mb-2">Request Approved!</h2>
                <p className="text-sm text-neutral-400 text-center mb-8">
                  Your rental has been confirmed
                </p>

                <div className="w-full space-y-3">
                  <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat with Lender</span>
                  </button>
                  <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                    Add to Calendar
                  </button>
                  <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                    View Details
                  </button>
                </div>

                <div className="absolute top-4 left-4 bg-blue-900 border border-blue-800 rounded-lg px-3 py-2 text-xs text-blue-300 max-w-[160px]">
                  Tap "Chat with Lender" →
                </div>
              </div>
            </PhoneFrame>

            {/* Frame 7: Renter Chat with Lender */}
            <PhoneFrame title="7. Renter ↔ Lender Chat">
              <div className="flex flex-col h-full bg-neutral-850">
                {/* Chat Header */}
                <div className="px-4 py-3 bg-neutral-800 border-b border-neutral-700 flex items-center gap-3">
                  <button className="w-8 h-8 flex items-center justify-center text-xl">←</button>
                  <div className="w-10 h-10 bg-neutral-600 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium">John Doe (Lender)</div>
                    <div className="text-xs text-neutral-400">Logistics Only</div>
                  </div>
                  <div className="text-xs text-green-400">● Online</div>
                </div>

                {/* Rental Banner */}
                <div className="bg-neutral-700 border-b border-neutral-600 p-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-650 rounded-lg flex items-center justify-center text-xl">
                    📷
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">Professional Camera</div>
                    <div className="text-xs text-neutral-400">Feb 23-26 · Pickup</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div className="text-center text-xs text-neutral-500 mb-4">
                    Chat limited to logistics coordination
                  </div>

                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-neutral-600 rounded-full flex-shrink-0" />
                    <div>
                      <div className="bg-neutral-700 rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                        <p className="text-sm">Hi! Thanks for renting. When would you like to pick it up?</p>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 ml-1">10:23 AM</div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <div>
                      <div className="bg-neutral-600 rounded-2xl rounded-tr-sm p-3 max-w-[70%]">
                        <p className="text-sm">Tomorrow at 2 PM works for me. Where should I meet you?</p>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 mr-1 text-right">10:25 AM</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-neutral-600 rounded-full flex-shrink-0" />
                    <div>
                      <div className="bg-neutral-700 rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                        <p className="text-sm">Perfect! I'm at 123 Main St. I'll be home 1-4 PM.</p>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 ml-1">10:26 AM</div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <div>
                      <div className="bg-neutral-600 rounded-2xl rounded-tr-sm p-3 max-w-[70%]">
                        <p className="text-sm">Great! See you tomorrow at 2 PM. Thanks!</p>
                      </div>
                      <div className="text-xs text-neutral-500 mt-1 mr-1 text-right">10:27 AM</div>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-neutral-800 border-t border-neutral-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Message..."
                      className="flex-1 h-10 bg-neutral-700 border border-neutral-600 rounded-full px-4 text-sm"
                    />
                    <button className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center text-lg">
                      →
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-green-900 border border-green-800 rounded-lg px-3 py-2 text-xs text-green-300 max-w-[150px] z-10">
                  Complete Flow:<br/>Swipe → Rent → Chat ✓
                </div>
              </div>
            </PhoneFrame>

            {/* Flow Diagram */}
            <PhoneFrame title="Complete Journey">
              <div className="flex flex-col items-center justify-center h-full bg-neutral-850 p-6">
                <h3 className="text-lg font-bold mb-6">Swipe to Chat Flow</h3>

                <div className="space-y-3 w-full max-w-xs">
                  <div className="bg-neutral-700 rounded-lg p-3 border-2 border-green-900">
                    <div className="text-sm font-bold mb-1">1. Swipe Right</div>
                    <div className="text-xs text-neutral-400">Show interest</div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-3 border-2 border-neutral-600">
                    <div className="text-sm font-bold mb-1">2. Action Sheet</div>
                    <div className="text-xs text-neutral-400">Purchase / Rent / Wishlist</div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-3 border-2 border-neutral-600">
                    <div className="text-sm font-bold mb-1">3. Select Rent</div>
                    <div className="text-xs text-neutral-400">Choose dates</div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-3 border-2 border-neutral-600">
                    <div className="text-sm font-bold mb-1">4. Add Message</div>
                    <div className="text-xs text-neutral-400">Submit request</div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-3 border-2 border-neutral-600">
                    <div className="text-sm font-bold mb-1">5. Wait for Approval</div>
                    <div className="text-xs text-neutral-400">Lender reviews</div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-3 border-2 border-neutral-600">
                    <div className="text-sm font-bold mb-1">6. Approved</div>
                    <div className="text-xs text-neutral-400">Rental confirmed</div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-neutral-500 transform rotate-90" />
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-3 border-2 border-blue-900">
                    <div className="text-sm font-bold mb-1 text-blue-400">7. Chat with Lender</div>
                    <div className="text-xs text-neutral-400">Coordinate logistics</div>
                  </div>
                </div>

                <div className="mt-6 text-xs text-neutral-500 text-center max-w-xs">
                  Natural progression from swipe gesture to renter-lender communication
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      )}

      {/* 04. END STATE */}
      {currentScreen === 'end-state' && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-neutral-200">04. Empty / End State</h3>
          <p className="text-sm text-neutral-400 mb-6">No more items - options to continue exploring</p>
          
          <div className="flex gap-6 flex-wrap">
            {/* Empty State */}
            <PhoneFrame title="No More Items">
              <div className="flex flex-col h-full bg-neutral-850 relative">
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="w-32 h-32 bg-neutral-700 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-neutral-600">
                    <div className="text-6xl">📭</div>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 text-center">You're all caught up!</h2>
                  <p className="text-sm text-neutral-400 text-center mb-8 max-w-xs">
                    No more items within 10 km
                  </p>

                  <div className="w-full max-w-xs space-y-3">
                    <button className="w-full h-14 bg-neutral-700 border-2 border-neutral-600 rounded-xl font-medium flex items-center justify-center gap-3">
                      <MapPin className="w-5 h-5" />
                      <span>Expand Search Radius</span>
                    </button>

                    <button className="w-full h-14 bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl font-medium flex items-center justify-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-300" />
                      <span>Try AI Planner</span>
                    </button>

                    <button className="w-full h-14 bg-neutral-700 border-2 border-neutral-600 rounded-xl font-medium flex items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5" />
                      <span>Refresh Feed</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="h-20 bg-neutral-850 border-t border-neutral-700" />
              </div>
            </PhoneFrame>

            {/* Expand Radius */}
            <PhoneFrame title="Expand Radius">
              <div className="flex flex-col h-full bg-neutral-850 p-6 pt-8">
                <h2 className="text-xl font-bold mb-6">Expand Search Area</h2>

                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
                  <div className="text-sm text-neutral-400 mb-2">Current Radius</div>
                  <div className="text-2xl font-bold">10 km</div>
                  <div className="text-xs text-neutral-500 mt-1">23 items viewed</div>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">25 km</span>
                      <span className="text-sm text-neutral-400">~150 items</span>
                    </div>
                    <div className="text-xs text-neutral-500">Recommended</div>
                  </button>

                  <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">50 km</span>
                      <span className="text-sm text-neutral-400">~400 items</span>
                    </div>
                    <div className="text-xs text-neutral-500">Wider area</div>
                  </button>

                  <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-xl text-left">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">100 km</span>
                      <span className="text-sm text-neutral-400">~800 items</span>
                    </div>
                    <div className="text-xs text-neutral-500">Maximum</div>
                  </button>
                </div>

                <div className="flex-1" />

                <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium mb-2">
                  Apply New Radius
                </button>
                <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                  Cancel
                </button>
              </div>
            </PhoneFrame>

            {/* New Items Found */}
            <PhoneFrame title="New Items Found">
              <div className="flex flex-col h-full bg-neutral-850 relative overflow-hidden">
                {/* Success Toast */}
                <div className="absolute top-16 left-4 right-4 bg-green-900 border border-green-800 rounded-xl p-4 shadow-lg z-30 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-xl">✓</div>
                  <div>
                    <div className="font-medium text-green-300">Radius expanded to 25 km</div>
                    <div className="text-xs text-green-200">142 new items found</div>
                  </div>
                </div>

                <div className="flex-1 relative p-6 pt-28">
                  <div className="absolute left-8 right-8 top-32 h-[500px] bg-neutral-700 rounded-3xl opacity-30 transform scale-90" />
                  <div className="absolute left-6 right-6 top-28 h-[500px] bg-neutral-700 rounded-3xl opacity-60 transform scale-95" />
                  
                  <div className="absolute left-4 right-4 top-24 h-[500px] bg-neutral-750 rounded-3xl border-2 border-neutral-600 shadow-2xl">
                    <div className="h-[320px] bg-neutral-700 rounded-t-3xl flex items-center justify-center">
                      <div className="text-8xl">⛺</div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-xl font-bold">Camping Tent</h3>
                      <div className="text-2xl font-bold">$25<span className="text-base text-neutral-400">/day</span></div>
                      <div className="text-sm text-neutral-400">📍 18.5 km away</div>
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 bottom-4 text-center text-sm text-neutral-500">
                    ← Swipe left to skip • Swipe right to interact →
                  </div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      )}
    </div>
  );
}
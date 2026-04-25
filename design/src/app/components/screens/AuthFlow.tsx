import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { Button } from '../ui/button';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function AuthFlow() {
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">01. Authentication Flow</h2>
      
      <div className="flex gap-6 flex-wrap">
        {/* Login / Sign Up Screen */}
        <PhoneFrame title="1. Login / Sign Up" active={currentScreen === 'login'}>
          <div className="flex flex-col items-center justify-between h-full py-8 px-6">
            <div className="w-full flex flex-col items-center">
              {/* Logo */}
              <div className="w-20 h-20 bg-neutral-600 rounded-2xl mb-8 flex items-center justify-center">
                <div className="text-2xl font-bold text-neutral-400">S&R</div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2 text-center">Welcome</h1>
              <p className="text-sm text-neutral-400 mb-8 text-center">
                Sign in to continue
              </p>
            </div>

            <div className="w-full space-y-3">
              {/* Social Login Buttons */}
              <button className="w-full h-12 bg-neutral-700 border-2 border-neutral-600 rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-650 transition-colors">
                <div className="w-5 h-5 bg-neutral-500 rounded-full" />
                <span className="text-sm">Continue with Google</span>
              </button>

              <button className="w-full h-12 bg-neutral-700 border-2 border-neutral-600 rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-650 transition-colors">
                <div className="w-5 h-5 bg-neutral-500 rounded-full" />
                <span className="text-sm">Continue with Apple</span>
              </button>

              <button className="w-full h-12 bg-neutral-700 border-2 border-neutral-600 rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-650 transition-colors">
                <div className="w-5 h-5 bg-neutral-500 rounded-full" />
                <span className="text-sm">Continue with Facebook</span>
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-neutral-800 px-2 text-neutral-400">OR</span>
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('biometric')}
                className="w-full h-12 bg-neutral-700 border-2 border-neutral-600 rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-650 transition-colors"
              >
                <span className="text-sm">Continue with Email</span>
              </button>

              <button className="w-full h-12 border-2 border-neutral-600 rounded-lg flex items-center justify-center gap-3 hover:bg-neutral-700 transition-colors">
                <span className="text-sm text-neutral-400">Continue as Guest</span>
              </button>
            </div>

            <p className="text-xs text-neutral-500 text-center mt-4">
              By continuing, you agree to our Terms & Privacy
            </p>
          </div>
        </PhoneFrame>

        {/* Biometric Verification */}
        <PhoneFrame title="2. Biometric Verification" active={currentScreen === 'biometric'}>
          <div className="flex flex-col items-center justify-center h-full py-8 px-6">
            <div className="flex flex-col items-center">
              {/* Biometric Icon */}
              <div className="w-24 h-24 bg-neutral-700 rounded-full mb-6 flex items-center justify-center">
                <div className="w-12 h-16 border-4 border-neutral-500 rounded-full" />
              </div>
              
              <h2 className="text-xl font-bold mb-2">Verify Your Identity</h2>
              <p className="text-sm text-neutral-400 text-center mb-8">
                Use Face ID or Touch ID to continue
              </p>

              <button 
                onClick={() => setCurrentScreen('biometric-success')}
                className="px-6 py-3 bg-neutral-700 border-2 border-neutral-600 rounded-lg hover:bg-neutral-650 transition-colors"
              >
                Authenticate
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Biometric Success */}
        <PhoneFrame title="2b. Success State" active={currentScreen === 'biometric-success'}>
          <div className="flex flex-col items-center justify-center h-full py-8 px-6">
            <div className="flex flex-col items-center">
              {/* Success Icon */}
              <div className="w-24 h-24 bg-neutral-700 rounded-full mb-6 flex items-center justify-center">
                <Check className="w-12 h-12 text-neutral-300" />
              </div>
              
              <h2 className="text-xl font-bold mb-2">Verified!</h2>
              <p className="text-sm text-neutral-400 text-center mb-8">
                Identity confirmed
              </p>

              <button 
                onClick={() => setCurrentScreen('onboarding-1')}
                className="px-6 py-3 bg-neutral-600 rounded-lg hover:bg-neutral-550 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Onboarding - Step 1: Role Selection */}
        <PhoneFrame title="3. Onboarding - Role" active={currentScreen === 'onboarding-1'}>
          <div className="flex flex-col h-full py-8 px-6">
            {/* Progress Indicators */}
            <div className="flex gap-1 mb-8">
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
            </div>

            <h2 className="text-xl font-bold mb-2">What brings you here?</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Select your primary interest
            </p>

            <div className="space-y-3 flex-1">
              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-lg text-left hover:border-neutral-500 transition-colors">
                <div className="font-bold mb-1">I want to Rent</div>
                <div className="text-xs text-neutral-400">Borrow items from others</div>
              </button>

              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-lg text-left hover:border-neutral-500 transition-colors">
                <div className="font-bold mb-1">I want to Lend</div>
                <div className="text-xs text-neutral-400">Share my items with others</div>
              </button>

              <button className="w-full p-4 bg-neutral-700 border-2 border-neutral-600 rounded-lg text-left hover:border-neutral-500 transition-colors">
                <div className="font-bold mb-1">Both</div>
                <div className="text-xs text-neutral-400">Rent and lend items</div>
              </button>

              <p className="text-xs text-neutral-500 text-center pt-2">
                Preferences can be changed later in Settings.
              </p>
            </div>

            <button 
              onClick={() => setCurrentScreen('onboarding-2')}
              className="w-full h-12 bg-neutral-600 rounded-lg hover:bg-neutral-550 transition-colors mb-2"
            >
              Continue
            </button>
            <button 
              onClick={() => setCurrentScreen('onboarding-4')}
              className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg hover:bg-neutral-650 transition-colors text-neutral-400"
            >
              Skip
            </button>
          </div>
        </PhoneFrame>

        {/* Onboarding - Step 2: Location */}
        <PhoneFrame title="3b. Onboarding - Location" active={currentScreen === 'onboarding-2'}>
          <div className="flex flex-col h-full py-8 px-6">
            {/* Progress Indicators */}
            <div className="flex gap-1 mb-8">
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
            </div>

            <h2 className="text-xl font-bold mb-2">Where are you located?</h2>
            <p className="text-sm text-neutral-400 mb-6">
              We'll show items near you
            </p>

            <div className="space-y-4 flex-1">
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">City</label>
                <input 
                  type="text" 
                  placeholder="Enter your city"
                  className="w-full h-12 bg-neutral-700 border-2 border-neutral-600 rounded-lg px-4 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <button className="w-full h-12 bg-neutral-700 border-2 border-neutral-600 rounded-lg flex items-center justify-center gap-2 hover:bg-neutral-650 transition-colors">
                <div className="w-5 h-5 bg-neutral-500 rounded-full" />
                <span className="text-sm">Use Current Location</span>
              </button>
            </div>

            <button 
              onClick={() => setCurrentScreen('onboarding-3')}
              className="w-full h-12 bg-neutral-600 rounded-lg hover:bg-neutral-550 transition-colors"
            >
              Continue
            </button>
          </div>
        </PhoneFrame>

        {/* Onboarding - Step 3: Interests */}
        <PhoneFrame title="3c. Onboarding - Interests" active={currentScreen === 'onboarding-3'}>
          <div className="flex flex-col h-full py-8 px-6">
            {/* Progress Indicators */}
            <div className="flex gap-1 mb-8">
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
            </div>

            <h2 className="text-xl font-bold mb-2">What are you interested in?</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Select at least 3 categories
            </p>

            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
              {['Photography', 'Camping', 'Sports', 'Tools', 'Electronics', 'Gaming', 'Music', 'Outdoor'].map((interest) => (
                <button
                  key={interest}
                  className="h-20 bg-neutral-700 border-2 border-neutral-600 rounded-lg hover:border-neutral-500 transition-colors flex items-center justify-center"
                >
                  <span className="text-sm">{interest}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentScreen('onboarding-4')}
              className="w-full h-12 bg-neutral-600 rounded-lg hover:bg-neutral-550 transition-colors mt-4"
            >
              Continue
            </button>
          </div>
        </PhoneFrame>

        {/* Onboarding - Step 4: Profile Photo */}
        <PhoneFrame title="3d. Onboarding - Photo" active={currentScreen === 'onboarding-4'}>
          <div className="flex flex-col h-full py-8 px-6">
            {/* Progress Indicators */}
            <div className="flex gap-1 mb-8">
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-700 rounded" />
            </div>

            <h2 className="text-xl font-bold mb-2">Add a profile photo</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Help others recognize you
            </p>

            <div className="flex flex-col items-center flex-1 justify-center">
              <div className="w-40 h-40 bg-neutral-700 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center mb-6">
                <div className="text-4xl text-neutral-500">+</div>
              </div>

              <button className="px-6 py-3 bg-neutral-700 border-2 border-neutral-600 rounded-lg hover:bg-neutral-650 transition-colors mb-3">
                Take Photo
              </button>

              <button className="px-6 py-3 bg-neutral-700 border-2 border-neutral-600 rounded-lg hover:bg-neutral-650 transition-colors">
                Choose from Library
              </button>
            </div>

            <button 
              onClick={() => setCurrentScreen('onboarding-5')}
              className="w-full h-12 bg-neutral-600 rounded-lg hover:bg-neutral-550 transition-colors"
            >
              Continue
            </button>
          </div>
        </PhoneFrame>

        {/* Onboarding - Step 5: Phone Number */}
        <PhoneFrame title="3e. Onboarding - Phone" active={currentScreen === 'onboarding-5'}>
          <div className="flex flex-col h-full py-8 px-6">
            {/* Progress Indicators */}
            <div className="flex gap-1 mb-8">
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
              <div className="flex-1 h-1 bg-neutral-600 rounded" />
            </div>

            <h2 className="text-xl font-bold mb-2">Verify your phone</h2>
            <p className="text-sm text-neutral-400 mb-6">
              We'll send you a verification code
            </p>

            <div className="space-y-4 flex-1">
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-12 bg-neutral-700 border-2 border-neutral-600 rounded-lg px-4 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <p className="text-xs text-neutral-500">
                Standard messaging rates may apply
              </p>
            </div>

            <button 
              className="w-full h-12 bg-neutral-600 rounded-lg hover:bg-neutral-550 transition-colors"
            >
              Send Code
            </button>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
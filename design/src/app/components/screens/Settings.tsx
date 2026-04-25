import React, { useState } from 'react';
import { ArrowLeft, Globe, DollarSign, MapPin } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function Settings() {
  const [currentScreen, setCurrentScreen] = useState('settings');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">12. Settings</h2>
      
      <div className="flex gap-6 flex-wrap">
        {/* Main Settings Screen */}
        <PhoneFrame title="Settings" active={currentScreen === 'settings'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700 flex items-center gap-3">
              <button className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Settings</h2>
            </div>

            {/* Settings List */}
            <div className="flex-1 overflow-y-auto">
              {/* Account Section */}
              <div className="p-4">
                <div className="text-xs text-neutral-500 mb-3 px-2">ACCOUNT</div>
                
                {/* Profile */}
                <button className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-600 rounded-full" />
                    <div className="text-left">
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-neutral-400">View Profile</div>
                    </div>
                  </div>
                  <div className="text-neutral-500">→</div>
                </button>
              </div>

              {/* Preferences Section */}
              <div className="p-4 border-t border-neutral-700">
                <div className="text-xs text-neutral-500 mb-3 px-2">PREFERENCES</div>
                
                {/* Language */}
                <button 
                  onClick={() => setCurrentScreen('language')}
                  className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-neutral-400" />
                    <div className="text-left">
                      <div className="font-medium">Language</div>
                      <div className="text-sm text-neutral-400">English</div>
                    </div>
                  </div>
                  <div className="text-neutral-500">→</div>
                </button>

                {/* Currency */}
                <button 
                  onClick={() => setCurrentScreen('currency')}
                  className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-neutral-400" />
                    <div className="text-left">
                      <div className="font-medium">Currency</div>
                      <div className="text-sm text-neutral-400">USD ($)</div>
                    </div>
                  </div>
                  <div className="text-neutral-500">→</div>
                </button>

                {/* Distance Unit */}
                <button 
                  onClick={() => setCurrentScreen('distance')}
                  className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-neutral-400" />
                    <div className="text-left">
                      <div className="font-medium">Distance Unit</div>
                      <div className="text-sm text-neutral-400">Kilometers</div>
                    </div>
                  </div>
                  <div className="text-neutral-500">→</div>
                </button>
              </div>

              {/* Notifications Section */}
              <div className="p-4 border-t border-neutral-700">
                <div className="text-xs text-neutral-500 mb-3 px-2">APP</div>
                
                {/* Notifications */}
                <button className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650">
                  <div className="font-medium">Notifications</div>
                  <div className="text-neutral-500">→</div>
                </button>

                {/* Privacy */}
                <button className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650">
                  <div className="font-medium">Privacy & Safety</div>
                  <div className="text-neutral-500">→</div>
                </button>
              </div>

              {/* Support Section */}
              <div className="p-4 border-t border-neutral-700">
                <div className="text-xs text-neutral-500 mb-3 px-2">SUPPORT</div>
                
                <button className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650">
                  <div className="font-medium">Help Center</div>
                  <div className="text-neutral-500">→</div>
                </button>

                <button className="w-full p-4 bg-neutral-700 rounded-xl mb-2 flex items-center justify-between border border-neutral-600 hover:bg-neutral-650">
                  <div className="font-medium">Terms & Conditions</div>
                  <div className="text-neutral-500">→</div>
                </button>
              </div>

              {/* Logout */}
              <div className="p-4 border-t border-neutral-700">
                <button className="w-full p-4 bg-red-950 rounded-xl flex items-center justify-center border border-red-900 hover:bg-red-900">
                  <div className="font-medium text-red-400">Log Out</div>
                </button>
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Language Selection */}
        <PhoneFrame title="Language" active={currentScreen === 'language'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700 flex items-center gap-3">
              <button 
                onClick={() => setCurrentScreen('settings')}
                className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Language</h2>
            </div>

            {/* Language List */}
            <div className="flex-1 overflow-y-auto p-4">
              {[
                { code: 'en', name: 'English', selected: true },
                { code: 'es', name: 'Español', selected: false },
                { code: 'fr', name: 'Français', selected: false },
                { code: 'de', name: 'Deutsch', selected: false },
                { code: 'it', name: 'Italiano', selected: false },
                { code: 'pt', name: 'Português', selected: false },
                { code: 'zh', name: '中文', selected: false },
                { code: 'ja', name: '日本語', selected: false },
                { code: 'ko', name: '한국어', selected: false },
              ].map((lang) => (
                <button
                  key={lang.code}
                  className={`w-full p-4 rounded-xl mb-2 flex items-center justify-between border-2 transition-colors ${
                    lang.selected
                      ? 'bg-neutral-700 border-neutral-500'
                      : 'bg-neutral-750 border-neutral-600 hover:bg-neutral-700'
                  }`}
                >
                  <div className="font-medium">{lang.name}</div>
                  {lang.selected && <div className="text-green-400">✓</div>}
                </button>
              ))}
            </div>
          </div>
        </PhoneFrame>

        {/* Currency Selection */}
        <PhoneFrame title="Currency" active={currentScreen === 'currency'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700 flex items-center gap-3">
              <button 
                onClick={() => setCurrentScreen('settings')}
                className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Currency</h2>
            </div>

            {/* Currency List */}
            <div className="flex-1 overflow-y-auto p-4">
              {[
                { code: 'USD', symbol: '$', name: 'US Dollar', selected: true },
                { code: 'EUR', symbol: '€', name: 'Euro', selected: false },
                { code: 'GBP', symbol: '£', name: 'British Pound', selected: false },
                { code: 'JPY', symbol: '¥', name: 'Japanese Yen', selected: false },
                { code: 'CAD', symbol: '$', name: 'Canadian Dollar', selected: false },
                { code: 'AUD', symbol: '$', name: 'Australian Dollar', selected: false },
                { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', selected: false },
                { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', selected: false },
              ].map((curr) => (
                <button
                  key={curr.code}
                  className={`w-full p-4 rounded-xl mb-2 flex items-center justify-between border-2 transition-colors ${
                    curr.selected
                      ? 'bg-neutral-700 border-neutral-500'
                      : 'bg-neutral-750 border-neutral-600 hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-650 rounded-full flex items-center justify-center text-sm font-bold">
                      {curr.symbol}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{curr.name}</div>
                      <div className="text-sm text-neutral-400">{curr.code}</div>
                    </div>
                  </div>
                  {curr.selected && <div className="text-green-400">✓</div>}
                </button>
              ))}
            </div>
          </div>
        </PhoneFrame>

        {/* Distance Unit Selection */}
        <PhoneFrame title="Distance Unit" active={currentScreen === 'distance'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700 flex items-center gap-3">
              <button 
                onClick={() => setCurrentScreen('settings')}
                className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Distance Unit</h2>
            </div>

            {/* Distance Unit List */}
            <div className="flex-1 overflow-y-auto p-4">
              {[
                { code: 'km', name: 'Kilometers', abbr: 'km', selected: true },
                { code: 'mi', name: 'Miles', abbr: 'mi', selected: false },
                { code: 'm', name: 'Meters', abbr: 'm', selected: false },
              ].map((unit) => (
                <button
                  key={unit.code}
                  className={`w-full p-4 rounded-xl mb-2 flex items-center justify-between border-2 transition-colors ${
                    unit.selected
                      ? 'bg-neutral-700 border-neutral-500'
                      : 'bg-neutral-750 border-neutral-600 hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-650 rounded-full flex items-center justify-center text-sm font-bold">
                      {unit.abbr}
                    </div>
                    <div className="font-medium">{unit.name}</div>
                  </div>
                  {unit.selected && <div className="text-green-400">✓</div>}
                </button>
              ))}
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';

// Screen Components
import AuthFlow from './components/screens/AuthFlow';
import HomeRenter from './components/screens/HomeRenter';
import AIBundle from './components/screens/AIBundle';
import RentFlow from './components/screens/RentFlow';
import PaymentFlow from './components/screens/PaymentFlow';
import QRChecklist from './components/screens/QRChecklist';
import ActiveRental from './components/screens/ActiveRental';
import IssuesFlow from './components/screens/IssuesFlow';
import RatingFlow from './components/screens/RatingFlow';
import CompletedTransactions from './components/screens/CompletedTransactions';
import NotificationsFlow from './components/screens/NotificationsFlow';
import Settings from './components/screens/Settings';

type Section = 
  | '01_Auth'
  | '02_Home_Swipe'
  | '03_AI_Bundle'
  | '04_Rent_Flow'
  | '05_Payment'
  | '06_QR_Checklist'
  | '07_Active_Rental'
  | '08_Issues'
  | '09_Ratings'
  | '10_Completed'
  | '11_Notifications'
  | '12_Settings';

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section>('01_Auth');

  const sections: { id: Section; label: string }[] = [
    { id: '01_Auth', label: '01 Auth' },
    { id: '02_Home_Swipe', label: '02 Home/Swipe' },
    { id: '03_AI_Bundle', label: '03 AI Bundle' },
    { id: '04_Rent_Flow', label: '04 Rent Flow' },
    { id: '05_Payment', label: '05 Payment' },
    { id: '06_QR_Checklist', label: '06 QR Checklist' },
    { id: '07_Active_Rental', label: '07 Active Rental' },
    { id: '08_Issues', label: '08 Issues' },
    { id: '09_Ratings', label: '09 Ratings' },
    { id: '10_Completed', label: '10 Completed' },
    { id: '11_Notifications', label: '11 Notifications' },
    { id: '12_Settings', label: '12 Settings' },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case '01_Auth':
        return <AuthFlow />;
      case '02_Home_Swipe':
        return <HomeRenter />;
      case '03_AI_Bundle':
        return <AIBundle />;
      case '04_Rent_Flow':
        return <RentFlow />;
      case '05_Payment':
        return <PaymentFlow />;
      case '06_QR_Checklist':
        return <QRChecklist />;
      case '07_Active_Rental':
        return <ActiveRental />;
      case '08_Issues':
        return <IssuesFlow />;
      case '09_Ratings':
        return <RatingFlow />;
      case '10_Completed':
        return <CompletedTransactions />;
      case '11_Notifications':
        return <NotificationsFlow />;
      case '12_Settings':
        return <Settings />;
      default:
        return <AuthFlow />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Navigation Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-xl font-bold">Swap&Rent - Complete Wireframes</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  currentSection === section.id
                    ? 'bg-neutral-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-650'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderSection()}
      </div>
    </div>
  );
}
import React from 'react';
import { Bell, Check, X, Clock, AlertTriangle } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function NotificationsFlow() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">11. Notifications Flow</h2>
      <p className="text-neutral-400 mb-6">Push notifications and in-app notification states</p>
      
      <div className="flex gap-6 flex-wrap">
        {/* Notification Center */}
        <PhoneFrame title="Notification Center">
          <div className="flex flex-col h-full bg-neutral-850">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">Notifications</h2>
              <button className="text-sm text-neutral-400">Mark all read</button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {/* Rental Request Received */}
              <div className="px-4 py-4 border-b border-neutral-700 bg-neutral-800">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">Request Approved!</div>
                    <div className="text-sm text-neutral-400">
                      John approved your request for Professional Camera. Complete payment to confirm.
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">2 hours ago</div>
                  </div>
                </div>
              </div>

              {/* Payment Reminder */}
              <div className="px-4 py-4 border-b border-neutral-700 bg-neutral-800">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💳</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">Payment Required</div>
                    <div className="text-sm text-neutral-400">
                      Complete payment for Gaming Console within 18 hours to confirm your booking.
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">6 hours ago</div>
                  </div>
                </div>
              </div>

              {/* Return Reminder */}
              <div className="px-4 py-4 border-b border-neutral-700">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">Return Reminder</div>
                    <div className="text-sm text-neutral-400">
                      Power Drill is due back tomorrow at 6:00 PM. Don't forget to return it on time!
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">1 day ago</div>
                  </div>
                </div>
              </div>

              {/* Request Rejected */}
              <div className="px-4 py-4 border-b border-neutral-700">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">Request Declined</div>
                    <div className="text-sm text-neutral-400">
                      Sarah declined your request for Camping Tent. The item was already booked.
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">2 days ago</div>
                  </div>
                </div>
              </div>

              {/* New Message */}
              <div className="px-4 py-4 border-b border-neutral-700">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">New Message</div>
                    <div className="text-sm text-neutral-400">
                      John: "I'll be home from 2-4 PM tomorrow for pickup."
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>

        {/* Push Notification - Request Received */}
        <PhoneFrame title="Push: Request Received">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Push Notification Preview</h3>
              <p className="text-sm text-neutral-400">As lender would see it</p>
            </div>

            {/* Phone notification preview */}
            <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-700 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center text-sm">
                  S&R
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Swap&Rent</div>
                  <div className="text-xs text-neutral-400">now</div>
                </div>
              </div>
              <div className="font-medium mb-1">New Rental Request</div>
              <div className="text-sm text-neutral-400">
                Mike wants to rent your Professional Camera for Mar 5-8. Respond soon!
              </div>
            </div>

            <div className="mt-8 text-xs text-neutral-500 text-center">
              Tapping notification opens the request details
            </div>
          </div>
        </PhoneFrame>

        {/* Push Notification - Approved */}
        <PhoneFrame title="Push: Request Approved">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Push Notification Preview</h3>
              <p className="text-sm text-neutral-400">Request approved</p>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 border border-green-900 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Swap&Rent</div>
                  <div className="text-xs text-neutral-400">now</div>
                </div>
              </div>
              <div className="font-medium mb-1 text-green-400">Request Approved!</div>
              <div className="text-sm text-neutral-400">
                John approved your rental. Complete payment to confirm your booking.
              </div>
            </div>

            <div className="mt-8 text-xs text-neutral-500 text-center">
              Tapping opens payment screen
            </div>
          </div>
        </PhoneFrame>

        {/* Push Notification - Rejected */}
        <PhoneFrame title="Push: Request Rejected">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Push Notification Preview</h3>
              <p className="text-sm text-neutral-400">Request declined</p>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 border border-red-900 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-900 rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Swap&Rent</div>
                  <div className="text-xs text-neutral-400">now</div>
                </div>
              </div>
              <div className="font-medium mb-1 text-red-400">Request Declined</div>
              <div className="text-sm text-neutral-400">
                Sarah declined your request. The item was already booked for those dates.
              </div>
            </div>

            <div className="mt-8 text-xs text-neutral-500 text-center">
              Tapping opens alternative item suggestions
            </div>
          </div>
        </PhoneFrame>

        {/* Push Notification - Payment Reminder */}
        <PhoneFrame title="Push: Payment Reminder">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Push Notification Preview</h3>
              <p className="text-sm text-neutral-400">Payment reminder</p>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 border border-yellow-900 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-900 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Swap&Rent</div>
                  <div className="text-xs text-neutral-400">now</div>
                </div>
              </div>
              <div className="font-medium mb-1 text-yellow-400">Payment Required Soon</div>
              <div className="text-sm text-neutral-400">
                Only 12 hours left to complete payment for Professional Camera or your booking will be cancelled.
              </div>
            </div>

            <div className="mt-8 text-xs text-neutral-500 text-center">
              Urgent reminder to complete payment
            </div>
          </div>
        </PhoneFrame>

        {/* Push Notification - Return Reminder */}
        <PhoneFrame title="Push: Return Reminder">
          <div className="flex flex-col h-full bg-neutral-850 p-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Push Notification Preview</h3>
              <p className="text-sm text-neutral-400">Return reminder</p>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-700 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center text-sm">
                  ⏰
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Swap&Rent</div>
                  <div className="text-xs text-neutral-400">now</div>
                </div>
              </div>
              <div className="font-medium mb-1">Return Reminder</div>
              <div className="text-sm text-neutral-400">
                Professional Camera is due tomorrow at 6:00 PM. Don't forget to coordinate return with John!
              </div>
            </div>

            <div className="mt-8 text-xs text-neutral-500 text-center">
              Sent 1 day before return date
            </div>
          </div>
        </PhoneFrame>

        {/* Notification Settings */}
        <PhoneFrame title="Notification Settings">
          <div className="flex flex-col h-full bg-neutral-850">
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-xl font-bold">Notification Settings</h2>
              <p className="text-sm text-neutral-400">Manage your preferences</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Push Notifications */}
              <div>
                <div className="font-medium mb-3">Push Notifications</div>
                <div className="space-y-3">
                  <div className="bg-neutral-700 rounded-lg p-4 border border-neutral-600 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Rental Requests</div>
                      <div className="text-xs text-neutral-400">When someone wants to rent from you</div>
                    </div>
                    <div className="w-12 h-6 bg-green-900 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-green-400 rounded-full ml-auto" />
                    </div>
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-4 border border-neutral-600 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Request Status</div>
                      <div className="text-xs text-neutral-400">Approvals, rejections, updates</div>
                    </div>
                    <div className="w-12 h-6 bg-green-900 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-green-400 rounded-full ml-auto" />
                    </div>
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-4 border border-neutral-600 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Messages</div>
                      <div className="text-xs text-neutral-400">New chat messages</div>
                    </div>
                    <div className="w-12 h-6 bg-green-900 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-green-400 rounded-full ml-auto" />
                    </div>
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-4 border border-neutral-600 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Return Reminders</div>
                      <div className="text-xs text-neutral-400">Due date notifications</div>
                    </div>
                    <div className="w-12 h-6 bg-green-900 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-green-400 rounded-full ml-auto" />
                    </div>
                  </div>

                  <div className="bg-neutral-700 rounded-lg p-4 border border-neutral-600 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Promotions</div>
                      <div className="text-xs text-neutral-400">Special offers and updates</div>
                    </div>
                    <div className="w-12 h-6 bg-neutral-650 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-neutral-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

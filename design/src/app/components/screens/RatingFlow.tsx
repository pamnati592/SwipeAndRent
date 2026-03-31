import React, { useState } from 'react';
import { Star, Check, Award } from 'lucide-react';
import PhoneFrame from '../wireframe/PhoneFrame';

export default function RatingFlow() {
  const [currentScreen, setCurrentScreen] = useState('rate-user');
  const [ratings, setRatings] = useState({
    reliability: 0,
    communication: 0,
    itemCondition: 0,
    timeliness: 0,
  });

  const StarRating = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="transition-colors"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-100">06. Rating Flow</h2>
      
      <div className="flex gap-6 flex-wrap">
        {/* Rate User Screen */}
        <PhoneFrame title="Rate Transaction" active={currentScreen === 'rate-user'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-lg font-bold">Rate Your Experience</h2>
              <p className="text-sm text-neutral-400">Help build trust in the community</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Transaction Summary */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 bg-neutral-650 rounded-lg flex items-center justify-center text-2xl">
                    📷
                  </div>
                  <div>
                    <h3 className="font-bold">Professional Camera</h3>
                    <p className="text-sm text-neutral-400">Rented Feb 23-26</p>
                    <p className="text-sm font-medium mt-1">From John Doe</p>
                  </div>
                </div>
              </div>

              {/* User Profile */}
              <div className="text-center">
                <div className="w-20 h-20 bg-neutral-600 rounded-full mx-auto mb-3" />
                <div className="font-bold">Rate John Doe</div>
                <div className="text-sm text-neutral-400">Owner</div>
              </div>

              {/* Rating Categories */}
              <div className="space-y-5">
                {/* Reliability */}
                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Reliability</div>
                      <div className="text-xs text-neutral-400">Item as described, worked well</div>
                    </div>
                  </div>
                  <StarRating
                    value={ratings.reliability}
                    onChange={(val) => setRatings({ ...ratings, reliability: val })}
                  />
                </div>

                {/* Communication */}
                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Communication</div>
                      <div className="text-xs text-neutral-400">Responsive and clear</div>
                    </div>
                  </div>
                  <StarRating
                    value={ratings.communication}
                    onChange={(val) => setRatings({ ...ratings, communication: val })}
                  />
                </div>

                {/* Item Condition */}
                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Item Condition</div>
                      <div className="text-xs text-neutral-400">Well-maintained and clean</div>
                    </div>
                  </div>
                  <StarRating
                    value={ratings.itemCondition}
                    onChange={(val) => setRatings({ ...ratings, itemCondition: val })}
                  />
                </div>

                {/* Timeliness */}
                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">Timeliness</div>
                      <div className="text-xs text-neutral-400">Pickup and return on time</div>
                    </div>
                  </div>
                  <StarRating
                    value={ratings.timeliness}
                    onChange={(val) => setRatings({ ...ratings, timeliness: val })}
                  />
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">
                  Additional Comments (Optional)
                </label>
                <textarea
                  placeholder="Share more about your experience..."
                  className="w-full h-24 bg-neutral-700 border border-neutral-600 rounded-xl p-3 text-sm resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <button 
                onClick={() => setCurrentScreen('rating-success')}
                className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Rating Success */}
        <PhoneFrame title="Rating Submitted" active={currentScreen === 'rating-success'}>
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-24 h-24 bg-green-900 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Thanks for Your Feedback!</h2>
            <p className="text-sm text-neutral-400 text-center mb-8">
              Your rating helps build a trustworthy community
            </p>

            {/* Rating Summary */}
            <div className="w-full bg-neutral-700 rounded-xl p-4 border border-neutral-600 mb-6">
              <div className="text-sm font-medium mb-3 text-center">Your Rating</div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-10 h-10 fill-yellow-500 text-yellow-500" />
                <span className="text-3xl font-bold">4.8</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-neutral-400">Reliability</div>
                  <div className="font-medium">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="text-center">
                  <div className="text-neutral-400">Communication</div>
                  <div className="font-medium">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="text-center">
                  <div className="text-neutral-400">Condition</div>
                  <div className="font-medium">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="text-center">
                  <div className="text-neutral-400">Timeliness</div>
                  <div className="font-medium">⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentScreen('reputation-impact')}
              className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550 mb-2"
            >
              View Impact
            </button>
            <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium hover:bg-neutral-550 mb-2">
              Back to Home
            </button>
          </div>
        </PhoneFrame>

        {/* Reputation Impact */}
        <PhoneFrame title="Reputation Impact" active={currentScreen === 'reputation-impact'}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-4 bg-gradient-to-br from-purple-900 to-blue-900 border-b border-purple-800">
              <h2 className="text-lg font-bold">Your Community Impact</h2>
              <p className="text-sm text-purple-200">Building a better marketplace</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Impact Score */}
              <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-6 border border-purple-800 text-center">
                <Award className="w-16 h-16 mx-auto mb-3 text-yellow-400" />
                <div className="text-xs text-purple-200 mb-1">Your Impact Score</div>
                <div className="text-4xl font-bold mb-2">456</div>
                <div className="text-sm text-purple-200">+15 from this transaction</div>
              </div>

              {/* Reputation Badge */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm font-medium mb-3">Reputation Badge</div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">Trusted Renter</div>
                    <div className="text-sm text-neutral-400">Level 3</div>
                    <div className="mt-2 h-2 bg-neutral-600 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">150 points to Level 4</div>
                  </div>
                </div>
              </div>

              {/* Your Stats */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm font-medium mb-3">Your Stats</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-xs text-neutral-400">Transactions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-xs text-neutral-400">Avg Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-xs text-neutral-400">Reviews Given</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs text-neutral-400">On-Time Rate</div>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="bg-green-950 border border-green-900 rounded-xl p-4">
                <div className="text-sm font-medium mb-3 text-green-300">Environmental Impact</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-green-200">
                    <span>Items Rented</span>
                    <span className="font-bold">23</span>
                  </div>
                  <div className="flex justify-between text-green-200">
                    <span>CO₂ Saved (est.)</span>
                    <span className="font-bold">125 kg</span>
                  </div>
                  <div className="flex justify-between text-green-200">
                    <span>Waste Prevented</span>
                    <span className="font-bold">$8,400</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm font-medium mb-3">Recent Achievements</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                      🎯
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">First Reviewer</div>
                      <div className="text-xs text-neutral-400">Completed first rating</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg flex items-center justify-center">
                      🌟
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">5-Star Streak</div>
                      <div className="text-xs text-neutral-400">5 consecutive 5-star ratings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <button className="w-full h-12 bg-neutral-700 border border-neutral-600 rounded-lg font-medium">
                View Full Profile
              </button>
            </div>
          </div>
        </PhoneFrame>

        {/* Rate as Lender (Reverse Perspective) */}
        <PhoneFrame title="Rate Renter (Lender POV)" active={currentScreen === 'rate-renter'}>
          <div className="flex flex-col h-full">
            <div className="px-4 py-4 border-b border-neutral-700">
              <h2 className="text-lg font-bold">Rate Your Renter</h2>
              <p className="text-sm text-neutral-400">How was Sarah as a renter?</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Renter Info */}
              <div className="text-center">
                <div className="w-20 h-20 bg-neutral-600 rounded-full mx-auto mb-3" />
                <div className="font-bold">Sarah Johnson</div>
                <div className="text-sm text-neutral-400">Renter</div>
              </div>

              {/* Transaction */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="text-sm text-neutral-400 mb-2">Item Rented</div>
                <div className="font-medium">Professional Camera</div>
                <div className="text-sm text-neutral-400">Feb 23-26, 2026</div>
              </div>

              {/* Rating Categories */}
              <div className="space-y-4">
                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="font-medium mb-2">Reliability</div>
                  <div className="text-xs text-neutral-400 mb-3">Returned on time, as agreed</div>
                  <StarRating value={0} onChange={() => {}} />
                </div>

                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="font-medium mb-2">Communication</div>
                  <div className="text-xs text-neutral-400 mb-3">Clear and responsive</div>
                  <StarRating value={0} onChange={() => {}} />
                </div>

                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="font-medium mb-2">Item Care</div>
                  <div className="text-xs text-neutral-400 mb-3">Took good care of item</div>
                  <StarRating value={0} onChange={() => {}} />
                </div>

                <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                  <div className="font-medium mb-2">Timeliness</div>
                  <div className="text-xs text-neutral-400 mb-3">Punctual for pickup/return</div>
                  <StarRating value={0} onChange={() => {}} />
                </div>
              </div>

              {/* Would Rent Again */}
              <div className="bg-neutral-700 rounded-xl p-4 border border-neutral-600">
                <div className="font-medium mb-3">Would you rent to them again?</div>
                <div className="flex gap-3">
                  <button className="flex-1 h-12 bg-green-900 hover:bg-green-800 rounded-lg font-medium">
                    Yes
                  </button>
                  <button className="flex-1 h-12 bg-neutral-600 hover:bg-neutral-550 rounded-lg font-medium">
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-800 border-t border-neutral-700">
              <button className="w-full h-12 bg-neutral-600 rounded-lg font-medium">
                Submit Rating
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
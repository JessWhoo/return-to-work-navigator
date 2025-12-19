import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const helpfulOptions = [
  'managing fatigue',
  'stress reduction',
  'workplace rights',
  'accommodations',
  'communication',
  'emotional support',
  'return planning',
  'legal guidance',
  'medical coordination'
];

export default function EnhancedResourceReviewDialog({ resourceId, resourceName }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [helpfulFor, setHelpfulFor] = useState([]);
  const [wouldRecommend, setWouldRecommend] = useState(true);

  // Fetch existing review if any
  const { data: existingReviews } = useQuery({
    queryKey: ['resource-review', resourceId],
    queryFn: async () => {
      const reviews = await base44.entities.ResourceReview.list();
      return reviews.filter(r => r.resource_id === resourceId);
    },
    enabled: open
  });

  const myReview = existingReviews?.find(r => r.created_by === 'current_user');

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      if (myReview) {
        return await base44.entities.ResourceReview.update(myReview.id, reviewData);
      } else {
        return await base44.entities.ResourceReview.create(reviewData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['resource-review']);
      toast.success('Review submitted successfully!');
      setOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to submit review. Please try again.');
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    submitReviewMutation.mutate({
      resource_id: resourceId,
      rating,
      review_text: reviewText.trim(),
      helpful_for: helpfulFor,
      would_recommend: wouldRecommend
    });
  };

  const resetForm = () => {
    setRating(0);
    setReviewText('');
    setHelpfulFor([]);
    setWouldRecommend(true);
  };

  const toggleHelpfulFor = (option) => {
    setHelpfulFor(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  // Calculate aggregate stats
  const avgRating = existingReviews?.length > 0
    ? (existingReviews.reduce((sum, r) => sum + r.rating, 0) / existingReviews.length).toFixed(1)
    : null;

  const recommendPercent = existingReviews?.length > 0
    ? Math.round((existingReviews.filter(r => r.would_recommend).length / existingReviews.length) * 100)
    : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Star className="h-4 w-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review: {resourceName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Community Stats */}
          {existingReviews && existingReviews.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">{avgRating}</div>
                  <div className="text-xs text-gray-600">Average Rating</div>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(avgRating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">{existingReviews.length}</div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
                {recommendPercent !== null && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700">{recommendPercent}%</div>
                    <div className="text-xs text-gray-600">Would Recommend</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Your Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300 hover:text-amber-400'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  ({rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Below Average' : 'Poor'})
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Your Experience (Optional)
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this resource. What was helpful? What could be improved?"
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length}/500 characters
            </p>
          </div>

          {/* Helpful For */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              This resource was helpful for: (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {helpfulOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleHelpfulFor(option)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    helpfulFor.includes(option)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Would Recommend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="block text-sm font-semibold text-gray-800">
                  Would you recommend this resource to others?
                </span>
                <span className="text-xs text-gray-600">
                  Help the community by sharing your recommendation
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setWouldRecommend(false)}
                  className={`p-2 rounded-lg transition-all ${
                    !wouldRecommend ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsDown className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setWouldRecommend(true)}
                  className={`p-2 rounded-lg transition-all ${
                    wouldRecommend ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" />
                </button>
              </div>
            </label>
          </div>

          {/* Recent Reviews */}
          {existingReviews && existingReviews.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span>Recent Community Reviews</span>
              </h4>
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {existingReviews.slice(-5).reverse().map((review, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.would_recommend && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    {review.review_text && (
                      <p className="text-sm text-gray-700 mb-2">{review.review_text}</p>
                    )}
                    {review.helpful_for && review.helpful_for.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {review.helpful_for.slice(0, 3).map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || submitReviewMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {submitReviewMutation.isPending ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
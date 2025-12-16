import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ResourceReviewDialog({ resourceId, resourceName, trigger }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [helpfulFor, setHelpfulFor] = useState([]);
  const [wouldRecommend, setWouldRecommend] = useState(true);

  const { data: existingReview } = useQuery({
    queryKey: ['userReview', resourceId],
    queryFn: async () => {
      const reviews = await base44.entities.ResourceReview.filter({ resource_id: resourceId });
      return reviews[0] || null;
    },
    enabled: open
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      if (existingReview) {
        return await base44.entities.ResourceReview.update(existingReview.id, reviewData);
      }
      return await base44.entities.ResourceReview.create(reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['resourceReviews']);
      queryClient.invalidateQueries(['userReview', resourceId]);
      toast.success(existingReview ? 'Review updated!' : 'Review submitted!');
      setOpen(false);
      resetForm();
    }
  });

  React.useEffect(() => {
    if (existingReview && open) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review_text || '');
      setHelpfulFor(existingReview.helpful_for || []);
      setWouldRecommend(existingReview.would_recommend ?? true);
    }
  }, [existingReview, open]);

  const resetForm = () => {
    setRating(0);
    setReviewText('');
    setHelpfulFor([]);
    setWouldRecommend(true);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    submitReviewMutation.mutate({
      resource_id: resourceId,
      rating,
      review_text: reviewText,
      helpful_for: helpfulFor,
      would_recommend: wouldRecommend
    });
  };

  const helpfulOptions = [
    'Understanding my rights',
    'Managing fatigue',
    'Communication with employer',
    'Emotional support',
    'Financial planning',
    'Medical accommodations',
    'Returning to work',
    'Legal guidance'
  ];

  const toggleHelpfulFor = (option) => {
    setHelpfulFor(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {existingReview ? 'Edit Review' : 'Write Review'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingReview ? 'Edit Your Review' : 'Review Resource'}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">{resourceName}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Rating *</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {rating === 1 ? 'Not helpful' : rating === 2 ? 'Somewhat helpful' : rating === 3 ? 'Helpful' : rating === 4 ? 'Very helpful' : 'Extremely helpful'}
                </span>
              )}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Review (Optional)</label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this resource..."
              className="min-h-[100px]"
            />
          </div>

          {/* Helpful For */}
          <div>
            <label className="text-sm font-medium mb-2 block">What was this most helpful for?</label>
            <div className="flex flex-wrap gap-2">
              {helpfulOptions.map((option) => (
                <Badge
                  key={option}
                  variant={helpfulFor.includes(option) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    helpfulFor.includes(option)
                      ? 'bg-teal-600 hover:bg-teal-700'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleHelpfulFor(option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          {/* Would Recommend */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={() => setWouldRecommend(!wouldRecommend)}
              className={`p-2 rounded-lg transition-all ${
                wouldRecommend
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <ThumbsUp className={`h-5 w-5 ${wouldRecommend ? 'fill-current' : ''}`} />
            </button>
            <label className="text-sm font-medium cursor-pointer flex-1" onClick={() => setWouldRecommend(!wouldRecommend)}>
              I would recommend this resource to others
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              onClick={handleSubmit}
              disabled={submitReviewMutation.isPending}
            >
              {submitReviewMutation.isPending ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DialogContent from '@/components/resources/ResourceDialogContent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
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
      <DialogTrigger asChild><Button variant="outline" size="sm" className="flex-1"><Star className="h-4 w-4 mr-2" />Review</Button></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Review: {resourceName}</DialogTitle></DialogHeader>
        <div className="space-y-6">
          {existingReviews && existingReviews.length > 0 && (
            <div className="nv-card nv-card--muted grid grid-cols-3 gap-3 p-4 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-primary">{avgRating}</div>
                <div className="text-xs text-brand-muted-foreground">Average Rating</div>
                <div className="flex items-center justify-center mt-1">{[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= Math.round(avgRating) ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} />)}</div>
              </div>
              <div><div className="text-3xl font-bold text-brand-primary">{existingReviews.length}</div><div className="text-xs text-brand-muted-foreground">Reviews</div></div>
              {recommendPercent !== null && <div><div className="text-3xl font-bold text-brand-text">{recommendPercent}%</div><div className="text-xs text-brand-muted-foreground">Would Recommend</div></div>}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-2">Your Rating *</label>
            <div className="flex items-center gap-1 flex-wrap">
              {[1, 2, 3, 4, 5].map(star => <Button key={star} variant="ghost" size="icon" aria-label={`Rate ${star} out of 5`} aria-pressed={rating === star} onClick={() => setRating(star)}><Star className={`h-7 w-7 ${star <= rating ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} /></Button>)}
              {rating > 0 && <span className="text-sm text-brand-muted-foreground w-full mt-2">({rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Below Average' : 'Poor'})</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Your Experience (Optional)</label>
            <Textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience with this resource. What was helpful? What could be improved?" className="min-h-[100px]" maxLength={500} />
            <p className="text-xs text-brand-muted-foreground mt-1">{reviewText.length}/500 characters</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">This resource was helpful for: (Select all that apply)</label>
            <div className="flex flex-wrap gap-2">{helpfulOptions.map(option => <Button key={option} size="sm" variant={helpfulFor.includes(option) ? 'default' : 'outline'} aria-pressed={helpfulFor.includes(option)} className="!whitespace-normal" onClick={() => toggleHelpfulFor(option)}>{option}</Button>)}</div>
          </div>
          <div className="nv-card nv-card--muted p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0"><span className="block text-sm font-semibold">Would you recommend this resource to others?</span><span className="text-xs text-brand-muted-foreground">Help the community by sharing your recommendation</span></div>
            <div className="flex gap-2">
              <Button size="icon" variant={!wouldRecommend ? 'default' : 'ghost'} onClick={() => setWouldRecommend(false)} aria-label="Would not recommend" aria-pressed={!wouldRecommend}><ThumbsDown className="h-5 w-5" /></Button>
              <Button size="icon" variant={wouldRecommend ? 'secondary' : 'ghost'} onClick={() => setWouldRecommend(true)} aria-label="Would recommend" aria-pressed={wouldRecommend}><ThumbsUp className="h-5 w-5" /></Button>
            </div>
          </div>
          {existingReviews && existingReviews.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-brand-primary" /><span>Recent Community Reviews</span></h4>
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {existingReviews.slice(-5).reverse().map((review, idx) => (
                  <div key={idx} className="nv-card nv-card--muted p-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= review.rating ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} />)}</div>
                      {review.would_recommend && <Badge variant="secondary" className="text-xs">Recommended</Badge>}
                    </div>
                    {review.review_text && <p className="text-sm text-brand-text mb-2 break-words">{review.review_text}</p>}
                    {review.helpful_for && review.helpful_for.length > 0 && <div className="flex flex-wrap gap-1">{review.helpful_for.slice(0, 3).map((tag, tagIdx) => <Badge key={tagIdx} variant="outline" className="text-xs">{tag}</Badge>)}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-brand-border">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={rating === 0 || submitReviewMutation.isPending}>{submitReviewMutation.isPending ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
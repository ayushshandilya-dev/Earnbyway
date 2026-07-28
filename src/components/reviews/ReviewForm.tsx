import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Star, Send, ThumbsUp } from 'lucide-react';

interface Props {
  targetId: string;
  orderId: string;
  onSubmitted?: () => void;
}

export const ReviewForm: React.FC<Props> = ({ targetId, orderId, onSubmitted }) => {
  const { currentUser, postReview } = useApp();
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [wouldHireAgain, setWouldHireAgain] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0 || !comment.trim()) return;
    postReview({
      orderId,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      targetId,
      rating,
      comment: comment.trim(),
      pros: pros.trim() || undefined,
      cons: cons.trim() || undefined,
      wouldHireAgain,
    });
    setSubmitted(true);
    addToast('Review submitted!', 'success');
    onSubmitted?.();
  };

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <ThumbsUp className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Review Submitted!</h3>
        <p className="text-sm text-zinc-400">Thank you for sharing your experience.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Leave a Review</h3>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium text-zinc-400 mb-2 block">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoveredStar || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-700'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-zinc-400">
              {rating > 0 ? `${rating}/5` : 'Select rating'}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your experience..."
            rows={3}
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Pros (optional)</label>
            <input
              type="text"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              placeholder="What went well?"
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Cons (optional)</label>
            <input
              type="text"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              placeholder="What could improve?"
              className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWouldHireAgain(!wouldHireAgain)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              wouldHireAgain
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" /> Would Hire Again
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || !comment.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-sm"
        >
          <Send className="w-4 h-4" /> Submit Review
        </button>
      </div>
    </div>
  );
};

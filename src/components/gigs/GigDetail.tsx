import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gig } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Star, CheckCircle, Clock, ChevronDown, ChevronUp, MessageSquare, ShoppingCart, ShieldCheck, ExternalLink } from 'lucide-react';

interface Props {
  gig: Gig;
  onBack: () => void;
}

export const GigDetail: React.FC<Props> = ({ gig, onBack }) => {
  const navigate = useNavigate();
  const { reviews, profiles, users, gigs, createOrderFromGig, currentRole } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [ordering, setOrdering] = useState(false);

  const allImages = [gig.coverImage, ...gig.galleryImages];
  const gigReviews = reviews.filter(r => r.targetId === gig.freelancerId);
  const freelancerProfile = profiles[gig.freelancerId];
  const freelancerUser = users.find(u => u.id === gig.freelancerId);
  const pkg = gig.packages[selectedPackage];

  const handleOrderNow = async () => {
    if (currentRole === 'guest') {
      navigate('/?auth=1');
      return;
    }
    setOrdering(true);
    try {
      await createOrderFromGig(gig, selectedPackage);
      setOrdering(false);
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setOrdering(false);
    }
  };

  const handleContact = () => {
    navigate(`/chat?user=${gig.freelancerId}`);
  };

  const handleViewProfile = () => {
    if (freelancerUser) navigate(`/profile/${freelancerUser.id}`);
  };

  const handleRelated = (related: Gig) => {
    navigate(`/gigs/${related.id}`);
  };

  return (
    <div className="py-8 animate-in fade-in duration-300">
      <button onClick={onBack}
        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 mb-4">
              <img
                src={allImages[selectedImage]}
                alt={gig.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm text-xs text-emerald-400 font-semibold border border-emerald-500/30">
                {gig.category}
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-heading font-bold text-white mb-4">{gig.title}</h1>
            <div className="flex items-center gap-4 text-sm mb-6">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" /> {gig.rating}
                <span className="text-zinc-400 font-normal">({gig.reviewsCount} reviews)</span>
              </span>
              <span className="text-zinc-500">{gig.ordersCompleted} orders completed</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{gig.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">About the Seller</h2>
            <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
              <img
                src={gig.freelancerAvatar}
                alt={gig.freelancerName}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/40"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{gig.freelancerName}</h3>
                  {freelancerUser?.isVerified && <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />}
                </div>
                <p className="text-xs text-zinc-400 mb-3">{gig.freelancerTitle}</p>
                {freelancerProfile && (
                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Star className="w-3.5 h-3.5 text-amber-400" /> {freelancerProfile.rating}
                    </span>
                    <span className="text-zinc-500">{freelancerProfile.completedJobs} jobs done</span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" /> {freelancerProfile.responseTime}
                    </span>
                    <span className="text-emerald-400 font-semibold">₹{freelancerProfile.hourlyRate}/hr</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">Services & Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['basic', 'standard', 'premium'] as const).map(tier => {
                const p = gig.packages[tier];
                const isSelected = selectedPackage === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedPackage(tier)}
                    className={`glass-card rounded-2xl p-5 text-left transition-all ${
                      isSelected
                        ? 'border-teal-500/60 ring-1 ring-violet-500/40 shadow-lg shadow-teal-500/10'
                        : 'hover:border-zinc-700'
                    }`}
                  >
                    <div className={`text-xs font-bold mb-2 uppercase tracking-wider ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {p.name}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-3">{p.title}</h3>
                    <div className="text-2xl font-bold text-emerald-400 mb-3">₹{p.price.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mb-4">
                      <Clock className="w-3 h-3" /> {p.deliveryDays} days delivery · {p.revisions} revisions
                    </div>
                    <div className="space-y-2">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm">
                {gig.title} — <span className="text-emerald-400">{pkg.name}</span>
              </h3>
              <div className="text-right">
                <span className="text-xs text-zinc-500">Total</span>
                <div className="text-xl font-bold text-emerald-400">₹{pkg.price.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleOrderNow} disabled={ordering}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-bold rounded-xl transition-all text-sm">
                <ShoppingCart className="w-4 h-4" /> {ordering ? 'Creating Order…' : `Continue (₹${pkg.price.toLocaleString()})`}
              </button>
              <button onClick={handleContact} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl transition-all text-sm">
                <MessageSquare className="w-4 h-4" /> Contact
              </button>
            </div>
          </div>

          {gig.faqs.length > 0 && (
            <div>
              <h2 className="text-lg font-heading font-bold text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {gig.faqs.map((faq, i) => (
                  <div key={i} className="glass-card rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left text-sm text-white hover:bg-zinc-900/50 transition-colors"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-top-1">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">Requirements</h2>
            <div className="glass-card rounded-2xl p-5">
              <ul className="space-y-3">
                {gig.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {gigReviews.length > 0 && (
            <div>
              <h2 className="text-lg font-heading font-bold text-white mb-4">Reviews ({gigReviews.length})</h2>
              <div className="space-y-4">
                {gigReviews.map(r => (
                  <div key={r.id} className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-500">{r.createdAt}</span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-3">{r.comment}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <img src={r.reviewerAvatar} alt="" className="w-6 h-6 rounded-lg object-cover" />
                      <span className="text-white font-medium">{r.reviewerName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-5 sticky top-28 space-y-5 aurora-top">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Escrow Protected
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Category</span>
                <span className="text-white">{gig.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subcategory</span>
                <span className="text-white">{gig.subcategory}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Orders</span>
                <span className="text-white">{gig.ordersCompleted} completed</span>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <h4 className="text-xs font-medium text-zinc-400 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {gig.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <h4 className="text-xs font-medium text-zinc-400 mb-3">Seller Info</h4>
              <div className="flex items-center gap-3 mb-3">
                <img src={gig.freelancerAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="text-sm font-semibold text-white">{gig.freelancerName}</div>
                  <div className="text-xs text-zinc-500">{gig.freelancerTitle}</div>
                </div>
              </div>
              {freelancerProfile && (
                <div className="space-y-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Response: {freelancerProfile.responseTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Delivery: {freelancerProfile.avgDeliveryTime}
                  </div>
                </div>
              )}
              <button onClick={handleViewProfile} className="w-full mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-3 h-3" /> View Full Profile
              </button>
            </div>

            <button onClick={handleOrderNow} disabled={ordering}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-bold rounded-xl transition-all text-sm">
              {ordering ? 'Creating Order…' : `Order Now — ₹${pkg.price.toLocaleString()}`}
            </button>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-lg font-heading font-bold text-white mb-6">Related Gigs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs
              .filter(g => g.id !== gig.id && g.category === gig.category)
              .slice(0, 3)
              .map(related => (
                <div key={related.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer group" onClick={() => handleRelated(related)}>
                  <div className="h-36 overflow-hidden">
                    <img src={related.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-1">{related.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {related.rating}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">₹{related.startingPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

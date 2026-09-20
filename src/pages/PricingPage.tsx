import React, { useState } from 'react';
import { 
  Check, Sparkles, Zap, ShieldCheck, Star, HelpCircle, 
  ArrowRight, Award, Brain, Users, Trophy, Download, HeartHandshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const tiers = [
    {
      id: 'scholar-free',
      name: 'Scholar Foundation',
      badge: 'Free Forever',
      badgeStyle: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Essential AI study support for everyday classroom homework and concept checks.',
      popular: false,
      features: [
        '5 AI Tutor interactions per day',
        'Standard Flashcard generation',
        'Basic Spaced Repetition queue',
        'Public Subject Competitions access',
        'View Famous Scholar Quotes',
        'Web browser study sessions'
      ],
      ctaText: 'Current Plan',
      ctaStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-default'
    },
    {
      id: 'pro-mentor',
      name: 'Lumora Pro Mentor',
      badge: 'Most Popular',
      badgeStyle: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
      priceMonthly: 12,
      priceYearly: 9, // $9/mo billed yearly
      description: 'The complete cognitive mentorship experience for ambitious board & competitive aspirants.',
      popular: true,
      features: [
        'Unlimited 1-on-1 consultations with 1,000+ AI Teacher Scholars',
        'Weekly Student Progress Chart & Downloadable PDF Audit reports',
        'Complete Memory Tricks & AI Mnemonic Generator Vault',
        'Spaced Repetition Mastery Hub with SuperMemo-2 scheduling',
        'Camera & Document Instant Multi-Concept OCR Analysis',
        'Speech-to-Speech Real Voice Mentor Tutoring sessions',
        'Entry into National Subject Olympiad Speed Cups with XP bounties'
      ],
      ctaText: 'Upgrade to Pro Mentor',
      ctaStyle: 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/40'
    },
    {
      id: 'elite-olympiad',
      name: 'Elite Olympiad & Institutional',
      badge: 'Highest Tier',
      badgeStyle: 'bg-amber-500/20 text-amber-500 border border-amber-500/40',
      priceMonthly: 29,
      priceYearly: 22, // $22/mo billed yearly
      description: 'For students targeting Top 100 National Ranks (JEE Advanced, NEET, SAT, Olympiads) & high achievers.',
      popular: false,
      features: [
        'Everything in Lumora Pro Mentor',
        '24/7 Priority GPU derivation compute (Zero queue time)',
        'All-India Predictive Percentile Mock Exam Simulator',
        'Dedicated Parent & Academic Mentor telemetry email digests',
        'Classical Neoclassical & Scientific 4K diagram generation access',
        'Personalized Weakness Prescription Matrix (100% gap eradication)',
        '1-on-1 human mentor office-hours consultation booking'
      ],
      ctaText: 'Unlock Elite Olympiad',
      ctaStyle: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg'
    }
  ];

  const handleSelectTier = (tierId: string) => {
    if (tierId === 'scholar-free') return;
    setSelectedTier(tierId);
    setShowSuccessModal(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Invest in Real Academic Mentorship</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Pricing for Advanced Cognitive Mastery
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Unlock 1,000+ AI Faculty Teachers, comprehensive downloadable weekly progress audits, subject competitions, and memory tricks designed to make you learn 3x faster.
        </p>

        {/* Billing Switch */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => {
          const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;
          return (
            <div
              key={tier.id}
              className={`p-8 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between transition-all duration-300 relative ${
                tier.popular
                  ? 'border-rose-500 shadow-2xl ring-2 ring-rose-500/20 lg:-translate-y-2'
                  : 'border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-rose-600/40">
                  Recommended for Top Scorers
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{tier.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${tier.badgeStyle}`}>
                    {tier.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 pt-2 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    ${price}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    /month {billingCycle === 'yearly' && price > 0 ? '(billed annually)' : ''}
                  </span>
                </div>

                {/* Feature List */}
                <div className="space-y-3.5">
                  <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">What's Included:</div>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleSelectTier(tier.id)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${tier.ctaStyle}`}
                >
                  <span>{tier.ctaText}</span>
                  {tier.id !== 'scholar-free' && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mentor Guarantee Section */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              The Real Academic Mentor Guarantee
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Lumora is designed to be your genuine intellectual mentor—not a lazy answer generator. If your quiz accuracy and study consistency don't improve within 14 days, cancel with a single click.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Encrypted billing</span>
        </div>
      </div>

      {/* Upgrade Simulation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-3xl shadow-xl">
              ✨
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Pro Mentorship Activated!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Welcome to the Lumora Pro Tier. You now have full access to 1,000+ AI Faculty Teachers, downloadable weekly progress reports, and all subject competitions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span>Selected Tier:</span>
                <span className="font-bold text-slate-900 dark:text-white">{tiers.find(t => t.id === selectedTier)?.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Billing Period:</span>
                <span className="font-bold text-slate-900 dark:text-white">{billingCycle === 'yearly' ? 'Annual (Save 25%)' : 'Monthly'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Status:</span>
                <span className="font-bold text-emerald-500">Active & Unlocked</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/student/mentors');
                }}
                className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-md shadow-rose-600/30"
              >
                Meet Your AI Faculty
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

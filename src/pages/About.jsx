import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
          About Back to Life, Back to Work Navigator
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
          A compassionate, comprehensive toolkit built for cancer survivors navigating the journey back to the workplace.
        </p>
      </div>

      {/* What the app does */}
      <Card className="bg-slate-800/80 border-teal-700">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-teal-300">What We Do</h2>
          <p className="text-slate-300 leading-relaxed">
            The Back to Life, Back to Work Navigator is a free, all-in-one digital companion designed to guide cancer
            survivors through every phase of returning to employment after treatment. Returning to work after a cancer
            diagnosis is rarely straightforward — physical fatigue, cognitive changes, emotional anxiety, legal
            questions, and workplace communication challenges can all feel overwhelming at once.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Our platform brings together evidence-based tools, curated resource libraries, AI-powered coaching, and
            community support in one accessible place. Users can track their daily energy and mood, generate
            accommodation request letters, prepare for difficult workplace conversations, understand their rights under
            the ADA and FMLA, and connect with peers who truly understand their experience.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Whether you are in the early planning stages before returning, navigating your first week back, or
            managing ongoing challenges months into your return, the Navigator meets you where you are and adapts to
            your needs.
          </p>
        </CardContent>
      </Card>

      {/* Who it's for */}
      <Card className="bg-slate-800/80 border-cyan-700">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-cyan-300">Who It's For</h2>
          <p className="text-slate-300 leading-relaxed">
            This platform is built for cancer survivors and patients at any stage of treatment or recovery who are
            thinking about, preparing for, or actively navigating a return to work. It is also a valuable resource
            for caregivers supporting a loved one through workplace reintegration, as well as HR professionals and
            occupational health practitioners seeking to better understand the needs of employees returning after
            serious illness.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The Navigator is designed to be accessible, supportive, and non-judgmental — recognizing that every
            survivor's journey is unique and that there is no single "right" timeline or approach.
          </p>
        </CardContent>
      </Card>

      {/* Who builds it */}
      <Card className="bg-slate-800/80 border-purple-700">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-purple-300">Who Builds It</h2>
          <p className="text-slate-300 leading-relaxed">
            The Back to Life, Back to Work Navigator is developed by a team passionate about the intersection of
            healthcare, workplace equity, and technology. Our mission is to close the support gap that exists for
            cancer survivors re-entering the workforce — a gap that too often leaves people feeling isolated and
            ill-equipped to advocate for themselves.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The platform draws on guidance from oncology social workers, employment attorneys, occupational therapists,
            and most importantly, the lived experiences of cancer survivors themselves. We are committed to keeping
            this resource free, evidence-based, and continually improving based on user feedback.
          </p>
          <p className="text-slate-400 text-sm italic">
            Note: Information provided is for educational purposes only and does not constitute legal or medical advice.
            Please consult with qualified professionals for your specific situation.
          </p>
        </CardContent>
      </Card>

      {/* Feature highlights */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Zap, color: 'text-amber-400', title: 'Energy & Mood Tracking', desc: 'Daily check-ins with AI-matched resource recommendations.' },
            { icon: Shield, color: 'text-green-400', title: 'Legal Rights Guidance', desc: 'Plain-language summaries of ADA, FMLA, and state laws.' },
            { icon: BookOpen, color: 'text-indigo-400', title: '90+ Curated Resources', desc: 'Vetted guides, videos, support groups, and tools.' },
            { icon: Users, color: 'text-cyan-400', title: 'Community & Peer Support', desc: 'Anonymous forums and peer matching for shared experiences.' },
            { icon: Heart, color: 'text-rose-400', title: 'AI Return-to-Work Coach', desc: 'Personalized guidance available 24/7 via conversational AI.' },
            { icon: ArrowRight, color: 'text-teal-400', title: 'Communication Toolkit', desc: 'Templates and scripts for employer conversations and emails.' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <f.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${f.color}`} />
              <div>
                <p className="text-slate-200 font-semibold text-sm">{f.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/Contact" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors">
          Get in touch with us <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
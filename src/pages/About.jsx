import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent leading-tight">
          About Back to Life, Back to Work Navigator
        </h1>
        <p className="text-slate-800 text-xl max-w-2xl mx-auto leading-relaxed font-semibold">
          A compassionate, comprehensive toolkit built for cancer survivors navigating the journey back to the workplace.
        </p>
      </div>

      {/* Founder */}
      <Card className="bg-white border-2 border-rose-300 shadow-lg">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold text-rose-700 mb-6 text-center sm:text-left">Meet the Founder</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img
              src="https://media.base44.com/images/public/69406c752de234aafebf891d/09d111f53_AirBrush_20250925233307.jpg"
              alt="Founder & Creator"
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-rose-400 shadow-xl flex-shrink-0"
            />
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-2xl font-bold text-slate-900">Jess Whorton</p>
                <p className="text-rose-700 font-semibold text-base">Founder &amp; Creator — Back to Life, Back to Work Navigator</p>
              </div>
              <p className="text-slate-800 text-base leading-relaxed font-medium">
                As a cancer survivor herself, our founder knows firsthand how isolating and overwhelming the return-to-work
                journey can feel. After navigating her own diagnosis, treatment, and the difficult conversations that
                followed with employers, HR, and coworkers, she realized how little practical support existed for people
                trying to rebuild their careers while healing.
              </p>
              <p className="text-slate-800 text-base leading-relaxed font-medium">
                She founded the Navigator to be the resource she wished she'd had — a warm, judgment-free companion that
                combines legal guidance, communication tools, emotional support, and community into one accessible place.
                Her mission is to make sure no survivor ever has to figure this out alone.
              </p>
              <p className="text-slate-700 text-base italic font-medium">
                "You are not going back to who you were. You are going forward as someone stronger — and you deserve support
                every step of the way."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What the app does */}
      <Card className="bg-white border-2 border-teal-400 shadow-md">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-3xl font-bold text-teal-700">What We Do</h2>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            The Back to Life, Back to Work Navigator is a free, all-in-one digital companion designed to guide cancer
            survivors through every phase of returning to employment after treatment. Returning to work after a cancer
            diagnosis is rarely straightforward — physical fatigue, cognitive changes, emotional anxiety, legal
            questions, and workplace communication challenges can all feel overwhelming at once.
          </p>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            Our platform brings together evidence-based tools, curated resource libraries, AI-powered coaching, and
            community support in one accessible place. Users can track their daily energy and mood, generate
            accommodation request letters, prepare for difficult workplace conversations, understand their rights under
            the ADA and FMLA, and connect with peers who truly understand their experience.
          </p>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            Whether you are in the early planning stages before returning, navigating your first week back, or
            managing ongoing challenges months into your return, the Navigator meets you where you are and adapts to
            your needs.
          </p>
        </CardContent>
      </Card>

      {/* Who it's for */}
      <Card className="bg-white border-2 border-cyan-400 shadow-md">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-3xl font-bold text-cyan-700">Who It's For</h2>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            This platform is built for cancer survivors and patients at any stage of treatment or recovery who are
            thinking about, preparing for, or actively navigating a return to work. It is also a valuable resource
            for caregivers supporting a loved one through workplace reintegration, as well as HR professionals and
            occupational health practitioners seeking to better understand the needs of employees returning after
            serious illness.
          </p>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            The Navigator is designed to be accessible, supportive, and non-judgmental — recognizing that every
            survivor's journey is unique and that there is no single "right" timeline or approach.
          </p>
        </CardContent>
      </Card>

      {/* Who builds it */}
      <Card className="bg-white border-2 border-purple-400 shadow-md">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-3xl font-bold text-purple-700">Who Builds It</h2>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            The Back to Life, Back to Work Navigator is developed by a team passionate about the intersection of
            healthcare, workplace equity, and technology. Our mission is to close the support gap that exists for
            cancer survivors re-entering the workforce — a gap that too often leaves people feeling isolated and
            ill-equipped to advocate for themselves.
          </p>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            The platform draws on guidance from oncology social workers, employment attorneys, occupational therapists,
            and most importantly, the lived experiences of cancer survivors themselves. We are committed to keeping
            this resource free, evidence-based, and continually improving based on user feedback.
          </p>
          <p className="text-slate-700 text-sm italic font-semibold">
            Note: Information provided is for educational purposes only and does not constitute legal or medical advice.
            Please consult with qualified professionals for your specific situation.
          </p>
        </CardContent>
      </Card>

      {/* Feature highlights */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Zap, color: 'text-amber-600', title: 'Energy & Mood Tracking', desc: 'Daily check-ins with AI-matched resource recommendations.' },
            { icon: Shield, color: 'text-green-700', title: 'Legal Rights Guidance', desc: 'Plain-language summaries of ADA, FMLA, and state laws.' },
            { icon: BookOpen, color: 'text-indigo-700', title: '90+ Curated Resources', desc: 'Vetted guides, videos, support groups, and tools.' },
            { icon: Users, color: 'text-cyan-700', title: 'Community & Peer Support', desc: 'Anonymous forums and peer matching for shared experiences.' },
            { icon: Heart, color: 'text-rose-600', title: 'AI Return-to-Work Coach', desc: 'Personalized guidance available 24/7 via conversational AI.' },
            { icon: ArrowRight, color: 'text-teal-700', title: 'Communication Toolkit', desc: 'Templates and scripts for employer conversations and emails.' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3 bg-white border-2 border-slate-300 rounded-xl p-4 shadow-sm">
              <f.icon className={`h-6 w-6 mt-0.5 flex-shrink-0 ${f.color}`} />
              <div>
                <p className="text-slate-900 font-bold text-base">{f.title}</p>
                <p className="text-slate-700 text-sm mt-1 font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/Contact" className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-bold text-base transition-colors">
          Get in touch with us <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
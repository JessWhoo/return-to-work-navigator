import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Heart, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';

const LOGO_URL =
  'https://media.base44.com/images/public/69406c752de234aafebf891d/ef1f55ae7_433da2071_IMG_1196.png';

const features = [
  {
    icon: Compass,
    title: 'Find your direction',
    text: 'A step-by-step compass for returning to work after cancer treatment.',
  },
  {
    icon: Heart,
    title: 'Care for yourself',
    text: 'Track energy, mood, and symptoms so you can pace what matters most.',
  },
  {
    icon: Shield,
    title: 'Know your rights',
    text: 'Understand accommodations, legal protections, and workplace policies.',
  },
  {
    icon: Sparkles,
    title: 'Never alone',
    text: 'AI coaching, expert advice, and a community that gets it.',
  },
];

export default function Landing() {
  useSEO({
    title: 'Back to Life, Back to Work Navigator',
    description:
      'Your compass for returning to work after cancer — practical guidance, legal know-how, and compassionate support.',
    path: '/welcome',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-20">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={LOGO_URL}
              alt="Navigator compass logo"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="font-extrabold text-slate-900 tracking-tight">
              Navigator
            </span>
          </div>
          <Link
            to="/login"
            className="text-sm font-bold text-slate-800 hover:text-rose-600 transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mt-14 lg:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
              For cancer survivors
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              <span className="bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent">
                Back to Life,
              </span>
              <br />
              <span className="text-slate-900">Back to Work.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-700 font-medium max-w-xl mx-auto lg:mx-0">
              Your compass for returning to work after cancer — practical
              guidance, legal know-how, and compassionate support, all in one
              place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-gradient-to-r from-rose-500 via-violet-500 to-sky-600 hover:from-rose-600 hover:via-violet-600 hover:to-sky-700 text-white font-bold px-7 py-6 rounded-xl shadow-lg text-base"
              >
                <Link to="/home">
                  Get started
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Link
                to="/About"
                className="px-5 py-3 rounded-xl font-bold text-slate-800 hover:text-rose-600 transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </motion.div>

          {/* Logo showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-300/40 via-violet-300/40 to-sky-400/40 blur-3xl rounded-full" />
            <img
              src={LOGO_URL}
              alt="Back to Life, Back to Work Navigator compass"
              className="relative w-72 sm:w-96 lg:w-[26rem] h-auto rounded-full shadow-2xl ring-4 ring-white"
            />
          </motion.div>
        </div>

        {/* Features */}
        <div className="mt-20 lg:mt-28 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 via-violet-500 to-sky-600 flex items-center justify-center shadow-md">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 font-extrabold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-700 font-medium leading-relaxed">
                  {f.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 lg:mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 sm:p-14 text-center">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-rose-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-sky-500/20 blur-3xl rounded-full" />
          <div className="relative">
            <img
              src={LOGO_URL}
              alt=""
              className="mx-auto h-16 w-16 rounded-full ring-2 ring-white/30 shadow-lg"
            />
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-white">
              Ready to find your way forward?
            </h2>
            <p className="mt-3 text-slate-200 font-medium max-w-xl mx-auto">
              Start free. No pressure, just support — at your pace.
            </p>
            <Button
              asChild
              className="mt-7 bg-white hover:bg-slate-100 text-slate-900 font-bold px-7 py-6 rounded-xl shadow-lg text-base"
            >
              <Link to="/home">
                Open Navigator
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-600 font-medium">
          © 2025 Back to Life, Back to Work Navigator · Information is for
          educational purposes only.
        </p>
      </div>
    </div>
  );
}
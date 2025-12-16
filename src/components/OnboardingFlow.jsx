import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Heart, Calendar, Shield, FileText, Zap, MessageSquare,
  CheckCircle2, ArrowRight, ArrowLeft, BookOpen, Sparkles
} from 'lucide-react';

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Your Return-to-Work Toolkit',
    description: 'This app is designed to support you through your journey back to work after cancer treatment. Let\'s take a quick tour of what\'s available.',
    icon: Heart,
    color: 'from-teal-500 to-cyan-500',
    bg: 'from-teal-50 to-cyan-50',
    action: null
  },
  {
    id: 'plan',
    title: 'Plan Your Return',
    description: 'Create a personalized phased return schedule that works for you. Choose from templates or customize your own timeline to ease back into work at your pace.',
    icon: Calendar,
    color: 'from-purple-500 to-violet-500',
    bg: 'from-purple-50 to-violet-50',
    action: { label: 'View Return Planning', page: 'ReturnPlanning' }
  },
  {
    id: 'legal',
    title: 'Know Your Rights',
    description: 'Understand your legal protections under ADA, FMLA, COBRA, and ACA. Learn what accommodations you\'re entitled to and how to request them.',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    bg: 'from-green-50 to-emerald-50',
    action: { label: 'View Legal Rights', page: 'LegalRights' }
  },
  {
    id: 'accommodations',
    title: 'Request Accommodations',
    description: 'Generate professional accommodation request letters. Choose from common accommodations and customize them to match your specific needs.',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    bg: 'from-blue-50 to-cyan-50',
    action: { label: 'View Accommodations', page: 'Accommodations' }
  },
  {
    id: 'energy',
    title: 'Manage Your Energy',
    description: 'Track your daily energy levels and identify patterns. Learn pacing strategies and discover what times of day work best for you.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
    action: { label: 'View Energy Management', page: 'EnergyManagement' }
  },
  {
    id: 'coach',
    title: 'Meet Your AI Coach',
    description: 'Get personalized guidance 24/7. Ask questions, share concerns, and receive tailored advice based on your progress and needs.',
    icon: MessageSquare,
    color: 'from-pink-500 to-rose-500',
    bg: 'from-pink-50 to-rose-50',
    action: { label: 'Chat with Coach', page: 'Coach' }
  },
  {
    id: 'resources',
    title: 'Explore Resources',
    description: 'Access curated resources including articles, videos, support groups, and expert guidance. Get AI-powered recommendations based on your journey.',
    icon: BookOpen,
    color: 'from-indigo-500 to-purple-500',
    bg: 'from-indigo-50 to-purple-50',
    action: { label: 'Browse Resources', page: 'Resources' }
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You now know the key features of your toolkit. Remember, you can always revisit any section. This is your journey—go at your own pace.',
    icon: Sparkles,
    color: 'from-teal-500 to-cyan-500',
    bg: 'from-teal-50 to-cyan-50',
    action: null
  }
];

export default function OnboardingFlow({ open, onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoToPage = () => {
    if (step.action?.page) {
      onComplete();
      navigate(createPageUrl(step.action.page));
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className={`bg-gradient-to-br ${step.bg} p-8`}>
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}>
              <Icon className="h-16 w-16 text-white" />
            </div>

            {/* Title */}
            <h2 className={`text-3xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
              {step.description}
            </p>

            {/* Action Button */}
            {step.action && (
              <Button
                onClick={handleGoToPage}
                variant="outline"
                className="mt-4"
              >
                {step.action.label}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-white flex items-center justify-between border-t">
          <Button
            onClick={handleBack}
            variant="ghost"
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex space-x-1">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-teal-600'
                    : index < currentStep
                    ? 'w-2 bg-teal-300'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
          >
            {currentStep === onboardingSteps.length - 1 ? (
              <>
                Get Started
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { Button } from '../components/ui';
import type { OnboardingData } from '../types';
import { Check, ArrowRight } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (data: OnboardingData) => void;
}

const STEPS = [
  {
    step: 1,
    question: 'What do you like to make?',
    subtext: 'Pick everything that resonates.',
    key: 'domains' as const,
    options: ['Design', 'Technology', 'Research', 'Business', 'Writing', 'Art', 'Hardware', 'Social Impact'],
  },
  {
    step: 2,
    question: 'What are you good at?',
    subtext: 'These help match you with ideas that need your skills.',
    key: 'skills' as const,
    options: ['UX Research', 'Product Design', 'Frontend Dev', 'Backend Dev', 'Machine Learning', 'Hardware', 'Writing', 'Business Strategy', 'Data Analysis', 'Visual Design', 'Research', 'Marketing'],
  },
  {
    step: 3,
    question: 'What are you looking for?',
    subtext: 'This shapes what IdeaWeave surfaces for you.',
    key: 'lookingFor' as const,
    options: ['Ideas to explore', 'Projects to join', 'Feedback to give', 'Collaborators', 'Mentorship', 'Challenges to solve'],
  },
  {
    step: 4,
    question: 'How do you prefer to work?',
    subtext: 'We\'ll match you with people who work the same way.',
    key: 'workingStyle' as const,
    options: ['Solo first', 'Small team', 'Async', 'Live collaboration', 'Research-first', 'Build-first', 'Experimental', 'Structured'],
  },
];

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({ domains: [], skills: [], lookingFor: [], workingStyle: [] });

  const current = STEPS[step];

  const toggle = (key: keyof OnboardingData, value: string) => {
    setData((prev) => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const selected = data[current.key];
  const canContinue = selected.length > 0;

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="min-h-full bg-[var(--background)] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--primary)] rounded-md flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2.5" fill="white" />
              <line x1="7" y1="0" x2="7" y2="4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="9.5" x2="7" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="7" x2="4.5" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9.5" y1="7" x2="14" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display font-bold text-sm text-[var(--muted-foreground)]">Step {current.step} of {STEPS.length}</span>
        </div>

        {/* Question */}
        <div>
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-[var(--foreground)] leading-tight">{current.question}</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{current.subtext}</p>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-2">
          {current.options.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(current.key, opt)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-display font-medium transition-all duration-150 ${
                  isSelected
                    ? 'border-[var(--primary)] bg-indigo-50 text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)]'
                }`}
              >
                {isSelected && <Check size={13} />}
                {opt}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-2">
          {step > 0 ? (
            <button onClick={() => setStep((s) => s - 1)} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Back
            </button>
          ) : <div />}
          <Button onClick={handleNext} disabled={!canContinue} size="md">
            {step < STEPS.length - 1 ? 'Continue' : 'Enter IdeaWeave'}
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Button } from '../components/ui';
import { ArrowRight, Sparkles, GitBranch, Users } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
}

export default function LandingView({ onStart }: LandingViewProps) {
  return (
    <div className="min-h-full bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 lg:px-12 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="2.5" fill="white" />
              <line x1="7" y1="0" x2="7" y2="4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="9.5" x2="7" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="7" x2="4.5" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9.5" y1="7" x2="14" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display font-bold text-base text-[var(--foreground)]">IdeaWeave</span>
        </div>
        <Button variant="outline" size="sm" onClick={onStart}>Sign in</Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto w-full py-20">
        <div className="fade-up space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 mb-2">
            <Sparkles size={11} />
            A new place for unfinished ideas
          </div>

          <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-[var(--foreground)] leading-[1.1] tracking-tight">
            What are you<br />
            <span className="text-[var(--primary)]">thinking about?</span>
          </h1>

          <p className="text-lg text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
            Capture the idea before it disappears. IdeaWeave is a private-to-public space where unfinished thoughts find the right people and become real.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
            <Button size="lg" onClick={onStart}>
              Capture an idea <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg" onClick={onStart}>
              Explore unfinished ideas
            </Button>
          </div>
        </div>

        {/* Feature trio */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-xl text-left">
          {[
            {
              Icon: Sparkles,
              color: 'text-amber-500',
              bg: 'bg-amber-50',
              title: 'Incubate privately',
              desc: 'Keep ideas private until you\'re ready. No judgment before you\'re ready for it.',
            },
            {
              Icon: Users,
              color: 'text-indigo-500',
              bg: 'bg-indigo-50',
              title: 'Find the missing skill',
              desc: 'Get matched with people who complement what your idea needs most.',
            },
            {
              Icon: GitBranch,
              color: 'text-violet-500',
              bg: 'bg-violet-50',
              title: 'Watch it evolve',
              desc: 'Every version is preserved. See how your thinking grows over time.',
            },
          ].map(({ Icon, color, bg, title, desc }) => (
            <div key={title} className="space-y-2">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
              <p className="font-display font-semibold text-sm text-[var(--foreground)]">{title}</p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      <footer className="px-6 py-8 border-t border-[var(--border)] text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          Not another social feed. A place where unfinished thoughts find their right people.
        </p>
      </footer>
    </div>
  );
}

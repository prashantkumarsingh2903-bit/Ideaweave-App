import React, { useState } from 'react';
import { CHALLENGES } from '../data/mockData';
import { Card, Tag, Button } from '../components/ui';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export default function ChallengesView() {
  const [responded, setResponded] = useState<Set<string>>(new Set());

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 lg:px-6 py-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-xl text-[var(--foreground)]">Challenges</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Real problems from organizations looking for ideas. Teams form around promising concepts.</p>
        </div>

        <div className="space-y-5">
          {CHALLENGES.map((challenge) => {
            const isResponded = responded.has(challenge.id);
            return (
              <Card key={challenge.id} className="p-5">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                      <Zap size={17} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base text-[var(--foreground)]">{challenge.title}</h3>
                      <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">{challenge.organization}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--foreground)] leading-relaxed">{challenge.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>

                  {/* Prize */}
                  {challenge.prize && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[var(--muted-foreground)]">Prize:</span>
                      <span className="font-display font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{challenge.prize}</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> Deadline: {challenge.deadline}
                      </span>
                      <span>{challenge.submittedIdeas} ideas submitted</span>
                    </div>
                    <Button
                      size="xs"
                      variant={isResponded ? 'secondary' : 'primary'}
                      onClick={() => setResponded((prev) => new Set([...prev, challenge.id]))}
                    >
                      {isResponded ? '✓ Submitted' : 'Submit an idea'}
                      {!isResponded && <ArrowRight size={11} />}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-5 border border-dashed border-[var(--border)] rounded-xl text-center space-y-3">
          <p className="font-display font-semibold text-sm text-[var(--foreground)]">Are you an organization?</p>
          <p className="text-xs text-[var(--muted-foreground)]">Post a real problem and let the IdeaWeave community respond with ideas and talent.</p>
          <Button variant="outline" size="sm">Post a challenge</Button>
        </div>
      </div>
    </div>
  );
}

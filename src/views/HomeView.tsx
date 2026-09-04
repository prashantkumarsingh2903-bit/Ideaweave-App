import React, { useState } from 'react';
import { IDEAS, NOTIFICATIONS, CURRENT_USER, USERS } from '../data/mockData';
import type { Idea } from '../types';
import { Button, StageChip, Avatar, Card, Tag, CompatibilityBadge, EmptyState } from '../components/ui';
import { Plus, Sparkles, ArrowRight, RotateCcw, GitBranch, Bell } from 'lucide-react';

interface HomeViewProps {
  onCapture: () => void;
  onOpenIdea: (idea: Idea) => void;
  ideas: Idea[];
}

const RESURFACE_IDEA = IDEAS[7]; // Local artisan marketplace (private, old)

const SUGGESTED_COLLABORATORS = [
  { user: USERS[0], compatibility: 92, forIdea: 'Smart Food-Waste Detection' },
  { user: USERS[1], compatibility: 87, forIdea: 'Smart Food-Waste Detection' },
  { user: USERS[2], compatibility: 84, forIdea: 'Climate Adaptation Toolkit' },
];

export default function HomeView({ onCapture, onOpenIdea, ideas }: HomeViewProps) {
  const [resurface, setResurface] = useState(true);
  const [invited, setInvited] = useState<Set<string>>(new Set());
  
  const toggleInvite = (userId: string) => {
    setInvited(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  const myIdeas = ideas.filter((i) => i.author.id === CURRENT_USER.id).slice(0, 3);
  const recentActivity = ideas.filter((i) => i.author.id !== CURRENT_USER.id).slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 lg:py-10 space-y-8 pb-24 lg:pb-10">
      {/* Greeting */}
      <div className="space-y-1">
        <p className="text-sm text-[var(--muted-foreground)] font-mono">Thursday, 3 Sep 2026</p>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-[var(--foreground)]">
          Good morning, Meera.
        </h1>
      </div>

      {/* Quick capture */}
      <button
        onClick={onCapture}
        className="w-full flex items-center gap-3 px-4 py-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-left hover:border-[var(--primary)] transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0 group-hover:opacity-90 transition-opacity">
          <Plus size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-display font-semibold text-[var(--foreground)]">What are you thinking about?</p>
          <p className="text-xs text-[var(--muted-foreground)]">Capture the idea before it disappears.</p>
        </div>
        <ArrowRight size={16} className="ml-auto text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
      </button>

      {/* Resurface */}
      {resurface && (
        <Card className="p-4 border-amber-200 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <RotateCcw size={15} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-amber-700 mb-1">Resurface</p>
              <p className="text-sm font-display font-semibold text-[var(--foreground)]">
                You haven&apos;t opened &ldquo;Local Artisan Marketplace&rdquo; in 5 days.
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">What would you like to do with it?</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Continue', 'Archive', 'Ask AI', 'Find collaborator'].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      if (action === 'Continue') onOpenIdea(RESURFACE_IDEA);
                      setResurface(false);
                    }}
                    className="text-xs px-2.5 py-1 rounded border border-amber-300 bg-white text-amber-800 hover:bg-amber-50 font-display font-medium transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setResurface(false)} className="text-amber-400 hover:text-amber-600 text-sm ml-1">✕</button>
          </div>
        </Card>
      )}

      {/* Notifications summary */}
      {unread > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl">
          <Bell size={15} className="text-indigo-600 flex-shrink-0" />
          <p className="text-sm text-indigo-800 flex-1">
            <span className="font-semibold">{unread} new notifications</span> — including a collaborator request for your food waste idea.
          </p>
        </div>
      )}

      {/* My recent ideas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base text-[var(--foreground)]">My ideas</h2>
          <button className="text-xs text-[var(--primary)] font-display font-medium hover:underline">See all</button>
        </div>
        <div className="space-y-3">
          {myIdeas.length === 0 ? (
            <EmptyState
              icon="💡"
              headline="Every project begins as something unfinished."
              subtext="Capture your first thought and start building."
              cta="Capture your first thought"
              onCta={onCapture}
            />
          ) : (
            myIdeas.map((idea) => (
              <IdeaRow key={idea.id} idea={idea} onClick={() => onOpenIdea(idea)} />
            ))
          )}
        </div>
      </div>

      {/* Suggested collaborators */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base text-[var(--foreground)]">People who could help</h2>
          <Sparkles size={14} className="text-[var(--muted-foreground)]" />
        </div>
        <div className="space-y-3">
          {SUGGESTED_COLLABORATORS.map(({ user, compatibility, forIdea }, i) => (
            <Card key={user.id} className="p-3">
              <div className="flex items-center gap-3">
                <Avatar initials={user.initials} size="md" colorIndex={i + 1} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm text-[var(--foreground)]">{user.name}</span>
                    <CompatibilityBadge value={compatibility} />
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">{user.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">For: <span className="text-[var(--foreground)]">{forIdea}</span></p>
                </div>
                <Button 
                  variant={invited.has(user.id) ? "secondary" : "outline"} 
                  size="xs"
                  onClick={() => toggleInvite(user.id)}
                  className={invited.has(user.id) ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : ""}
                >
                  {invited.has(user.id) ? 'Invited' : 'Invite'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity from community */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base text-[var(--foreground)]">From the community</h2>
          <button className="text-xs text-[var(--primary)] font-display font-medium hover:underline">Explore more</button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((idea) => (
            <IdeaRow key={idea.id} idea={idea} onClick={() => onOpenIdea(idea)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function IdeaRow({ idea, onClick }: { idea: Idea; onClick: () => void }) {
  return (
    <Card className="p-4" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <StageChip stage={idea.stage} />
            {idea.topics.slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
          <p className="font-display font-semibold text-sm text-[var(--foreground)] line-clamp-1">{idea.title}</p>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">{idea.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {idea.contributors.length > 0 && (
            <div className="flex -space-x-1.5">
              {idea.contributors.slice(0, 3).map((c, i) => (
                <Avatar key={c.user.id} initials={c.user.initials} size="xs" colorIndex={i + 1} />
              ))}
            </div>
          )}
          <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{idea.versions.length}v</span>
        </div>
      </div>
      {idea.skillsNeeded.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-mono text-[var(--muted-foreground)]">Needs:</span>
          {idea.skillsNeeded.slice(0, 3).map((s) => (
            <span key={s} className="text-[10px] font-mono bg-[var(--secondary)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded">{s}</span>
          ))}
        </div>
      )}
    </Card>
  );
}

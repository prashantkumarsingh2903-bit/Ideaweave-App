import React, { useState } from 'react';
import { IDEAS, CURRENT_USER } from '../data/mockData';
import type { Idea } from '../types';
import { Card, StageChip, Avatar, Button, ProgressBar } from '../components/ui';
import { Users, MessageSquare, FileText, CheckCircle } from 'lucide-react';

interface CollaborationsViewProps {
  onOpenIdea: (idea: Idea) => void;
}

export default function CollaborationsView({ onOpenIdea }: CollaborationsViewProps) {
  const myCollabs = IDEAS.filter((i) =>
    i.contributors.some((c) => c.user.id === CURRENT_USER.id && c.status === 'active')
  );
  const myIdeasWithCollabs = IDEAS.filter((i) =>
    i.author.id === CURRENT_USER.id && i.contributors.length > 0
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 space-y-8 pb-24 lg:pb-10">
        <div>
          <h1 className="font-display font-bold text-xl text-[var(--foreground)]">Collaborations</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Ideas you are building with others.</p>
        </div>

        {/* Ideas I collaborate on */}
        <div>
          <h2 className="font-display font-semibold text-sm text-[var(--foreground)] mb-4">Ideas I contribute to</h2>
          {myCollabs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-xl">
              <Users size={24} className="text-[var(--muted-foreground)] mx-auto mb-3" />
              <p className="font-display font-semibold text-sm text-[var(--foreground)]">Your idea is missing someone.</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Find the missing skill in Explore.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myCollabs.map((idea) => {
                const entry = idea.contributors.find((c) => c.user.id === CURRENT_USER.id);
                return (
                  <CollaborationCard key={idea.id} idea={idea} role={entry?.role || ''} onOpen={() => onOpenIdea(idea)} isOwned={false} />
                );
              })}
            </div>
          )}
        </div>

        {/* My ideas with collaborators */}
        {myIdeasWithCollabs.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-sm text-[var(--foreground)] mb-4">My ideas with collaborators</h2>
            <div className="space-y-4">
              {myIdeasWithCollabs.map((idea) => (
                <CollaborationCard key={idea.id} idea={idea} role="Author" onOpen={() => onOpenIdea(idea)} isOwned />
              ))}
            </div>
          </div>
        )}

        {/* Climate adaptation — where current user is contributor */}
        {(() => {
          const climateIdea = IDEAS.find((i) => i.id === 'i9');
          if (!climateIdea) return null;
          return (
            <div>
              <h2 className="font-display font-semibold text-sm text-[var(--foreground)] mb-4">External collaboration</h2>
              <CollaborationCard idea={climateIdea} role="UX Researcher" onOpen={() => onOpenIdea(climateIdea)} isOwned={false} />
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function CollaborationCard({ idea, role, onOpen, isOwned }: { idea: Idea; role: string; onOpen: () => void; isOwned: boolean }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');
  const done = idea.milestones.filter((m) => m.completed).length;
  const total = idea.milestones.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      {/* Card header */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StageChip stage={idea.stage} size="xs" />
              <span className="text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--secondary)] px-1.5 py-0.5 rounded">{role}</span>
            </div>
            <h3 className="font-display font-semibold text-sm text-[var(--foreground)] cursor-pointer hover:text-[var(--primary)] transition-colors" onClick={onOpen}>
              {idea.title}
            </h3>
          </div>
          <div className="flex -space-x-1.5 flex-shrink-0">
            <Avatar initials={idea.author.initials} size="xs" colorIndex={0} />
            {idea.contributors.slice(0, 2).map((c, i) => (
              <Avatar key={c.user.id} initials={c.user.initials} size="xs" colorIndex={i + 1} />
            ))}
          </div>
        </div>

        {/* Progress */}
        {total > 0 && (
          <div className="mt-3">
            <ProgressBar value={progress} label={`${done}/${total} milestones`} color="bg-emerald-500" />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex">
        {(['overview', 'tasks'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 text-xs font-display font-medium transition-colors ${
              activeTab === t ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {t === 'overview' ? 'Overview' : 'Tasks'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === 'overview' ? (
          <div className="space-y-3">
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">{idea.description}</p>
            <div className="flex items-center gap-3">
              {idea.contributors.filter((c) => c.status === 'active').map((c, i) => (
                <div key={c.user.id} className="flex items-center gap-1.5">
                  <Avatar initials={c.user.initials} size="xs" colorIndex={i + 1} />
                  <div>
                    <p className="text-[10px] font-display font-medium text-[var(--foreground)]">{c.user.name}</p>
                    <p className="text-[10px] font-mono text-emerald-600">Active</p>
                  </div>
                </div>
              ))}
            </div>
            <Button size="xs" variant="outline" onClick={onOpen} className="w-full">Open workspace</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {idea.milestones.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)]">No milestones yet.</p>
            ) : (
              idea.milestones.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <CheckCircle size={13} className={m.completed ? 'text-emerald-500' : 'text-[var(--border)]'} />
                  <span className={`text-xs font-display ${m.completed ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>{m.title}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

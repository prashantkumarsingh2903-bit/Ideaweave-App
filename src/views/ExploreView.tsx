import React, { useState } from 'react';
import type { Idea } from '../types';
import { IDEAS } from '../data/mockData';
import { Card, StageChip, Avatar, Button, Tag, SkillBadge } from '../components/ui';
import { Zap, MessageSquare, Users, Layers, Shuffle, Search } from 'lucide-react';

interface ExploreViewProps {
  ideas: Idea[];
  onOpenIdea: (idea: Idea) => void;
}

type Category = 'all' | 'fresh' | 'feedback' | 'collaborators' | 'almost-ready' | 'unexpected';

const CATEGORIES: { id: Category; label: string; Icon: React.ElementType; description: string }[] = [
  { id: 'all', label: 'All ideas', Icon: Layers, description: 'Browse everything' },
  { id: 'fresh', label: 'Fresh Sparks', Icon: Zap, description: 'Very early ideas' },
  { id: 'feedback', label: 'Seeking Feedback', Icon: MessageSquare, description: 'Ideas wanting opinions' },
  { id: 'collaborators', label: 'Seeking Collaborators', Icon: Users, description: 'Actively recruiting' },
  { id: 'almost-ready', label: 'Almost Ready', Icon: Layers, description: 'Close to becoming projects' },
  { id: 'unexpected', label: 'Unexpected Connections', Icon: Shuffle, description: 'Semantically related to your interests' },
];

function filterByCategory(ideas: Idea[], cat: Category): Idea[] {
  if (cat === 'all') return ideas.filter((i) => i.privacy !== 'PRIVATE');
  if (cat === 'fresh') return ideas.filter((i) => ['SPARK', 'INCUBATING'].includes(i.stage) && i.privacy !== 'PRIVATE');
  if (cat === 'feedback') return ideas.filter((i) => i.stage === 'SEEKING_FEEDBACK');
  if (cat === 'collaborators') return ideas.filter((i) => i.stage === 'SEEKING_COLLABORATORS');
  if (cat === 'almost-ready') return ideas.filter((i) => ['PROTOTYPING', 'ACTIVE_PROJECT'].includes(i.stage));
  if (cat === 'unexpected') return ideas.filter((i) => i.topics.some((t) => ['Sustainability', 'Civic Tech', 'Research'].includes(t)) && i.privacy !== 'PRIVATE');
  return ideas;
}

export default function ExploreView({ ideas, onOpenIdea }: ExploreViewProps) {
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');

  const filtered = filterByCategory(ideas, category).filter((i) =>
    !search || i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.topics.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
    i.skillsNeeded.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 lg:px-6 py-5 border-b border-[var(--border)]">
        <h1 className="font-display font-bold text-xl text-[var(--foreground)] mb-4">Explore</h1>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas, skills, topics…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 lg:px-6 py-3 border-b border-[var(--border)]">
        {CATEGORIES.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-display font-medium transition-colors ${
              category === id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
        {category !== 'all' && (
          <p className="text-xs text-[var(--muted-foreground)] font-mono mb-4">
            {CATEGORIES.find((c) => c.id === category)?.description} · {filtered.length} ideas
          </p>
        )}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--muted-foreground)]">No ideas match your search.</p>
            </div>
          ) : (
            filtered.map((idea, i) => (
              <DiscoveryCard key={idea.id} idea={idea} onOpen={() => onOpenIdea(idea)} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DiscoveryCard({ idea, onOpen, index }: { idea: Idea; onOpen: () => void; index: number }) {
  const [buildOn, setBuildOn] = useState(false);
  const [helped, setHelped] = useState(false);

  return (
    <Card className="p-5">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StageChip stage={idea.stage} />
              {idea.topics.slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <h3
              className="font-display font-semibold text-base text-[var(--foreground)] cursor-pointer hover:text-[var(--primary)] transition-colors"
              onClick={onOpen}
            >
              {idea.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">{idea.description}</p>
          </div>
          <div className="flex-shrink-0">
            <Avatar initials={idea.author.initials} size="md" colorIndex={index % 5} />
          </div>
        </div>

        {/* What's needed */}
        {idea.skillsNeeded.length > 0 && (
          <div>
            <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-1.5">Needs</p>
            <div className="flex flex-wrap gap-1.5">
              {idea.skillsNeeded.slice(0, 4).map((s) => (
                <span key={s} className="flex items-center gap-1 text-[10px] font-mono bg-[var(--secondary)] text-[var(--muted-foreground)] px-2 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--muted-foreground)]">
          {idea.contributors.length > 0 && <span>{idea.contributors.length} contributors</span>}
          {idea.feedbackItems.length > 0 && <span>{idea.feedbackItems.length} feedback</span>}
          {idea.versions.length > 1 && <span>{idea.versions.length} versions</span>}
          {idea.milestones.filter((m) => m.completed).length > 0 && (
            <span className="text-emerald-600">{idea.milestones.filter((m) => m.completed).length} milestones done</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]">
          <Button
            size="xs"
            variant={buildOn ? 'secondary' : 'primary'}
            onClick={() => { setBuildOn(true); onOpen(); }}
          >
            {buildOn ? '✓ Building on this' : 'Build on this'}
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => { setHelped(true); onOpen(); }}
          >
            {helped ? '✓ Helping' : 'Help this idea'}
          </Button>
          <button
            onClick={onOpen}
            className="ml-auto text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-display transition-colors"
          >
            Open →
          </button>
        </div>
      </div>
    </Card>
  );
}

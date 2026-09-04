import React, { useState } from 'react';
import type { Idea } from '../types';
import { IDEAS, USERS, CHALLENGES } from '../data/mockData';
import { StageChip, Avatar, Card, Button, CompatibilityBadge } from '../components/ui';
import { Search, Lightbulb, Users, Zap, X } from 'lucide-react';

interface SearchViewProps {
  onOpenIdea: (idea: Idea) => void;
}

type ResultType = 'ideas' | 'people' | 'challenges';

function searchIdeas(query: string) {
  const q = query.toLowerCase();
  return IDEAS.filter((i) =>
    i.privacy !== 'PRIVATE' && (
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.topics.some((t) => t.toLowerCase().includes(q)) ||
      i.skillsNeeded.some((s) => s.toLowerCase().includes(q))
    )
  );
}

function searchPeople(query: string) {
  const q = query.toLowerCase();
  return USERS.filter((u) =>
    u.name.toLowerCase().includes(q) ||
    u.title.toLowerCase().includes(q) ||
    u.skills.some((s) => s.name.toLowerCase().includes(q)) ||
    u.interests.some((i) => i.toLowerCase().includes(q))
  );
}

function searchChallenges(query: string) {
  const q = query.toLowerCase();
  return CHALLENGES.filter((c) =>
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export default function SearchView({ onOpenIdea }: SearchViewProps) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<ResultType>('ideas');

  const ideaResults = query.length > 1 ? searchIdeas(query) : [];
  const peopleResults = query.length > 1 ? searchPeople(query) : [];
  const challengeResults = query.length > 1 ? searchChallenges(query) : [];

  const TYPES: { id: ResultType; label: string; Icon: React.ElementType; count: number }[] = [
    { id: 'ideas', label: 'Ideas', Icon: Lightbulb, count: ideaResults.length },
    { id: 'people', label: 'People', Icon: Users, count: peopleResults.length },
    { id: 'challenges', label: 'Challenges', Icon: Zap, count: challengeResults.length },
  ];

  const SUGGESTIONS = ['sustainable food systems', 'accessibility', 'hardware prototyping', 'computer vision', 'campus tech'];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 space-y-6 pb-24 lg:pb-10">
        <h1 className="font-display font-bold text-xl text-[var(--foreground)]">Search</h1>

        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ideas, people, skills, topics…"
            className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Suggestions */}
        {!query && (
          <div className="space-y-3">
            <p className="text-xs font-mono text-[var(--muted-foreground)]">Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] font-display transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result tabs */}
        {query.length > 1 && (
          <>
            <div className="flex gap-2">
              {TYPES.map(({ id, label, Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveType(id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-display font-medium transition-colors ${
                    activeType === id
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                  }`}
                >
                  <Icon size={12} />
                  {label}
                  <span className="font-mono">{count}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {activeType === 'ideas' && (
                ideaResults.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No ideas match &ldquo;{query}&rdquo;</p>
                ) : (
                  ideaResults.map((idea, i) => (
                    <Card key={idea.id} className="p-4" onClick={() => onOpenIdea(idea)}>
                      <StageChip stage={idea.stage} size="xs" />
                      <p className="font-display font-semibold text-sm text-[var(--foreground)] mt-1">{idea.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">{idea.description}</p>
                    </Card>
                  ))
                )
              )}

              {activeType === 'people' && (
                peopleResults.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No people match &ldquo;{query}&rdquo;</p>
                ) : (
                  peopleResults.map((user, i) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={user.initials} size="md" colorIndex={i + 1} />
                        <div className="flex-1">
                          <p className="font-display font-semibold text-sm text-[var(--foreground)]">{user.name}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{user.title}</p>
                          <p className="text-[10px] font-mono text-[var(--muted-foreground)] mt-0.5">{user.availability}</p>
                        </div>
                        <CompatibilityBadge value={Math.floor(75 + Math.random() * 20)} />
                      </div>
                    </Card>
                  ))
                )
              )}

              {activeType === 'challenges' && (
                challengeResults.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No challenges match &ldquo;{query}&rdquo;</p>
                ) : (
                  challengeResults.map((c) => (
                    <Card key={c.id} className="p-4">
                      <p className="font-display font-semibold text-sm text-[var(--foreground)]">{c.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-0.5">{c.description}</p>
                      <p className="text-[10px] font-mono text-[var(--muted-foreground)] mt-1">{c.organization}</p>
                    </Card>
                  ))
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

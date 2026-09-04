import React, { useState, useRef, useEffect } from 'react';
import type { Idea, Stage } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { Button, StageChip, Tag, EmptyState, Card } from '../components/ui';
import { List, Network, Plus } from 'lucide-react';
import { STAGE_LABELS, STAGE_DOTS } from '../components/ui';

interface MyIdeasViewProps {
  ideas: Idea[];
  onOpenIdea: (idea: Idea) => void;
  onCapture: () => void;
}

const STAGE_ORDER: Stage[] = [
  'SPARK', 'INCUBATING', 'EXPLORING', 'SEEKING_FEEDBACK',
  'SEEKING_COLLABORATORS', 'PROTOTYPING', 'ACTIVE_PROJECT', 'COMPLETED', 'ARCHIVED',
];

// Simple radial layout for constellation
function getNodePositions(count: number, cx: number, cy: number) {
  if (count === 0) return [];
  if (count === 1) return [{ x: cx, y: cy }];
  const positions = [{ x: cx, y: cy }];
  const rings = [
    { r: 90, max: 6 },
    { r: 160, max: 10 },
  ];
  let remaining = count - 1;
  for (const ring of rings) {
    if (remaining <= 0) break;
    const inRing = Math.min(remaining, ring.max);
    for (let i = 0; i < inRing; i++) {
      const angle = (2 * Math.PI * i) / inRing - Math.PI / 2;
      positions.push({
        x: cx + ring.r * Math.cos(angle),
        y: cy + ring.r * Math.sin(angle),
      });
    }
    remaining -= inRing;
  }
  return positions;
}

const STAGE_SVG_COLORS: Record<Stage, string> = {
  SPARK: '#F59E0B',
  INCUBATING: '#F97316',
  EXPLORING: '#0EA5E9',
  SEEKING_FEEDBACK: '#3B82F6',
  SEEKING_COLLABORATORS: '#7C3AED',
  PROTOTYPING: '#8B5CF6',
  ACTIVE_PROJECT: '#10B981',
  COMPLETED: '#6B7280',
  ARCHIVED: '#9CA3AF',
};

function ConstellationView({ ideas, onOpenIdea }: { ideas: Idea[]; onOpenIdea: (idea: Idea) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const W = 520, H = 400;
  const cx = W / 2, cy = H / 2;
  const positions = getNodePositions(ideas.length, cx, cy);

  if (ideas.length === 0) {
    return (
      <EmptyState
        icon="✦"
        headline="Every project begins as something unfinished."
        subtext="Your idea universe is waiting. Capture your first thought."
      />
    );
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        ref={containerRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-2xl mx-auto"
        style={{ minWidth: 320 }}
      >
        {/* Connection lines between related ideas */}
        {ideas.map((idea, i) => {
          const from = positions[i];
          return idea.relatedIdeas.map((rid) => {
            const j = ideas.findIndex((x) => x.id === rid);
            if (j < 0 || j <= i) return null;
            const to = positions[j];
            return (
              <line
                key={`${idea.id}-${rid}`}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          });
        })}

        {/* Nodes */}
        {ideas.map((idea, i) => {
          const pos = positions[i];
          const isHovered = hovered === idea.id;
          const color = STAGE_SVG_COLORS[idea.stage];
          const r = i === 0 ? 28 : 20;

          return (
            <g
              key={idea.id}
              className="cursor-pointer node-pop"
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => onOpenIdea(idea)}
              onMouseEnter={() => setHovered(idea.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={idea.title}
            >
              {/* Glow ring when hovered */}
              {isHovered && (
                <circle cx={pos.x} cy={pos.y} r={r + 8} fill={color} opacity="0.15" />
              )}
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'r 0.15s, opacity 0.15s' }}
              />
              {/* Inner dot */}
              <circle cx={pos.x} cy={pos.y} r={r * 0.35} fill="white" opacity="0.8" />

              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + r + 14}
                textAnchor="middle"
                fontSize="10"
                fill="var(--muted-foreground)"
                fontFamily="var(--font-body)"
                style={{ pointerEvents: 'none' }}
              >
                {idea.title.length > 22 ? idea.title.slice(0, 22) + '…' : idea.title}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hovered tooltip */}
      {hovered && (() => {
        const idea = ideas.find((i) => i.id === hovered);
        if (!idea) return null;
        return (
          <div className="absolute left-4 bottom-4 bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-lg max-w-xs pointer-events-none">
            <StageChip stage={idea.stage} />
            <p className="font-display font-semibold text-sm mt-1 text-[var(--foreground)]">{idea.title}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">{idea.description}</p>
          </div>
        );
      })()}
    </div>
  );
}

export default function MyIdeasView({ ideas, onOpenIdea, onCapture }: MyIdeasViewProps) {
  const [view, setView] = useState<'universe' | 'list'>('universe');
  const [filterStage, setFilterStage] = useState<Stage | 'ALL'>('ALL');
  const myIdeas = ideas.filter((i) => i.author.id === CURRENT_USER.id);
  const filtered = filterStage === 'ALL' ? myIdeas : myIdeas.filter((i) => i.stage === filterStage);
  const stages = [...new Set(myIdeas.map((i) => i.stage))];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-display font-bold text-xl text-[var(--foreground)]">My Idea Universe</h1>
          <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">{myIdeas.length} ideas · {myIdeas.filter((i) => i.contributors.length > 0).length} with collaborators</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
            <button
              onClick={() => setView('universe')}
              className={`p-2 transition-colors ${view === 'universe' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'}`}
              title="Constellation view"
            >
              <Network size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 transition-colors ${view === 'list' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'}`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
          <Button size="sm" onClick={onCapture}>
            <Plus size={14} /> New idea
          </Button>
        </div>
      </div>

      {/* Stage filter */}
      <div className="flex gap-2 overflow-x-auto px-4 lg:px-6 py-3 border-b border-[var(--border)]">
        <button
          onClick={() => setFilterStage('ALL')}
          className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-mono transition-colors ${filterStage === 'ALL' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'}`}
        >
          All ({myIdeas.length})
        </button>
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-mono transition-colors ${filterStage === stage ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${STAGE_DOTS[stage]}`} />
            {STAGE_LABELS[stage]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
        {view === 'universe' ? (
          <div className="relative">
            <ConstellationView ideas={filtered} onOpenIdea={onOpenIdea} />
            <div className="mt-6 border-t border-[var(--border)] pt-6">
              <p className="text-xs text-[var(--muted-foreground)] font-mono mb-3">Connected ideas share a dashed thread. Click a node to open.</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(STAGE_SVG_COLORS).slice(0, 6).map(([stage, color]) => (
                  <div key={stage} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{STAGE_LABELS[stage as Stage]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <EmptyState
                icon="💡"
                headline="Every project begins as something unfinished."
                subtext="Capture your first thought."
                cta="Capture your first thought"
                onCta={onCapture}
              />
            ) : (
              filtered.map((idea) => (
                <IdeaListCard key={idea.id} idea={idea} onClick={() => onOpenIdea(idea)} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IdeaListCard({ idea, onClick }: { idea: Idea; onClick: () => void }) {
  return (
    <Card className="p-4" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <StageChip stage={idea.stage} />
            <span className="text-xs text-[var(--muted-foreground)] font-mono">{idea.privacy.replace('_', ' ').toLowerCase()}</span>
          </div>
          <p className="font-display font-semibold text-sm text-[var(--foreground)]">{idea.title}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">{idea.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{idea.versions.length} versions</span>
            {idea.contributors.length > 0 && <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{idea.contributors.length} collaborators</span>}
            {idea.feedbackItems.length > 0 && <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{idea.feedbackItems.length} feedback</span>}
          </div>
        </div>
        <div className="flex-shrink-0 text-[10px] font-mono text-[var(--muted-foreground)]">
          {idea.updatedAt.split('-').slice(1).join('/')}
        </div>
      </div>
    </Card>
  );
}

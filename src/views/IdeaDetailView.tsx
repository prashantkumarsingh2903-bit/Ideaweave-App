import React, { useState, useEffect } from 'react';
import type { Idea, Stage, Privacy } from '../types';
import { IDEAS, POTENTIAL_COLLABORATORS_FOR_IDEA } from '../data/mockData';
import {
  Button, StageChip, PrivacyChip, Avatar, Card, Tag, ProgressBar,
  CompatibilityBadge, LoadingDots, SectionLabel, SkillBadge, Divider,
  STAGE_LABELS, PRIVACY_LABELS,
} from '../components/ui';
import { getAIInsight, getNextStep } from '../lib/mockAI';
import type { AIInsight } from '../types';
import {
  ArrowLeft, GitBranch, Users, MessageSquare, Clock, Sparkles,
  Lock, ChevronDown, ExternalLink, Plus, Check, AlertCircle,
  Layers, Target, Edit2,
} from 'lucide-react';

interface IdeaDetailViewProps {
  idea: Idea;
  onBack: () => void;
  onUpdateIdea: (idea: Idea) => void;
  onFork: (idea: Idea) => void;
}

type Tab = 'overview' | 'evolution' | 'collaborators' | 'feedback' | 'workspace';

const FEEDBACK_TYPES = [
  'Validate the problem', 'Challenge the assumption', 'Suggest an alternative',
  'Improve the UX', 'Technical feasibility', 'Business viability',
  'Research evidence', 'Find missing perspectives',
];

const STAGES: Stage[] = [
  'SPARK', 'INCUBATING', 'EXPLORING', 'SEEKING_FEEDBACK',
  'SEEKING_COLLABORATORS', 'PROTOTYPING', 'ACTIVE_PROJECT', 'COMPLETED',
];

const PRIVACIES: Privacy[] = ['PRIVATE', 'TRUSTED_CIRCLE', 'SELECTED_EXPERTS', 'COMMUNITY', 'PUBLIC'];

export default function IdeaDetailView({ idea, onBack, onUpdateIdea, onFork }: IdeaDetailViewProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showWeave, setShowWeave] = useState(false);
  const [nextStep, setNextStep] = useState<string>('');
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showPrivacySelector, setShowPrivacySelector] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const [selectedFeedbackType, setSelectedFeedbackType] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const potentialCollabs = POTENTIAL_COLLABORATORS_FOR_IDEA(idea.id);

  const loadAI = async () => {
    if (aiInsight) { setShowWeave(true); return; }
    setAiLoading(true);
    setShowWeave(true);
    const [insight, step] = await Promise.all([getAIInsight(idea), getNextStep(idea)]);
    setAiInsight(insight);
    setNextStep(step);
    setAiLoading(false);
  };

  const handleStageChange = (stage: Stage) => {
    onUpdateIdea({ ...idea, stage });
    setShowStageSelector(false);
  };

  const handlePrivacyChange = (privacy: Privacy) => {
    onUpdateIdea({ ...idea, privacy });
    setShowPrivacySelector(false);
  };

  const handleSave = () => {
    onUpdateIdea({ ...idea, saved: !idea.saved });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackDraft.trim() || !selectedFeedbackType) return;
    setFeedbackSubmitted(true);
    setFeedbackDraft('');
    setSelectedFeedbackType('');
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  const relatedIdeas = IDEAS.filter((i) => idea.relatedIdeas.includes(i.id));
  const completedMilestones = idea.milestones.filter((m) => m.completed).length;
  const missingSkills = idea.skillsNeeded.filter((s) => !idea.contributors.some((c) => c.role.toLowerCase().includes(s.toLowerCase())));

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'evolution', label: 'Evolution', count: idea.versions.length },
    { id: 'collaborators', label: 'Collaborators', count: idea.contributors.length },
    { id: 'feedback', label: 'Feedback', count: idea.feedbackItems.length },
    { id: 'workspace', label: 'Workspace', count: idea.milestones.length },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--border)] px-4 lg:px-6 py-4">
        <div className="flex items-start gap-3">
          <button onClick={onBack} className="mt-0.5 p-1 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors flex-shrink-0">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {/* Stage selector */}
              <div className="relative">
                <button onClick={() => setShowStageSelector(!showStageSelector)} className="flex items-center gap-1">
                  <StageChip stage={idea.stage} />
                  <ChevronDown size={11} className="text-[var(--muted-foreground)]" />
                </button>
                {showStageSelector && (
                  <div className="absolute top-7 left-0 z-20 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[200px]">
                    {STAGES.map((s) => (
                      <button key={s} onClick={() => handleStageChange(s)}
                        className={`w-full text-left px-3 py-2 text-xs font-mono hover:bg-[var(--secondary)] ${idea.stage === s ? 'text-[var(--primary)] font-semibold' : 'text-[var(--foreground)]'}`}>
                        {STAGE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy selector */}
              <div className="relative">
                <button onClick={() => setShowPrivacySelector(!showPrivacySelector)} className="flex items-center gap-1">
                  <PrivacyChip privacy={idea.privacy} />
                  <ChevronDown size={11} className="text-[var(--muted-foreground)]" />
                </button>
                {showPrivacySelector && (
                  <div className="absolute top-7 left-0 z-20 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[180px]">
                    {PRIVACIES.map((p) => (
                      <button key={p} onClick={() => handlePrivacyChange(p)}
                        className={`w-full text-left px-3 py-2 text-xs font-mono hover:bg-[var(--secondary)] ${idea.privacy === p ? 'text-[var(--primary)] font-semibold' : 'text-[var(--foreground)]'}`}>
                        {PRIVACY_LABELS[p]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {idea.topics.slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <h1 className="font-display font-bold text-lg lg:text-xl text-[var(--foreground)] leading-tight">{idea.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5">
                <Avatar initials={idea.author.initials} size="xs" colorIndex={0} />
                <span className="text-xs text-[var(--muted-foreground)]">{idea.author.name}</span>
              </div>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">{idea.updatedAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleSave} className={`p-1.5 rounded hover:bg-[var(--secondary)] transition-colors ${idea.saved ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
              {idea.saved ? '★' : '☆'}
            </button>
            <Button variant="ghost" size="sm" onClick={loadAI}>
              <Sparkles size={13} /> Weave
            </Button>
            <Button variant="outline" size="sm" onClick={() => onFork(idea)}>
              <GitBranch size={13} /> Fork
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto -mb-px">
          {TABS.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-display font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === id
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {label}
              {count !== undefined && count > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${tab === id ? 'bg-indigo-100 text-indigo-700' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>{count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className={`grid ${showWeave ? 'lg:grid-cols-[1fr_300px]' : 'grid-cols-1'}`}>
          {/* Main content */}
          <div className="px-4 lg:px-6 py-6 space-y-8 min-w-0">

            {/* Missing Piece component */}
            {missingSkills.length > 0 && (idea.stage === 'EXPLORING' || idea.stage === 'SEEKING_COLLABORATORS' || idea.stage === 'INCUBATING') && (
              <div className="border border-violet-200 bg-violet-50/50 rounded-xl p-4">
                <p className="text-xs font-mono text-violet-600 mb-2">Missing Piece</p>
                <p className="font-display font-semibold text-sm text-[var(--foreground)] mb-3">Your idea may be missing…</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {missingSkills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 bg-white border border-violet-200 text-violet-800 rounded font-mono">{s}</span>
                  ))}
                </div>
                <button onClick={() => setTab('collaborators')} className="text-xs text-violet-700 font-display font-semibold hover:underline flex items-center gap-1">
                  Find someone who can help <ArrowLeft size={11} className="rotate-180" />
                </button>
              </div>
            )}

            {tab === 'overview' && <OverviewTab idea={idea} relatedIdeas={relatedIdeas} />}
            {tab === 'evolution' && <EvolutionTab idea={idea} />}
            {tab === 'collaborators' && <CollaboratorsTab idea={idea} potentialCollabs={potentialCollabs} />}
            {tab === 'feedback' && (
              <FeedbackTab
                idea={idea}
                feedbackDraft={feedbackDraft}
                setFeedbackDraft={setFeedbackDraft}
                selectedType={selectedFeedbackType}
                setSelectedType={setSelectedFeedbackType}
                onSubmit={handleFeedbackSubmit}
                submitted={feedbackSubmitted}
              />
            )}
            {tab === 'workspace' && <WorkspaceTab idea={idea} onUpdateIdea={onUpdateIdea} />}
          </div>

          {/* Weave panel */}
          {showWeave && (
            <div className="border-l border-[var(--border)] px-4 py-6 space-y-6 lg:block hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--primary)]" />
                  <span className="font-display font-semibold text-sm text-[var(--foreground)]">Weave</span>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)] bg-[var(--secondary)] px-1.5 py-0.5 rounded">AI thinking partner</span>
                </div>
                <button onClick={() => setShowWeave(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">✕</button>
              </div>

              {aiLoading ? (
                <div className="py-8 flex flex-col items-center gap-3">
                  <LoadingDots />
                  <p className="text-xs text-[var(--muted-foreground)] font-mono">Thinking about your idea…</p>
                </div>
              ) : aiInsight ? (
                <WeaveContent insight={aiInsight} nextStep={nextStep} />
              ) : null}

              {/* Health panel */}
              <div>
                <p className="text-xs font-mono text-[var(--muted-foreground)] mb-3">Idea Health · AI-assisted reflection</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Clarity', value: idea.health.clarity, color: 'bg-indigo-500' },
                    { label: 'Evidence', value: idea.health.evidence, color: 'bg-sky-500' },
                    { label: 'Feasibility', value: idea.health.feasibility, color: 'bg-violet-500' },
                    { label: 'Collab ready', value: idea.health.collaborationReadiness, color: 'bg-emerald-500' },
                    { label: 'Exec ready', value: idea.health.executionReadiness, color: 'bg-amber-500' },
                  ].map(({ label, value, color }) => (
                    <ProgressBar key={label} label={label} value={value} color={color} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[var(--foreground)] text-[var(--background)] text-sm font-display font-medium px-4 py-2 rounded-full shadow-lg z-50">
          {idea.saved ? '★ Saved to your library' : 'Removed from saved'}
        </div>
      )}

      {/* Close dropdowns on outside click */}
      {(showStageSelector || showPrivacySelector) && (
        <div className="fixed inset-0 z-10" onClick={() => { setShowStageSelector(false); setShowPrivacySelector(false); }} />
      )}
    </div>
  );
}

// ─── Tab panels ────────────────────────────────────────────────────────────────

function OverviewTab({ idea, relatedIdeas }: { idea: Idea; relatedIdeas: Idea[] }) {
  return (
    <div className="space-y-8">
      {/* 01 The Spark */}
      <div>
        <SectionLabel number="01">The Spark</SectionLabel>
        <blockquote className="border-l-2 border-[var(--primary)] pl-4 text-[var(--foreground)] text-sm leading-relaxed font-display italic">
          &ldquo;{idea.originalThought}&rdquo;
        </blockquote>
      </div>

      {/* 02 Why it matters */}
      <div>
        <SectionLabel number="02">Why it matters</SectionLabel>
        <p className="text-sm text-[var(--foreground)] leading-relaxed">{idea.whyItMatters}</p>
      </div>

      {/* 03 What I'm exploring */}
      <div>
        <SectionLabel number="03">What I&apos;m exploring</SectionLabel>
        <ul className="space-y-2">
          {idea.openQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
              <span className="font-mono text-[var(--primary)] text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 04 Skills needed */}
      {idea.skillsNeeded.length > 0 && (
        <div>
          <SectionLabel number="04">People I need</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {idea.skillsNeeded.map((s) => (
              <SkillBadge key={s} name={s} />
            ))}
          </div>
        </div>
      )}

      {/* 05 References */}
      {idea.references.length > 0 && (
        <div>
          <SectionLabel number="05">References</SectionLabel>
          <div className="space-y-2">
            {idea.references.map((ref, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <ExternalLink size={12} className="text-[var(--muted-foreground)] flex-shrink-0" />
                <span className="text-[var(--primary)] hover:underline cursor-pointer font-display">{ref.title}</span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{ref.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 06 Next move */}
      <div>
        <SectionLabel number="06">Next move</SectionLabel>
        <div className="flex items-start gap-3 p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
          <Target size={16} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--foreground)] leading-relaxed font-display font-medium">{idea.nextMove}</p>
        </div>
      </div>

      {/* Related ideas */}
      {relatedIdeas.length > 0 && (
        <div>
          <SectionLabel>Related ideas</SectionLabel>
          <div className="space-y-2">
            {relatedIdeas.map((ri) => (
              <div key={ri.id} className="flex items-center gap-2 p-2.5 bg-[var(--secondary)] rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-colors">
                <StageChip stage={ri.stage} size="xs" />
                <span className="text-sm font-display font-medium text-[var(--foreground)]">{ri.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EvolutionTab({ idea }: { idea: Idea }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted-foreground)]">A visible history of how this idea has grown.</p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-[var(--border)]" />

        <div className="space-y-6">
          {idea.versions.map((v, i) => (
            <div key={v.version} className="flex gap-4 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${i === 0 ? 'bg-[var(--secondary)] border-2 border-[var(--border)]' : 'bg-[var(--primary)]'}`}>
                <span className="text-[10px] font-mono font-bold" style={{ color: i === 0 ? 'var(--muted-foreground)' : 'white' }}>{v.version}</span>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-sm text-[var(--foreground)]">{v.label}</span>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{v.date}</span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{v.description}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Avatar initials={v.changedBy.split(' ').map((n) => n[0]).join('')} size="xs" colorIndex={i} />
                  <span className="text-xs text-[var(--muted-foreground)]">{v.changedBy}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">·</span>
                  <span className="text-xs text-[var(--muted-foreground)] italic">{v.reason}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Future */}
          <div className="flex gap-4 relative opacity-40">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center flex-shrink-0 z-10 bg-[var(--background)]">
              <Plus size={12} className="text-[var(--muted-foreground)]" />
            </div>
            <div className="flex-1 pb-2 pt-1.5">
              <span className="text-xs font-mono text-[var(--muted-foreground)]">Next version</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lineage */}
      {idea.forks.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <SectionLabel>Idea Lineage</SectionLabel>
          <p className="text-sm text-[var(--muted-foreground)]">{idea.forks.length} fork(s) have branched from this idea.</p>
        </div>
      )}
    </div>
  );
}

function CollaboratorsTab({ idea, potentialCollabs }: { idea: Idea; potentialCollabs: ReturnType<typeof POTENTIAL_COLLABORATORS_FOR_IDEA> }) {
  const [invited, setInvited] = useState<Set<string>>(new Set(idea.contributors.filter((c) => c.status === 'invited').map((c) => c.user.id)));
  const [showInviteFor, setShowInviteFor] = useState<string | null>(null);
  const [inviteReason, setInviteReason] = useState<string[]>([]);
  const [inviteRole, setInviteRole] = useState('');

  const inviteReasons = ['Need their expertise', 'Need feedback', 'Need co-builder', 'Need research help', 'Need technical validation', 'Need design help'];

  const handleInvite = (userId: string) => {
    setInvited((prev) => new Set([...prev, userId]));
    setShowInviteFor(null);
    setInviteReason([]);
    setInviteRole('');
  };

  return (
    <div className="space-y-8">
      {/* Active collaborators */}
      {idea.contributors.length > 0 && (
        <div>
          <SectionLabel>Active collaborators</SectionLabel>
          <div className="space-y-3">
            {idea.contributors.map((c, i) => (
              <Card key={c.user.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar initials={c.user.initials} size="md" colorIndex={i + 1} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm text-[var(--foreground)]">{c.user.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        c.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                        c.status === 'invited' ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {c.status === 'active' ? 'Currently active' : c.status === 'invited' ? 'Invited' : c.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">{c.user.title} · {c.role}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1 italic">{c.matchReason}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                        Commitment: {c.commitmentHours} hrs/week
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Potential collaborators */}
      <div>
        <SectionLabel>People who could help</SectionLabel>
        <div className="space-y-3">
          {potentialCollabs.slice(0, 4).map(({ user, compatibility, matchReason, relevantProject }, i) => {
            const isInvited = invited.has(user.id);
            const isActive = idea.contributors.some((c) => c.user.id === user.id);
            if (isActive) return null;
            return (
              <Card key={user.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar initials={user.initials} size="md" colorIndex={i + 2} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-semibold text-sm text-[var(--foreground)]">{user.name}</span>
                      <CompatibilityBadge value={compatibility} />
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">{user.title} · {user.availability}</p>
                    <div className="mt-2 p-2.5 bg-[var(--secondary)] rounded-lg">
                      <p className="text-xs text-[var(--foreground)] font-display font-medium mb-0.5">Why this person?</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{matchReason}</p>
                    </div>
                    <p className="text-[10px] font-mono text-[var(--muted-foreground)] mt-1.5">Previous: {relevantProject}</p>
                    <div className="flex gap-2 mt-3">
                      {isInvited ? (
                        <span className="text-xs text-emerald-700 font-display font-medium flex items-center gap-1">
                          <Check size={12} /> Invitation sent
                        </span>
                      ) : (
                        <>
                          <Button size="xs" onClick={() => setShowInviteFor(user.id)}>Build with me</Button>
                          <Button size="xs" variant="outline">Ask for feedback</Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invite modal */}
                {showInviteFor === user.id && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                    <p className="text-xs font-display font-semibold text-[var(--foreground)]">Why are you inviting them?</p>
                    <div className="flex flex-wrap gap-2">
                      {inviteReasons.map((r) => (
                        <button
                          key={r}
                          onClick={() => setInviteReason((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])}
                          className={`text-xs px-2.5 py-1 rounded border transition-colors font-display ${inviteReason.includes(r) ? 'border-[var(--primary)] bg-indigo-50 text-[var(--primary)]' : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <input
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      placeholder="Their role (e.g. Hardware Lead)"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
                    />
                    <div className="flex gap-2">
                      <Button size="xs" onClick={() => handleInvite(user.id)} disabled={inviteReason.length === 0}>Send invitation</Button>
                      <Button size="xs" variant="ghost" onClick={() => setShowInviteFor(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeedbackTab({ idea, feedbackDraft, setFeedbackDraft, selectedType, setSelectedType, onSubmit, submitted }: {
  idea: Idea;
  feedbackDraft: string;
  setFeedbackDraft: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  onSubmit: () => void;
  submitted: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Give feedback */}
      <div>
        <SectionLabel>Give structured feedback</SectionLabel>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">Choose a type before responding. This keeps feedback useful.</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {FEEDBACK_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? '' : type)}
              className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors font-display ${
                selectedType === type
                  ? 'border-[var(--primary)] bg-indigo-50 text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {selectedType && (
          <div className="space-y-3">
            <textarea
              value={feedbackDraft}
              onChange={(e) => setFeedbackDraft(e.target.value)}
              placeholder={`Your response on "${selectedType}"…`}
              rows={4}
              className="w-full text-sm px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] resize-none"
            />
            <Button size="sm" onClick={onSubmit} disabled={!feedbackDraft.trim()}>
              Submit feedback
            </Button>
          </div>
        )}
        {submitted && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl">
            <Check size={14} /> Feedback submitted. Thank you.
          </div>
        )}
      </div>

      {/* Existing feedback */}
      {idea.feedbackItems.length > 0 && (
        <div>
          <SectionLabel>Received feedback</SectionLabel>
          <div className="space-y-4">
            {idea.feedbackItems.map((fb, i) => (
              <Card key={fb.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar initials={fb.author.initials} size="sm" colorIndex={i + 2} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-semibold text-sm text-[var(--foreground)]">{fb.author.name}</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{fb.type}</span>
                    </div>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">{fb.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{fb.date}</span>
                      <button className="text-[10px] text-emerald-700 font-mono hover:underline">Mark useful</button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkspaceTab({ idea, onUpdateIdea }: { idea: Idea; onUpdateIdea: (idea: Idea) => void }) {
  const toggleMilestone = (id: string) => {
    onUpdateIdea({
      ...idea,
      milestones: idea.milestones.map((m) => m.id === id ? { ...m, completed: !m.completed } : m),
    });
  };
  const done = idea.milestones.filter((m) => m.completed).length;

  return (
    <div className="space-y-8">
      {/* Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Milestones</SectionLabel>
          <span className="text-xs font-mono text-[var(--muted-foreground)]">{done}/{idea.milestones.length} done</span>
        </div>
        {idea.milestones.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">No milestones yet. Add one to track progress.</p>
        ) : (
          <div className="space-y-2">
            {idea.milestones.map((m) => (
              <div
                key={m.id}
                onClick={() => toggleMilestone(m.id)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-colors group"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${m.completed ? 'border-emerald-500 bg-emerald-500' : 'border-[var(--border)] group-hover:border-[var(--primary)]'}`}>
                  {m.completed && <Check size={11} className="text-white" />}
                </div>
                <span className={`text-sm font-display flex-1 ${m.completed ? 'line-through text-[var(--muted-foreground)]' : 'text-[var(--foreground)]'}`}>{m.title}</span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{m.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Commitment contracts */}
      {idea.contributors.filter((c) => c.status === 'active').length > 0 && (
        <div>
          <SectionLabel>Commitment contracts</SectionLabel>
          <div className="space-y-3">
            {idea.contributors.filter((c) => c.status === 'active').map((c, i) => (
              <Card key={c.user.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={c.user.initials} size="sm" colorIndex={i + 1} />
                  <div className="flex-1">
                    <p className="font-display font-semibold text-sm text-[var(--foreground)]">{c.user.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{c.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-[var(--foreground)]">{c.commitmentHours} hrs/week</p>
                    <p className="text-[10px] font-mono text-emerald-600">Currently active</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Build With Me */}
      <div className="border border-[var(--border)] rounded-xl p-5 space-y-4">
        <p className="text-xs font-mono text-[var(--muted-foreground)]">Build With Me</p>
        <p className="font-display font-bold text-lg text-[var(--foreground)]">Build with me</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'What exists', value: `${idea.versions.length} versions, ${idea.contributors.length} collaborators` },
            { label: 'What is missing', value: idea.skillsNeeded.slice(0, 2).join(', ') || 'Being defined' },
            { label: 'Contribution needed', value: idea.skillsNeeded[0] || 'TBD' },
            { label: 'Time commitment', value: '3–6 hrs/week' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-0.5">{label}</p>
              <p className="text-sm text-[var(--foreground)] font-display">{value}</p>
            </div>
          ))}
        </div>
        <Button size="sm" className="w-full">Express interest in collaborating</Button>
      </div>
    </div>
  );
}

function WeaveContent({ insight, nextStep }: { insight: AIInsight; nextStep: string }) {
  const [activeSection, setActiveSection] = useState<string | null>('expand');

  const sections = [
    { id: 'expand', label: 'Expand', content: insight.expand },
    { id: 'challenge', label: 'Challenge', content: insight.challenge.join('\n\n') },
    { id: 'gaps', label: 'Find gaps', content: insight.gaps.join('\n') },
    { id: 'next', label: 'Next step', content: nextStep },
  ];

  return (
    <div className="space-y-3">
      {sections.map(({ id, label, content }) => (
        <div key={id} className="border border-[var(--border)] rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === id ? null : id)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-display font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
          >
            {label}
            <ChevronDown size={12} className={`transition-transform ${activeSection === id ? 'rotate-180' : ''}`} />
          </button>
          {activeSection === id && (
            <div className="px-3 pb-3 pt-0.5 text-xs text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
              {content}
            </div>
          )}
        </div>
      ))}

      <div className="pt-1">
        <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-2">Missing expertise</p>
        <div className="flex flex-wrap gap-1.5">
          {insight.missingExpertise.map((e) => (
            <span key={e} className="text-[10px] font-mono bg-violet-50 text-violet-700 px-2 py-0.5 rounded">{e}</span>
          ))}
        </div>
      </div>

      <p className="text-[10px] font-mono text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
        Weave distinguishes AI suggestions from your original thinking. The Spark section always preserves your words.
      </p>
    </div>
  );
}

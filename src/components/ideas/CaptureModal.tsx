import React, { useState, useRef } from 'react';
import type { Idea, Stage, Privacy } from '../../types';
import { CURRENT_USER } from '../../data/mockData';
import { Button } from '../ui';
import { X, Mic, Image, Link2, Zap, Check } from 'lucide-react';

interface CaptureModalProps {
  onClose: () => void;
  onSave: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

type CaptureMode = 'text' | 'voice' | 'link' | 'quick';
type PostAction = 'save' | 'explore' | 'feedback' | 'collaborators' | 'project';

const POST_ACTIONS: { id: PostAction; label: string; desc: string }[] = [
  { id: 'save', label: 'Just save it', desc: 'Keep it private for now' },
  { id: 'explore', label: 'Explore it', desc: 'AI will help you think it through' },
  { id: 'feedback', label: 'Get feedback', desc: 'Share with your trusted circle' },
  { id: 'collaborators', label: 'Find collaborators', desc: 'Open it to the community' },
  { id: 'project', label: 'Turn it into a project', desc: 'Commit and find a team' },
];

export default function CaptureModal({ onClose, onSave }: CaptureModalProps) {
  const [mode, setMode] = useState<CaptureMode>('text');
  const [thought, setThought] = useState('');
  const [title, setTitle] = useState('');
  const [postAction, setPostAction] = useState<PostAction | null>(null);
  const [step, setStep] = useState<'capture' | 'action'>('capture');
  const [recording, setRecording] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleContinue = () => {
    if (!thought.trim()) return;
    if (!title.trim()) setTitle(thought.slice(0, 60));
    setStep('action');
  };

  const handleSave = () => {
    const privacyMap: Record<PostAction, Privacy> = {
      save: 'PRIVATE',
      explore: 'PRIVATE',
      feedback: 'TRUSTED_CIRCLE',
      collaborators: 'COMMUNITY',
      project: 'COMMUNITY',
    };
    const stageMap: Record<PostAction, Stage> = {
      save: 'SPARK',
      explore: 'INCUBATING',
      feedback: 'SEEKING_FEEDBACK',
      collaborators: 'SEEKING_COLLABORATORS',
      project: 'EXPLORING',
    };
    const action = postAction || 'save';

    onSave({
      title: title || thought.slice(0, 60),
      originalThought: thought,
      description: '',
      stage: stageMap[action],
      privacy: privacyMap[action],
      author: CURRENT_USER,
      topics: [],
      skillsNeeded: [],
      openQuestions: [],
      references: [],
      versions: [{ version: 'V0.1', label: 'Raw spark', description: thought.slice(0, 100), date: new Date().toISOString().slice(0, 10), changedBy: CURRENT_USER.name, reason: 'Initial capture' }],
      contributors: [],
      feedbackItems: [],
      feedbackRequests: [],
      relatedIdeas: [],
      forks: [],
      milestones: [],
      saved: false,
      health: { clarity: 30, evidence: 10, feasibility: 40, collaborationReadiness: 15, executionReadiness: 10 },
      whyItMatters: '',
      nextMove: 'Return to this thought soon and ask: what specifically bothers you about the current situation?',
    });
  };

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setThought('What if we could make it easier for hostel students to share surplus food between rooms instead of throwing it away?');
      setMode('text');
    } else {
      setRecording(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="font-display font-bold text-base text-[var(--foreground)]">
              {step === 'capture' ? 'Capture an idea' : 'What would you like to do?'}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {step === 'capture' ? 'Under 20 seconds. No pressure.' : 'You can change this at any time.'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors">
            <X size={16} />
          </button>
        </div>

        {step === 'capture' ? (
          <div className="p-5 space-y-4">
            {/* Mode switcher */}
            <div className="flex gap-1 p-1 bg-[var(--secondary)] rounded-xl">
              {([
                { id: 'text', label: 'Text', Icon: null },
                { id: 'voice', label: 'Voice', Icon: Mic },
                { id: 'link', label: 'Link', Icon: Link2 },
                { id: 'quick', label: 'Quick', Icon: Zap },
              ] as { id: CaptureMode; label: string; Icon: React.ElementType | null }[]).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-display font-medium transition-colors ${
                    mode === id ? 'bg-white shadow-sm text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  {Icon && <Icon size={11} />}
                  {label}
                </button>
              ))}
            </div>

            {mode === 'text' && (
              <div className="space-y-3">
                <textarea
                  ref={textRef}
                  autoFocus
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="What are you thinking? Don't edit yourself."
                  rows={4}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] resize-none"
                />
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give it a name (optional)"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
                />
              </div>
            )}

            {mode === 'voice' && (
              <div className="text-center py-6 space-y-4">
                <button
                  onClick={toggleRecording}
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all ${
                    recording ? 'bg-red-500 animate-pulse scale-110' : 'bg-[var(--primary)] hover:opacity-90'
                  }`}
                >
                  <Mic size={24} className="text-white" />
                </button>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {recording ? 'Recording… tap to stop' : 'Tap and speak your idea'}
                </p>
                {thought && (
                  <div className="text-left p-3 bg-[var(--secondary)] rounded-xl">
                    <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-1">Transcribed</p>
                    <p className="text-sm text-[var(--foreground)]">{thought}</p>
                  </div>
                )}
              </div>
            )}

            {mode === 'link' && (
              <input
                autoFocus
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && thought.startsWith('http')) {
                    setTitle('Inspired by: ' + new URL(thought).hostname);
                    setThought('A thought inspired by this link: ' + thought + '\\n\\nThis addresses a gap I noticed recently.');
                    setMode('text');
                  }
                }}
                placeholder="Paste a link and press Enter..."
                className="w-full text-sm px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
              />
            )}

            {mode === 'quick' && (
              <input
                autoFocus
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="One line. Just the spark."
                className="w-full text-lg px-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] font-display"
              />
            )}

            <Button onClick={handleContinue} disabled={!thought.trim()} className="w-full">
              Continue
            </Button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Show what was captured */}
            <div className="p-3 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-1">Your thought</p>
              <p className="text-sm text-[var(--foreground)] leading-relaxed line-clamp-2">{thought}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {POST_ACTIONS.map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setPostAction(postAction === id ? null : id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left ${
                    postAction === id
                      ? 'border-[var(--primary)] bg-indigo-50'
                      : 'border-[var(--border)] hover:border-[var(--primary)]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${postAction === id ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border)]'}`}>
                    {postAction === id && <Check size={11} className="text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-display font-semibold ${postAction === id ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep('capture')}>Back</Button>
              <Button onClick={handleSave} className="flex-1">
                {postAction ? POST_ACTIONS.find((a) => a.id === postAction)?.label : 'Save idea'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

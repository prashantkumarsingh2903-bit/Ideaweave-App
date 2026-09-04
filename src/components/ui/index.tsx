import React from 'react';
import type { Stage, Privacy } from '../../types';

// ─── Stage helpers ────────────────────────────────────────────────────────────

export const STAGE_LABELS: Record<Stage, string> = {
  SPARK: 'Spark',
  INCUBATING: 'Incubating',
  EXPLORING: 'Exploring',
  SEEKING_FEEDBACK: 'Seeking Feedback',
  SEEKING_COLLABORATORS: 'Seeking Collaborators',
  PROTOTYPING: 'Prototyping',
  ACTIVE_PROJECT: 'Active Project',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

export const STAGE_COLORS: Record<Stage, string> = {
  SPARK: 'bg-amber-100 text-amber-800 border-amber-200',
  INCUBATING: 'bg-orange-100 text-orange-800 border-orange-200',
  EXPLORING: 'bg-sky-100 text-sky-800 border-sky-200',
  SEEKING_FEEDBACK: 'bg-blue-100 text-blue-800 border-blue-200',
  SEEKING_COLLABORATORS: 'bg-violet-100 text-violet-800 border-violet-200',
  PROTOTYPING: 'bg-purple-100 text-purple-800 border-purple-200',
  ACTIVE_PROJECT: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  COMPLETED: 'bg-gray-100 text-gray-600 border-gray-200',
  ARCHIVED: 'bg-gray-50 text-gray-400 border-gray-100',
};

export const STAGE_DOTS: Record<Stage, string> = {
  SPARK: 'bg-amber-400',
  INCUBATING: 'bg-orange-400',
  EXPLORING: 'bg-sky-400',
  SEEKING_FEEDBACK: 'bg-blue-500',
  SEEKING_COLLABORATORS: 'bg-violet-500',
  PROTOTYPING: 'bg-purple-500',
  ACTIVE_PROJECT: 'bg-emerald-500',
  COMPLETED: 'bg-gray-400',
  ARCHIVED: 'bg-gray-300',
};

export const PRIVACY_LABELS: Record<Privacy, string> = {
  PRIVATE: 'Private',
  TRUSTED_CIRCLE: 'Trusted Circle',
  SELECTED_EXPERTS: 'Selected Experts',
  COMMUNITY: 'Community',
  PUBLIC: 'Public',
};

export const PRIVACY_ICONS: Record<Privacy, string> = {
  PRIVATE: '🔒',
  TRUSTED_CIRCLE: '👥',
  SELECTED_EXPERTS: '🎯',
  COMMUNITY: '🌱',
  PUBLIC: '🌍',
};

// ─── StageChip ────────────────────────────────────────────────────────────────

export function StageChip({ stage, size = 'sm' }: { stage: Stage; size?: 'xs' | 'sm' | 'md' }) {
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1 rounded border font-mono font-medium ${sizeClass} ${STAGE_COLORS[stage]}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${STAGE_DOTS[stage]}`} />
      {STAGE_LABELS[stage]}
    </span>
  );
}

// ─── PrivacyChip ──────────────────────────────────────────────────────────────

export function PrivacyChip({ privacy }: { privacy: Privacy }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)] text-xs px-2 py-0.5 font-mono">
      {PRIVACY_ICONS[privacy]} {PRIVACY_LABELS[privacy]}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
];

export function Avatar({ initials, size = 'md', colorIndex = 0 }: { initials: string; size?: 'xs' | 'sm' | 'md' | 'lg'; colorIndex?: number }) {
  const sz = size === 'xs' ? 'w-6 h-6 text-[10px]' : size === 'sm' ? 'w-8 h-8 text-xs' : size === 'md' ? 'w-9 h-9 text-sm' : 'w-12 h-12 text-base';
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center font-display font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────

export function ProgressBar({ value, color = 'bg-[var(--primary)]', label, showValue = true }: { value: number; color?: string; label?: string; showValue?: boolean }) {
  return (
    <div className="space-y-1">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-[var(--muted-foreground)] font-mono">{label}</span>}
          {showValue && <span className="text-xs text-[var(--muted-foreground)] font-mono ml-auto">{value}%</span>}
        </div>
      )}
      <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-display font-semibold rounded transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { xs: 'text-xs px-2.5 py-1', sm: 'text-sm px-3 py-1.5', md: 'text-sm px-4 py-2', lg: 'text-base px-5 py-2.5' };
  const variants = {
    primary: 'bg-[var(--primary)] text-white hover:opacity-90',
    secondary: 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--border)]',
    ghost: 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]',
    outline: 'border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────

export function Tag({ children, color = 'default' }: { children: React.ReactNode; color?: 'default' | 'indigo' | 'violet' | 'emerald' | 'amber' }) {
  const colors = {
    default: 'bg-[var(--secondary)] text-[var(--muted-foreground)]',
    indigo: 'bg-indigo-50 text-indigo-700',
    violet: 'bg-violet-50 text-violet-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-mono ${colors[color]}`}>{children}</span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] ${onClick ? 'cursor-pointer hover:border-[var(--primary)] hover:shadow-sm transition-all duration-150' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-[var(--border)] ${className}`} />;
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, headline, subtext, cta, onCta }: { icon?: React.ReactNode; headline: string; subtext: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8 space-y-4">
      {icon && <div className="text-4xl mb-2">{icon}</div>}
      <p className="font-display font-semibold text-lg text-[var(--foreground)]">{headline}</p>
      <p className="text-sm text-[var(--muted-foreground)] max-w-xs">{subtext}</p>
      {cta && onCta && <Button onClick={onCta} variant="outline" size="sm">{cta}</Button>}
    </div>
  );
}

// ─── SkillBadge ───────────────────────────────────────────────────────────────

export function SkillBadge({ name, level }: { name: string; level?: string }) {
  const levelColors: Record<string, string> = {
    expert: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    intermediate: 'border-violet-200 bg-violet-50 text-violet-800',
    beginner: 'border-gray-200 bg-gray-50 text-gray-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${level ? levelColors[level] || levelColors.beginner : 'border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>
      {name}
    </span>
  );
}

// ─── CompatibilityBadge ───────────────────────────────────────────────────────

export function CompatibilityBadge({ value }: { value: number }) {
  const color = value >= 90 ? 'text-emerald-700 bg-emerald-50' : value >= 75 ? 'text-indigo-700 bg-indigo-50' : 'text-amber-700 bg-amber-50';
  return (
    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${color}`}>{value}% match</span>
  );
}

// ─── LoadingDots ──────────────────────────────────────────────────────────────

export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] pulse-soft"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </span>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export function SectionLabel({ children, number }: { children: React.ReactNode; number?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {number && <span className="font-mono text-xs text-[var(--muted-foreground)] tabular-nums">{number}</span>}
      <h3 className="font-display font-semibold text-sm text-[var(--foreground)] uppercase tracking-wide">{children}</h3>
    </div>
  );
}

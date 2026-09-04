import React, { useState } from 'react';
import { CURRENT_USER } from '../data/mockData';
import { Card, Button, Divider } from '../components/ui';
import { Moon, Sun, Bell, Lock, Users, Eye } from 'lucide-react';

interface SettingsViewProps {
  dark: boolean;
  onToggleDark: () => void;
}

export default function SettingsView({ dark, onToggleDark }: SettingsViewProps) {
  const [notifs, setNotifs] = useState({
    collaboratorRequests: true,
    feedbackReceived: true,
    ideaEvolution: true,
    milestones: true,
    challenges: false,
  });

  const [defaultPrivacy, setDefaultPrivacy] = useState<string>('PRIVATE');

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 space-y-6 pb-24 lg:pb-10">
        <h1 className="font-display font-bold text-xl text-[var(--foreground)]">Settings</h1>

        {/* Appearance */}
        <Card className="p-5 space-y-4">
          <h2 className="font-display font-semibold text-sm text-[var(--foreground)] flex items-center gap-2">
            {dark ? <Moon size={15} /> : <Sun size={15} />}
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--foreground)]">Dark mode</p>
              <p className="text-xs text-[var(--muted-foreground)]">Easier on the eyes at night</p>
            </div>
            <button
              onClick={onToggleDark}
              className={`w-11 h-6 rounded-full transition-colors relative ${dark ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-5 space-y-4">
          <h2 className="font-display font-semibold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Bell size={15} />
            Notifications
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">IdeaWeave only sends notifications that matter. No engagement spam.</p>
          {Object.entries(notifs).map(([key, val]) => {
            const LABELS: Record<string, string> = {
              collaboratorRequests: 'Collaborator requests',
              feedbackReceived: 'Feedback received',
              ideaEvolution: 'Idea evolution updates',
              milestones: 'Milestone completions',
              challenges: 'New challenges matching my interests',
            };
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground)]">{LABELS[key]}</span>
                <button
                  onClick={() => setNotifs((prev) => ({ ...prev, [key]: !val }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${val ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            );
          })}
        </Card>

        {/* Privacy */}
        <Card className="p-5 space-y-4">
          <h2 className="font-display font-semibold text-sm text-[var(--foreground)] flex items-center gap-2">
            <Lock size={15} />
            Privacy Controls
          </h2>
          <div>
            <p className="text-sm text-[var(--foreground)] mb-1">Default idea visibility</p>
            <p className="text-xs text-[var(--muted-foreground)] mb-3">New ideas start at this privacy level. You can always change it per idea.</p>
            <div className="flex flex-col gap-2">
              {[
                { value: 'PRIVATE', label: 'Private', desc: 'Only you can see it' },
                { value: 'TRUSTED_CIRCLE', label: 'Trusted Circle', desc: 'Invited people only' },
                { value: 'COMMUNITY', label: 'Community', desc: 'IdeaWeave members' },
                { value: 'PUBLIC', label: 'Public', desc: 'Everyone on the internet' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setDefaultPrivacy(value)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    defaultPrivacy === value
                      ? 'border-[var(--primary)] bg-indigo-50'
                      : 'border-[var(--border)] hover:border-[var(--primary)]'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-display font-medium ${defaultPrivacy === value ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{desc}</p>
                  </div>
                  {defaultPrivacy === value && <span className="text-[var(--primary)] text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Account */}
        <Card className="p-5 space-y-3">
          <h2 className="font-display font-semibold text-sm text-[var(--foreground)]">Account</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--foreground)]">{CURRENT_USER.name}</p>
              <p className="text-xs text-[var(--muted-foreground)]">meera.pillai@ideaweave.io</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Divider />
          <Button variant="danger" size="sm">Delete account</Button>
        </Card>
      </div>
    </div>
  );
}

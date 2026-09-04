import React, { useState } from 'react';
import type { Notification, Idea } from '../types';
import { NOTIFICATIONS } from '../data/mockData';
import { IDEAS } from '../data/mockData';
import { Card, Button } from '../components/ui';
import { Bell, Users, MessageSquare, GitBranch, CheckCircle, Zap, RefreshCw } from 'lucide-react';

const ICON_MAP: Record<Notification['type'], React.ElementType> = {
  collaborator: Users,
  feedback: MessageSquare,
  evolution: GitBranch,
  milestone: CheckCircle,
  challenge: Zap,
  connection: GitBranch,
  resurface: RefreshCw,
};

const COLOR_MAP: Record<Notification['type'], string> = {
  collaborator: 'bg-violet-50 text-violet-600',
  feedback: 'bg-blue-50 text-blue-600',
  evolution: 'bg-emerald-50 text-emerald-600',
  milestone: 'bg-emerald-50 text-emerald-600',
  challenge: 'bg-amber-50 text-amber-600',
  connection: 'bg-indigo-50 text-indigo-600',
  resurface: 'bg-orange-50 text-orange-600',
};

interface NotificationsViewProps {
  onOpenIdea: (idea: Idea) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsView({ onOpenIdea, onMarkAllRead }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 space-y-4 pb-24 lg:pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-[var(--foreground)]">Notifications</h1>
            {unread > 0 && <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">{unread} unread</p>}
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAll}>Mark all read</Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={24} className="text-[var(--muted-foreground)] mx-auto mb-3" />
            <p className="font-display font-semibold text-sm text-[var(--foreground)]">No notifications yet</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">You&apos;ll hear about collaborator requests, feedback, and idea evolution here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = ICON_MAP[n.type];
              const color = COLOR_MAP[n.type];
              const relatedIdea = n.ideaId ? IDEAS.find((i) => i.id === n.ideaId) : undefined;

              return (
                <div
                  key={n.id}
                  onClick={() => { markRead(n.id); if (relatedIdea) onOpenIdea(relatedIdea); }}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-150 hover:border-[var(--primary)] ${
                    n.read ? 'bg-[var(--card)] border-[var(--border)]' : 'bg-indigo-50/30 border-indigo-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">{n.message}</p>
                    {n.ideaTitle && (
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5 font-mono">{n.ideaTitle}</p>
                    )}
                    <p className="text-[10px] font-mono text-[var(--muted-foreground)] mt-1">{n.date}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0 mt-1.5" />}
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] text-center">
            IdeaWeave only sends notifications that are actually useful to you.
          </p>
        </div>
      </div>
    </div>
  );
}

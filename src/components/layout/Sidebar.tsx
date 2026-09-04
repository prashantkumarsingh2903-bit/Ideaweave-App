import React from 'react';
import type { View } from '../../types';
import { Avatar } from '../ui';
import { CURRENT_USER } from '../../data/mockData';
import {
  Home, Lightbulb, Compass, Users, Zap, BookOpen, Bookmark,
  Bell, Settings, Moon, Sun, Search,
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  dark: boolean;
  onToggleDark: () => void;
  notificationCount: number;
}

const NAV_ITEMS: { id: View; label: string; Icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'my-ideas', label: 'My Ideas', Icon: Lightbulb },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'collaborations', label: 'Collaborations', Icon: Users },
  { id: 'challenges', label: 'Challenges', Icon: Zap },
  { id: 'search', label: 'Search', Icon: Search },
];

const NAV_BOTTOM: { id: View; label: string; Icon: React.ElementType }[] = [
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export default function Sidebar({ currentView, onNavigate, dark, onToggleDark, notificationCount }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-56 h-full border-r border-[var(--border)] bg-[var(--card)] flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-[var(--border)]">
        <div className="w-7 h-7 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="2.5" fill="white" />
            <line x1="7" y1="0" x2="7" y2="4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="9.5" x2="7" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="7" x2="4.5" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9.5" y1="7" x2="14" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="font-display font-bold text-base text-[var(--foreground)]">IdeaWeave</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-display font-medium transition-all duration-100 ${
                active
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-[var(--border)] space-y-0.5">
        {NAV_BOTTOM.map(({ id, label, Icon }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-display font-medium transition-all duration-100 relative ${
                active
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon size={16} />
              {label}
              {id === 'notifications' && notificationCount > 0 && (
                <span className="ml-auto text-xs bg-[var(--primary)] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {notificationCount}
                </span>
              )}
            </button>
          );
        })}

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-display font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-all duration-100"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-100 mt-1 ${
            currentView === 'profile' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--secondary)]'
          }`}
        >
          <Avatar initials={CURRENT_USER.initials} size="xs" colorIndex={0} />
          <div className="text-left min-w-0">
            <p className={`text-xs font-display font-semibold truncate ${currentView === 'profile' ? 'text-white' : 'text-[var(--foreground)]'}`}>
              {CURRENT_USER.name}
            </p>
            <p className={`text-[10px] truncate ${currentView === 'profile' ? 'text-white/70' : 'text-[var(--muted-foreground)]'}`}>
              {CURRENT_USER.title}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}

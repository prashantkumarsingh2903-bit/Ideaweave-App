import React from 'react';
import type { View } from '../../types';
import { Home, Compass, Plus, Users, User } from 'lucide-react';

interface MobileNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onCapture: () => void;
}

const NAV: { id: View; label: string; Icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'collaborations', label: 'Collab', Icon: Users },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function MobileNav({ currentView, onNavigate, onCapture }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)] border-t border-[var(--border)] flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
      {NAV.slice(0, 2).map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            currentView === id ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px] font-mono">{label}</span>
        </button>
      ))}

      {/* Center capture button */}
      <button
        onClick={onCapture}
        className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-all active:scale-95"
        aria-label="Capture idea"
      >
        <Plus size={22} />
      </button>

      {NAV.slice(2).map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            currentView === id ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px] font-mono">{label}</span>
        </button>
      ))}
    </nav>
  );
}

import React, { useState, useCallback } from 'react';
import type { View, Idea, OnboardingData } from './types';
import { IDEAS, NOTIFICATIONS } from './data/mockData';

import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import CaptureModal from './components/ideas/CaptureModal';

import LandingView from './views/LandingView';
import OnboardingView from './views/OnboardingView';
import HomeView from './views/HomeView';
import MyIdeasView from './views/MyIdeasView';
import IdeaDetailView from './views/IdeaDetailView';
import ExploreView from './views/ExploreView';
import ChallengesView from './views/ChallengesView';
import CollaborationsView from './views/CollaborationsView';
import ProfileView from './views/ProfileView';
import NotificationsView from './views/NotificationsView';
import SearchView from './views/SearchView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [appState, setAppState] = useState<'landing' | 'onboarding' | 'app'>('landing');
  const [view, setView] = useState<View>('home');
  const [ideas, setIdeas] = useState<Idea[]>(IDEAS);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [prevView, setPrevView] = useState<View>('home');
  const [dark, setDark] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [notifCount, setNotifCount] = useState(NOTIFICATIONS.filter((n) => !n.read).length);

  const toggleDark = useCallback(() => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  const navigate = useCallback((v: View) => {
    if (v !== 'idea-detail') setPrevView(view);
    setView(v);
    if (v !== 'idea-detail') setSelectedIdea(null);
  }, [view]);

  const openIdea = useCallback((idea: Idea) => {
    setSelectedIdea(idea);
    setPrevView(view);
    setView('idea-detail');
  }, [view]);

  const updateIdea = useCallback((updated: Idea) => {
    setIdeas((prev) => prev.map((i) => i.id === updated.id ? updated : i));
    setSelectedIdea(updated);
  }, []);

  const forkIdea = useCallback((idea: Idea) => {
    const forked: Idea = {
      ...idea,
      id: `fork-${Date.now()}`,
      title: `Fork of: ${idea.title}`,
      originalThought: `Branched from: "${idea.originalThought}"`,
      stage: 'SPARK',
      privacy: 'PRIVATE',
      contributors: [],
      feedbackItems: [],
      versions: [{ version: 'V0.1', label: 'Fork', description: `Forked from "${idea.title}"`, date: new Date().toISOString().slice(0, 10), changedBy: 'Meera Pillai', reason: 'Build on this' }],
      milestones: [],
      forks: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setIdeas((prev) => [forked, ...prev]);
    openIdea(forked);
  }, [openIdea]);

  const saveNewIdea = useCallback((partial: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newIdea: Idea = {
      ...partial,
      id: `new-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setIdeas((prev) => [newIdea, ...prev]);
    setShowCapture(false);
    openIdea(newIdea);
  }, [openIdea]);

  if (appState === 'landing') {
    return <LandingView onStart={() => setAppState('onboarding')} />;
  }

  if (appState === 'onboarding') {
    return <OnboardingView onComplete={(_data: OnboardingData) => setAppState('app')} />;
  }

  return (
    <div className={`flex h-full overflow-hidden bg-[var(--background)] ${dark ? 'dark' : ''}`}>
      {/* Sidebar (desktop) */}
      <Sidebar
        currentView={view}
        onNavigate={navigate}
        dark={dark}
        onToggleDark={toggleDark}
        notificationCount={notifCount}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--primary)] rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="2.5" fill="white" />
                <line x1="7" y1="0" x2="7" y2="4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="7" y1="9.5" x2="7" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0" y1="7" x2="4.5" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9.5" y1="7" x2="14" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-display font-bold text-sm text-[var(--foreground)]">IdeaWeave</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)]">
              {dark ? '☀' : '🌙'}
            </button>
            <button
              onClick={() => navigate('notifications')}
              className="relative p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)]"
            >
              🔔
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--primary)] text-white text-[8px] rounded-full flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          {view === 'home' && (
            <div className="h-full overflow-y-auto">
              <HomeView onCapture={() => setShowCapture(true)} onOpenIdea={openIdea} ideas={ideas} />
            </div>
          )}
          {view === 'my-ideas' && (
            <MyIdeasView ideas={ideas} onOpenIdea={openIdea} onCapture={() => setShowCapture(true)} />
          )}
          {view === 'idea-detail' && selectedIdea && (
            <IdeaDetailView
              idea={ideas.find((i) => i.id === selectedIdea.id) || selectedIdea}
              onBack={() => { setView(prevView); setSelectedIdea(null); }}
              onUpdateIdea={updateIdea}
              onFork={forkIdea}
            />
          )}
          {view === 'explore' && <ExploreView ideas={ideas} onOpenIdea={openIdea} />}
          {view === 'challenges' && <ChallengesView />}
          {view === 'collaborations' && <CollaborationsView onOpenIdea={openIdea} />}
          {view === 'profile' && <ProfileView />}
          {view === 'notifications' && (
            <NotificationsView onOpenIdea={openIdea} onMarkAllRead={() => setNotifCount(0)} />
          )}
          {view === 'search' && <SearchView onOpenIdea={openIdea} />}
          {view === 'settings' && <SettingsView dark={dark} onToggleDark={toggleDark} />}
        </main>
      </div>

      {/* Mobile nav */}
      <MobileNav currentView={view} onNavigate={navigate} onCapture={() => setShowCapture(true)} />

      {/* Capture modal */}
      {showCapture && (
        <CaptureModal onClose={() => setShowCapture(false)} onSave={saveNewIdea} />
      )}
    </div>
  );
}

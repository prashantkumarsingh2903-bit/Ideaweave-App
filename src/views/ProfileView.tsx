import React, { useState } from 'react';
import { CURRENT_USER, IDEAS } from '../data/mockData';
import { Avatar, Card, SkillBadge, ProgressBar, Tag, Button, Divider } from '../components/ui';
import { Briefcase, Star, GitBranch, MessageSquare, Lightbulb } from 'lucide-react';

type ProfileTab = 'map' | 'projects' | 'contributions';

export default function ProfileView() {
  const [tab, setTab] = useState<ProfileTab>('map');
  const myIdeas = IDEAS.filter((i) => i.author.id === CURRENT_USER.id);
  const myContributions = IDEAS.filter((i) => i.contributors.some((c) => c.user.id === CURRENT_USER.id));

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: CURRENT_USER.name,
    title: CURRENT_USER.title,
    bio: CURRENT_USER.bio
  });

  const TABS: { id: ProfileTab; label: string }[] = [
    { id: 'map', label: 'Contribution Map' },
    { id: 'projects', label: 'Projects' },
    { id: 'contributions', label: 'Contributions' },
  ];

  const STYLE_LABELS: Record<string, string> = {
    'async': 'Async',
    'structured': 'Structured',
    'experimental': 'Experimental',
    'rapid-prototyping': 'Rapid prototyper',
    'research-first': 'Research-first',
    'visual-thinker': 'Visual thinker',
    'technical-builder': 'Technical builder',
    'build-first': 'Build-first',
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 space-y-6 pb-24 lg:pb-10">
        {/* Profile header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center font-display font-bold text-xl text-indigo-700 flex-shrink-0">
            {CURRENT_USER.initials}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2 max-w-md">
                <input 
                  value={profileData.name} 
                  onChange={e => setProfileData({...profileData, name: e.target.value})} 
                  className="w-full text-xl font-display font-bold px-2 py-1 rounded border border-[var(--border)] focus:outline-none focus:border-[var(--primary)]"
                />
                <input 
                  value={profileData.title} 
                  onChange={e => setProfileData({...profileData, title: e.target.value})} 
                  className="w-full text-sm px-2 py-1 rounded border border-[var(--border)] focus:outline-none focus:border-[var(--primary)]"
                />
                <textarea 
                  value={profileData.bio} 
                  onChange={e => setProfileData({...profileData, bio: e.target.value})} 
                  rows={3}
                  className="w-full text-xs leading-relaxed px-2 py-1 rounded border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] resize-none"
                />
              </div>
            ) : (
              <>
                <h1 className="font-display font-bold text-xl text-[var(--foreground)]">{profileData.name}</h1>
                <p className="text-sm text-[var(--muted-foreground)]">{profileData.title}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed max-w-md">{profileData.bio}</p>
              </>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CURRENT_USER.domains.map((d) => <Tag key={d} color="indigo">{d}</Tag>)}
            </div>
          </div>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save changes" : "Edit profile"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ideas', value: myIdeas.length, Icon: Lightbulb },
            { label: 'Contributions', value: CURRENT_USER.contributions, Icon: GitBranch },
            { label: 'Feedback given', value: CURRENT_USER.feedbackGiven, Icon: MessageSquare },
          ].map(({ label, value, Icon }) => (
            <Card key={label} className="p-3 text-center">
              <Icon size={16} className="text-[var(--primary)] mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-[var(--foreground)]">{value}</p>
              <p className="text-[10px] font-mono text-[var(--muted-foreground)]">{label}</p>
            </Card>
          ))}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-display font-medium text-emerald-800">Available {CURRENT_USER.availability}</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[var(--border)]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-2 text-sm font-display font-medium border-b-2 transition-colors ${
                tab === id ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'map' && (
          <div className="space-y-6">
            {/* What I know */}
            <div>
              <p className="font-display font-semibold text-sm text-[var(--foreground)] mb-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">WHAT I KNOW</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {CURRENT_USER.skills.map((s) => (
                  <SkillBadge key={s.name} name={s.name} level={s.level} />
                ))}
              </div>
            </div>

            <Divider />

            {/* What I'm exploring */}
            <div>
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-2">WHAT I&apos;M EXPLORING</p>
              <div className="flex flex-wrap gap-2">
                {CURRENT_USER.interests.map((i) => <Tag key={i}>{i}</Tag>)}
              </div>
            </div>

            <Divider />

            {/* What I can contribute */}
            <div>
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-2">WHAT I CAN CONTRIBUTE</p>
              <div className="flex flex-wrap gap-2">
                {['UX Research', 'Product Design', 'User Interviews', 'Systems Thinking'].map((c) => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 font-display">{c}</span>
                ))}
              </div>
            </div>

            <Divider />

            {/* What I'm looking for */}
            <div>
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-2">WHAT I&apos;M LOOKING FOR</p>
              <div className="flex flex-wrap gap-2">
                {CURRENT_USER.lookingFor.map((l) => <Tag key={l}>{l}</Tag>)}
              </div>
            </div>

            <Divider />

            {/* Working style */}
            <div>
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] mb-2">HOW I WORK</p>
              <div className="flex flex-wrap gap-2">
                {CURRENT_USER.workingStyles.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--secondary)] text-[var(--foreground)] font-display border border-[var(--border)]">
                    {STYLE_LABELS[s] || s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-4">
            {CURRENT_USER.completedProjects.map((p, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={15} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-display font-semibold text-sm text-[var(--foreground)]">{p.title}</p>
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{p.year}</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.skills.map((s) => <SkillBadge key={s} name={s} />)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {myIdeas.filter((i) => i.stage === 'ACTIVE_PROJECT').map((idea) => (
              <Card key={idea.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Star size={15} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-semibold text-sm text-[var(--foreground)]">{idea.title}</p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">{idea.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'contributions' && (
          <div className="space-y-4">
            {myContributions.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No contributions to other ideas yet. Explore ideas to find one you can help.</p>
            ) : (
              myContributions.map((idea) => {
                const entry = idea.contributors.find((c) => c.user.id === CURRENT_USER.id);
                return (
                  <Card key={idea.id} className="p-4">
                    <p className="font-display font-semibold text-sm text-[var(--foreground)]">{idea.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[var(--muted-foreground)]">Role: {entry?.role}</span>
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">·</span>
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]">By {idea.author.name}</span>
                    </div>
                  </Card>
                );
              })
            )}

            {/* Feedback given */}
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-xs font-mono text-[var(--muted-foreground)] mb-3">FEEDBACK GIVEN</p>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-display font-bold text-[var(--foreground)]">{CURRENT_USER.feedbackGiven}</div>
                <div>
                  <p className="text-sm font-display font-medium text-[var(--foreground)]">feedback responses</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Across all ideas on IdeaWeave</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

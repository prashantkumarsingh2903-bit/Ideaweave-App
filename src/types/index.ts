export type Stage =
  | 'SPARK'
  | 'INCUBATING'
  | 'EXPLORING'
  | 'SEEKING_FEEDBACK'
  | 'SEEKING_COLLABORATORS'
  | 'PROTOTYPING'
  | 'ACTIVE_PROJECT'
  | 'COMPLETED'
  | 'ARCHIVED';

export type Privacy = 'PRIVATE' | 'TRUSTED_CIRCLE' | 'SELECTED_EXPERTS' | 'COMMUNITY' | 'PUBLIC';

export type View =
  | 'landing'
  | 'onboarding'
  | 'home'
  | 'my-ideas'
  | 'explore'
  | 'collaborations'
  | 'profile'
  | 'notifications'
  | 'search'
  | 'settings'
  | 'idea-detail'
  | 'challenges';

export type WorkingStyle =
  | 'async'
  | 'structured'
  | 'experimental'
  | 'rapid-prototyping'
  | 'research-first'
  | 'visual-thinker'
  | 'technical-builder'
  | 'build-first';

export interface UserSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface CompletedProject {
  title: string;
  description: string;
  year: string;
  skills: string[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  title: string;
  skills: UserSkill[];
  interests: string[];
  workingStyles: WorkingStyle[];
  lookingFor: string[];
  contributions: number;
  completedProjects: CompletedProject[];
  feedbackGiven: number;
  availability: string;
  bio: string;
  domains: string[];
}

export interface IdeaVersion {
  version: string;
  label: string;
  description: string;
  date: string;
  changedBy: string;
  reason: string;
}

export interface FeedbackItem {
  id: string;
  author: User;
  type: string;
  content: string;
  date: string;
  useful: boolean;
}

export interface CollaboratorEntry {
  user: User;
  role: string;
  compatibility: number;
  matchReason: string;
  status: 'active' | 'paused' | 'completed' | 'invited';
  commitmentHours: number;
  contribution: string;
  joinedAt: string;
}

export interface Reference {
  title: string;
  url: string;
  type: 'article' | 'paper' | 'video' | 'sketch' | 'link';
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export interface IdeaHealth {
  clarity: number;
  evidence: number;
  feasibility: number;
  collaborationReadiness: number;
  executionReadiness: number;
}

export interface Idea {
  id: string;
  title: string;
  originalThought: string;
  description: string;
  stage: Stage;
  privacy: Privacy;
  author: User;
  topics: string[];
  skillsNeeded: string[];
  openQuestions: string[];
  references: Reference[];
  versions: IdeaVersion[];
  contributors: CollaboratorEntry[];
  feedbackItems: FeedbackItem[];
  feedbackRequests: string[];
  relatedIdeas: string[];
  forks: string[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  saved: boolean;
  health: IdeaHealth;
  nextMove: string;
  whyItMatters: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  organization: string;
  deadline: string;
  tags: string[];
  submittedIdeas: number;
  prize?: string;
}

export interface Notification {
  id: string;
  type: 'collaborator' | 'feedback' | 'evolution' | 'milestone' | 'challenge' | 'connection' | 'resurface';
  message: string;
  date: string;
  read: boolean;
  ideaId?: string;
  ideaTitle?: string;
}

export interface AIInsight {
  expand: string;
  challenge: string[];
  connections: string[];
  gaps: string[];
  nextStep: string;
  missingExpertise: string[];
}

export interface OnboardingData {
  domains: string[];
  skills: string[];
  lookingFor: string[];
  workingStyle: string[];
}

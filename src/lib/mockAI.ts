import type { Idea, AIInsight } from '../types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const INSIGHTS: Record<string, AIInsight> = {
  default: {
    expand: 'This idea could evolve in multiple directions — toward a B2C product, a B2B tool, or an open-source community project. The framing you choose will determine who can help and how fast you can move.',
    challenge: [
      'Have you spoken directly with the people this idea is for? Not about the idea, but about their actual day?',
      'What happens if the problem is already partially solved by something else people are already using?',
      'What is the one assumption here that, if wrong, would invalidate everything?',
    ],
    connections: [
      'Community resource sharing (trust layer)',
      'Behavioral change research',
      'Last-mile distribution challenges',
    ],
    gaps: [
      'No evidence that target users would switch from their current approach',
      'The cost model is unclear',
      'Success metric has not been defined',
    ],
    nextStep: 'Have one unstructured conversation with a real potential user. Don\'t pitch the idea. Just listen.',
    missingExpertise: ['Domain expert', 'User researcher', 'Technical validation'],
  },
  i1: {
    expand: 'This could expand beyond campuses to hospitals, corporate canteens, or large-scale events — any place where food is prepared in centralized kitchens with predictable demand patterns.',
    challenge: [
      'Who actually has the power to act on waste data? The mess manager? The university administration? The students? If the data doesn\'t reach the decision-maker, nothing changes.',
      'Is the primary problem prediction, detection, or redistribution? These require completely different solutions.',
      'What happens to the system\'s usefulness during exam season when food demand becomes highly unpredictable?',
    ],
    connections: [
      'Smart inventory management (retail)',
      'Food bank logistics and cold-chain',
      'Community fridge networks',
      'Meal prediction apps',
    ],
    gaps: [
      'No evidence of what mess workers actually want — this is designed from the outside',
      'Data privacy framework for camera systems in shared spaces',
      'Redistribution partner identification is missing',
    ],
    nextStep: 'Spend one breakfast and one dinner in the hostel mess just observing — no notepad, no phone. Then talk to the person in charge of ordering.',
    missingExpertise: ['Computer vision engineer', 'Food systems researcher', 'Embedded hardware specialist'],
  },
  i4: {
    expand: 'The same core insight — reducing mechanical research work — could apply to legal research, policy analysis, or medical evidence synthesis. Each has slightly different trust and accuracy requirements.',
    challenge: [
      'The most time-consuming parts of literature review might also be where the most learning happens. What if automating them reduces research quality, not just time?',
      'Citation hallucination in AI is still an unsolved problem. One false citation in a thesis could end a career. How do you handle this?',
      'Have you validated that researchers would actually trust AI-surfaced literature, or would they re-verify everything anyway?',
    ],
    connections: [
      'Systematic review methodology',
      'Knowledge graph tools (Roam, Obsidian)',
      'Semantic scholar and paper recommendation systems',
    ],
    gaps: [
      'No validation that researchers would actually adopt a new tool',
      'Hallucination mitigation strategy is absent',
      'Scope (discipline-specific vs generic) is unresolved',
    ],
    nextStep: 'Shadow one PhD student through a full literature review session, from search to synthesis. Time each step.',
    missingExpertise: ['NLP engineer', 'Academic librarian', 'Domain expert (choose one discipline to start)'],
  },
};

export async function getAIInsight(idea: Idea): Promise<AIInsight> {
  await delay(1200 + Math.random() * 800);
  return INSIGHTS[idea.id] ?? INSIGHTS.default;
}

export async function expandIdea(thought: string): Promise<string> {
  await delay(1000);
  const expansions = [
    `This thought touches on a real behavioral gap: the distance between noticing something and doing something about it. There may be a product in reducing that distance significantly.`,
    `Interesting — this seems to sit at the intersection of a distribution problem and a trust problem. The technology is often the easy part; getting people to change how they work is the hard part.`,
    `The most promising direction here might be the smallest possible version: one location, one use case, one week. What would you learn from that?`,
    `Before building, it\'s worth asking: who is already trying to solve this, and why have they not succeeded? Their failure modes will tell you more than any research report.`,
  ];
  return expansions[Math.floor(Math.random() * expansions.length)];
}

export async function getNextStep(idea: Idea): Promise<string> {
  await delay(800);
  const steps: Record<string, string> = {
    SPARK: 'Write down in one sentence: who experiences this problem, and how often. That\'s it for now.',
    INCUBATING: 'Have one real conversation with someone who lives the problem. Don\'t mention your idea. Just ask about their experience.',
    EXPLORING: 'Map the existing landscape: what already exists? Where does it fall short specifically?',
    SEEKING_FEEDBACK: 'Prepare 3 specific questions you want answered. Vague feedback requests get vague responses.',
    SEEKING_COLLABORATORS: 'Write a one-paragraph brief for each missing role. Good collaborators need to see the work, not just the vision.',
    PROTOTYPING: 'Define what \'done\' means for this prototype — what specific question is it answering?',
    ACTIVE_PROJECT: 'Review your milestones. Which one is the most important, and what\'s blocking it?',
    COMPLETED: 'Document what you learned. The next idea you build will benefit from this.',
  };
  return steps[idea.stage] ?? 'Return to this idea with fresh eyes and ask: what has changed since you last opened it?';
}

export async function generateFeedbackResponse(feedbackType: string, ideaTitle: string): Promise<string> {
  await delay(900);
  const responses: Record<string, string> = {
    'Validate the problem': `The problem framing in "${ideaTitle}" is grounded in a real behavioral observation. The challenge will be scoping: the same root cause often manifests in different ways for different user segments, each requiring a different response.`,
    'Challenge the assumption': `The core assumption to test: does the person experiencing the problem have the agency to adopt a solution? Often the person feeling the pain is not the one who can change behavior — that\'s a structural problem, not a product problem.`,
    'Technical feasibility': `From a technical standpoint, the core mechanism is achievable with existing tools. The risk is in integration complexity and maintenance burden. Simpler systems are more likely to be sustained long-term.`,
    'Business viability': `The unit economics are the key question. What does it cost to acquire one user and deliver one unit of value? If you can\'t answer that with a rough number, you\'re not ready for a business model discussion.`,
    'Find missing perspectives': `Perspectives worth seeking: the person doing the operational work (not just the decision-maker), people who tried to solve this before and stopped, and someone from a completely different culture who faces the same problem.`,
    'Improve the UX': `The interaction flow needs to be frictionless at the moment of highest motivation — which is usually when the problem is being experienced, not later when someone sits down to \'use an app.\'`,
    'Research evidence': `The research gap here is whether the behavior change you\'re hoping for actually sticks. Find 2-3 analogous case studies and look specifically at long-term retention, not just adoption.`,
    'Suggest an alternative': `An alternative framing worth considering: instead of solving the problem directly, what if the solution made the problem visible to someone with power to change it systemically?`,
  };
  return responses[feedbackType] ?? responses['Validate the problem'];
}

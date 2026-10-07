import type { Standup } from '../types';

/**
 * Calculate blocker rate across team standup submissions.
 */
export function calculateBlockerRate(standups: Standup[]): number {
  if (!standups || standups.length === 0) return 0;
  const blockedCount = standups.filter((s) => s.hasBlocker || !!s.blockers?.trim()).length;
  return Math.round((blockedCount / standups.length) * 100);
}

/**
 * Analyze team mood health distribution.
 */
export function analyzeMoodHealth(standups: Standup[]): {
  healthyPct: number;
  stressedPct: number;
  dominantMood: Standup['mood'];
} {
  if (!standups || standups.length === 0) {
    return { healthyPct: 100, stressedPct: 0, dominantMood: 'good' };
  }

  const counts: Record<Standup['mood'], number> = {
    great: 0,
    good: 0,
    neutral: 0,
    tired: 0,
    blocked: 0
  };

  standups.forEach((s) => {
    if (counts[s.mood] !== undefined) counts[s.mood]++;
  });

  const healthyCount = counts.great + counts.good;
  const stressedCount = counts.tired + counts.blocked;

  const healthyPct = Math.round((healthyCount / standups.length) * 100);
  const stressedPct = Math.round((stressedCount / standups.length) * 100);

  let dominantMood: Standup['mood'] = 'good';
  let maxCount = -1;
  (Object.keys(counts) as Standup['mood'][]).forEach((m) => {
    if (counts[m] > maxCount) {
      maxCount = counts[m];
      dominantMood = m;
    }
  });

  return { healthyPct, stressedPct, dominantMood };
}

/**
 * Aggregate reactions, comments, and distinct active participants.
 */
export function aggregateTeamActivity(standups: Standup[]): {
  totalReactions: number;
  totalComments: number;
  activeMemberIds: string[];
} {
  let totalReactions = 0;
  let totalComments = 0;
  const memberIdSet = new Set<string>();

  standups.forEach((s) => {
    totalReactions += s.reactions || 0;
    totalComments += s.comments ? s.comments.length : 0;
    if (s.userId) memberIdSet.add(s.userId);
  });

  return {
    totalReactions,
    totalComments,
    activeMemberIds: Array.from(memberIdSet)
  };
}

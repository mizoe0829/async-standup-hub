import { describe, it, expect } from 'vitest';
import {
  calculateBlockerRate,
  analyzeMoodHealth,
  aggregateTeamActivity
} from '../src/lib/standupMetrics';
import type { Standup, User } from '../src/types';

const mockUser1: User = {
  id: 'u1',
  name: '田中 (柴犬)',
  email: 'tanaka@example.com',
  avatar: '🐶',
  role: 'Frontend Lead',
  timezone: 'JST',
  location: 'Tokyo',
  status: 'online'
};

const mockUser2: User = {
  id: 'u2',
  name: '佐藤 (猫)',
  email: 'sato@example.com',
  avatar: '🐱',
  role: 'Backend Eng',
  timezone: 'JST',
  location: 'Osaka',
  status: 'online'
};

const mockStandups: Standup[] = [
  {
    id: 's1',
    userId: 'u1',
    user: mockUser1,
    date: '2026-10-06',
    yesterday: 'Next.js App Routerの調査',
    today: 'SSRデータフェッチの最適化',
    blockers: null,
    hasBlocker: false,
    mood: 'great',
    reactions: 5,
    comments: [
      { id: 'c1', standupId: 's1', userId: 'u2', user: mockUser2, content: 'LGTM!', createdAt: '2026-10-06' }
    ],
    createdAt: '2026-10-06 09:30',
    updatedAt: '2026-10-06 09:30'
  },
  {
    id: 's2',
    userId: 'u2',
    user: mockUser2,
    date: '2026-10-06',
    yesterday: 'Prismaスキーママイグレーション',
    today: 'DBコネクションプールの調査',
    blockers: '本番DB接続タイムアウトが発生中',
    hasBlocker: true,
    mood: 'blocked',
    reactions: 3,
    comments: [],
    createdAt: '2026-10-06 10:00',
    updatedAt: '2026-10-06 10:00'
  }
];

describe('Async Standup Metrics Unit Tests', () => {
  describe('calculateBlockerRate', () => {
    it('2件中1件ブロッカーがある場合、ブロッカー率50%と計算されること', () => {
      const rate = calculateBlockerRate(mockStandups);
      expect(rate).toBe(50);
    });

    it('空配列の場合は0%を返すこと', () => {
      expect(calculateBlockerRate([])).toBe(0);
    });
  });

  describe('analyzeMoodHealth', () => {
    it('greatとblockedが各1名の場合、healthyPct=50%, stressedPct=50%と計算されること', () => {
      const result = analyzeMoodHealth(mockStandups);
      expect(result.healthyPct).toBe(50);
      expect(result.stressedPct).toBe(50);
    });

    it('全員がgoodの場合はhealthyPct=100%となること', () => {
      const allGood = [
        { ...mockStandups[0], mood: 'good' as const },
        { ...mockStandups[1], mood: 'good' as const }
      ];
      const result = analyzeMoodHealth(allGood);
      expect(result.healthyPct).toBe(100);
      expect(result.stressedPct).toBe(0);
      expect(result.dominantMood).toBe('good');
    });
  });

  describe('aggregateTeamActivity', () => {
    it('チーム全体のリアクション数・コメント数・アクティブ人数が集計されること', () => {
      const activity = aggregateTeamActivity(mockStandups);
      expect(activity.totalReactions).toBe(8); // 5 + 3
      expect(activity.totalComments).toBe(1); // 1 + 0
      expect(activity.activeMemberIds).toHaveLength(2);
      expect(activity.activeMemberIds).toContain('u1');
      expect(activity.activeMemberIds).toContain('u2');
    });
  });
});

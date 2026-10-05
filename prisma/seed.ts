import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial async standup data...');

  // Clear existing
  await prisma.comment.deleteMany({});
  await prisma.standup.deleteMany({});
  await prisma.gitActivity.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Ken Mizoe',
      email: 'mizoe@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      githubUsername: 'mizoe0829',
      role: 'Fullstack Tech Lead',
      timezone: 'Asia/Tokyo (UTC+9)',
      location: 'Tokyo, Japan',
      status: 'online',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@remoteworks.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      githubUsername: 'sjenkins-dev',
      role: 'DevOps & Backend Engineer',
      timezone: 'Europe/London (UTC+0)',
      location: 'London, UK',
      status: 'deep_work',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Marcus Chen',
      email: 'm.chen@hypergrid.design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      githubUsername: 'marcus-c-ui',
      role: 'Senior Product Designer',
      timezone: 'America/Los_Angeles (UTC-8)',
      location: 'San Francisco, US',
      status: 'online',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena@berlincloud.de',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      githubUsername: 'elena-qa',
      role: 'QA & Reliability Engineer',
      timezone: 'Europe/Berlin (UTC+1)',
      location: 'Berlin, Germany',
      status: 'offline',
    },
  });

  const today = new Date().toISOString().split('T')[0];

  // 2. Create Standups for Today
  await prisma.standup.create({
    data: {
      userId: user1.id,
      date: today,
      yesterday: `- Merged PR #42: \`feat: Add Global Dashboard & responsive modal controls\`
- Reviewed Svelte-EC checkout pipeline
- Refactored Prisma data models for async standup hub`,
      today: `- Implement Next.js 15 Route Handlers for automated GitHub PR syncing
- Build Blocker Radar UI component with urgent indicator tags
- Set up Slack/Discord webhook export format`,
      blockers: null,
      hasBlocker: false,
      mood: 'great',
      reactions: 4,
    },
  });

  const standup2 = await prisma.standup.create({
    data: {
      userId: user2.id,
      date: today,
      yesterday: `- Set up Docker multi-stage build pipeline for Next.js and API services
- Upgraded PostgreSQL connection pooling on staging`,
      today: `- Verify Stripe production webhook signature validation
- Benchmark Prisma query latency against staging DB`,
      blockers: `Stripe webhook signing secret in staging keeps returning 400 Bad Signature. Blocked until DevOps access token is rotated.`,
      hasBlocker: true,
      mood: 'blocked',
      reactions: 2,
    },
  });

  await prisma.standup.create({
    data: {
      userId: user3.id,
      date: today,
      yesterday: `- Completed Figma design system components for Dark Mode
- User testing on standup check-in mobile workflow`,
      today: `- Polish glassmorphic badges and responsive sidebar navigation
- Hand off mobile bottom-bar specs to Ken`,
      blockers: null,
      hasBlocker: false,
      mood: 'good',
      reactions: 5,
    },
  });

  await prisma.standup.create({
    data: {
      userId: user4.id,
      date: today,
      yesterday: `- Automated Playwright E2E suite covering Standup submission
- Verified cross-browser rendering on Safari and Chromium`,
      today: `- Load testing on WebSocket edge telemetry
- Add regression tests for timezone conversion`,
      blockers: null,
      hasBlocker: false,
      mood: 'neutral',
      reactions: 3,
    },
  });

  // 3. Comments on blocker
  await prisma.comment.create({
    data: {
      standupId: standup2.id,
      userId: user1.id,
      content: 'Sarah, I have admin credentials for AWS Secrets Manager. Sending you the refreshed Stripe secret via 1Password vault right now!',
    },
  });

  // 4. Git Activities
  await prisma.gitActivity.createMany({
    data: [
      {
        userId: user1.id,
        type: 'pr',
        repo: 'mizoe0829/task-matrix',
        title: 'PR #12: Enable responsive internal scrolling for all modals',
        url: 'https://github.com/mizoe0829/task-matrix/pull/12',
      },
      {
        userId: user1.id,
        type: 'commit',
        repo: 'mizoe0829/task-matrix',
        title: 'feat: add global dashboard and hierarchy flow analytics',
        url: 'https://github.com/mizoe0829/task-matrix/commit/6789abc',
      },
      {
        userId: user1.id,
        type: 'commit',
        repo: 'mizoe0829/async-standup-hub',
        title: 'chore: initialize Next.js 15, Prisma schema and SQLite connection',
        url: 'https://github.com/mizoe0829/async-standup-hub/commit/1234def',
      },
      {
        userId: user2.id,
        type: 'pr',
        repo: 'org/backend-service',
        title: 'PR #108: Optimize Docker Alpine build layer caching',
        url: 'https://github.com/org/backend-service/pull/108',
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

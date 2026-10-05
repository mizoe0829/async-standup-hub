export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  githubUsername?: string | null;
  role: string;
  timezone: string;
  location: string;
  status: 'online' | 'deep_work' | 'offline';
}

export interface Comment {
  id: string;
  standupId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface Standup {
  id: string;
  userId: string;
  user: User;
  date: string;
  yesterday: string;
  today: string;
  blockers?: string | null;
  hasBlocker: boolean;
  mood: 'great' | 'good' | 'neutral' | 'tired' | 'blocked';
  reactions: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface GitActivityItem {
  id: string;
  type: 'commit' | 'pr' | 'issue';
  repo: string;
  title: string;
  url: string;
  date: string;
}

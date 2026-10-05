'use client';

import React, { useState } from 'react';
import { Standup } from '../types';
import {
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  ThumbsUp,
  MessageSquare,
  Send,
  Sparkles,
  MapPin
} from 'lucide-react';

interface StandupCardProps {
  standup: Standup;
  currentUserId: string;
  onReact: (standupId: string) => void;
  onAddComment: (standupId: string, content: string) => void;
}

export const StandupCard: React.FC<StandupCardProps> = ({
  standup,
  currentUserId,
  onReact,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  const moodConfig = {
    great: { label: '🔥 On Fire', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
    good: { label: '😊 Steady', color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
    neutral: { label: '😐 In Progress', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
    tired: { label: '😴 Low Energy', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
    blocked: { label: '🔴 Blocked', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' },
  }[standup.mood] || { label: 'Steady', color: 'bg-indigo-50 text-indigo-600' };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(standup.id, commentText);
    setCommentText('');
  };

  return (
    <div
      id={`standup-${standup.id}`}
      className={`rounded-2xl border transition-all duration-200 p-5 sm:p-6 shadow-sm ${
        standup.hasBlocker
          ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20 dark:bg-slate-900/90 ring-1 ring-rose-500/20'
          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90'
      }`}
    >
      {/* Top Header: User Profile, Timezone, Mood */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={standup.user.avatar}
              alt={standup.user.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                standup.user.status === 'online'
                  ? 'bg-emerald-500'
                  : standup.user.status === 'deep_work'
                  ? 'bg-indigo-500'
                  : 'bg-slate-400'
              }`}
              title={`Status: ${standup.user.status}`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {standup.user.name}
              </h3>
              {standup.user.githubUsername && (
                <a
                  href={`https://github.com/${standup.user.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                >
                  @{standup.user.githubUsername}
                </a>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{standup.user.role}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                {standup.user.location}
              </span>
            </p>
          </div>
        </div>

        {/* Timezone & Mood badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {standup.user.timezone.split(' ')[0]}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${moodConfig.color}`}>
            {moodConfig.label}
          </span>
        </div>
      </div>

      {/* Main Standup Content: Yesterday, Today, Blockers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5 text-xs">
        {/* Left: Yesterday Completed */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Yesterday's Milestones</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {standup.yesterday}
          </div>
        </div>

        {/* Right: Today's Focus */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span>Today's Commitments</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {standup.today}
          </div>
        </div>
      </div>

      {/* Red Blocker Callout if exists */}
      {standup.hasBlocker && standup.blockers && (
        <div className="mb-4 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Active Blocker — Needs Immediate Unblocking:</span>
          </div>
          <p className="pl-6 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            {standup.blockers}
          </p>
        </div>
      )}

      {/* Comments list */}
      {standup.comments && standup.comments.length > 0 && (
        <div className="mt-2 mb-4 space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Team Responses & Solutions ({standup.comments.length})
          </span>
          {standup.comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs"
            >
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="h-6 w-6 rounded-full object-cover mt-0.5"
              />
              <div className="flex-1">
                <span className="font-bold text-slate-900 dark:text-white mr-2">
                  {comment.user.name}
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {comment.content}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Footer: Clap Reaction & Reply */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {/* Reaction Button */}
          <button
            onClick={() => onReact(standup.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all font-medium"
          >
            <ThumbsUp className="h-3.5 w-3.5 text-indigo-500" />
            <span>{standup.reactions}</span>
          </button>

          {/* Comment Box Toggle */}
          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all font-medium"
          >
            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
            <span>Reply & Unblock</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Posted for {standup.date}
        </span>
      </div>

      {/* Expandable Comment Box */}
      {showCommentBox && (
        <form onSubmit={handleSubmitComment} className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            placeholder="Offer a solution or reply to this standup..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Send className="h-3 w-3" />
            <span>Send</span>
          </button>
        </form>
      )}
    </div>
  );
};

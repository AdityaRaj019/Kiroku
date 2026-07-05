"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import { Comment } from "@/utils/mangaDetailsEnricher";

interface SocialPanelProps {
  comments: Comment[];
}

export const SocialPanel: React.FC<SocialPanelProps> = ({ comments }) => {
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [newCommentText, setNewCommentText] = useState("");
  const [newRating, setNewRating] = useState(10);
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const userVal = authorName.trim() || "MangaFan";
    const dateVal = "Just now";

    const freshComment: Comment = {
      username: userVal,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=80&h=80&fit=crop`,
      comment: newCommentText,
      rating: newRating,
      likes: 0,
      date: dateVal,
    };

    setCommentList([freshComment, ...commentList]);
    setNewCommentText("");
    setAuthorName("");
  };

  return (
    <div className="w-full bg-white border-4 border-zinc-950 p-6 shadow-[6px_6px_0px_#000] space-y-6">
      
      {/* Header */}
      <h2 className="font-bebas text-2xl md:text-3xl font-black tracking-wider text-zinc-950 border-b-4 border-zinc-950 pb-3 uppercase flex items-center gap-2">
        <MessageSquare className="w-6 h-6 shrink-0" style={{ color: "var(--theme-primary)" }} />
        Discussions & Reviews
      </h2>

      {/* Write Comment Box */}
      <form onSubmit={handleSubmit} className="border-4 border-zinc-950 p-4 bg-zinc-50 space-y-3">
        <h4 className="font-bebas text-lg font-bold tracking-wider text-zinc-950 uppercase">
          Leave a Review
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your Username (e.g. ShinobiReader)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="border-2 border-zinc-950 p-2 text-xs font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#CC0000] rounded-none"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase shrink-0">Rating:</span>
            <select
              value={newRating}
              onChange={(e) => setNewRating(parseInt(e.target.value, 10))}
              className="border-2 border-zinc-950 p-2 text-xs font-mono font-bold bg-white focus:outline-none rounded-none w-full cursor-pointer"
            >
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ★ {r >= 9 ? "(Masterpiece)" : r >= 7 ? "(Great)" : r >= 5 ? "(Average)" : "(Poor)"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          rows={3}
          placeholder="Share your thoughts about this manga. Spoilers are prohibited..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className="w-full border-2 border-zinc-950 p-3 text-sm font-sans font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#CC0000] rounded-none"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#CC0000] text-white border-2 border-zinc-950 px-4 py-2 font-bebas text-sm font-bold tracking-wider shadow-[2px_2px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] cursor-pointer uppercase"
          >
            Post Review
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {commentList && commentList.length > 0 ? (
          commentList.map((comm, index) => (
            <div
              key={`${comm.username}-${index}`}
              className="border-4 border-zinc-950 p-4 bg-zinc-50 flex gap-4 shadow-[3px_3px_0px_#000]"
            >
              {/* User Avatar */}
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-zinc-950 overflow-hidden bg-zinc-200 shrink-0">
                <Image
                  src={comm.avatar}
                  alt={comm.username}
                  fill
                  className="object-cover"
                  sizes="(max-w-768px) 40px, 48px"
                  unoptimized={comm.avatar.startsWith("http")}
                />
              </div>

              {/* Comment Content */}
              <div className="flex-grow min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-md md:text-lg font-bold tracking-wide text-zinc-950 uppercase">
                      {comm.username}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-zinc-400">
                      {comm.date}
                    </span>
                  </div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 bg-yellow-50 border border-yellow-300 px-1.5 py-0.5 text-[10px] font-mono font-extrabold text-yellow-700">
                    <span>{comm.rating}</span>
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  </div>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed font-sans font-medium">
                  {comm.comment}
                </p>

                {/* Comment Likes Footer */}
                <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-dashed border-zinc-200">
                  <button className="flex items-center gap-1.5 text-zinc-500 hover:text-[#CC0000] text-xs font-mono font-bold transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comm.likes} Likes</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p className="text-sm font-sans font-medium text-zinc-500 py-4 text-center">
            Be the first to leave a review!
          </p>
        )}
      </div>

    </div>
  );
};

"use client";

import { useState, useEffect, useRef } from "react";
import { Comment } from "@/types";
import { md } from "./md";

interface CommentItemProps {
  comment: Comment;
  onReply: (parentCommentId: string) => void;
  depth?: number;
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const hasReplies = comment.replies && comment.replies.length > 0;

  useEffect(() => {
    let date: Date;
    
    if (typeof comment.timestamp === 'string') {
      // Try to parse the date string
      const parsedDate = new Date(comment.timestamp);
      date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    } else if (comment.timestamp instanceof Date) {
      date = comment.timestamp;
    } else if (comment.timestamp && typeof comment.timestamp === 'object') {
      // Handle Firestore Timestamp format
      const ts = comment.timestamp as any;
      if (ts._seconds) {
        date = new Date(ts._seconds * 1000);
      } else {
        date = new Date();
      }
    } else {
      date = new Date();
    }
    
    setFormattedDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, [comment.timestamp]);

  const displayName = comment.commenterName || "Anonymous";

  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{displayName}</span>
            {comment.fromAdmin && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                Admin
              </span>
            )}
            {comment.editedByAdmin && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                Edited
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <div
          className="text-gray-700 prose prose-sm max-w-none mb-3"
          dangerouslySetInnerHTML={{ __html: md.render(comment.text) }}
        />
        <button
          onClick={() => onReply(comment.id)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Reply
        </button>
      </div>
      
      {hasReplies && (
        <div className="mt-2">
          {isExpanded ? (
            <>
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
              {depth >= 2 && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                >
                  Show less
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileTokenRef = useRef<string | null>(null);

  // Sync token ref with state
  useEffect(() => {
    turnstileTokenRef.current = turnstileToken;
  }, [turnstileToken]);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Initialize Turnstile (invisible mode)
  useEffect(() => {
    let mounted = true;
    
    const initTurnstile = () => {
      if (!mounted) return;
      
      if (typeof window !== 'undefined' && 
          window.turnstile && 
          turnstileRef.current && 
          !turnstileWidgetId.current &&
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        
        try {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            size: 'invisible',
            callback: (token: string) => {
              if (mounted) {
                setTurnstileToken(token);
                turnstileTokenRef.current = token;
                setTurnstileError(null);
              }
            },
            'error-callback': (error: any) => {
              if (mounted) {
                setTurnstileError('Turnstile validation failed. Please try again.');
                setTurnstileToken(null);
                turnstileTokenRef.current = null;
              }
            },
          });
          if (mounted) {
            turnstileWidgetId.current = widgetId;
          }
        } catch (error) {
          if (mounted) {
            setTurnstileError('Failed to initialize Turnstile. Please refresh the page.');
          }
        }
      }
    };

    // Wait for Turnstile script to be loaded
    if (typeof window !== 'undefined') {
      if (window.turnstile) {
        // Script already loaded
        // Small delay to ensure DOM is ready
        const timer = setTimeout(initTurnstile, 100);
        return () => {
          mounted = false;
          clearTimeout(timer);
        };
      } else {
        // Wait for script to load
        const checkTurnstile = setInterval(() => {
          if (window.turnstile) {
            clearInterval(checkTurnstile);
            initTurnstile();
          }
        }, 100);

        const timeout = setTimeout(() => {
          clearInterval(checkTurnstile);
          if (mounted) {
            setTurnstileError('Turnstile failed to load. Please refresh the page.');
          }
        }, 5000); // 5 second timeout

        return () => {
          mounted = false;
          clearInterval(checkTurnstile);
          clearTimeout(timeout);
        };
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Cleanup Turnstile widget on unmount
  useEffect(() => {
    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch (error) {
          // Silently fail on cleanup
        }
        turnstileWidgetId.current = null;
      }
    };
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      
      if (response.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data.comments || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setTurnstileError('Please enter a comment.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setTurnstileError(null);

    // Try to initialize Turnstile if not already done
    if (!turnstileWidgetId.current && typeof window !== 'undefined' && window.turnstile && turnstileRef.current && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      try {
        const widgetId = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          size: 'invisible',
          callback: (token: string) => {
            setTurnstileToken(token);
            turnstileTokenRef.current = token;
            setTurnstileError(null);
          },
          'error-callback': (error: any) => {
            setTurnstileError('Turnstile validation failed. Please try again.');
            setTurnstileToken(null);
            turnstileTokenRef.current = null;
          },
        });
        turnstileWidgetId.current = widgetId;
      } catch (error) {
        setTurnstileError('Failed to initialize Turnstile. Please refresh the page.');
        setSubmitting(false);
        return;
      }
    }

    // Small delay to ensure widget is ready
    await new Promise(resolve => setTimeout(resolve, 100));

    // Trigger invisible Turnstile challenge
    if (turnstileWidgetId.current && window.turnstile) {
      try {
        window.turnstile.execute(turnstileWidgetId.current);
        
        // Wait for the token to be generated (callback will set turnstileToken)
        // Poll for token with timeout
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds timeout
        
        const waitForToken = setInterval(() => {
          attempts++;
          
          if (turnstileTokenRef.current) {
            clearInterval(waitForToken);
            submitComment();
          } else if (attempts >= maxAttempts) {
            clearInterval(waitForToken);
            setTurnstileError('Turnstile validation timed out. Please try again.');
            setSubmitting(false);
            
            // Reset Turnstile widget
            if (turnstileWidgetId.current && window.turnstile) {
              window.turnstile.reset(turnstileWidgetId.current);
            }
          }
        }, 100);
      } catch (error) {
        setTurnstileError('Failed to execute Turnstile. Please try again.');
        setSubmitting(false);
      }
    } else {
      setTurnstileError('Turnstile not initialized. Please refresh the page.');
      setSubmitting(false);
    }
  };

  const submitComment = async () => {
    const token = turnstileToken || turnstileTokenRef.current;
    
    if (!token) {
      setTurnstileError('Security verification failed. Please try again.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText,
          commenterName: commenterName.trim() || undefined,
          turnstileToken: token,
          parentCommentId: replyingTo,
        }),
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Maximum 10 requests per day.');
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      const data = await response.json();
      
      // Add the new comment to the list
      if (replyingTo) {
        const addReplyToComment = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), data.comment],
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies),
              };
            }
            return comment;
          });
        };
        setComments(addReplyToComment(comments));
      } else {
        setComments([...comments, data.comment]);
      }

      // Reset form
      setCommentText('');
      setCommenterName('');
      setReplyingTo(null);
      setTurnstileToken(null);
      
      // Reset Turnstile widget
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  if (loading) {
    return (
      <div className="max-w-[768px] w-full mx-auto mt-12 px-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[768px] w-full mx-auto mt-12 px-6">
      <div className="border-t border-gray-300 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {turnstileError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            {turnstileError}
          </div>
        )}

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          {replyingTo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Replying to a comment
              </span>
              <button
                type="button"
                onClick={handleCancelReply}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="commenterName" className="block text-sm font-medium text-gray-700 mb-2">
              Name (optional)
            </label>
            <input
              type="text"
              id="commenterName"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-2">
              Comment <span className="text-gray-400">(Markdown supported)</span>
            </label>
            <textarea
              id="commentText"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Write your comment..."
            />
          </div>

          {/* Invisible Turnstile */}
          <div ref={turnstileRef} className="mb-4"></div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={setReplyingTo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
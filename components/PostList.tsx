import Link from "next/link";
import { BlogPost } from "@/types";

function toDate(value?: number) {
  if (!value) return null;
  const ms = value < 1e12 ? value * 1000 : value;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: number) {
  const date = toDate(value);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function excerpt(description?: string) {
  if (!description) return "";
  return description
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_>#~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <ol className="border-t border-gray-200">
      {posts.map((post) => {
        const date = toDate(post.updatedTime);
        const summary = excerpt(post.description);
        return (
          <li key={post.slug} className="border-b border-gray-200">
            <Link href={`/${post.slug}`} className="group block py-7">
              {date && (
                <time
                  dateTime={date.toISOString()}
                  className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400"
                >
                  {formatDate(post.updatedTime)}
                </time>
              )}
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-950 transition-colors group-hover:text-indigo-700 sm:text-[1.35rem]">
                {post.title}
              </h2>
              {summary && (
                <p className="mt-2 line-clamp-2 max-w-2xl text-[15px] leading-relaxed text-gray-600">
                  {summary}
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function PostIndex({
  title,
  description,
  posts,
}: {
  title: string;
  description?: string;
  posts: BlogPost[];
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-10 pt-12 sm:pt-16">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-gray-600">
            {description}
          </p>
        ) : null}
      </header>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}

import Link from "next/link";
import { SectionNav } from "@/components/SectionNav";
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
    <ol className="border-t border-[#e6dfd2]">
      {posts.map((post) => {
        const date = toDate(post.updatedTime);
        const summary = excerpt(post.description);
        return (
          <li key={post.slug} className="border-b border-[#e6dfd2]">
            <Link href={`/${post.slug}`} className="group block py-8">
              {date && (
                <time
                  dateTime={date.toISOString()}
                  className="text-sm font-medium uppercase tracking-[0.16em] text-stone-400"
                >
                  {formatDate(post.updatedTime)}
                </time>
              )}
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 transition-colors group-hover:text-indigo-700 sm:text-3xl">
                {post.title}
              </h2>
              {summary && (
                <p className="mt-3 line-clamp-2 max-w-2xl text-lg leading-relaxed text-stone-600">
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
  posts,
}: {
  title: string;
  posts: BlogPost[];
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-12 pt-10 sm:pt-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          {title}
        </h1>
        <SectionNav />
      </div>
      {posts.length === 0 ? (
        <p className="text-lg text-stone-500">No posts yet.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}

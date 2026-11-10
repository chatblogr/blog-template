"use client";

import { Layout } from "@/components/Layout";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PostContent } from "@/components/PostContent";
import { CommentsSection } from "@/components/CommentsSection";

export function PostPage({
  blogName,
  blogDescription,
  content,
  description,
  title,
  createdAt,
  backHref = "/",
}: {
  blogName: string;
  blogDescription?: string;
  content: string;
  description?: string;
  title: string;
  createdAt?: number | string | { _seconds: number; _nanoseconds: number };
  backHref?: string;
}) {
  const params = useParams();
  const postId = params?.id as string;

  return (
    <Layout blogName={blogName} description={blogDescription}>
      <div className="mx-auto w-full max-w-3xl px-6 pt-10 sm:pt-12">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#efe6d8] px-4 py-2 text-base font-medium text-stone-800 transition-colors hover:bg-[#e5d9c6]"
        >
          <span aria-hidden="true">←</span>
          Back
        </Link>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <PostContent content={content} title={title} description={description} createdAt={createdAt} />
        {postId && <CommentsSection postId={postId} />}
      </div>
    </Layout>
  );
}

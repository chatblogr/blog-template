"use client";

import { Layout } from "@/components/Layout";
import { useParams } from "next/navigation";
import { PostContent } from "@/components/PostContent";
import { Message } from "@/types";

export function PostPage({
  blogName,
  content,
  description,
  title,
  createdAt
}: {
  blogName: string;
  content: string;
  description?: string;
  title: string;
  createdAt?: number | string | { _seconds: number; _nanoseconds: number };
}) {
  return (
    <Layout blogName={blogName}>
      <div className="max-w-[768px] w-full mx-auto">
        <PostContent content={content} title={title} description={description} createdAt={createdAt} />
      </div>
    </Layout>
  );
}

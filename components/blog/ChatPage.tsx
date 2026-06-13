"use client";

import { Layout } from "@/components/blog/Layout";
import { useParams } from "next/navigation";
import { ChatContent } from "./ChatContent";
import { Message } from "@/types";

export function ChatPage({
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
        <ChatContent content={content} title={title} description={description} createdAt={createdAt} />
      </div>
    </Layout>
  );
}

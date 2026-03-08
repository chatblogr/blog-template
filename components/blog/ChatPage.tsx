"use client";

import { Layout } from "@/components/blog/Layout";
import { useParams } from "next/navigation";
import { ChatContent } from "./ChatContent";
import { Message } from "@/types";

export function ChatPage({
  blogName,
  content,
  description,
  title
}: {
  blogName: string;
  content: string;
  description?: string;
  title: string;
}) {
  return (
    <Layout blogName={blogName}>
      <div className="max-w-[768px] w-full mx-auto">
        <ChatContent content={content} title={title} description={description} />
      </div>
    </Layout>
  );
}

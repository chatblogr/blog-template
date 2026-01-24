"use client";

import { Layout } from "@/components/blog/Layout";
import { useParams } from "next/navigation";
import { ChatContent } from "./ChatContent";
import { Message } from "@/types";

export function ChatPage({
  blogName,
  messages,
  title
}: {
  blogName: string;
  messages: Message[];
  title: string;
}) {
  return (
    <Layout blogName={blogName}>
      <div className="max-w-[640px] w-full mx-auto">
        <ChatContent messages={messages} title={title} />
      </div>
    </Layout>
  );
}

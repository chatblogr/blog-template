"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types";
import { Layout } from "@/components/blog/Layout";
import Link from "next/link";
import { md } from "./md";

export function BlogPage({ blogName, posts }: { posts: BlogPost[], blogName: string }) {
  
  return (
    <Layout blogName={blogName}>
      {posts.length === 0 ? (
        <p className="text-red-500">No posts available.</p>
      ) : (
        <>
          <div className="w-full max-w-[640px] mx-auto flex flex-col gap-6 cursor-pointer pt-6">
            {posts.map((chat) => (
              <Link
                key={chat.chatId}
                href={`/${chat.chatId}`}
              >
                <div className="mx-6 pb-8 border-b border-gray-300">
                  <h2 className="text-2xl font-bold text-blue-500">
                    {chat.title}
                  </h2>
                  {chat.updatedTime && (
                    <p className="text-gray-600 text-sm">
                      Updated: {new Date(chat.updatedTime).toLocaleString()}
                    </p>
                  )}
                  <p className="text-gray-600 text-md mt-4">
                    <div
                      className="message"
                      dangerouslySetInnerHTML={{
                        __html: md.render(chat.description ?? ""),
                      }}
                    />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}

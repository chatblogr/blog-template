"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types";
import { Layout } from "@/components/blog/Layout";
import Link from "next/link";
import { md } from "./md";
import { Button } from "../Button";

export function BlogPage({
  blogName,
  posts,
}: {
  posts: BlogPost[];
  blogName: string;
}) {
  return (
    <Layout blogName={blogName}>
      {posts.length === 0 ? (
        <p className="text-red-500">No posts available.</p>
      ) : (
        <>
          <div className="w-full max-w-[768px] mx-auto flex flex-col gap-6 cursor-pointer pt-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/${post.slug}`}>
                <div className="mx-6 pb-6 border-b border-gray-300">
                  <h2 className="text-2xl font-bold text-blue-500">
                    {post.title}
                  </h2>
                  {post.updatedTime && (
                    <p className="text-gray-600 text-sm">
                      Updated: {new Date(post.updatedTime).toLocaleString()}
                    </p>
                  )}
                  <p className="text-gray-600 text-md mt-4">
                    <div
                      className="message"
                      dangerouslySetInnerHTML={{
                        __html: md.render(post.description ?? ""),
                      }}
                    />
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button>Read More &gt;</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}

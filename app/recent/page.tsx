import type { Metadata } from "next";
import { getBlog } from "@/lib/utils";
import { SectionPage } from "@/components/SectionPage";
import { BlogPost } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog();
  return {
    title: blog?.blogName ? `Recents | ${blog.blogName}` : "Recents",
  };
}

export default async function RecentPage() {
  const blog = await getBlog();
  const posts = [...(blog?.posts ?? [])]
    .filter((post: BlogPost) => post.type !== "ar")
    .sort(
      (a: BlogPost, b: BlogPost) => (b.updatedTime ?? 0) - (a.updatedTime ?? 0),
    );
  return (
    <SectionPage
      blogName={blog?.blogName ?? ""}
      description={blog?.description}
      title="Recents"
      posts={posts}
    />
  );
}

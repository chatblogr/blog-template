import type { Metadata } from "next";
import { SITENAME } from "@/constants";
import { BlogPage } from "@/components/blog/BlogPage";
import { getBlog } from "@/lib/utils";



export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog();
  const title = blog.blogName;
  const description = blog.description;

  return title
    ? {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://${SITENAME}`,
          type: "article",
          images: `https://${SITENAME}/images/blog_share.png`,
        },
        twitter: {
          card: "summary",
        },
      }
    : {};
}

export default async function Page() {
  const blog = await getBlog();
  return (
    <BlogPage
      posts={blog.posts}
      blogName={blog.blogName}
    />
  );
}

import type { Metadata } from "next";
import { BlogPage } from "@/components/blog/BlogPage";
import { getBlog } from "@/lib/utils";



export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog();
  const title = blog.blogName;
  const description = blog.description;
  const customDomain = blog.customDomain;

  return title
    ? {
        title,
        description,
        openGraph: {
          title,
          description,
          url: customDomain,
          type: "article",
          images: `${customDomain}/images/facebook.png`,
        },
        twitter: {
          card: "summary",
          images: `${customDomain}/images/twitter.png`,
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

import { Layout } from "@/components/Layout";
import { PostIndex } from "@/components/PostList";
import { BlogPost } from "@/types";

export function SectionPage({
  blogName,
  title,
  posts,
  description,
}: {
  blogName: string;
  title: string;
  posts: BlogPost[];
  description?: string;
}) {
  const sorted = [...posts].sort(
    (a, b) => (b.updatedTime ?? 0) - (a.updatedTime ?? 0),
  );

  return (
    <Layout blogName={blogName} description={description}>
      <PostIndex title={title} posts={sorted} />
    </Layout>
  );
}

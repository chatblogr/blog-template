import { Layout } from "@/components/Layout";
import { PostIndex } from "@/components/PostList";
import { BlogPost } from "@/types";

export function SectionPage({
  blogName,
  title,
  posts,
}: {
  blogName: string;
  title: string;
  posts: BlogPost[];
}) {
  const sorted = [...posts].sort(
    (a, b) => (b.updatedTime ?? 0) - (a.updatedTime ?? 0),
  );

  return (
    <Layout blogName={blogName}>
      <PostIndex title={title} posts={sorted} />
    </Layout>
  );
}

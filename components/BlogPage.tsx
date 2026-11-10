import { Layout } from "@/components/Layout";
import { PostIndex } from "@/components/PostList";
import { BlogPost } from "@/types";

export function BlogPage({
  blogName,
  posts,
  description,
}: {
  posts: BlogPost[];
  blogName: string;
  description?: string;
}) {
  const recentPosts = [...posts]
    .filter((post) => post.type !== "ar")
    .sort((a, b) => (b.updatedTime ?? 0) - (a.updatedTime ?? 0));

  return (
    <Layout blogName={blogName} description={description}>
      <PostIndex title="Recents" posts={recentPosts} />
    </Layout>
  );
}

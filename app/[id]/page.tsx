import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ChatPage } from "@/components/blog/ChatPage";
import { getBlog, getPost } from "@/lib/utils";

type Props = Promise<{
  id: string;
}>;

export async function generateStaticParams() {
  const blog = await getBlog();
  console.log("Generating static params for posts:", blog);

  return blog.posts.flatMap((post: { slug: string; redirects: string[] }) => {
    const posts = [];
    if (post.redirects) {
      posts.push(
        ...post.redirects.map((redirect) => ({
          id: redirect,
        })),
      );
    }
    posts.push({
      id: post.slug,
    });
    return posts;
  });
}

export async function generateMetadata({
  params,
}: {
  params: Props;
}): Promise<Metadata> {
  const id = (await params).id;
  const post = await getPost(id);
  if (post.redirect) {
    return {};
  }
  const title = post.title;
  const description = post.messages?.[0]?.content || post.title;
  const customDomain = post.customDomain;

  return title
    ? {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `${customDomain}/${id}`,
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

export default async function Page({ params }: { params: Props }) {
  const post = await getPost((await params).id);
  if (post.redirect) {
    redirect(post.redirect);
  }
  return <ChatPage {...post} />;
}

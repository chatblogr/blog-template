import type { Metadata } from "next";
import { ChatPage } from "@/components/blog/ChatPage";
import { getBlog, getPost } from "@/lib/utils";

type Props = Promise<{
  id: string;
}>;

export async function generateStaticParams() {
  const { posts } = await getBlog();

  return posts.map((post: { chatId: string }) => ({
    id: post.chatId,
  }));
}

export async function generateMetadata({ params } : { params: Props }): Promise<Metadata> {
  const id = (await params).id;
  const post = await getPost(id);
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
  return <ChatPage {...post} />;
}

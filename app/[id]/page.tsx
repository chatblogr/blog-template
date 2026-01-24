import type { Metadata } from "next";
import { SITENAME } from "@/constants";
import { ChatPage } from "@/components/blog/ChatPage";
import { getBlog, getPost } from "@/lib/utils";

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const { posts } = await getBlog();

  return posts.map((post: { chatId: string }) => ({
    id: post.chatId,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.id);
  let title = post.title;
  let description = post.messages?.[0]?.content || post.title;

  return title
    ? {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://${SITENAME}/${params.id}`,
          type: "article",
          images: `https://${SITENAME}/images/blog_share.png`,
        },
        twitter: {
          card: "summary",
        },
      }
    : {};
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const post = await getPost((await params).id);
  return (
    <ChatPage {...post}
    />
  );
}

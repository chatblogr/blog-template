import { Message } from "@/types";
import { md } from "./md";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ChatContent({
  messages,
  title,
}: {
  messages: Message[];
  title: string;
}) {
  const router = useRouter();
  const content = messages.filter((msg) => msg.role === "assistant")?.[0]
    ?.content;

  return (
    <div className="px-6 pt-4">
      <div className="py-2 border-b border-gray-100 flex items-center">
        <button
          onClick={() => router.push("/")}
          className="mr-3 p-1 rounded hover:bg-gray-200"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <span className="font-bold text-gray-700 text-2xl">{title}</span>
      </div>
      <div
        className="py-6 message"
        dangerouslySetInnerHTML={{ __html: md.render(content ?? "No content") }}
      />
    </div>
  );
}

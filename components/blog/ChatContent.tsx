import { Message } from "@/types";
import { md } from "./md";

export function ChatContent({
  messages,
  title,
}: {
  messages: Message[];
  title: string;
}) {
  const content = messages.filter((msg) => msg.role === "assistant")?.[0]
    ?.content;

  return (
    <div className="px-6 pt-4">
      <div className="py-2 border-b-3 border-gray-200">
        <span className="font-bold text-red-400 text-2xl">{title}</span>
      </div>
      <div
        className="py-6 message"
        dangerouslySetInnerHTML={{ __html: md.render(content ?? "No content") }}
      />
    </div>
  );
}

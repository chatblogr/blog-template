import { Message } from "@/types";
import { md } from "./md";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ChatContent({
  content,
  title,
  description
}: {
  title: string;
  content: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <div className="px-6 pt-4">
      <div className="py-2 border-b border-gray-300 flex items-center">
        <button
          onClick={() => router.push("/")}
          className="mr-3 p-1 rounded hover:bg-gray-200"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <span className="font-bold text-black text-4xl">{title}</span>
      </div>
      <p className="italic text-gray-600 mt-2 mb-6">
        {description}
      </p>
      <div
        className="py-6 message"
        dangerouslySetInnerHTML={{ __html: md.render(content ?? "No content") }}
      />
    </div>
  );
}

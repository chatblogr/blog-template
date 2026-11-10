import { PropsWithChildren } from "react";
import Link from "next/link";

interface LayoutProps {
  blogName: string;
  description?: string;
}

export function Layout({
  children,
  blogName,
  description,
}: PropsWithChildren<LayoutProps>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f3ea] text-stone-950">
      <header className="w-full border-b border-[#e6dfd2]">
        <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:py-10">
          <Link href="/" className="min-w-0">
            <span className="block truncate text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              {blogName}
            </span>
          </Link>
          {description ? (
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-4 border-t border-[#e6dfd2] py-8 text-center text-base text-stone-500">
        <span>Made with </span>
        <a
          href="https://chatblogr.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-stone-800 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-800"
        >
          chatblogr.com
        </a>
      </footer>
    </div>
  );
}

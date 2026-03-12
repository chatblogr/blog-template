"use client";
import { PropsWithChildren } from "react";
import Link from "next/link";

interface LayoutProps {
  blogName: string;
}

export function Layout({ children, blogName }: PropsWithChildren<LayoutProps>) {
  return (
    <div>
      <div className="bg-gradient-to-r from-red-200 to-blue-300 px-6 rounded fixed h-20 flex items-center w-full z-50">
        <Link href={`/`}>
          <h1 className="text-2xl font-bold">{blogName}</h1>
        </Link>
      </div>
      <main className="px-0 pt-20 pb-4">{children}</main>
      <div className="bg-black text-white text-center py-4 mt-6">
        <span className="text-gray-300">Made with </span>
        <a
          href="https://chatblogr.com"
          target="_blank"
          className="hover:border-b border-white"
        >
          chatblogr.com
        </a>
      </div>
    </div>
  );
}

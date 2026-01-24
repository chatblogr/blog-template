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
    </div>
  );
}

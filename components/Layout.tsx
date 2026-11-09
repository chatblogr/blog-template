"use client";
import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LayoutProps {
  blogName: string;
}

const NAV_LINKS = [
  { href: "/", label: "Recents" },
  { href: "/archived", label: "Archived" },
];

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

export function Layout({ children, blogName }: PropsWithChildren<LayoutProps>) {
  const pathname = normalizePath(usePathname() ?? "/");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-6">
          <Link href="/" className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-tight text-gray-950">
              {blogName}
            </span>
          </Link>
          <nav className="flex shrink-0 items-center rounded-full bg-gray-100 p-1">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white text-gray-950 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-16">{children}</main>
      <footer className="mt-4 border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <span>Made with </span>
        <a
          href="https://chatblogr.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-800"
        >
          chatblogr.com
        </a>
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function SectionNav() {
  const pathname = normalizePath(usePathname() ?? "/");

  return (
    <nav className="flex shrink-0 items-center rounded-full bg-[#efe6d8] p-1">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-base font-medium transition-colors ${
              active
                ? "bg-[#fffdf8] text-stone-950 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderNavProps = {
  onNavClick: () => void;
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Games", href: "/games" },
  { label: "Contact", href: "/contact" },
];

export default function HeaderNav({ onNavClick }: HeaderNavProps) {
  const pathname = usePathname();

  return (
    <nav className="header__nav" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={isActive ? "header__nav__link header__nav__link--active" : "header__nav__link"}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
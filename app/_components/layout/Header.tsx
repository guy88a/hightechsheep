"use client";

import Link from "next/link";
import "@/app/_styles/layout/header.scss";

type HeaderProps = {
  onNavClick: () => void;
};

export default function Header({ onNavClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">HightechSheep</div>

      <nav className="header__nav" aria-label="Main navigation">
        <Link href="/" onClick={onNavClick}>
          Home
        </Link>

        <Link href="/games" onClick={onNavClick}>
          Games
        </Link>

        <Link href="/about" onClick={onNavClick}>
          About
        </Link>

        <Link href="/contact" onClick={onNavClick}>
          Contact
        </Link>
      </nav>

      <div className="header__actions">
        <button type="button">Auto</button>
      </div>
    </header>
  );
}
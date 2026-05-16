"use client";

import HeaderNav from "./HeaderNav";
import "@/app/_styles/layout/header.scss";

type HeaderProps = {
  onNavClick: () => void;
};

export default function Header({ onNavClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">HightechSheep</div>

      <HeaderNav onNavClick={onNavClick} />

      <div className="header__actions">
        <button type="button">Auto</button>
      </div>
    </header>
  );
}
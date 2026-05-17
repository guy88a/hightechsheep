"use client";

import { Dispatch, SetStateAction } from "react";
import HeaderAutoPilot from "./HeaderAutoPilot";
import HeaderNav from "./HeaderNav";
import "@/app/_styles/layout/header/header.scss";

type HeaderProps = {
  onNavClick: () => void;
  autoPilotEnabled: boolean;
  setAutoPilotEnabled: Dispatch<SetStateAction<boolean>>;
};

export default function Header({
  onNavClick,
  autoPilotEnabled,
  setAutoPilotEnabled
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">HightechSheep</div>

      <HeaderNav onNavClick={onNavClick} />

      <div className="header__actions">
        <HeaderAutoPilot autoPilotEnabled={autoPilotEnabled} setAutoPilotEnabled={setAutoPilotEnabled} />
      </div>
    </header>
  );
}
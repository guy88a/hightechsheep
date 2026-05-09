import "@/app/_styles/layout/header.scss"

export default function Header() {
  return (
    <header className="header">
      <div className="header__brand">HightechSheep</div>

      <nav className="header__nav" aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/games">Games</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>

      <div className="header__actions">
        <button type="button">Auto</button>
      </div>
    </header>
  );
}
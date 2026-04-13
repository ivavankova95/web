"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = { label: string; href: string };

export function NavMenu({
  primaryNav,
  ctaHref,
  ctaLabel
}: {
  primaryNav: NavItem[];
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="nav-desktop">
        {primaryNav.map((item) => (
          <Link key={item.href} href={item.href} className="nav-link">
            <span>{item.label}</span>
            <span className="nav-link__line" />
          </Link>
        ))}
        <a href={ctaHref} className="btn btn-primary nav-cta" target="_blank" rel="noreferrer">
          {ctaLabel}
        </a>
      </nav>

      {/* Mobile hamburger */}
      <button
        className={`nav-hamburger${open ? " is-open" : ""}`}
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="nav-mobile-overlay" onClick={() => setOpen(false)}>
          <nav className="nav-mobile" onClick={(e) => e.stopPropagation()}>
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-mobile__link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={ctaHref}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              {ctaLabel}
            </a>
          </nav>
        </div>
      )}

      <style>{`
        .nav-desktop {
          display: none;
          align-items: center;
          gap: 0.25rem;
        }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
        }
        .nav-link {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 0.4rem 0.75rem;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-text);
          overflow: hidden;
        }
        .nav-link__line {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--color-brand);
          transition: width 0.25s ease, left 0.25s ease;
        }
        .nav-link:hover .nav-link__line {
          width: 80%;
          left: 10%;
        }
        .nav-cta {
          margin-left: 0.5rem;
          font-size: 0.78rem;
          padding: 0.6rem 1.1rem;
        }
        .nav-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        @media (min-width: 768px) {
          .nav-hamburger { display: none; }
        }
        .nav-hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--color-text);
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }
        .nav-hamburger.is-open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .nav-hamburger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .nav-hamburger.is-open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .nav-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 200;
        }
        .nav-mobile {
          position: absolute;
          top: 0;
          right: 0;
          width: min(320px, 85vw);
          height: 100vh;
          background: var(--color-white);
          padding: 5rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: -4px 0 24px rgba(0,0,0,0.12);
        }
        .nav-mobile__link {
          padding: 0.875rem 0;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-text);
          border-bottom: 1px solid var(--color-border);
        }
        .nav-mobile .btn {
          margin-top: 1.5rem;
          text-align: center;
        }
      `}</style>
    </>
  );
}

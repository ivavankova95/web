"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  variant?: string;
  openInNewTab?: boolean;
};

export function NavMenu({
  primaryNav
}: {
  primaryNav: NavItem[];
}) {
  const [open, setOpen] = useState(false);

  const renderLink = (item: NavItem, className: string, isMobile = false) => {
    const isExternal = item.href.startsWith("http") || item.openInNewTab;
    if (isExternal) {
      return (
        <a
          key={item.href}
          href={item.href}
          className={className}
          target="_blank"
          rel="noreferrer"
          onClick={isMobile ? () => setOpen(false) : undefined}
        >
          {isMobile ? (
            item.label
          ) : (
            <>
              <span>{item.label}</span>
              <span className="nav-link__line" />
            </>
          )}
        </a>
      );
    }
    return (
      <Link
        key={item.href}
        href={item.href}
        className={className}
        onClick={isMobile ? () => setOpen(false) : undefined}
      >
        {isMobile ? (
          item.label
        ) : (
          <>
            <span>{item.label}</span>
            <span className="nav-link__line" />
          </>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="nav-desktop">
        {primaryNav.map((item) => {
          const isCta = item.variant === "cta";
          return renderLink(item, isCta ? "btn btn-primary nav-cta" : "nav-link");
        })}
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
            {primaryNav.map((item) => {
              const isCta = item.variant === "cta";
              return renderLink(item, isCta ? "btn btn-primary nav-cta-mobile" : "nav-mobile__link", true);
            })}
          </nav>
        </div>
      )}

      <style>{`
        .nav-desktop {
          display: none;
          align-items: center;
          gap: 0;
        }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
        }
        .nav-link {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 15px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: normal;
          text-transform: uppercase;
          color: var(--color-brand);
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
          font-size: 14px;
          font-weight: 500;
          padding: 9px 25px;
          letter-spacing: 1px;
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
          background: var(--color-brand);
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
          background: var(--color-surface);
          padding: 5rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: -4px 0 24px rgba(0,0,0,0.12);
        }
        .nav-mobile__link {
          padding: 0.875rem 0;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: normal;
          text-transform: uppercase;
          color: var(--color-brand);
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

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  const [menuState, setMenuState] = useState<"closed" | "opening" | "open" | "closing">("closed");

  const isActive = menuState !== "closed";
  const isVisible = menuState === "open";

  const openMenu = () => {
    if (isActive) {
      return;
    }
    setMounted(true);
    setMenuState("opening");
  };

  const closeMenu = () => {
    if (menuState === "closed" || menuState === "closing") {
      return;
    }
    setMenuState("closing");
  };

  useEffect(() => {
    let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (menuState === "opening") {
      frameId = requestAnimationFrame(() => {
        setMenuState("open");
      });
      return () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    }

    if (menuState === "closing") {
      timeoutId = setTimeout(() => {
        setMounted(false);
        setMenuState("closed");
      }, 260);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [menuState]);

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
          onClick={isMobile ? closeMenu : undefined}
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
        onClick={isMobile ? closeMenu : undefined}
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
        className={`nav-hamburger${isActive ? " is-open" : ""}`}
        aria-label={isActive ? "Zavřít menu" : "Menu"}
        onClick={() => (isActive ? closeMenu() : openMenu())}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile drawer */}
      {mounted && (
        <div
          className={`nav-mobile-overlay${isVisible ? " is-open" : ""}`}
          onClick={closeMenu}
        >
          <nav className={`nav-mobile${isVisible ? " is-open" : ""}`} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="nav-mobile__close"
              aria-label="Zavřít menu"
              onClick={closeMenu}
            >
              <span />
              <span />
            </button>

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
          opacity: 0;
          transition: opacity 0.26s ease;
        }
        .nav-mobile-overlay.is-open {
          opacity: 1;
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
          transform: translateX(100%);
          transition: transform 0.26s ease;
          will-change: transform;
        }
        .nav-mobile.is-open {
          transform: translateX(0);
        }
        .nav-mobile__close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 36px;
          height: 36px;
          border: none;
          background: none;
          padding: 0;
          cursor: pointer;
        }
        .nav-mobile__close span {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 24px;
          height: 2px;
          background: var(--color-brand);
          border-radius: 2px;
        }
        .nav-mobile__close span:nth-child(1) {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .nav-mobile__close span:nth-child(2) {
          transform: translate(-50%, -50%) rotate(-45deg);
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

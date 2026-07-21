"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/routing";

export type NavLink = { href: string; label: string };

export function MobileNav({ links, openLabel, closeLabel }: { links: NavLink[]; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);

  // Lock scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-asphalt-600 text-dust-100"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 bg-asphalt-950"
          role="dialog"
          aria-modal="true"
        >
          <div className="container-page flex h-16 items-center justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-asphalt-600 text-dust-100"
            >
              <X size={22} />
            </button>
          </div>
          <nav aria-label={openLabel} className="container-page flex flex-col gap-1 pt-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-asphalt-600/60 py-4 font-display text-xl font-semibold uppercase tracking-wide text-dust-50 hover:text-ember-600"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

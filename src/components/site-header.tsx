"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import type { HeaderCopy } from "../lib/copy";
import { ThemeToggle } from "./theme-toggle";

type SessionUser = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

type SiteHeaderProps = {
  copy: HeaderCopy;
  currentPath?: string;
};

function getUserInitials(user: SessionUser | null): string {
  const label = user?.name || user?.email || "Nora";
  const words = label
    .replace(/@.*/u, "")
    .split(/\s+/u)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
  }

  return (words[0]?.slice(0, 2) || "N").toUpperCase();
}

function useSessionUser() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isDisposed = false;

    authClient
      .getSession()
      .catch(() => null)
      .then((result) => {
        if (isDisposed) return;
        setSessionUser((result as { data?: { user?: SessionUser | null } } | null)?.data?.user ?? null);
        setIsAuthLoading(false);
      });

    return () => {
      isDisposed = true;
    };
  }, []);

  return { sessionUser, setSessionUser, isAuthLoading };
}

function UserAvatar({ user, className }: { user: SessionUser; className: string }) {
  const [hasError, setHasError] = useState(false);
  const label = user.name || user.email || "Nora";

  useEffect(() => {
    setHasError(false);
  }, [user.image]);

  return (
    <span className={className}>
      {user.image && !hasError ? (
        <img
          src={user.image}
          alt={label}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <span aria-hidden="true">{getUserInitials(user)}</span>
      )}
    </span>
  );
}

export function SiteHeader({ copy, currentPath = "/" }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const { sessionUser, setSessionUser, isAuthLoading } = useSessionUser();
  const navLinks = [
    { label: copy.nav.features, href: "/#app", path: "#app" },
    { label: copy.nav.docs, href: "/docs/", path: "/docs" },
    { label: copy.nav.changelog, href: "/changelog", path: "/changelog" },
    { label: copy.nav.feedback, href: "/feedback", path: "/feedback" },
  ];
  const userLabel = sessionUser?.name || sessionUser?.email || "Nora";

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const signInWithGitHub = async () => {
    if (isLoginPending || sessionUser) return;

    setIsLoginPending(true);
    const result = await authClient.signIn.social({ callbackURL: currentPath, provider: "github" });
    if (result?.error) setIsLoginPending(false);
  };

  const signOut = async () => {
    if (isLoginPending || !sessionUser) return;

    setIsLoginPending(true);
    await authClient.signOut();
    setSessionUser(null);
    setIsLoginPending(false);
    window.dispatchEvent(new Event("nora-auth-change"));
  };

  const handleAuthAction = () => {
    if (isAuthLoading) return;
    void (sessionUser ? signOut() : signInWithGitHub());
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className="sticky top-0 z-[90] bg-[color-mix(in_oklab,var(--paper)_88%,transparent)] font-mono backdrop-blur"
        aria-label={copy.primaryNavigationAria}
      >
        <div className="n-wrap flex h-16 items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-2.5" aria-label={copy.homeAria}>
            <img src="/icon-192.png" alt={copy.logoAlt} className="h-7 w-7" />
            <span className="text-[0.95rem] font-semibold">
              nora<span className="font-normal text-[var(--muted-foreground)]">.app</span>
            </span>
          </a>

          <div className="hidden flex-1 items-center justify-center gap-6 text-[0.82rem] text-[var(--ink-soft)] md:flex">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`transition-colors hover:text-[var(--ink)] ${isActive ? "text-[var(--accent-ink)]" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-[var(--muted-foreground)]">/ </span>
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle label={copy.themeAria} />

            {sessionUser ? (
              <button
                type="button"
                aria-label={copy.logout}
                title={`${userLabel} · ${copy.logout}`}
                disabled={isLoginPending}
                onClick={handleAuthAction}
                className="disabled:opacity-60"
              >
                <UserAvatar
                  user={sessionUser}
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--rule)] text-xs font-medium"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAuthAction}
                disabled={isAuthLoading || isLoginPending}
                className="text-[0.82rem] text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-60"
              >
                {copy.login}
              </button>
            )}

            <a href="/#download" className="n-btn n-btn--ink !h-9 !px-3 !text-[0.8rem]">
              {copy.nav.download}
            </a>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-[var(--rule)] md:hidden"
            aria-label={isMobileMenuOpen ? copy.closeMenuAria : copy.menuAria}
            aria-expanded={isMobileMenuOpen}
            title={isMobileMenuOpen ? copy.closeMenuAria : copy.menuAria}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className="relative h-3.5 w-4" aria-hidden="true">
              <motion.span
                className="absolute left-0 top-0 h-[1.5px] w-4 bg-current"
                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-current"
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-[1.5px] w-4 bg-current"
                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label={copy.closeMenuAria}
              onClick={closeMobileMenu}
            />

            <motion.div
              className="absolute left-0 right-0 top-16 border-b border-[var(--rule)] bg-[var(--paper)] font-mono"
              role="dialog"
              aria-modal="true"
              aria-label={copy.primaryNavigationAria}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="n-wrap pb-6 pt-1 text-[0.95rem]">
                {navLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex min-h-14 items-center justify-between border-t border-dashed border-[var(--rule)] py-4"
                  >
                    <span>
                      <span className="text-[var(--muted-foreground)]">/ </span>
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                  </a>
                ))}

                <div className="flex min-h-14 items-center justify-between border-t border-dashed border-[var(--rule)] py-4">
                  <span>{copy.themeAria}</span>
                  <ThemeToggle label={copy.themeAria} />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    handleAuthAction();
                  }}
                  disabled={isAuthLoading || isLoginPending}
                  className="flex min-h-14 w-full items-center justify-between border-t border-dashed border-[var(--rule)] py-4 text-left disabled:opacity-60"
                >
                  {sessionUser ? (
                    <span className="flex min-w-0 items-center gap-3">
                      <UserAvatar
                        user={sessionUser}
                        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--rule)] text-sm"
                      />
                      <span className="min-w-0">
                        <span className="block truncate">{userLabel}</span>
                        <span className="block text-sm text-[var(--muted-foreground)]">{copy.logout}</span>
                      </span>
                    </span>
                  ) : (
                    <span>{copy.login}</span>
                  )}
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
                </button>

                <a href="/#download" onClick={closeMobileMenu} className="n-btn n-btn--ink mt-4 w-full justify-center">
                  {copy.nav.download}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

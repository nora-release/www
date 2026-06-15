"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appStoreUrl, localizedPath } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import type { FooterCopy } from "../lib/translations";

type FooterProps = {
  copy: FooterCopy;
  locale: Locale;
  showProductLinks?: boolean;
};

export function Footer({
  copy,
  locale,
  showProductLinks = true,
}: FooterProps) {
  const homePath = localizedPath(locale, "/");
  const footerLinks = {
    product: [
      { label: copy.productLinks.faq, href: `${homePath}#faq` },
    ],
    resources: [
      { label: copy.resourceLinks.changelog, href: localizedPath(locale, "/changelog") },
      { label: copy.resourceLinks.support, href: localizedPath(locale, "/support") },
    ],
    legal: [
      { label: copy.legalLinks.privacy, href: localizedPath(locale, "/privacy") },
      { label: copy.legalLinks.terms, href: localizedPath(locale, "/terms") },
    ],
  };

  return (
    <footer className="relative bg-background border-t border-border/50">
      {/* CTA Section */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div>
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-foreground mb-2">
                {copy.ctaTitle}
              </h2>
              <p className="text-muted-foreground">
                {copy.ctaText}
              </p>
            </div>
            <motion.a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>{copy.appStoreButton}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className={`grid grid-cols-2 gap-8 md:gap-12 ${showProductLinks ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/icon-192.png"
                  alt=""
                  className="w-9 h-9 rounded-lg"
                />
                <span className="font-semibold text-foreground">Nora</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {copy.description}
              </p>
            </motion.div>
          </div>

          {showProductLinks && (
            <FooterLinkGroup title={copy.groups.product} links={footerLinks.product} delay={0.1} />
          )}

          {/* Resources Links */}
          <FooterLinkGroup title={copy.groups.resources} links={footerLinks.resources} delay={0.15} />

          {/* Legal Links */}
          <FooterLinkGroup title={copy.groups.legal} links={footerLinks.legal} delay={0.2} />

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Nora. {copy.copyright}</p>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {copy.systemStatus}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
  delay
}: {
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

import type { ReactNode } from "react";
import { isPlaceholder } from "@/data/site";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  download?: boolean;
  label?: string;
};

const variants = {
  primary:
    "bg-accent text-accent-fg font-semibold hover:brightness-110 shadow-[0_0_0_1px_rgb(86_217_195/0.5),0_8px_24px_-8px_rgb(86_217_195/0.5)]",
  secondary: "bg-surface text-fg border border-line-strong hover:bg-surface-hover hover:border-accent-line",
  ghost: "text-muted hover:text-fg hover:bg-surface",
};

/**
 * Link styled as a button. When `href` is still a [PLACEHOLDER], it renders as an inert,
 * clearly-labelled element instead of a broken link.
 */
export function LinkButton({ href, variant = "secondary", size = "md", icon, children, className, download, label }: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 select-none",
    size === "md" ? "h-11 px-5 text-sm" : "h-9 px-3.5 text-[13px]",
    variants[variant],
    className,
  );

  if (isPlaceholder(href)) {
    return (
      <a role="link" aria-disabled="true" title="Link not set yet" aria-label={label} className={cn(classes, "cursor-default")}>
        {icon}
        {children}
      </a>
    );
  }

  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      aria-label={label}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      {icon}
      {children}
    </a>
  );
}

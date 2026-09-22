import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container-x flex flex-col items-start justify-between gap-4 text-sm text-subtle sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js, TypeScript and Tailwind CSS.
        </p>
        <a href="#home" className="text-muted transition-colors hover:text-fg">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

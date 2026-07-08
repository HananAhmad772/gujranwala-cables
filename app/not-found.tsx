import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="grid min-h-[65vh] place-items-center px-4 py-20 text-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-secondary">404</p>
          <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-6xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">The page you are looking for may have moved or is not available yet.</p>
          <Link href="/" className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-primary-foreground">
            Back to home
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}

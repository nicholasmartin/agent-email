"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 Agent Email. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/#" className="text-sm text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link href="/#" className="text-sm text-muted-foreground hover:underline">
            Privacy
          </Link>
          <Link href="/#" className="text-sm text-muted-foreground hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

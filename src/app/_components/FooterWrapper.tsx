"use client";

import { Footer } from "@/features/shared";
import { usePathname } from "next/navigation";

const HIDDEN_FOOTER_PATHS = ["/admin", "/seller"];

export function FooterWrapper() {
  const pathname = usePathname();
  const isHidden = HIDDEN_FOOTER_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (isHidden) return null;

  return <Footer />;
}

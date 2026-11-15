"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Signale chaque page vue à /api/collect. Respecte Do Not Track et Global Privacy Control. */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
    const params = new URLSearchParams(window.location.search);
    const payload = JSON.stringify({
      path: pathname,
      // Le référent n'a de sens que pour la première page ; ensuite la navigation est interne.
      referrer: first.current ? document.referrer : "",
      utm: params.get("utm_source") ?? params.get("ref") ?? "",
    });
    first.current = false;
    const blob = new Blob([payload], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/collect", blob)) {
      fetch("/api/collect", { method: "POST", body: payload, keepalive: true }).catch(() => undefined);
    }
  }, [pathname]);

  return null;
}

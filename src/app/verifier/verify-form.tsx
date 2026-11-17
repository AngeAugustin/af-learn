"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanLine, X } from "lucide-react";
import { codeFromScan, formatCertificateInput } from "@/lib/certificate-format";

// API de détection de codes-barres du navigateur (Chrome, Edge, Android) ; absente des types TypeScript.
type Detector = { detect(source: CanvasImageSource): Promise<{ rawValue: string }[]> };
type DetectorCtor = new (options: { formats: string[] }) => Detector;
const detectorCtor = () => (globalThis as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;

/** Formulaire de saisie d'un identifiant d'attestation (GET vers /verifier), avec scan du QR code si le navigateur le permet. */
/** `scan` : bouton de scan du QR code, réservé à /verifier (seule page autorisée à utiliser la caméra). */
export function VerifyForm({ defaultValue = "", autoFocus = false, scan = false }: { defaultValue?: string; autoFocus?: boolean; scan?: boolean }) {
  const [value, setValue] = useState(() => formatCertificateInput(defaultValue));
  const [canScan, setCanScan] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    // Détecté après le montage pour que le rendu serveur et le premier rendu client soient identiques.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanScan(scan && Boolean(detectorCtor() && navigator.mediaDevices?.getUserMedia));
  }, [scan]);

  return (
    <div>
      <form action="/verifier" method="get" className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="code" className="sr-only">
          Identifiant de l&apos;attestation
        </label>
        <input
          id="code"
          name="code"
          value={value}
          onChange={(e) => setValue(formatCertificateInput(e.target.value))}
          placeholder="CUR-AIE-7K4Q-M29X"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          autoFocus={autoFocus}
          maxLength={17}
          required
          className="min-w-0 flex-1 rounded-xl border border-border-strong bg-bg-elevated px-4 py-3 font-mono text-base tracking-[0.12em] text-fg outline-none placeholder:text-fg-subtle/60 focus:border-brand focus:ring-2 focus:ring-[var(--ring)]"
        />
        <button type="submit" className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-fg transition hover:bg-brand-strong">
          Vérifier
        </button>
      </form>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-fg-subtle">
        <span>Majuscules et tirets ajoutés automatiquement.</span>
        {canScan && !scanning && (
          <button
            type="button"
            onClick={() => {
              setScanError("");
              setScanning(true);
            }}
            className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
          >
            <ScanLine className="size-4" aria-hidden /> Scanner le QR code
          </button>
        )}
      </div>
      {scanError && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {scanError}
        </p>
      )}
      {scanning && (
        <Scanner
          onClose={() => setScanning(false)}
          onError={(message) => {
            setScanning(false);
            setScanError(message);
          }}
        />
      )}
    </div>
  );
}

function Scanner({ onClose, onError }: { onClose: () => void; onError: (message: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [hint, setHint] = useState("Placez le QR code de l'attestation dans le cadre.");
  // Gardé dans une référence : un nouveau rendu du parent ne doit pas relancer la caméra.
  const fail = useRef(onError);
  useEffect(() => {
    fail.current = onError;
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    const Ctor = detectorCtor();
    if (!Ctor) return;
    const detector = new Ctor({ formats: ["qr_code"] });

    const tick = async () => {
      if (stopped || !video.current) return;
      try {
        if (video.current.readyState >= 2) {
          const [hit] = await detector.detect(video.current);
          if (hit) {
            const code = codeFromScan(hit.rawValue);
            if (code) {
              stopped = true;
              router.push(`/verifier/${code}`);
              return;
            }
            setHint("Ce QR code n'est pas celui d'une attestation Cursus.");
          }
        }
      } catch {
        // Image illisible : on réessaie au prochain passage.
      }
      timer = setTimeout(tick, 250);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        if (video.current) {
          video.current.srcObject = s;
          void video.current.play();
        }
        tick();
      })
      .catch(() => fail.current("Accès à la caméra refusé ou indisponible. Saisissez l'identifiant à la main."));

    return () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [router]);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-bg-muted">
      <div className="relative aspect-[4/3] bg-black">
        <video ref={video} muted playsInline className="size-full object-cover" aria-label="Aperçu de la caméra" />
        <div aria-hidden className="pointer-events-none absolute inset-[18%] rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
      </div>
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs text-fg-muted">
        <span aria-live="polite">{hint}</span>
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1 font-semibold text-fg hover:text-brand">
          <X className="size-4" aria-hidden /> Fermer
        </button>
      </div>
    </div>
  );
}

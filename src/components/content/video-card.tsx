import { ExternalLink, Play } from "lucide-react";
import { parseVideo, videoWatchUrl, type VideoSpec } from "@/lib/content/references";

const YOUTUBE_RED = "#ff0033";

/**
 * Vidéo YouTube recommandée dans un chapitre (bloc ```video). La vidéo s'ouvre sur YouTube : aucune ressource
 * de YouTube n'est chargée par la page, pour ne rien transmettre à un tiers tant que l'apprenant ne clique pas.
 */
export function VideoCard({ source }: { source: string }) {
  let video: VideoSpec;
  try {
    video = parseVideo(source);
  } catch {
    return null;
  }
  const passage = video.from ? (video.to ? `de ${video.from} à ${video.to}` : `à partir de ${video.from}`) : null;

  return (
    <a
      href={videoWatchUrl(video)}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group my-6 grid gap-4 rounded-2xl border border-border bg-bg-elevated p-3 no-underline transition hover:border-[color:var(--border-strong,var(--border))] hover:shadow-hover sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center"
    >
      <span className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#14110f]">
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.10)_1.2px,transparent_1.4px)] bg-[size:14px_14px]"
        />
        <span
          className="relative flex h-9 w-12 items-center justify-center rounded-[10px] text-white transition-transform duration-200 group-hover:scale-110"
          style={{ background: YOUTUBE_RED }}
        >
          <Play className="size-4 fill-current" aria-hidden />
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white">{video.duration}</span>
      </span>

      <span className="block min-w-0 px-1 pb-1 sm:p-0">
        <span className="label-mono flex items-center gap-1.5 text-[11px]" style={{ color: YOUTUBE_RED }}>
          Pour aller plus loin en vidéo
        </span>
        <span className="mt-1 block text-base font-bold leading-snug text-fg transition-colors group-hover:text-brand">{video.title}</span>
        <span className="mt-0.5 block text-xs text-fg-muted">
          {video.channel} · {video.lang === "fr" ? "en français" : "en anglais, sous-titres disponibles"}
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-fg">
          {video.why}
          {passage && <span className="font-semibold"> Regardez {passage}.</span>}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand">
          Regarder sur YouTube <ExternalLink className="size-3.5" aria-hidden />
        </span>
      </span>
    </a>
  );
}

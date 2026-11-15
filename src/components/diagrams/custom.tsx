import type { ReactNode } from "react";
import type { CUSTOM_DIAGRAMS } from "@/lib/diagrams/spec";

type Name = (typeof CUSTOM_DIAGRAMS)[number];

const FG = "var(--fg)";
const MUTED = "var(--fg-muted)";
const BORDER = "var(--border-strong)";
const T = {
  violet: "var(--tone-violet)",
  blue: "var(--tone-blue)",
  teal: "var(--tone-teal)",
  amber: "var(--tone-amber)",
  rose: "var(--tone-rose)",
};
const SOFT = {
  violet: "var(--tone-violet-soft)",
  blue: "var(--tone-blue-soft)",
  teal: "var(--tone-teal-soft)",
  amber: "var(--tone-amber-soft)",
  rose: "var(--tone-rose-soft)",
};

function Svg({ width, height, label, children }: { width: number; height: number; label: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="mx-auto block h-auto w-full"
        style={{ minWidth: Math.min(width, 480), maxWidth: width }}
        fontFamily="var(--font-sans)"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={MUTED} />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

function OverfittingCurves() {
  const x0 = 60, y0 = 250, w = 500, h = 200;
  const px = (t: number) => x0 + t * w;
  const py = (v: number) => y0 - v * h;
  const train = (t: number) => 0.08 + 0.82 * Math.exp(-4.2 * t);
  const val = (t: number) => 0.24 + 0.68 * Math.exp(-5 * t) + 0.42 * Math.max(0, t - 0.38) ** 1.6;
  const path = (f: (t: number) => number) =>
    Array.from({ length: 101 }, (_, i) => i / 100)
      .map((t, i) => `${i === 0 ? "M" : "L"} ${px(t).toFixed(1)} ${py(f(t)).toFixed(1)}`)
      .join(" ");
  let best = 0;
  for (let i = 0; i <= 100; i++) if (val(i / 100) < val(best / 100)) best = i;
  const tb = best / 100;
  return (
    <Svg width={600} height={300} label="Courbes de perte d'entraînement et de validation">
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={BORDER} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - h - 10} stroke={BORDER} />
      <text x={x0 + w} y={y0 + 24} textAnchor="end" fontSize="13" fill={MUTED}>Époques d&apos;entraînement →</text>
      <text x={x0 - 12} y={y0 - h - 16} fontSize="13" fill={MUTED}>Perte</text>
      <rect x={px(0)} y={y0 - h - 10} width={px(tb) - px(0)} height={h + 10} fill={SOFT.blue} opacity="0.55" />
      <rect x={px(tb)} y={y0 - h - 10} width={px(1) - px(tb)} height={h + 10} fill={SOFT.rose} opacity="0.55" />
      <text x={(px(0) + px(tb)) / 2} y={y0 - h + 8} textAnchor="middle" fontSize="12" fill={T.blue} fontWeight="600">le modèle apprend</text>
      <text x={(px(tb) + px(1)) / 2} y={y0 - h + 8} textAnchor="middle" fontSize="12" fill={T.rose} fontWeight="600">surapprentissage</text>
      <path d={path(train)} fill="none" stroke={T.violet} strokeWidth="3" />
      <path d={path(val)} fill="none" stroke={T.amber} strokeWidth="3" />
      <line x1={px(tb)} y1={y0} x2={px(tb)} y2={y0 - h - 10} stroke={FG} strokeDasharray="5 4" />
      <circle cx={px(tb)} cy={py(val(tb))} r="5" fill={T.amber} />
      <text x={px(tb)} y={py(val(tb)) - 14} textAnchor="middle" fontSize="12" fill={FG} fontWeight="600">arrêt optimal</text>
      <g fontSize="13" fontWeight="600">
        <rect x={x0 + w - 190} y={y0 - h + 26} width="12" height="4" fill={T.violet} />
        <text x={x0 + w - 172} y={y0 - h + 32} fill={FG}>Perte d&apos;entraînement</text>
        <rect x={x0 + w - 190} y={y0 - h + 46} width="12" height="4" fill={T.amber} />
        <text x={x0 + w - 172} y={y0 - h + 52} fill={FG}>Perte de validation</text>
      </g>
    </Svg>
  );
}

function Neuron() {
  const inputs = [70, 150, 230];
  return (
    <Svg width={600} height={300} label="Schéma d'un neurone artificiel">
      {inputs.map((y, i) => (
        <g key={i}>
          <circle cx="60" cy={y} r="24" fill={SOFT.blue} stroke={T.blue} strokeWidth="2" />
          <text x="60" y={y + 5} textAnchor="middle" fontSize="15" fontWeight="600" fill={FG}>x{"₁₂₃"[i]}</text>
          <line x1="86" y1={y} x2="262" y2="150" stroke={MUTED} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="165" y={(y + 150) / 2 - 8} textAnchor="middle" fontSize="14" fill={T.violet} fontWeight="600">w{"₁₂₃"[i]}</text>
        </g>
      ))}
      <circle cx="300" cy="150" r="38" fill={SOFT.violet} stroke={T.violet} strokeWidth="2" />
      <text x="300" y="148" textAnchor="middle" fontSize="22" fill={FG}>Σ</text>
      <text x="300" y="170" textAnchor="middle" fontSize="12" fill={MUTED}>+ b</text>
      <line x1="338" y1="150" x2="398" y2="150" stroke={MUTED} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <rect x="402" y="118" width="80" height="64" rx="12" fill={SOFT.teal} stroke={T.teal} strokeWidth="2" />
      <text x="442" y="148" textAnchor="middle" fontSize="18" fill={FG} fontStyle="italic">f</text>
      <text x="442" y="168" textAnchor="middle" fontSize="11" fill={MUTED}>activation</text>
      <line x1="482" y1="150" x2="532" y2="150" stroke={MUTED} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <circle cx="560" cy="150" r="22" fill={SOFT.amber} stroke={T.amber} strokeWidth="2" />
      <text x="560" y="155" textAnchor="middle" fontSize="15" fontWeight="600" fill={FG}>y</text>
      <text x="300" y="232" textAnchor="middle" fontSize="12" fill={MUTED}>somme pondérée</text>
      <text x="60" y="285" textAnchor="middle" fontSize="12" fill={MUTED}>entrées</text>
      <text x="560" y="200" textAnchor="middle" fontSize="12" fill={MUTED}>sortie</text>
    </Svg>
  );
}

function NeuralNetwork() {
  const layers = [3, 5, 5, 2];
  const xs = [80, 230, 380, 530];
  const names = ["Entrée", "Couche cachée 1", "Couche cachée 2", "Sortie"];
  const tones = [T.blue, T.violet, T.violet, T.amber];
  const softs = [SOFT.blue, SOFT.violet, SOFT.violet, SOFT.amber];
  const ys = (n: number) => Array.from({ length: n }, (_, i) => 150 + (i - (n - 1) / 2) * 46);
  return (
    <Svg width={610} height={310} label="Réseau de neurones à deux couches cachées">
      {layers.slice(0, -1).map((n, l) =>
        ys(n).map((y1, i) =>
          ys(layers[l + 1]).map((y2, j) => (
            <line key={`${l}-${i}-${j}`} x1={xs[l]} y1={y1} x2={xs[l + 1]} y2={y2} stroke={BORDER} strokeWidth="1" />
          )),
        ),
      )}
      {layers.map((n, l) =>
        ys(n).map((y, i) => (
          <circle key={`${l}-${i}`} cx={xs[l]} cy={y} r="15" fill={softs[l]} stroke={tones[l]} strokeWidth="2" />
        )),
      )}
      {names.map((name, l) => (
        <text key={l} x={xs[l]} y="290" textAnchor="middle" fontSize="13" fontWeight="600" fill={FG}>{name}</text>
      ))}
    </Svg>
  );
}

function EmbeddingSpace() {
  const groups = [
    { label: "Animaux", color: T.teal, soft: SOFT.teal, points: [["chat", 110, 90], ["chien", 150, 70], ["chaton", 95, 125], ["lion", 165, 115]] },
    { label: "Véhicules", color: T.blue, soft: SOFT.blue, points: [["voiture", 420, 80], ["camion", 470, 105], ["vélo", 405, 125], ["moto", 455, 60]] },
    { label: "Finance", color: T.amber, soft: SOFT.amber, points: [["banque", 300, 230], ["crédit", 345, 255], ["prêt", 265, 260], ["épargne", 330, 205]] },
  ] as const;
  return (
    <Svg width={580} height={310} label="Espace d'embeddings simplifié en deux dimensions">
      <rect x="20" y="20" width="540" height="270" rx="14" fill="none" stroke={BORDER} strokeDasharray="4 6" />
      {groups.map((g) => {
        const cx = g.points.reduce((n, p) => n + p[1], 0) / g.points.length;
        const cy = g.points.reduce((n, p) => n + p[2], 0) / g.points.length;
        return (
          <g key={g.label}>
            <ellipse cx={cx} cy={cy} rx="85" ry="55" fill={g.soft} stroke={g.color} strokeOpacity="0.4" />
            <text x={cx} y={cy - 62} textAnchor="middle" fontSize="13" fontWeight="700" fill={g.color}>{g.label}</text>
            {g.points.map(([word, x, y]) => (
              <g key={word}>
                <circle cx={x} cy={y} r="5" fill={g.color} />
                <text x={x + 8} y={y + 4} fontSize="12.5" fill={FG}>{word}</text>
              </g>
            ))}
          </g>
        );
      })}
      <g>
        <line x1="200" y1="150" x2="128" y2="104" stroke={T.rose} strokeDasharray="4 4" />
        <path d="M 200 138 l 4 9 l 10 1 l -7 7 l 2 10 l -9 -5 l -9 5 l 2 -10 l -7 -7 l 10 -1 z" fill={T.rose} />
        <text x="216" y="156" fontSize="12.5" fontWeight="600" fill={T.rose}>« mon chat dort » (requête)</text>
      </g>
    </Svg>
  );
}

function AttentionHeatmap() {
  const tokens = ["Le", "trophée", "ne", "rentre", "pas", "dans", "la", "valise", "car", "il"];
  const weights = [0.03, 0.52, 0.02, 0.06, 0.02, 0.02, 0.03, 0.18, 0.07, 0.05];
  const cell = 56;
  const x0 = 20;
  return (
    <Svg width={x0 * 2 + cell * tokens.length} height={190} label="Poids d'attention du token il">
      <text x={x0} y="28" fontSize="13" fill={MUTED}>
        Attention portée par « il » à chaque token (illustratif) :
      </text>
      {tokens.map((tok, i) => (
        <g key={i}>
          <rect
            x={x0 + i * cell + 2}
            y="50"
            width={cell - 4}
            height="56"
            rx="8"
            fill={T.violet}
            fillOpacity={0.08 + weights[i] * 1.6}
            stroke={i === tokens.length - 1 ? T.rose : "none"}
            strokeWidth="2"
          />
          <text
            x={x0 + i * cell + cell / 2}
            y="84"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            fill={weights[i] > 0.3 ? "#ffffff" : FG}
          >
            {Math.round(weights[i] * 100)} %
          </text>
          <text x={x0 + i * cell + cell / 2} y="132" textAnchor="middle" fontSize="13" fill={FG} fontWeight={weights[i] > 0.1 ? 700 : 400}>
            {tok}
          </text>
        </g>
      ))}
      <text x={x0} y="172" fontSize="12" fill={MUTED}>
        Les poids somment à 100 % ; « trophée » domine, « valise » est le principal concurrent.
      </text>
    </Svg>
  );
}

function Temperature() {
  const tokens = ["bleu", "gris", "clair", "dégagé", "magnifique"];
  const logits = [3.0, 2.0, 1.5, 1.0, 0.2];
  const temps = [0.5, 1, 1.5];
  const softmax = (t: number) => {
    const e = logits.map((l) => Math.exp(l / t));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map((v) => v / s);
  };
  const panelW = 190;
  const barH = 140;
  return (
    <Svg width={panelW * 3 + 30} height={250} label="Effet de la température sur la distribution de probabilités">
      {temps.map((t, k) => {
        const probs = softmax(t);
        const ox = 15 + k * panelW;
        return (
          <g key={t}>
            <text x={ox + panelW / 2} y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill={FG}>
              T = {String(t).replace(".", ",")}
            </text>
            <line x1={ox + 10} y1={40 + barH} x2={ox + panelW - 10} y2={40 + barH} stroke={BORDER} />
            {probs.map((p, i) => {
              const bw = 26;
              const x = ox + 18 + i * 32;
              const hgt = p * barH;
              return (
                <g key={i}>
                  <rect x={x} y={40 + barH - hgt} width={bw} height={hgt} rx="4" fill={i === 0 ? T.violet : T.blue} fillOpacity={i === 0 ? 1 : 0.65} />
                  <text x={x + bw / 2} y={34 + barH - hgt} textAnchor="middle" fontSize="10.5" fill={FG}>
                    {Math.round(p * 100)}
                  </text>
                  <text
                    x={x + bw / 2}
                    y={58 + barH}
                    textAnchor="end"
                    fontSize="10.5"
                    fill={MUTED}
                    transform={`rotate(-35 ${x + bw / 2} ${58 + barH})`}
                  >
                    {tokens[i]}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <text x="15" y="244" fontSize="11.5" fill={MUTED}>Probabilités en %, calculées par softmax(logits / T) sur des logits illustratifs.</text>
    </Svg>
  );
}

function VectorSearch() {
  const points: [number, number][] = [
    [70, 60], [120, 210], [160, 110], [210, 250], [250, 70], [300, 170], [330, 240], [360, 95],
    [400, 200], [440, 60], [470, 150], [510, 230], [540, 110], [230, 160], [280, 120], [190, 40],
  ];
  const q: [number, number] = [262, 145];
  const dist = (p: [number, number]) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const sorted = [...points].sort((a, b) => dist(a) - dist(b));
  const topK = sorted.slice(0, 3);
  const radius = dist(topK[2]) + 8;
  const graph: [number, number][] = [[0, 2], [2, 4], [4, 14], [14, 13], [13, 5], [5, 7], [7, 9], [2, 13], [1, 13], [3, 13], [5, 8], [8, 11], [10, 12], [7, 10], [6, 8], [15, 4]];
  return (
    <Svg width={600} height={300} label="Recherche des plus proches voisins">
      {graph.map(([a, b], i) => (
        <line key={i} x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]} stroke={BORDER} strokeWidth="1" />
      ))}
      <circle cx={q[0]} cy={q[1]} r={radius} fill={SOFT.violet} stroke={T.violet} strokeDasharray="5 4" />
      {points.map((p, i) => {
        const near = topK.includes(p);
        return <circle key={i} cx={p[0]} cy={p[1]} r={near ? 7 : 5} fill={near ? T.teal : "var(--fg-subtle)"} />;
      })}
      <path
        d={`M ${q[0]} ${q[1] - 11} l 4 8 l 9 1 l -7 6 l 2 9 l -8 -5 l -8 5 l 2 -9 l -7 -6 l 9 -1 z`}
        fill={T.rose}
      />
      <g fontSize="12.5">
        <circle cx="30" cy="280" r="6" fill={T.rose} />
        <text x="42" y="284" fill={FG}>requête</text>
        <circle cx="120" cy="280" r="6" fill={T.teal} />
        <text x="132" y="284" fill={FG}>3 plus proches voisins</text>
        <line x1="290" y1="280" x2="320" y2="280" stroke={BORDER} />
        <text x="328" y="284" fill={FG}>arêtes du graphe de voisinage (index HNSW)</text>
      </g>
    </Svg>
  );
}

function TraceTimeline() {
  const total = 3400;
  const spans = [
    { name: "Requête complète", start: 0, end: 3400, depth: 0, color: T.violet },
    { name: "Réécriture de la question", start: 0, end: 450, depth: 1, color: T.blue },
    { name: "Recherche hybride", start: 450, end: 620, depth: 1, color: T.teal },
    { name: "Reranking", start: 620, end: 1100, depth: 1, color: T.amber },
    { name: "Génération (LLM)", start: 1100, end: 3400, depth: 1, color: T.rose },
  ];
  const x0 = 190, w = 380;
  const sx = (ms: number) => x0 + (ms / total) * w;
  return (
    <Svg width={600} height={250} label="Chronologie d'une trace">
      {[0, 1000, 2000, 3000].map((ms) => (
        <g key={ms}>
          <line x1={sx(ms)} y1="30" x2={sx(ms)} y2="210" stroke={BORDER} strokeDasharray="3 5" />
          <text x={sx(ms)} y="228" textAnchor="middle" fontSize="11" fill={MUTED}>{ms} ms</text>
        </g>
      ))}
      {spans.map((s, i) => {
        const y = 36 + i * 36;
        return (
          <g key={i}>
            <text x={10 + s.depth * 14} y={y + 15} fontSize="12.5" fontWeight={s.depth === 0 ? 700 : 500} fill={FG}>{s.name}</text>
            <rect x={sx(s.start)} y={y} width={Math.max(4, sx(s.end) - sx(s.start))} height="22" rx="5" fill={s.color} fillOpacity="0.85" />
            <text x={sx(s.end) - 6} y={y + 15} textAnchor="end" fontSize="11" fill="#ffffff" fontWeight="600">
              {s.end - s.start >= 300 ? `${s.end - s.start} ms` : ""}
            </text>
          </g>
        );
      })}
      <line x1={sx(1450)} y1="176" x2={sx(1450)} y2="210" stroke={FG} strokeWidth="2" />
      <text x={sx(1450) + 5} y="207" fontSize="11" fill={FG} fontWeight="600">premier token</text>
    </Svg>
  );
}

function Lora() {
  return (
    <Svg width={600} height={270} label="Principe de LoRA">
      <rect x="20" y="40" width="160" height="160" rx="10" fill={SOFT.blue} stroke={T.blue} strokeWidth="2" />
      <text x="100" y="118" textAnchor="middle" fontSize="22" fontWeight="700" fill={FG}>W</text>
      <text x="100" y="142" textAnchor="middle" fontSize="12" fill={MUTED}>d × k, gelée</text>
      <text x="100" y="225" textAnchor="middle" fontSize="12" fill={MUTED}>poids pré-entraînés</text>
      <text x="205" y="128" textAnchor="middle" fontSize="28" fill={FG}>+</text>
      <rect x="235" y="40" width="34" height="160" rx="8" fill={SOFT.violet} stroke={T.violet} strokeWidth="2" />
      <text x="252" y="125" textAnchor="middle" fontSize="18" fontWeight="700" fill={FG}>B</text>
      <text x="252" y="225" textAnchor="middle" fontSize="12" fill={MUTED}>d × r</text>
      <text x="290" y="128" textAnchor="middle" fontSize="22" fill={FG}>·</text>
      <rect x="310" y="103" width="160" height="34" rx="8" fill={SOFT.violet} stroke={T.violet} strokeWidth="2" />
      <text x="390" y="126" textAnchor="middle" fontSize="18" fontWeight="700" fill={FG}>A</text>
      <text x="390" y="160" textAnchor="middle" fontSize="12" fill={MUTED}>r × k</text>
      <text x="495" y="128" textAnchor="middle" fontSize="28" fill={FG}>=</text>
      <rect x="520" y="70" width="70" height="100" rx="10" fill={SOFT.teal} stroke={T.teal} strokeWidth="2" />
      <text x="555" y="125" textAnchor="middle" fontSize="18" fontWeight="700" fill={FG}>W′</text>
      <text x="390" y="22" textAnchor="middle" fontSize="12.5" fill={T.violet} fontWeight="600">entraînées (r petit, ex. 8 ou 16)</text>
      <text x="300" y="258" textAnchor="middle" fontSize="12.5" fill={MUTED}>W′ = W + (α / r) · B · A</text>
    </Svg>
  );
}

const REGISTRY: Record<Name, () => ReactNode> = {
  "overfitting-curves": OverfittingCurves,
  neuron: Neuron,
  "neural-network": NeuralNetwork,
  "embedding-space": EmbeddingSpace,
  "attention-heatmap": AttentionHeatmap,
  temperature: Temperature,
  "vector-search": VectorSearch,
  "trace-timeline": TraceTimeline,
  lora: Lora,
};

export function CustomDiagram({ name }: { name: Name }) {
  const Component = REGISTRY[name];
  return <Component />;
}

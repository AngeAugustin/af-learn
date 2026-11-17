import { BarChart3, Boxes, BrainCircuit, ClipboardList, Code2, Compass, Database, FileText, FlaskConical, GraduationCap, Kanban, LayoutDashboard, Megaphone, MousePointer2, ShieldCheck, Terminal, Workflow } from "lucide-react";

export const ICONS = {
  brain: BrainCircuit,
  database: Database,
  shield: ShieldCheck,
  code: Code2,
  chart: BarChart3,
  flask: FlaskConical,
  dashboard: LayoutDashboard,
  workflow: Workflow,
  kanban: Kanban,
  megaphone: Megaphone,
  compass: Compass,
  clipboard: ClipboardList,
  boxes: Boxes,
  pointer: MousePointer2,
  terminal: Terminal,
  spec: FileText,
};

export function ParcoursIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICONS[icon as keyof typeof ICONS] ?? GraduationCap;
  return <Icon className={className} aria-hidden />;
}

/** Couleur de ton associée à un parcours (définie dans parcours.yaml). */
export const TONES = ["violet", "blue", "teal", "amber", "rose", "plum", "ocean", "sand", "copper", "pine", "indigo", "slate", "ember", "olive"] as const;

export function parcoursTone(color: string) {
  const tone = (TONES as readonly string[]).includes(color) ? color : "violet";
  return { color: `var(--tone-${tone})`, soft: `var(--tone-${tone}-soft)` };
}

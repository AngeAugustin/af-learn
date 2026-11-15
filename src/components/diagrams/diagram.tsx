import { parseDiagram, type DiagramSpec } from "@/lib/diagrams/spec";
import {
  CompareDiagram,
  DecisionDiagram,
  FlowDiagram,
  LayersDiagram,
  PipelineDiagram,
  SequenceDiagram,
  StackDiagram,
} from "./basic";
import { CustomDiagram } from "./custom";
import { Figure } from "./figure";

export function Diagram({ source }: { source: string }) {
  let spec: DiagramSpec;
  try {
    spec = parseDiagram(source);
  } catch (error) {
    // Le contenu est validé par `npm run content:check` ; ce cas ne doit pas arriver en production.
    return (
      <div className="not-prose my-6 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm text-danger">
        Diagramme invalide : {(error as Error).message}
      </div>
    );
  }
  switch (spec.type) {
    case "flow":
      return <FlowDiagram spec={spec} />;
    case "pipeline":
      return <PipelineDiagram spec={spec} />;
    case "compare":
      return <CompareDiagram spec={spec} />;
    case "layers":
      return <LayersDiagram spec={spec} />;
    case "stack":
      return <StackDiagram spec={spec} />;
    case "sequence":
      return <SequenceDiagram spec={spec} />;
    case "decision":
      return <DecisionDiagram spec={spec} />;
    case "custom":
      return (
        <Figure caption={spec.caption} label={spec.name}>
          <CustomDiagram name={spec.name} />
        </Figure>
      );
  }
}

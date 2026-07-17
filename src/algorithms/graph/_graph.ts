/**
 * A fixed sample graph shared by the graph-traversal visualizers. Positions are
 * expressed on a 0–100 coordinate grid so the GraphVisualizer can lay it out
 * responsively inside its SVG canvas. Keeping the graph here (rather than
 * regenerating it) means the visualizer and the algorithm always agree on the
 * same node ids and edges.
 */
export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export const NODES: GraphNode[] = [
  { id: 'A', x: 12, y: 50 },
  { id: 'B', x: 32, y: 22 },
  { id: 'C', x: 32, y: 78 },
  { id: 'D', x: 54, y: 12 },
  { id: 'E', x: 54, y: 50 },
  { id: 'F', x: 54, y: 88 },
  { id: 'G', x: 76, y: 30 },
  { id: 'H', x: 76, y: 70 },
  { id: 'I', x: 92, y: 50 },
];

export const EDGES: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 3 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'B', to: 'E', weight: 2 },
  { from: 'C', to: 'E', weight: 6 },
  { from: 'C', to: 'F', weight: 4 },
  { from: 'D', to: 'G', weight: 3 },
  { from: 'E', to: 'G', weight: 5 },
  { from: 'E', to: 'H', weight: 2 },
  { from: 'F', to: 'H', weight: 6 },
  { from: 'G', to: 'I', weight: 4 },
  { from: 'H', to: 'I', weight: 3 },
];

/** Undirected adjacency list derived from EDGES, neighbors in sorted order. */
export function buildAdjacency(): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  for (const n of NODES) adj[n.id] = [];
  for (const e of EDGES) {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  }
  for (const id of Object.keys(adj)) adj[id].sort();
  return adj;
}

export const START_NODE = 'A';

import type { TreeFrame, TreeNodeState, TreeNodeView } from '@/types';

/** Minimal binary-tree node used by the tree visualizers. */
export interface TNode {
  id: string;
  label: string;
  left: TNode | null;
  right: TNode | null;
  color?: 'red' | 'black';
}

export function node(id: string, label: string, color?: 'red' | 'black'): TNode {
  return { id, label, left: null, right: null, color };
}

/** Depth of a (sub)tree, 0 for an empty tree. */
function depth(n: TNode | null): number {
  return n ? 1 + Math.max(depth(n.left), depth(n.right)) : 0;
}

/**
 * Lay a binary tree out on the 0–100 SVG grid. X positions come from an in-order
 * walk (so nodes never overlap horizontally); Y from the node's depth. `states`
 * maps node ids to a highlight state for the current frame.
 */
export function layout(root: TNode | null, states: Record<string, TreeNodeState> = {}): {
  nodes: TreeNodeView[];
  edges: { from: string; to: string }[];
} {
  const nodes: TreeNodeView[] = [];
  const edges: { from: string; to: string }[] = [];
  const total = count(root);
  const maxDepth = Math.max(1, depth(root));
  let order = 0;

  const walk = (n: TNode | null, d: number) => {
    if (!n) return;
    walk(n.left, d + 1);
    const x = ((order + 1) / (total + 1)) * 100;
    const y = 10 + (d / Math.max(1, maxDepth)) * 78;
    order++;
    nodes.push({ id: n.id, label: n.label, x, y, state: states[n.id], color: n.color });
    if (n.left) edges.push({ from: n.id, to: n.left.id });
    if (n.right) edges.push({ from: n.id, to: n.right.id });
    walk(n.right, d + 1);
  };
  walk(root, 0);
  return { nodes, edges };
}

function count(n: TNode | null): number {
  return n ? 1 + count(n.left) + count(n.right) : 0;
}

/** Deep-clone a tree so each frame captures an immutable snapshot. */
export function clone(n: TNode | null): TNode | null {
  if (!n) return null;
  return { ...n, left: clone(n.left), right: clone(n.right) };
}

export function frame(root: TNode | null, states: Record<string, TreeNodeState>, description: string): TreeFrame {
  const { nodes, edges } = layout(clone(root), states);
  return { nodes, edges, description };
}

import type { AlgorithmModule, GraphFrame } from '@/types';
import { buildAdjacency, START_NODE } from './_graph';

function generateFrames(): GraphFrame[] {
  const adj = buildAdjacency();
  const frames: GraphFrame[] = [];
  const visited = new Set<string>();
  const order: string[] = [];
  const stack: string[] = [];

  frames.push({
    visited: [],
    frontier: [START_NODE],
    current: null,
    path: [],
    description: `Start DFS from ${START_NODE}. Dive deep before backtracking (explicit stack).`,
  });

  function visit(node: string): void {
    visited.add(node);
    order.push(node);
    stack.push(node);
    frames.push({
      visited: [...order],
      frontier: [...stack],
      current: node,
      path: [...stack],
      description: `Visit ${node}; recurse into its first unvisited neighbor.`,
    });
    for (const next of adj[node]) {
      if (!visited.has(next)) visit(next);
    }
    stack.pop();
    frames.push({
      visited: [...order],
      frontier: [...stack],
      current: stack[stack.length - 1] ?? null,
      path: [...stack],
      description: `Backtrack from ${node}.`,
    });
  }

  visit(START_NODE);
  frames.push({
    visited: [...order],
    frontier: [],
    current: null,
    path: [...order],
    description: `DFS complete. Visit order: ${order.join(' → ')}.`,
  });
  return frames;
}

const module: AlgorithmModule = {
  visualizer: 'graph',
  generateFrames,
  code: {
    javascript: `function dfs(adj, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  for (const next of adj[start])
    if (!visited.has(next)) dfs(adj, next, visited, order);
  return order;
}`,
    typescript: `function dfs(
  adj: Record<string, string[]>,
  start: string,
  visited = new Set<string>(),
  order: string[] = []
): string[] {
  visited.add(start);
  order.push(start);
  for (const next of adj[start])
    if (!visited.has(next)) dfs(adj, next, visited, order);
  return order;
}`,
    python: `def dfs(adj, start, visited=None, order=None):
    if visited is None:
        visited, order = set(), []
    visited.add(start)
    order.append(start)
    for nxt in adj[start]:
        if nxt not in visited:
            dfs(adj, nxt, visited, order)
    return order`,
    java: `void dfs(Map<String, List<String>> adj, String node,
         Set<String> visited, List<String> order) {
    visited.add(node);
    order.add(node);
    for (String next : adj.get(node))
        if (!visited.contains(next)) dfs(adj, next, visited, order);
}`,
    cpp: `void dfs(std::map<std::string, std::vector<std::string>>& adj,
         std::string node, std::set<std::string>& visited,
         std::vector<std::string>& order) {
    visited.insert(node);
    order.push_back(node);
    for (auto& next : adj[node])
        if (!visited.count(next)) dfs(adj, next, visited, order);
}`,
    csharp: `void Dfs(Dictionary<string, List<string>> adj, string node,
         HashSet<string> visited, List<string> order) {
    visited.Add(node);
    order.Add(node);
    foreach (var next in adj[node])
        if (!visited.Contains(next)) Dfs(adj, next, visited, order);
}`,
  },
  meta: {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    difficulty: 'Easy',
    summary: 'Explores as deep as possible along each branch before backtracking.',
    complexity: {
      time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
      space: 'O(V)',
      recursive: true,
    },
    description:
      'Depth-First Search plunges down one path as far as it can go, then backtracks to the last node with an unexplored neighbor. It can be written recursively (using the call stack) or iteratively with an explicit stack, and forms the backbone of cycle detection, topological sorting and connectivity algorithms.',
    whenToUse:
      'Topological sorting, cycle detection, connected components, maze generation, or any exhaustive path exploration.',
    advantages: [
      'Low memory on deep, narrow graphs — O(depth).',
      'Naturally expresses recursion, backtracking and topological order.',
    ],
    disadvantages: [
      'Does not find shortest paths in unweighted graphs.',
      'Recursion can overflow the stack on very deep graphs.',
    ],
    applications: [
      'Topological sorting and cycle detection.',
      'Connected/strongly-connected components.',
      'Maze generation and backtracking search.',
    ],
    steps: [
      'Mark the current node visited and record it.',
      'Recurse into the first unvisited neighbor.',
      'When no unvisited neighbor remains, backtrack.',
      'Continue until every reachable node is visited.',
    ],
    pseudocode: `dfs(node)
    visit(node)
    for next in adj[node]
        if next not visited
            dfs(next)`,
  },
};

export default module;

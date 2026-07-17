import type { AlgorithmModule, GraphFrame, GridFrame } from '@/types';
import {
  NODES,
  EDGES,
  buildWeightedAdjacency,
  START_NODE,
  GOAL_NODE,
  heuristic,
} from './_graph';

const ALL_IDS = NODES.map((n) => n.id);
const snapshotDist = (d: Record<string, number | null>) => ({ ...d });
const finiteUnvisited = (d: Record<string, number | null>, visited: Set<string>) =>
  ALL_IDS.filter((id) => !visited.has(id) && d[id] !== null && d[id] !== undefined);

// ---------------------------------------------------------------------------
// Dijkstra
// ---------------------------------------------------------------------------
function dijkstraFrames(): GraphFrame[] {
  const adj = buildWeightedAdjacency();
  const dist: Record<string, number | null> = Object.fromEntries(ALL_IDS.map((id) => [id, null]));
  dist[START_NODE] = 0;
  const visited = new Set<string>();
  const frames: GraphFrame[] = [];

  frames.push({
    visited: [],
    frontier: [START_NODE],
    current: null,
    path: [],
    distances: snapshotDist(dist),
    markedEdges: [],
    description: `Start at ${START_NODE} (distance 0); every other node is ∞.`,
  });

  while (true) {
    let u: string | null = null;
    let best = Infinity;
    for (const id of ALL_IDS) {
      if (!visited.has(id) && dist[id] !== null && (dist[id] as number) < best) {
        best = dist[id] as number;
        u = id;
      }
    }
    if (u === null) break;
    visited.add(u);
    frames.push({
      visited: [...visited],
      frontier: finiteUnvisited(dist, visited),
      current: u,
      path: [],
      distances: snapshotDist(dist),
      markedEdges: [],
      description: `Finalize ${u} with the smallest tentative distance (${dist[u]}).`,
    });
    for (const [v, w] of adj[u]) {
      if (visited.has(v)) continue;
      const nd = (dist[u] as number) + w;
      if (dist[v] === null || nd < (dist[v] as number)) {
        dist[v] = nd;
        frames.push({
          visited: [...visited],
          frontier: finiteUnvisited(dist, visited),
          current: u,
          path: [],
          distances: snapshotDist(dist),
          markedEdges: [],
          description: `Relax ${u}→${v}: shorter path found, set ${v} = ${nd}.`,
        });
      }
    }
  }
  frames.push({
    visited: [...visited],
    frontier: [],
    current: null,
    path: [],
    distances: snapshotDist(dist),
    markedEdges: [],
    description: 'All shortest distances from the source are final.',
  });
  return frames;
}

// ---------------------------------------------------------------------------
// Bellman-Ford
// ---------------------------------------------------------------------------
function bellmanFordFrames(): GraphFrame[] {
  const dist: Record<string, number | null> = Object.fromEntries(ALL_IDS.map((id) => [id, null]));
  dist[START_NODE] = 0;
  const frames: GraphFrame[] = [];
  const directed = EDGES.flatMap((e) => [
    [e.from, e.to, e.weight] as const,
    [e.to, e.from, e.weight] as const,
  ]);

  frames.push({
    visited: [START_NODE],
    frontier: [],
    current: null,
    path: [],
    distances: snapshotDist(dist),
    markedEdges: [],
    description: `Initialize ${START_NODE} = 0. Relax every edge V−1 times.`,
  });

  for (let i = 1; i < ALL_IDS.length; i++) {
    let changed = false;
    for (const [u, v, w] of directed) {
      if (dist[u] !== null && (dist[v] === null || (dist[u] as number) + w < (dist[v] as number))) {
        dist[v] = (dist[u] as number) + w;
        changed = true;
      }
    }
    frames.push({
      visited: ALL_IDS.filter((id) => dist[id] !== null),
      frontier: [],
      current: null,
      path: [],
      distances: snapshotDist(dist),
      markedEdges: [],
      description: `Pass ${i}: relaxed all edges${changed ? '' : ' (no changes — done early)'}.`,
    });
    if (!changed) break;
  }
  frames.push({
    visited: ALL_IDS.filter((id) => dist[id] !== null),
    frontier: [],
    current: null,
    path: [],
    distances: snapshotDist(dist),
    markedEdges: [],
    description: 'Distances are final; a further relaxation would reveal a negative cycle.',
  });
  return frames;
}

// ---------------------------------------------------------------------------
// A*
// ---------------------------------------------------------------------------
function aStarFrames(): GraphFrame[] {
  const adj = buildWeightedAdjacency();
  const g: Record<string, number | null> = Object.fromEntries(ALL_IDS.map((id) => [id, null]));
  g[START_NODE] = 0;
  const came: Record<string, string> = {};
  const open = new Set<string>([START_NODE]);
  const closed = new Set<string>();
  const frames: GraphFrame[] = [];

  const reconstruct = (end: string) => {
    const path: [string, string][] = [];
    let cur = end;
    while (came[cur]) {
      path.push([came[cur], cur]);
      cur = came[cur];
    }
    return path;
  };

  frames.push({
    visited: [],
    frontier: [START_NODE],
    current: null,
    path: [],
    distances: snapshotDist(g),
    markedEdges: [],
    description: `A* from ${START_NODE} to ${GOAL_NODE}: expand the node with the lowest g + heuristic.`,
  });

  while (open.size) {
    let u: string | null = null;
    let best = Infinity;
    for (const id of open) {
      const f = (g[id] as number) + heuristic(id, GOAL_NODE);
      if (f < best) {
        best = f;
        u = id;
      }
    }
    if (u === null) break;
    open.delete(u);
    closed.add(u);

    if (u === GOAL_NODE) {
      frames.push({
        visited: [...closed],
        frontier: [...open],
        current: u,
        path: [GOAL_NODE],
        distances: snapshotDist(g),
        markedEdges: reconstruct(GOAL_NODE),
        description: `Reached ${GOAL_NODE}! Shortest path highlighted (cost ${g[GOAL_NODE]}).`,
      });
      return frames;
    }

    frames.push({
      visited: [...closed],
      frontier: [...open],
      current: u,
      path: [],
      distances: snapshotDist(g),
      markedEdges: [],
      description: `Expand ${u} (g+h = ${best}).`,
    });

    for (const [v, w] of adj[u]) {
      if (closed.has(v)) continue;
      const t = (g[u] as number) + w;
      if (g[v] === null || t < (g[v] as number)) {
        g[v] = t;
        came[v] = u;
        open.add(v);
      }
    }
  }
  return frames;
}

// ---------------------------------------------------------------------------
// Prim
// ---------------------------------------------------------------------------
function primFrames(): GraphFrame[] {
  const adj = buildWeightedAdjacency();
  const inTree = new Set<string>([START_NODE]);
  const mst: [string, string][] = [];
  const frames: GraphFrame[] = [];

  frames.push({
    visited: [START_NODE],
    frontier: [],
    current: START_NODE,
    path: [],
    markedEdges: [],
    description: `Grow the MST from ${START_NODE}, always adding the cheapest crossing edge.`,
  });

  while (inTree.size < ALL_IDS.length) {
    let bestEdge: [string, string] | null = null;
    let bestW = Infinity;
    for (const u of inTree) {
      for (const [v, w] of adj[u]) {
        if (!inTree.has(v) && w < bestW) {
          bestW = w;
          bestEdge = [u, v];
        }
      }
    }
    if (!bestEdge) break;
    inTree.add(bestEdge[1]);
    mst.push(bestEdge);
    frames.push({
      visited: [...inTree],
      frontier: [],
      current: bestEdge[1],
      path: [],
      markedEdges: [...mst],
      description: `Add cheapest crossing edge ${bestEdge[0]}–${bestEdge[1]} (weight ${bestW}).`,
    });
  }
  frames.push({
    visited: [...inTree],
    frontier: [],
    current: null,
    path: [],
    markedEdges: [...mst],
    description: `Minimum spanning tree complete (${mst.length} edges).`,
  });
  return frames;
}

// ---------------------------------------------------------------------------
// Kruskal
// ---------------------------------------------------------------------------
function kruskalFrames(): GraphFrame[] {
  const sorted = [...EDGES].sort((a, b) => a.weight - b.weight);
  const parent: Record<string, string> = Object.fromEntries(ALL_IDS.map((id) => [id, id]));
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const mst: [string, string][] = [];
  const included = new Set<string>();
  const frames: GraphFrame[] = [];

  frames.push({
    visited: [],
    frontier: [],
    current: null,
    path: [],
    markedEdges: [],
    description: 'Sort every edge by weight, then add the cheapest that joins two components.',
  });

  for (const e of sorted) {
    const cycle = find(e.from) === find(e.to);
    frames.push({
      visited: [...included],
      frontier: [e.from, e.to],
      current: null,
      path: [],
      markedEdges: [...mst],
      description: `Consider ${e.from}–${e.to} (weight ${e.weight}): ${cycle ? 'would form a cycle — skip.' : 'connects two trees — add it.'}`,
    });
    if (!cycle) {
      parent[find(e.from)] = find(e.to);
      mst.push([e.from, e.to]);
      included.add(e.from);
      included.add(e.to);
    }
    if (mst.length === ALL_IDS.length - 1) break;
  }
  frames.push({
    visited: [...included],
    frontier: [],
    current: null,
    path: [],
    markedEdges: [...mst],
    description: `Minimum spanning tree complete (${mst.length} edges).`,
  });
  return frames;
}

// ---------------------------------------------------------------------------
// Floyd-Warshall (matrix)
// ---------------------------------------------------------------------------
function floydFrames(): GridFrame[] {
  const n = ALL_IDS.length;
  const INF = Infinity;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : INF))
  );
  const idx = Object.fromEntries(ALL_IDS.map((id, i) => [id, i]));
  for (const e of EDGES) {
    dist[idx[e.from]][idx[e.to]] = e.weight;
    dist[idx[e.to]][idx[e.from]] = e.weight;
  }

  const cell = (v: number) => (v === INF ? '∞' : v);
  const frame = (k: number, hi: [number, number] | null, updated: [number, number] | null, desc: string): GridFrame => ({
    grid: dist.map((row, i) =>
      row.map((v, j) => ({
        value: cell(v),
        state:
          updated && updated[0] === i && updated[1] === j
            ? ('chosen' as const)
            : hi && (i === hi[0] || j === hi[1] || i === k || j === k)
              ? ('compare' as const)
              : undefined,
      }))
    ),
    rowLabels: ALL_IDS,
    colLabels: ALL_IDS,
    caption: `Allowing intermediate node ${ALL_IDS[k] ?? '—'}`,
    description: desc,
  });

  const frames: GridFrame[] = [
    frame(-1, null, null, 'Distance matrix: direct edges only, ∞ where no edge exists.'),
  ];

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          frames.push(
            frame(k, [i, j], [i, j], `Route ${ALL_IDS[i]}→${ALL_IDS[j]} through ${ALL_IDS[k]}: shorter (${dist[i][j]}).`)
          );
        }
      }
    }
  }
  frames.push(frame(n - 1, null, null, 'All-pairs shortest paths computed.'));
  return frames;
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------
const dijkstra: AlgorithmModule = {
  visualizer: 'graph',
  generateFrames: dijkstraFrames,
  code: {
    javascript: `function dijkstra(graph, source) {
  const dist = {}, pq = [[0, source]];
  for (const v in graph) dist[v] = Infinity;
  dist[source] = 0;
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u])
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.push([dist[v], v]); }
  }
  return dist;
}`,
    python: `import heapq
def dijkstra(graph, source):
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    pq = [(0, source)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
  },
  meta: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    difficulty: 'Medium',
    summary: 'Finds shortest paths from a source in a non-negative weighted graph.',
    complexity: {
      time: { best: 'O(E + V log V)', average: 'O(E + V log V)', worst: 'O(E + V log V)' },
      space: 'O(V)',
      recursive: false,
    },
    description:
      "Dijkstra's Algorithm computes the shortest path from a source to every other vertex in a graph with non-negative edge weights. It greedily expands the closest unfinalized vertex using a priority queue, relaxing each outgoing edge to improve tentative distances.",
    whenToUse: 'Single-source shortest paths on graphs with non-negative weights (maps, networks).',
    advantages: ['Optimal shortest paths with non-negative weights.', 'Efficient with a binary or Fibonacci heap.'],
    disadvantages: ['Fails with negative edge weights.', 'Computes distances to all nodes, not just one target.'],
    applications: ['GPS/route planning.', 'Network routing (link-state protocols).', 'Least-cost pathfinding in games.'],
    steps: [
      'Set the source distance to 0 and all others to infinity.',
      'Pick the unvisited node with the smallest tentative distance.',
      'Relax each neighbor: update its distance if a shorter path is found.',
      'Mark the node finalized and repeat until all are processed.',
    ],
    pseudocode: `dist[source] = 0; pq = {(0, source)}
while pq not empty
    (d, u) = pq.extractMin()
    for (v, w) in adj[u]
        if dist[u] + w < dist[v]
            dist[v] = dist[u] + w
            pq.add((dist[v], v))`,
  },
};

const bellmanFord: AlgorithmModule = {
  visualizer: 'graph',
  generateFrames: bellmanFordFrames,
  code: {
    javascript: `function bellmanFord(V, edges, source) {
  const dist = Array(V).fill(Infinity);
  dist[source] = 0;
  for (let i = 1; i < V; i++)
    for (const [u, v, w] of edges)
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  return dist;
}`,
    python: `def bellman_ford(V, edges, source):
    dist = [float('inf')] * V
    dist[source] = 0
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist`,
  },
  meta: {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    category: 'graph',
    difficulty: 'Medium',
    summary: 'Shortest paths that also handle negative edges and detect negative cycles.',
    complexity: { time: { best: 'O(E)', average: 'O(VE)', worst: 'O(VE)' }, space: 'O(V)', recursive: false },
    description:
      'Bellman-Ford computes single-source shortest paths even when edges have negative weights. It relaxes every edge V − 1 times; a further relaxation that still improves a distance reveals a negative-weight cycle.',
    whenToUse: 'Shortest paths with possible negative weights, or to detect negative cycles.',
    advantages: ['Handles negative edge weights.', 'Detects negative cycles.'],
    disadvantages: ['Slower than Dijkstra at O(VE).', 'Not ideal for dense graphs.'],
    applications: ['Currency arbitrage detection.', 'Distance-vector routing (RIP).'],
    steps: [
      'Initialize source distance 0, others infinity.',
      'Relax all edges repeatedly, V − 1 times.',
      'Check all edges once more; any improvement means a negative cycle.',
    ],
    pseudocode: `for i = 1 to V - 1
    for (u, v, w) in edges
        if dist[u] + w < dist[v]
            dist[v] = dist[u] + w`,
  },
};

const floydWarshall: AlgorithmModule = {
  visualizer: 'grid',
  generateFrames: floydFrames,
  code: {
    javascript: `function floydWarshall(dist) {
  const n = dist.length;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}`,
    python: `def floyd_warshall(dist):
    n = len(dist)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
  },
  meta: {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall',
    category: 'graph',
    difficulty: 'Hard',
    summary: 'All-pairs shortest paths via dynamic programming over intermediate nodes.',
    complexity: { time: { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)' }, space: 'O(V²)', recursive: false },
    description:
      'Floyd-Warshall finds the shortest path between every pair of vertices. It progressively allows each vertex k to serve as an intermediate point, updating the distance matrix whenever routing through k is cheaper.',
    whenToUse: 'Dense graphs where you need shortest paths between all pairs of nodes.',
    advantages: ['Computes all-pairs shortest paths.', 'Simple triple-nested loop; handles negative edges.'],
    disadvantages: ['O(V³) time and O(V²) space — poor for large graphs.'],
    applications: ['Routing tables.', 'Transitive closure of relations.'],
    steps: [
      'Initialize the distance matrix from the edge weights.',
      'For each intermediate vertex k:',
      'For every pair (i, j), relax dist[i][j] through k.',
      'After all k, the matrix holds all shortest paths.',
    ],
    pseudocode: `for k in V
  for i in V
    for j in V
      if dist[i][k] + dist[k][j] < dist[i][j]
        dist[i][j] = dist[i][k] + dist[k][j]`,
  },
};

const prim: AlgorithmModule = {
  visualizer: 'graph',
  generateFrames: primFrames,
  code: {
    javascript: `function prim(graph, start) {
  const inTree = new Set([start]);
  const mst = [];
  while (inTree.size < Object.keys(graph).length) {
    let best = null;
    for (const u of inTree)
      for (const [v, w] of graph[u])
        if (!inTree.has(v) && (!best || w < best[2])) best = [u, v, w];
    if (!best) break;
    inTree.add(best[1]);
    mst.push(best);
  }
  return mst;
}`,
    python: `def prim(graph, start):
    in_tree = {start}
    mst = []
    while len(in_tree) < len(graph):
        best = None
        for u in in_tree:
            for v, w in graph[u]:
                if v not in in_tree and (best is None or w < best[2]):
                    best = (u, v, w)
        if best is None:
            break
        in_tree.add(best[1])
        mst.append(best)
    return mst`,
  },
  meta: {
    id: 'prim',
    name: "Prim's Algorithm",
    category: 'graph',
    difficulty: 'Medium',
    summary: 'Grows a minimum spanning tree one nearest edge at a time.',
    complexity: {
      time: { best: 'O(E + V log V)', average: 'O(E + V log V)', worst: 'O(E + V log V)' },
      space: 'O(V)',
      recursive: false,
    },
    description:
      "Prim's Algorithm builds a minimum spanning tree by starting from any vertex and repeatedly adding the cheapest edge that connects a new vertex to the growing tree, using a priority queue to find that edge quickly.",
    whenToUse: 'Minimum spanning tree of a dense, connected weighted graph.',
    advantages: ['Efficient on dense graphs with a heap.', 'Always maintains a single connected tree.'],
    disadvantages: ['Only works on connected graphs.', 'Kruskal can be simpler on sparse/edge-listed graphs.'],
    applications: ['Network/utility layout.', 'Clustering and approximation algorithms.'],
    steps: [
      'Start the tree from an arbitrary vertex.',
      'Find the minimum-weight edge leaving the tree.',
      'Add that edge and its new vertex to the tree.',
      'Repeat until all vertices are included.',
    ],
    pseudocode: `add start to tree
while tree has < V nodes
    pick min-weight edge (u in tree, v not in tree)
    add v and the edge to the tree`,
  },
};

const kruskal: AlgorithmModule = {
  visualizer: 'graph',
  generateFrames: kruskalFrames,
  code: {
    javascript: `function kruskal(V, edges) {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: V }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const mst = [];
  for (const [u, v, w] of edges)
    if (find(u) !== find(v)) { parent[find(u)] = find(v); mst.push([u, v, w]); }
  return mst;
}`,
    python: `def kruskal(V, edges):
    edges.sort(key=lambda e: e[2])
    parent = list(range(V))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    mst = []
    for u, v, w in edges:
        if find(u) != find(v):
            parent[find(u)] = find(v)
            mst.append((u, v, w))
    return mst`,
  },
  meta: {
    id: 'kruskal',
    name: "Kruskal's Algorithm",
    category: 'graph',
    difficulty: 'Medium',
    summary: 'Builds a minimum spanning tree by adding the globally cheapest safe edges.',
    complexity: { time: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' }, space: 'O(V)', recursive: false },
    description:
      "Kruskal's Algorithm sorts all edges by weight and adds them one by one, skipping any edge that would form a cycle. A union-find (disjoint set) structure detects cycles in near-constant time, producing a minimum spanning forest.",
    whenToUse: 'Minimum spanning tree of sparse graphs given as an edge list.',
    advantages: ['Simple with union-find.', 'Great for sparse graphs and edge lists.'],
    disadvantages: ['Sorting edges dominates the cost.', 'Less natural for adjacency-matrix graphs.'],
    applications: ['Network design.', 'Image segmentation.', 'Approximation for TSP.'],
    steps: [
      'Sort all edges by ascending weight.',
      'Take the next cheapest edge.',
      'Add it if it connects two different components (no cycle).',
      'Repeat until V − 1 edges are chosen.',
    ],
    pseudocode: `sort edges by weight
for (u, v, w) in edges
    if find(u) != find(v)
        union(u, v)
        add edge to MST`,
  },
};

const astar: AlgorithmModule = {
  visualizer: 'graph',
  generateFrames: aStarFrames,
  code: {
    javascript: `function aStar(graph, start, goal, h) {
  const g = { [start]: 0 };
  const open = [[h(start), start]];
  const came = {};
  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, u] = open.shift();
    if (u === goal) return reconstruct(came, u);
    for (const [v, w] of graph[u]) {
      const t = g[u] + w;
      if (t < (g[v] ?? Infinity)) { g[v] = t; came[v] = u; open.push([t + h(v), v]); }
    }
  }
  return null;
}`,
    python: `import heapq
def a_star(graph, start, goal, h):
    g = {start: 0}
    open_set = [(h(start), start)]
    came = {}
    while open_set:
        _, u = heapq.heappop(open_set)
        if u == goal:
            return reconstruct(came, u)
        for v, w in graph[u]:
            t = g[u] + w
            if t < g.get(v, float('inf')):
                g[v] = t
                came[v] = u
                heapq.heappush(open_set, (t + h(v), v))
    return None`,
  },
  meta: {
    id: 'a-star',
    name: 'A* Search',
    category: 'graph',
    difficulty: 'Hard',
    summary: 'Best-first pathfinding guided by a heuristic estimate of remaining cost.',
    complexity: { time: { best: 'O(E)', average: 'O(E)', worst: 'O(b^d)' }, space: 'O(V)', recursive: false },
    description:
      'A* finds a shortest path by expanding the node that minimizes f(n) = g(n) + h(n), where g is the cost so far and h is an admissible heuristic estimating the cost to the goal. With a good heuristic it explores far fewer nodes than Dijkstra while remaining optimal.',
    whenToUse: 'Goal-directed shortest path where a good heuristic exists (grids, maps, games).',
    advantages: ['Optimal with an admissible heuristic.', 'Much faster than Dijkstra when the heuristic is informative.'],
    disadvantages: ['Needs a well-chosen heuristic.', 'Memory grows with the frontier.'],
    applications: ['Game pathfinding.', 'Robot motion planning.', 'Map routing.'],
    steps: [
      'Push the start node with f = h(start).',
      'Pop the node with the lowest f value.',
      'If it is the goal, reconstruct the path.',
      'Otherwise relax neighbors using g + edge cost and re-estimate f.',
    ],
    pseudocode: `open = {start}; g[start] = 0
while open not empty
    current = node in open with lowest g + h
    if current == goal: return path
    for neighbor in adj[current]
        tentative = g[current] + cost
        if tentative < g[neighbor]
            g[neighbor] = tentative`,
  },
};

const modules: AlgorithmModule[] = [dijkstra, bellmanFord, floydWarshall, prim, kruskal, astar];
export default modules;

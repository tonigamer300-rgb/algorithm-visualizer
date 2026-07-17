import type { AlgorithmModule, GraphFrame } from '@/types';
import { buildAdjacency, START_NODE } from './_graph';

function generateFrames(): GraphFrame[] {
  const adj = buildAdjacency();
  const frames: GraphFrame[] = [];
  const visited = new Set<string>();
  const queue: string[] = [START_NODE];
  const order: string[] = [];

  frames.push({
    visited: [],
    frontier: [...queue],
    current: null,
    path: [],
    description: `Start BFS from ${START_NODE}. Explore level by level using a queue.`,
  });

  visited.add(START_NODE);
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    frames.push({
      visited: [...order],
      frontier: [...queue],
      current: node,
      path: [...order],
      description: `Dequeue ${node}; enqueue its unvisited neighbors.`,
    });
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
        frames.push({
          visited: [...order],
          frontier: [...queue],
          current: node,
          path: [...order],
          description: `Discover ${next} from ${node} and add it to the queue.`,
        });
      }
    }
  }

  frames.push({
    visited: [...order],
    frontier: [],
    current: null,
    path: [...order],
    description: `BFS complete. Visit order: ${order.join(' → ')}.`,
  });
  return frames;
}

const module: AlgorithmModule = {
  visualizer: 'graph',
  generateFrames,
  code: {
    javascript: `function bfs(adj, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}`,
    typescript: `function bfs(adj: Record<string, string[]>, start: string): string[] {
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  const order: string[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}`,
    python: `from collections import deque
def bfs(adj, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in adj[node]:
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
    return order`,
    java: `List<String> bfs(Map<String, List<String>> adj, String start) {
    Set<String> visited = new HashSet<>(List.of(start));
    Queue<String> queue = new LinkedList<>(List.of(start));
    List<String> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        String node = queue.poll();
        order.add(node);
        for (String next : adj.get(node))
            if (visited.add(next)) queue.add(next);
    }
    return order;
}`,
    cpp: `std::vector<std::string> bfs(
    std::map<std::string, std::vector<std::string>>& adj, std::string start) {
    std::set<std::string> visited{start};
    std::queue<std::string> q; q.push(start);
    std::vector<std::string> order;
    while (!q.empty()) {
        auto node = q.front(); q.pop();
        order.push_back(node);
        for (auto& next : adj[node])
            if (!visited.count(next)) { visited.insert(next); q.push(next); }
    }
    return order;
}`,
    csharp: `List<string> Bfs(Dictionary<string, List<string>> adj, string start) {
    var visited = new HashSet<string> { start };
    var queue = new Queue<string>(new[] { start });
    var order = new List<string>();
    while (queue.Count > 0) {
        var node = queue.Dequeue();
        order.Add(node);
        foreach (var next in adj[node])
            if (visited.Add(next)) queue.Enqueue(next);
    }
    return order;
}`,
  },
  meta: {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    difficulty: 'Easy',
    summary: 'Explores a graph level by level using a queue, giving shortest unweighted paths.',
    complexity: {
      time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
      space: 'O(V)',
      recursive: false,
    },
    description:
      'Breadth-First Search explores a graph in expanding rings from the source, visiting all neighbors at the current distance before moving deeper. Backed by a FIFO queue, it naturally discovers the shortest path (fewest edges) to every reachable node in an unweighted graph.',
    whenToUse:
      'Shortest paths in unweighted graphs, level-order traversal, or finding the nearest node satisfying a condition.',
    advantages: [
      'Finds shortest paths in unweighted graphs.',
      'Complete — visits every reachable node.',
      'Simple queue-based implementation.',
    ],
    disadvantages: [
      'Uses O(V) memory for the queue/visited set.',
      'Ignores edge weights — not for weighted shortest paths.',
    ],
    applications: [
      'Shortest path in unweighted graphs and mazes.',
      'Web crawling, peer-to-peer network broadcasts.',
      'Finding connected components and bipartiteness.',
    ],
    steps: [
      'Enqueue the start node and mark it visited.',
      'Dequeue a node and record it.',
      'Enqueue each unvisited neighbor and mark it visited.',
      'Repeat until the queue is empty.',
    ],
    pseudocode: `queue = [start]; visited = {start}
while queue not empty
    node = queue.dequeue()
    for next in adj[node]
        if next not visited
            visited.add(next)
            queue.enqueue(next)`,
  },
};

export default module;

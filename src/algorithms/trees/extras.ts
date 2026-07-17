import type { AlgorithmModule } from '@/types';
import { definePlaceholder } from '../_placeholder';

const bst = definePlaceholder(
  {
    id: 'binary-search-tree',
    name: 'Binary Search Tree',
    category: 'trees',
    difficulty: 'Easy',
    summary: 'Ordered binary tree: left subtree smaller, right subtree larger.',
    complexity: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(n)',
      recursive: true,
    },
    description:
      'A Binary Search Tree keeps keys ordered so that every node’s left subtree holds smaller keys and its right subtree holds larger keys. This ordering makes search, insertion and deletion proportional to the tree height — O(log n) when balanced, but O(n) if it degenerates into a chain.',
    whenToUse: 'Ordered maps/sets with dynamic inserts and deletes when balance can be maintained.',
    advantages: ['Ordered traversal in O(n).', 'Efficient search/insert/delete when balanced.'],
    disadvantages: ['Degrades to O(n) if unbalanced.', 'No self-balancing without extra logic.'],
    applications: ['In-memory ordered maps and sets.', 'Range queries and successor/predecessor lookups.'],
    steps: [
      'Compare the key with the current node.',
      'Go left if smaller, right if larger.',
      'Insert at the first empty spot; search stops on a match.',
    ],
    pseudocode: `insert(node, key)
    if node is null: return new Node(key)
    if key < node.key: node.left = insert(node.left, key)
    else: node.right = insert(node.right, key)
    return node`,
  },
  {
    javascript: `class Node { constructor(k) { this.key = k; this.left = this.right = null; } }
function insert(node, key) {
  if (!node) return new Node(key);
  if (key < node.key) node.left = insert(node.left, key);
  else node.right = insert(node.right, key);
  return node;
}`,
    python: `class Node:
    def __init__(self, key):
        self.key, self.left, self.right = key, None, None
def insert(node, key):
    if node is None:
        return Node(key)
    if key < node.key:
        node.left = insert(node.left, key)
    else:
        node.right = insert(node.right, key)
    return node`,
  }
);

const avl = definePlaceholder(
  {
    id: 'avl-tree',
    name: 'AVL Tree',
    category: 'trees',
    difficulty: 'Hard',
    summary: 'Self-balancing BST that keeps subtree heights within one via rotations.',
    complexity: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(n)',
      recursive: true,
    },
    description:
      'An AVL Tree is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one. After each insert or delete it restores balance with single or double rotations, guaranteeing O(log n) operations.',
    whenToUse: 'Lookup-heavy ordered data needing strict, guaranteed balance.',
    advantages: ['Strict O(log n) height.', 'Faster lookups than red-black trees due to tighter balance.'],
    disadvantages: ['More rotations on insert/delete than red-black trees.'],
    applications: ['Databases and in-memory indexes with frequent lookups.'],
    steps: [
      'Insert as in a normal BST.',
      'Update heights up the path to the root.',
      'Compute each node’s balance factor.',
      'Apply the matching rotation (LL, RR, LR, RL) where imbalance appears.',
    ],
    pseudocode: `insert then, walking back up:
balance = height(left) - height(right)
if balance > 1 and key < left.key: rotateRight
if balance < -1 and key > right.key: rotateLeft
// LR and RL cases combine both rotations`,
  },
  {
    javascript: `function rotateRight(y) {
  const x = y.left;
  y.left = x.right;
  x.right = y;
  update(y); update(x);
  return x;
}`,
    python: `def rotate_right(y):
    x = y.left
    y.left = x.right
    x.right = y
    update(y); update(x)
    return x`,
  }
);

const rbt = definePlaceholder(
  {
    id: 'red-black-tree',
    name: 'Red-Black Tree',
    category: 'trees',
    difficulty: 'Hard',
    summary: 'Self-balancing BST using node colors to bound the height to 2·log n.',
    complexity: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(n)',
      recursive: false,
    },
    description:
      'A Red-Black Tree colors each node red or black and enforces rules (no two consecutive reds, equal black-height on all paths) that keep the longest path at most twice the shortest. It rebalances with rotations and recolorings, trading slightly looser balance than AVL for fewer rotations on updates.',
    whenToUse: 'General-purpose ordered maps/sets with frequent inserts and deletes.',
    advantages: ['Fewer rotations than AVL on updates.', 'Guaranteed O(log n).'],
    disadvantages: ['Looser balance means slightly slower lookups than AVL.', 'Complex delete cases.'],
    applications: ['std::map / TreeMap implementations.', 'Linux kernel schedulers and memory maps.'],
    steps: [
      'Insert the node and color it red.',
      'Fix violations by recoloring or rotating up the tree.',
      'Ensure the root stays black.',
    ],
    pseudocode: `insert red node
while parent is red
    if uncle is red: recolor and move up
    else: rotate and recolor
root.color = black`,
  },
  {
    javascript: `const RED = 0, BLACK = 1;
// Insert as BST (color RED), then fix-up violations
// by recoloring the uncle or rotating the grandparent.`,
    python: `RED, BLACK = 0, 1
# Insert as BST (color RED), then fix-up violations
# by recoloring the uncle or rotating the grandparent.`,
  }
);

const heap = definePlaceholder(
  {
    id: 'heap',
    name: 'Binary Heap',
    category: 'trees',
    difficulty: 'Medium',
    summary: 'Complete binary tree maintaining the min/max at the root as a priority queue.',
    complexity: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(n)',
      recursive: false,
    },
    description:
      'A Binary Heap is a complete binary tree stored in an array where each parent is ordered relative to its children (min-heap or max-heap). It supports O(log n) insertion and extraction of the extreme element, making it the standard backing structure for priority queues.',
    whenToUse: 'Priority queues, scheduling, and repeated extraction of the min/max element.',
    advantages: ['O(1) peek, O(log n) push/pop.', 'Array-backed — cache friendly and no pointers.'],
    disadvantages: ['No efficient search for arbitrary elements.', 'Not sorted beyond the root.'],
    applications: ['Priority queues.', 'Heap sort.', 'Dijkstra and Prim frontiers.'],
    steps: [
      'Insert at the end, then sift up while it beats its parent.',
      'Remove the root, move the last element to the top.',
      'Sift down, swapping with the better child until ordered.',
    ],
    pseudocode: `push(x): append x; siftUp(last)
pop(): swap(root, last); remove last; siftDown(root)`,
  },
  {
    javascript: `class MinHeap {
  constructor() { this.h = []; }
  push(x) {
    this.h.push(x);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
}`,
    python: `import heapq
h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
smallest = heapq.heappop(h)  # 1`,
  }
);

const modules: AlgorithmModule[] = [bst, avl, rbt, heap];
export default modules;

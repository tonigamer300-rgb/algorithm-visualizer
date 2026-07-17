import type { AlgorithmModule, TreeFrame, TreeNodeState } from '@/types';
import { TNode, node, frame } from './_tree';

// ---------------------------------------------------------------------------
// Binary Search Tree — animated insertion
// ---------------------------------------------------------------------------
function bstFrames(): TreeFrame[] {
  const values = [50, 30, 70, 20, 40, 60, 80, 35, 65];
  const frames: TreeFrame[] = [];
  let root: TNode | null = null;

  for (const v of values) {
    if (!root) {
      root = node(String(v), String(v));
      frames.push(frame(root, { [String(v)]: 'placed' }, `Insert ${v} as the root.`));
      continue;
    }
    let cur: TNode | null = root;
    while (cur) {
      frames.push(frame(root, { [cur.id]: 'compare' }, `Compare ${v} with ${cur.label}.`));
      if (v < Number(cur.label)) {
        if (!cur.left) {
          cur.left = node(String(v), String(v));
          break;
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = node(String(v), String(v));
          break;
        }
        cur = cur.right;
      }
    }
    frames.push(frame(root, { [String(v)]: 'placed' }, `Insert ${v} into its sorted position.`));
  }
  frames.push(frame(root, {}, 'Binary search tree complete — an in-order walk yields sorted keys.'));
  return frames;
}

// ---------------------------------------------------------------------------
// AVL Tree — self-balancing insertion with rotations
// ---------------------------------------------------------------------------
interface AVL {
  key: number;
  left: AVL | null;
  right: AVL | null;
  h: number;
}
const h = (n: AVL | null) => (n ? n.h : 0);
const upd = (n: AVL) => (n.h = 1 + Math.max(h(n.left), h(n.right)));
const bal = (n: AVL | null) => (n ? h(n.left) - h(n.right) : 0);

function rotR(y: AVL): AVL {
  const x = y.left!;
  y.left = x.right;
  x.right = y;
  upd(y);
  upd(x);
  return x;
}
function rotL(x: AVL): AVL {
  const y = x.right!;
  x.right = y.left;
  y.left = x;
  upd(x);
  upd(y);
  return y;
}

function avlToTNode(n: AVL | null): TNode | null {
  if (!n) return null;
  const t = node(String(n.key), String(n.key));
  t.left = avlToTNode(n.left);
  t.right = avlToTNode(n.right);
  return t;
}

function avlFrames(): TreeFrame[] {
  const values = [10, 20, 30, 40, 50, 25];
  const frames: TreeFrame[] = [];
  let root: AVL | null = null;

  const snapshot = (states: Record<string, TreeNodeState>, desc: string) =>
    frames.push(frame(avlToTNode(root), states, desc));

  const insert = (n: AVL | null, key: number): AVL => {
    if (!n) return { key, left: null, right: null, h: 1 };
    if (key < n.key) n.left = insert(n.left, key);
    else n.right = insert(n.right, key);
    upd(n);
    const b = bal(n);
    if (b > 1 && key < n.left!.key) return rotR(n);
    if (b < -1 && key > n.right!.key) return rotL(n);
    if (b > 1 && key > n.left!.key) {
      n.left = rotL(n.left!);
      return rotR(n);
    }
    if (b < -1 && key < n.right!.key) {
      n.right = rotR(n.right!);
      return rotL(n);
    }
    return n;
  };

  for (const v of values) {
    const before = JSON.stringify(avlToTNode(root));
    root = insert(root, v);
    const rotated = before !== JSON.stringify(avlToTNode(root)) && root !== null;
    snapshot(
      { [String(v)]: 'placed' },
      rotated
        ? `Insert ${v}, then rotate to keep every subtree height-balanced.`
        : `Insert ${v} — tree stays balanced.`
    );
  }
  snapshot({}, 'AVL tree stays balanced after every insert (heights differ by ≤ 1).');
  return frames;
}

// ---------------------------------------------------------------------------
// Binary Heap (max-heap) — build with sift-up
// ---------------------------------------------------------------------------
function heapArrayToTNode(a: number[], i = 0): TNode | null {
  if (i >= a.length) return null;
  const t = node(`${i}:${a[i]}`, String(a[i]));
  t.left = heapArrayToTNode(a, 2 * i + 1);
  t.right = heapArrayToTNode(a, 2 * i + 2);
  return t;
}

function heapFrames(): TreeFrame[] {
  const values = [15, 40, 25, 60, 8, 55, 30];
  const heap: number[] = [];
  const frames: TreeFrame[] = [];
  const idOf = (i: number) => `${i}:${heap[i]}`;

  for (const v of values) {
    heap.push(v);
    let i = heap.length - 1;
    frames.push(frame(heapArrayToTNode(heap), { [idOf(i)]: 'placed' }, `Add ${v} at the end of the heap.`));
    while (i > 0) {
      const p = (i - 1) >> 1;
      frames.push(
        frame(heapArrayToTNode(heap), { [idOf(i)]: 'active', [idOf(p)]: 'compare' }, `Compare ${heap[i]} with parent ${heap[p]}.`)
      );
      if (heap[p] >= heap[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      frames.push(frame(heapArrayToTNode(heap), { [idOf(p)]: 'active' }, `Swap up: ${heap[p]} bubbles toward the root.`));
      i = p;
    }
  }
  frames.push(frame(heapArrayToTNode(heap), {}, 'Max-heap built — the largest value sits at the root.'));
  return frames;
}

// ---------------------------------------------------------------------------
// Red-Black Tree (left-leaning) — insertion with recoloring
// ---------------------------------------------------------------------------
interface RB {
  key: number;
  left: RB | null;
  right: RB | null;
  red: boolean;
}
const isRed = (n: RB | null) => !!n && n.red;
function rbRotL(hn: RB): RB {
  const x = hn.right!;
  hn.right = x.left;
  x.left = hn;
  x.red = hn.red;
  hn.red = true;
  return x;
}
function rbRotR(hn: RB): RB {
  const x = hn.left!;
  hn.left = x.right;
  x.right = hn;
  x.red = hn.red;
  hn.red = true;
  return x;
}
function flip(hn: RB) {
  hn.red = !hn.red;
  if (hn.left) hn.left.red = !hn.left.red;
  if (hn.right) hn.right.red = !hn.right.red;
}
function rbToTNode(n: RB | null): TNode | null {
  if (!n) return null;
  const t = node(String(n.key), String(n.key), n.red ? 'red' : 'black');
  t.left = rbToTNode(n.left);
  t.right = rbToTNode(n.right);
  return t;
}

function rbFrames(): TreeFrame[] {
  const values = [10, 20, 30, 15, 25, 5];
  const frames: TreeFrame[] = [];
  let root: RB | null = null;

  const insert = (hn: RB | null, key: number): RB => {
    if (!hn) return { key, left: null, right: null, red: true };
    if (key < hn.key) hn.left = insert(hn.left, key);
    else hn.right = insert(hn.right, key);
    if (isRed(hn.right) && !isRed(hn.left)) hn = rbRotL(hn);
    if (isRed(hn.left) && isRed(hn.left!.left)) hn = rbRotR(hn);
    if (isRed(hn.left) && isRed(hn.right)) flip(hn);
    return hn;
  };

  for (const v of values) {
    root = insert(root, v);
    root.red = false;
    frames.push(frame(rbToTNode(root), { [String(v)]: 'placed' }, `Insert ${v}; recolor / rotate so no red node has a red child.`));
  }
  frames.push(frame(rbToTNode(root), {}, 'Red-black tree stays balanced: every root-to-leaf path has equal black height.'));
  return frames;
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------
const bst: AlgorithmModule = {
  visualizer: 'tree',
  generateFrames: bstFrames,
  code: {
    javascript: `function insert(node, key) {
  if (!node) return { key, left: null, right: null };
  if (key < node.key) node.left = insert(node.left, key);
  else node.right = insert(node.right, key);
  return node;
}`,
    python: `def insert(node, key):
    if node is None:
        return Node(key)
    if key < node.key:
        node.left = insert(node.left, key)
    else:
        node.right = insert(node.right, key)
    return node`,
  },
  meta: {
    id: 'binary-search-tree',
    name: 'Binary Search Tree',
    category: 'trees',
    difficulty: 'Easy',
    summary: 'Ordered binary tree: left subtree smaller, right subtree larger.',
    complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' }, space: 'O(n)', recursive: true },
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
};

const avl: AlgorithmModule = {
  visualizer: 'tree',
  generateFrames: avlFrames,
  code: {
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
  },
  meta: {
    id: 'avl-tree',
    name: 'AVL Tree',
    category: 'trees',
    difficulty: 'Hard',
    summary: 'Self-balancing BST that keeps subtree heights within one via rotations.',
    complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(n)', recursive: true },
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
if balance < -1 and key > right.key: rotateLeft`,
  },
};

const rbt: AlgorithmModule = {
  visualizer: 'tree',
  generateFrames: rbFrames,
  code: {
    javascript: `function insert(h, key) {
  if (!h) return { key, red: true, left: null, right: null };
  if (key < h.key) h.left = insert(h.left, key);
  else h.right = insert(h.right, key);
  if (isRed(h.right) && !isRed(h.left)) h = rotateLeft(h);
  if (isRed(h.left) && isRed(h.left.left)) h = rotateRight(h);
  if (isRed(h.left) && isRed(h.right)) flipColors(h);
  return h;
}`,
    python: `def insert(h, key):
    if h is None:
        return Node(key, red=True)
    if key < h.key: h.left = insert(h.left, key)
    else: h.right = insert(h.right, key)
    if is_red(h.right) and not is_red(h.left): h = rotate_left(h)
    if is_red(h.left) and is_red(h.left.left): h = rotate_right(h)
    if is_red(h.left) and is_red(h.right): flip_colors(h)
    return h`,
  },
  meta: {
    id: 'red-black-tree',
    name: 'Red-Black Tree',
    category: 'trees',
    difficulty: 'Hard',
    summary: 'Self-balancing BST using node colors to bound the height to 2·log n.',
    complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(n)', recursive: false },
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
};

const heap: AlgorithmModule = {
  visualizer: 'tree',
  generateFrames: heapFrames,
  code: {
    javascript: `function push(heap, x) {
  heap.push(x);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p] >= heap[i]) break;
    [heap[p], heap[i]] = [heap[i], heap[p]];
    i = p;
  }
}`,
    python: `def push(heap, x):
    heap.append(x)
    i = len(heap) - 1
    while i > 0:
        p = (i - 1) // 2
        if heap[p] >= heap[i]:
            break
        heap[p], heap[i] = heap[i], heap[p]
        i = p`,
  },
  meta: {
    id: 'heap',
    name: 'Binary Heap',
    category: 'trees',
    difficulty: 'Medium',
    summary: 'Complete binary tree maintaining the min/max at the root as a priority queue.',
    complexity: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(n)', recursive: false },
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
};

const modules: AlgorithmModule[] = [bst, avl, rbt, heap];
export default modules;

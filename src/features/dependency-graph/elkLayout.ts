import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from '@xyflow/react';
import { ProjectFile, DependencyEdge } from '../../types';

const elk = new ELK();

const NODE_WIDTH = 210;
const NODE_HEIGHT = 68;

export async function computeElkLayout(
  files: ProjectFile[],
  edges: DependencyEdge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const elkGraph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '40',
      'elk.layered.spacing.nodeNodeBetweenLayers': '70',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
    },
    children: files.map((file) => ({
      id: file.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const layout = await elk.layout(elkGraph);

  const nodes: Node[] = (layout.children || []).map((node) => {
    const file = files.find((f) => f.id === node.id)!;
    return {
      id: node.id,
      type: 'fileNode',
      position: { x: node.x ?? 0, y: node.y ?? 0 },
      data: { file },
    };
  });

  const reactFlowEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: false,
    style: { stroke: '#CBD5E1', strokeWidth: 1.5 },
  }));

  return { nodes, edges: reactFlowEdges };
}
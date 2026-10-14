import React, { useEffect, useState, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ProjectFile, DependencyEdge } from '../../types';
import { FileNode } from './FileNode';
import { computeElkLayout } from './elkLayout';
import { getConnectedFileIds } from '../../lib/graphUtils';

const nodeTypes = {
  fileNode: FileNode,
};

interface DependencyGraphProps {
  files: ProjectFile[];
  edges: DependencyEdge[];
  selectedFileId: string | null;
  refactoringThreshold: number;
  isRefactoringMode: boolean;
  onSelectFile: (id: string | null) => void;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  files,
  edges,
  selectedFileId,
  refactoringThreshold,
  isRefactoringMode,
  onSelectFile,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Первоначальный расчет ELK.js
  useEffect(() => {
    let isCancelled = false;
    computeElkLayout(files, edges).then((result) => {
      if (!isCancelled) {
        setNodes(result.nodes);
        setRfEdges(result.edges);
        setIsLayoutReady(true);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [files, edges, setNodes, setRfEdges]);

  // Вычисление активных связей
  const connectedInfo = useMemo(() => {
    if (!selectedFileId) return null;
    return getConnectedFileIds(selectedFileId, edges);
  }, [selectedFileId, edges]);

  // Стилизация и подсветка узлов
  const styledNodes = useMemo(() => {
    return nodes.map((node) => {
      const file = node.data.file as ProjectFile;
      const isSelected = file.id === selectedFileId;
      const isCandidate = isRefactoringMode && file.lineCount > refactoringThreshold;
      const isDimmed =
        Boolean(connectedInfo) && !connectedInfo?.allConnected.has(file.id);

      return {
        ...node,
        data: {
          ...node.data,
          isSelected,
          isDimmed,
          isRefactoringCandidate: isCandidate,
        },
      };
    });
  }, [nodes, selectedFileId, connectedInfo, isRefactoringMode, refactoringThreshold]);

  // Стилизация рёбер
  const styledEdges = useMemo(() => {
    return rfEdges.map((edge) => {
      if (!selectedFileId) {
        return {
          ...edge,
          animated: false,
          style: { stroke: '#CBD5E1', strokeWidth: 1.5, opacity: 0.8 },
        };
      }

      const isOutgoing = edge.source === selectedFileId;
      const isIncoming = edge.target === selectedFileId;

      if (isOutgoing) {
        return {
          ...edge,
          animated: true,
          style: { stroke: '#0969DA', strokeWidth: 2, opacity: 1 },
        };
      }
      if (isIncoming) {
        return {
          ...edge,
          animated: true,
          style: { stroke: '#10B981', strokeWidth: 2, opacity: 1 },
        };
      }

      return {
        ...edge,
        animated: false,
        style: { stroke: '#E2E8F0', strokeWidth: 1, opacity: 0.2 },
      };
    });
  }, [rfEdges, selectedFileId]);

  if (!isLayoutReady) {
    return (
      <div className="flex h-full items-center justify-center text-xs font-mono text-graphite-400">
        Вычисление топологии графа (ELK)...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#FAFAFA]">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onSelectFile(node.id)}
        onPaneClick={() => onSelectFile(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.8}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E2E8F0" />
        <Controls className="!bg-white !border !border-graphite-200 !shadow-xs !rounded-md" />
        <MiniMap
          nodeColor="#CBD5E1"
          maskColor="rgba(240, 242, 245, 0.7)"
          className="!border !border-graphite-200 !rounded-md"
        />
      </ReactFlow>

      {/* Легенда связей */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-graphite-200 rounded-md p-2.5 text-[11px] font-mono shadow-xs flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-0.5 bg-brand-500 inline-block"></span>
          <span className="text-graphite-600">Импортирует (исходящая)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-0.5 bg-emerald-500 inline-block"></span>
          <span className="text-graphite-600">Импортируется (входящая)</span>
        </div>
      </div>
    </div>
  );
};
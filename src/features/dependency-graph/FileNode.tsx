import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ProjectFile } from '../../types';
import { FileCode, Layers, Database, Route, Component, Settings } from 'lucide-react';

interface FileNodeProps {
  data: {
    file: ProjectFile;
    isSelected?: boolean;
    isDimmed?: boolean;
    isRefactoringCandidate?: boolean;
  };
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  entry: Route,
  router: Route,
  service: Layers,
  repository: Database,
  model: FileCode,
  component: Component,
  config: Settings,
  types: FileCode,
  util: FileCode,
};

export const FileNode: React.FC<FileNodeProps> = ({ data }) => {
  const { file, isSelected, isDimmed, isRefactoringCandidate } = data;
  const Icon = CATEGORY_ICONS[file.category] || FileCode;

  return (
    <div
      className={`
        px-3 py-2.5 rounded-md border text-left transition-all duration-150 select-none bg-white shadow-xs
        w-[210px]
        ${
          isSelected
            ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/40'
            : isRefactoringCandidate
            ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300'
            : 'border-graphite-200 hover:border-graphite-300'
        }
        ${isDimmed ? 'opacity-30' : 'opacity-100'}
      `}
    >
      <Handle type="target" position={Position.Left} className="!bg-graphite-400 !w-1.5 !h-1.5 !border-0" />
      
      <div className="flex items-center gap-2">
        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-brand-600' : 'text-graphite-400'}`} />
        <span className="font-mono text-xs font-semibold text-graphite-800 truncate" title={file.name}>
          {file.name}
        </span>
      </div>

      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-graphite-100 text-[10px] text-graphite-400 font-mono">
        <span className="truncate max-w-[110px]">{file.category}</span>
        <span className={isRefactoringCandidate ? 'text-amber-700 font-medium' : ''}>
          {file.lineCount} l
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-graphite-400 !w-1.5 !h-1.5 !border-0" />
    </div>
  );
};
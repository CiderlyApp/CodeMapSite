import React from 'react';
import { ProjectFile } from '../../types';
import { FileCode, Folder, ChevronDown } from 'lucide-react';

interface FileTreeProps {
  files: ProjectFile[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  refactoringThreshold: number;
  isRefactoringMode: boolean;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  refactoringThreshold,
  isRefactoringMode,
}) => {
  return (
    <div className="h-full flex flex-col bg-surface border-r border-graphite-200 select-none">
      <div className="p-3 border-b border-graphite-100 flex items-center justify-between text-xs font-semibold text-graphite-500 uppercase tracking-wider font-mono">
        <span>Проводник</span>
        <span className="text-[10px] bg-graphite-100 text-graphite-600 px-1.5 py-0.5 rounded">
          {files.length} файлов
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 text-graphite-400">
          <ChevronDown className="w-3.5 h-3.5" />
          <Folder className="w-3.5 h-3.5 text-graphite-400" />
          <span className="text-graphite-700 font-medium">src</span>
        </div>

        <div className="pl-3 space-y-0.5">
          {files.map((file) => {
            const isSelected = file.id === selectedFileId;
            const isCandidate = isRefactoringMode && file.lineCount > refactoringThreshold;

            return (
              <button
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`
                  w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors
                  ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'hover:bg-graphite-50 text-graphite-600 hover:text-graphite-900'
                  }
                `}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-brand-500' : 'text-graphite-400'}`} />
                  <span className="truncate">{file.path.replace('src/', '')}</span>
                </div>

                <div className="flex items-center gap-1">
                  {isCandidate && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Кандидат на рефакторинг" />
                  )}
                  <span className="text-[10px] text-graphite-400">{file.lineCount}l</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
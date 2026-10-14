import React from 'react';
import { ProjectFile } from '../../types';
import { ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2 } from 'lucide-react';

interface CodeViewerProps {
  file: ProjectFile | null;
  onClearSelection: () => void;
  onSelectConnected: (fileId: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  file,
  onClearSelection,
  onSelectConnected,
}) => {
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-graphite-400 bg-surface">
        <FileText className="w-8 h-8 text-graphite-300 mb-2 stroke-[1.5]" />
        <p className="text-xs font-mono">Выберите файл в дереве или на графе</p>
        <p className="text-[11px] text-graphite-400 mt-1">
          Чтобы просмотреть импорты, экспорты и исходный код
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface border-l border-graphite-200">
      {/* Шапка файла */}
      <div className="p-3 border-b border-graphite-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-mono text-xs font-bold text-graphite-900">{file.name}</h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-graphite-100 font-mono text-graphite-600">
              {file.lineCount} строк
            </span>
          </div>
          <p className="text-[11px] text-graphite-500 mt-0.5 line-clamp-1">{file.description}</p>
        </div>
        <button
          onClick={onClearSelection}
          className="text-xs text-graphite-500 hover:text-graphite-800 px-2 py-1 rounded hover:bg-graphite-100"
        >
          Весь проект
        </button>
      </div>

      {/* Метаданные зависимостей */}
      <div className="p-3 border-b border-graphite-100 space-y-3 font-mono text-[11px] bg-graphite-50/50">
        <div>
          <div className="flex items-center gap-1 text-graphite-500 mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-500" />
            <span>Импортирует ({file.imports.length}):</span>
          </div>
          {file.imports.length === 0 ? (
            <span className="text-graphite-400 italic">Нет импортов</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {file.imports.map((dep) => (
                <button
                  key={dep}
                  onClick={() => onSelectConnected(dep)}
                  className="px-1.5 py-0.5 bg-white border border-graphite-200 rounded text-graphite-700 hover:border-brand-500 hover:text-brand-600"
                >
                  {dep.split('/').pop()}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1 text-graphite-500 mb-1">
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
            <span>Экспорты:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {file.exports.map((exp) => (
              <span key={exp} className="px-1.5 py-0.5 bg-white border border-graphite-200 rounded text-graphite-600">
                {exp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Просмотр исходного кода */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs bg-[#FBFBFC]">
        <pre className="text-graphite-800 leading-relaxed font-normal">
          <code>{file.content}</code>
        </pre>
      </div>
    </div>
  );
};
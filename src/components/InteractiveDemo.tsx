import React, { useState, useMemo } from 'react';
import { DEMO_PROJECT_FILES, DEMO_PROJECT_EDGES } from '../data/demoProject';
import { DependencyGraph } from '../features/dependency-graph/DependencyGraph';
import { FileTree } from '../features/file-explorer/FileTree';
import { CodeViewer } from '../features/code-viewer/CodeViewer';
import { ContextModal } from '../features/context-builder/ContextModal';
import { buildLLMContext } from '../features/context-builder/contextBuilder';
import { findRefactoringCandidates } from '../features/refactoring/refactoringAnalysis';
import { findFileById } from '../lib/graphUtils';
import { Sparkles, AlertTriangle, RotateCcw, SlidersHorizontal } from 'lucide-react';

export const InteractiveDemo: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isRefactoringMode, setIsRefactoringMode] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(500);
  const [isContextModalOpen, setIsContextModalOpen] = useState<boolean>(false);

  const selectedFile = useMemo(
    () => findFileById(DEMO_PROJECT_FILES, selectedFileId),
    [selectedFileId]
  );

  const refactoringCandidates = useMemo(
    () => findRefactoringCandidates(DEMO_PROJECT_FILES, threshold),
    [threshold]
  );

  const contextData = useMemo(() => {
    return buildLLMContext({
      rootFileId: selectedFileId,
      allFiles: DEMO_PROJECT_FILES,
      edges: DEMO_PROJECT_EDGES,
    });
  }, [selectedFileId]);

  return (
    <div id="interactive-demo" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-600 font-semibold mb-1">
            <span>Live Workspace Demo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-graphite-900">
            Интерактивный граф: drink-catalog (10 файлов)
          </h2>
          <p className="text-xs sm:text-sm text-graphite-500 mt-1">
            Исследуйте архитектуру в реальном времени. Кликните по файлу для изоляции связей или соберите контекст для LLM.
          </p>
        </div>

        {/* Панель быстрых действий */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Режим рефакторинга */}
          <button
            onClick={() => setIsRefactoringMode(!isRefactoringMode)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border flex items-center gap-1.5 transition-colors ${
              isRefactoringMode
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-graphite-200 text-graphite-600 hover:border-graphite-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Рефакторинг</span>
            {isRefactoringMode && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-200/60 text-[10px]">
                {refactoringCandidates.length}
              </span>
            )}
          </button>

          {/* Сборка контекста */}
          <button
            onClick={() => setIsContextModalOpen(true)}
            className="px-3 py-1.5 text-xs font-mono rounded-md bg-graphite-900 hover:bg-graphite-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Собрать контекст {selectedFile ? `(модуль)` : `(весь проект)`}</span>
          </button>

          {selectedFileId && (
            <button
              onClick={() => setSelectedFileId(null)}
              className="p-1.5 text-graphite-500 hover:text-graphite-800 border border-graphite-200 rounded-md bg-white hover:bg-graphite-50"
              title="Сбросить выделение"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Панель настройки порога строк при включенном режиме рефакторинга */}
      {isRefactoringMode && (
        <div className="mb-3 p-3 bg-amber-50/60 border border-amber-200 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-900">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Порог предупреждения строк кода:</span>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-20 px-2 py-0.5 border border-amber-300 rounded bg-white text-graphite-900 text-xs font-mono"
              min={10}
              max={1000}
              step={5}
            />
            <span className="text-graphite-500 text-[11px]">
              (По умолчанию 500. Попробуйте установить 30, чтобы подсветить крупные файлы в демо)
            </span>
          </div>

          <div className="text-amber-800 font-semibold">
            Найдено: {refactoringCandidates.length} шт.
          </div>
        </div>
      )}

      {/* Контейнер рабочей среды */}
      <div className="grid grid-cols-1 lg:grid-cols-12 h-[680px] border border-graphite-200 rounded-lg overflow-hidden bg-white shadow-xs">
        {/* Левая панель: дерево файлов */}
        <div className="hidden md:block lg:col-span-3 h-full">
          <FileTree
            files={DEMO_PROJECT_FILES}
            selectedFileId={selectedFileId}
            onSelectFile={(id) => setSelectedFileId(id)}
            refactoringThreshold={threshold}
            isRefactoringMode={isRefactoringMode}
          />
        </div>

        {/* Центральная панель: Граф */}
        <div className="col-span-1 md:col-span-6 lg:col-span-6 h-full relative border-r border-graphite-200">
          <DependencyGraph
            files={DEMO_PROJECT_FILES}
            edges={DEMO_PROJECT_EDGES}
            selectedFileId={selectedFileId}
            refactoringThreshold={threshold}
            isRefactoringMode={isRefactoringMode}
            onSelectFile={(id) => setSelectedFileId(id)}
          />
        </div>

        {/* Правая панель: просмотрщик кода и деталей */}
        <div className="hidden sm:block lg:col-span-3 h-full">
          <CodeViewer
            file={selectedFile}
            onClearSelection={() => setSelectedFileId(null)}
            onSelectConnected={(id) => setSelectedFileId(id)}
          />
        </div>
      </div>

      {/* Модальное окно готового контекста */}
      <ContextModal
        contextResult={contextData}
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
      />
    </div>
  );
};
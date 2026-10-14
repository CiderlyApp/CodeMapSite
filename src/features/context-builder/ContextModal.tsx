import React, { useState } from 'react';
import { LLMContextResult } from '../../types';
import { copyTextToClipboard } from '../../lib/clipboard';
import { Copy, Check, X, Sparkles } from 'lucide-react';

interface ContextModalProps {
  contextResult: LLMContextResult;
  isOpen: boolean;
  onClose: () => void;
}

export const ContextModal: React.FC<ContextModalProps> = ({
  contextResult,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    setCopyError(false);
    const success = await copyTextToClipboard(contextResult.textPayload);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-graphite-200 shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="p-4 border-b border-graphite-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="font-semibold text-sm text-graphite-900">
              Собранный контекст для LLM
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-graphite-400 hover:text-graphite-700 p-1 rounded"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-2 bg-graphite-50 border-b border-graphite-100 flex items-center gap-6 text-xs font-mono text-graphite-600">
          <span>Файлов: <strong>{contextResult.totalFiles}</strong></span>
          <span>Строк: <strong>{contextResult.totalLines}</strong></span>
          <span>~Токенов: <strong>{contextResult.estimatedTokens}</strong></span>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-[#FBFBFC] font-mono text-xs">
          <pre className="text-graphite-800 whitespace-pre-wrap">
            {contextResult.textPayload}
          </pre>
        </div>

        <div className="p-3 border-t border-graphite-200 bg-white flex items-center justify-between">
          <span className="text-xs text-graphite-500 font-mono">
            {copyError
              ? 'Ошибка буфера обмена. Скопируйте текст вручную.'
              : 'Готово к вставке в ChatGPT, Claude или Cursor'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-graphite-600 hover:text-graphite-900 font-medium"
            >
              Закрыть
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Копировать контекст</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
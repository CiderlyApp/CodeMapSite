import { describe, it, expect } from 'vitest';
import { DEMO_PROJECT_FILES, DEMO_PROJECT_EDGES } from '../data/demoProject';
import { buildLLMContext } from '../features/context-builder/contextBuilder';

describe('LLM Context Builder', () => {
  it('собирает все 10 файлов в глобальном режиме без дубликатов', () => {
    const result = buildLLMContext({
      rootFileId: null,
      allFiles: DEMO_PROJECT_FILES,
      edges: DEMO_PROJECT_EDGES,
    });

    expect(result.totalFiles).toBe(10);
    const uniqueIds = new Set(result.fileIds);
    expect(uniqueIds.size).toBe(10);
    expect(result.textPayload).toContain('# Codebase Context for LLM');
  });

  it('выполняет дедупликацию и сохраняет связность при выборе модуля app.ts', () => {
    const result = buildLLMContext({
      rootFileId: 'src/app.ts',
      allFiles: DEMO_PROJECT_FILES,
      edges: DEMO_PROJECT_EDGES,
    });

    // Должен включать сам rootFileId и зависимости
    expect(result.fileIds[0]).toBe('src/app.ts');
    expect(result.fileIds).toContain('src/repositories/drinkRepository.ts');
    expect(result.fileIds).toContain('src/models/drink.ts');
    expect(result.fileIds).toContain('src/types.ts');

    // Проверка отсутствия дубликатов
    const uniqueIds = new Set(result.fileIds);
    expect(uniqueIds.size).toBe(result.fileIds.length);
  });

  it('корректно оценивает число токенов эвристикой длины', () => {
    const result = buildLLMContext({
      rootFileId: null,
      allFiles: DEMO_PROJECT_FILES,
      edges: DEMO_PROJECT_EDGES,
    });

    expect(result.estimatedTokens).toBeGreaterThan(500);
    expect(result.estimatedTokens).toBe(Math.ceil(result.textPayload.length / 4));
  });
});
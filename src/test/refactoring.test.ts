import { describe, it, expect } from 'vitest';
import { DEMO_PROJECT_FILES } from '../data/demoProject';
import { findRefactoringCandidates } from '../features/refactoring/refactoringAnalysis';

describe('Refactoring Analysis', () => {
  it('по умолчанию при пороге 500 строк кандидатов нет', () => {
    const candidates = findRefactoringCandidates(DEMO_PROJECT_FILES, 500);
    expect(candidates).toHaveLength(0);
  });

  it('находит файлы, превышающие заданный порог (например, 35 строк)', () => {
    const candidates = findRefactoringCandidates(DEMO_PROJECT_FILES, 35);
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0].file.lineCount).toBeGreaterThan(35);
    expect(candidates[0].excessLines).toBe(candidates[0].file.lineCount - 35);
  });

  it('возвращает пустой список при отрицательном или нулевом пороге', () => {
    expect(findRefactoringCandidates(DEMO_PROJECT_FILES, 0)).toEqual([]);
    expect(findRefactoringCandidates(DEMO_PROJECT_FILES, -10)).toEqual([]);
  });
});
import { describe, it, expect } from 'vitest';
import { DEMO_PROJECT_FILES, DEMO_PROJECT_EDGES } from '../data/demoProject';

describe('Demo Project Integrity', () => {
  it('содержит ровно 10 файлов проекта', () => {
    expect(DEMO_PROJECT_FILES).toHaveLength(10);
  });

  it('все рёбра ссылаются на существующие ID файлов', () => {
    const fileIds = new Set(DEMO_PROJECT_FILES.map((f) => f.id));
    for (const edge of DEMO_PROJECT_EDGES) {
      expect(fileIds.has(edge.source)).toBe(true);
      expect(fileIds.has(edge.target)).toBe(true);
    }
  });

  it('каждое ребро соответствует реальному импорту в файле-источнике', () => {
    for (const edge of DEMO_PROJECT_EDGES) {
      const sourceFile = DEMO_PROJECT_FILES.find((f) => f.id === edge.source)!;
      expect(sourceFile.imports).toContain(edge.target);
    }
  });
});
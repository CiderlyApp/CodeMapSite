import { ProjectFile, DependencyEdge } from '../types';

export function getConnectedFileIds(
  selectedFileId: string,
  edges: DependencyEdge[]
): {
  dependencies: string[]; // Файлы, которые импортирует selectedFileId
  dependents: string[];   // Файлы, которые импортируют selectedFileId
  allConnected: Set<string>;
} {
  const dependencies: string[] = [];
  const dependents: string[] = [];

  for (const edge of edges) {
    if (edge.source === selectedFileId) {
      dependencies.push(edge.target);
    }
    if (edge.target === selectedFileId) {
      dependents.push(edge.source);
    }
  }

  const allConnected = new Set<string>([
    selectedFileId,
    ...dependencies,
    ...dependents,
  ]);

  return { dependencies, dependents, allConnected };
}

export function findFileById(
  files: ProjectFile[],
  id: string | null
): ProjectFile | null {
  if (!id) return null;
  return files.find((f) => f.id === id) ?? null;
}
import { ProjectFile, DependencyEdge, LLMContextResult } from '../../types';

/**
 * Детерминированный сбор контекста:
 * - Выполняет поиск в ширину (BFS) по исходящим и входящим зависимостям.
 * - Гарантирует уникальность каждого файла в выводе (дедупликация через Set).
 * - Формирует разметку Markdown, оптимизированную для передачи в LLM (System / User prompt).
 */
export function buildLLMContext(params: {
  rootFileId?: string | null;
  allFiles: ProjectFile[];
  edges: DependencyEdge[];
}): LLMContextResult {
  const { rootFileId, allFiles, edges } = params;
  const fileMap = new Map<string, ProjectFile>(allFiles.map((f) => [f.id, f]));

  let orderedFiles: ProjectFile[] = [];

  if (!rootFileId) {
    // Режим "Весь проект": сортируем детерминированно по пути
    orderedFiles = [...allFiles].sort((a, b) => a.path.localeCompare(b.path));
  } else {
    const visited = new Set<string>();
    const queue: string[] = [rootFileId];
    visited.add(rootFileId);

    // Собираем прямые и вторичные зависимости через детерминированный BFS
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const outgoing = edges
        .filter((e) => e.source === currentId)
        .map((e) => e.target)
        .sort();

      for (const targetId of outgoing) {
        if (!visited.has(targetId) && fileMap.has(targetId)) {
          visited.add(targetId);
          queue.push(targetId);
        }
      }
    }

    orderedFiles = Array.from(visited)
      .map((id) => fileMap.get(id)!)
      .filter(Boolean);
  }

  let totalLines = 0;
  const sections: string[] = [];

  sections.push('# Codebase Context for LLM');
  sections.push(`Generated: ${new Date().toISOString()}`);
  sections.push(`Total Included Files: ${orderedFiles.length}`);
  sections.push('');
  sections.push('## Dependency Summary');

  for (const file of orderedFiles) {
    sections.push(`- **${file.path}** (${file.lineCount} lines)`);
    if (file.imports.length > 0) {
      sections.push(`  - imports: ${file.imports.join(', ')}`);
    }
    if (file.exports.length > 0) {
      sections.push(`  - exports: ${file.exports.join(', ')}`);
    }
  }

  sections.push('\n---\n## File Contents\n');

  for (const file of orderedFiles) {
    totalLines += file.lineCount;
    sections.push(`### File: \`${file.path}\``);
    sections.push('```typescript');
    sections.push(file.content);
    sections.push('```\n');
  }

  const textPayload = sections.join('\n');
  // Эвристика: ~4 символа на токен
  const estimatedTokens = Math.ceil(textPayload.length / 4);

  return {
    totalFiles: orderedFiles.length,
    totalLines,
    estimatedTokens,
    textPayload,
    fileIds: orderedFiles.map((f) => f.id),
  };
}
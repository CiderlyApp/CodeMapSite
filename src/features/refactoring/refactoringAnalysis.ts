import { ProjectFile } from '../../types';

export interface RefactoringCandidate {
  file: ProjectFile;
  excessLines: number;
}

export function findRefactoringCandidates(
  files: ProjectFile[],
  lineThreshold: number
): RefactoringCandidate[] {
  if (lineThreshold <= 0) return [];

  return files
    .filter((file) => file.lineCount > lineThreshold)
    .map((file) => ({
      file,
      excessLines: file.lineCount - lineThreshold,
    }))
    .sort((a, b) => b.file.lineCount - a.file.lineCount);
}
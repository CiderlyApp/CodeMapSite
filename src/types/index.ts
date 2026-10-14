export type FileCategory =
  | 'entry'
  | 'router'
  | 'service'
  | 'repository'
  | 'model'
  | 'component'
  | 'util'
  | 'types'
  | 'config';

export interface ProjectFile {
  id: string; // "src/routes/drinks.ts"
  name: string; // "drinks.ts"
  path: string; // "src/routes/drinks.ts"
  category: FileCategory;
  lineCount: number;
  content: string;
  imports: string[]; // пути импортируемых файлов
  exports: string[]; // идентификаторы экспортов
  description: string;
}

export interface DependencyEdge {
  id: string;
  source: string; // ID файла-импортера
  target: string; // ID импортируемого файла
}

export interface LLMContextResult {
  totalFiles: number;
  totalLines: number;
  estimatedTokens: number;
  textPayload: string;
  fileIds: string[];
}
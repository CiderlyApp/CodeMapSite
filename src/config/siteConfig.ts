export interface SiteConfig {
  appName: string;
  tagline: string;
  description: string;
  githubUrl: string;
  hasVerifiedRepo: boolean;
  navLinks: Array<{ label: string; href: string }>;
  version: string;
}

export const SITE_CONFIG: SiteConfig = {
  appName: 'CodeMap',
  tagline: 'Understand your codebase. See how everything connects.',
  description:
    'Исследуйте структуру проекта, находите связи между файлами и собирайте релевантный контекст для работы с LLM.',
  // До подтверждения реального адреса используется placeholder
  githubUrl: 'https://github.com/CiderlyApp/CodeMapSite',
  hasVerifiedRepo: false,
  navLinks: [
    { label: 'Возможности', href: '#features' },
    { label: 'Демонстрация', href: '#interactive-demo' },
    { label: 'Архитектура', href: '#architecture' },
    { label: 'Запуск', href: '#quickstart' },
  ],
  version: '0.1.0-alpha',
};
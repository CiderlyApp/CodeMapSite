import React from 'react';
import { SITE_CONFIG } from '../config/siteConfig';
import { InteractiveDemo } from '../components/InteractiveDemo';
import {
  Network,
  GitFork,
  Sparkles,
  SearchCode,
  ArrowRight,
  Terminal,
  ExternalLink,
} from 'lucide-react';

const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-graphite-900">
      {/* Шапка */}
      <header className="sticky top-0 z-40 w-full border-b border-graphite-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-graphite-900 flex items-center justify-center text-white">
              <Network className="w-4 h-4" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight">
              {SITE_CONFIG.appName}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono bg-graphite-100 text-graphite-600 px-1.5 py-0.5 rounded">
              {SITE_CONFIG.version}
            </span>
          </div>

          <nav className="flex items-center gap-6 text-xs font-medium text-graphite-600">
            {SITE_CONFIG.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-graphite-900 transition-colors hidden sm:block"
              >
                {link.label}
              </a>
            ))}
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-graphite-900 transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              <span className="font-mono text-xs">GitHub</span>
            </a>
            <a
              href="#interactive-demo"
              className="px-3 py-1.5 rounded-md bg-graphite-900 text-white font-mono text-xs hover:bg-graphite-800 transition-colors"
            >
              Открыть демо
            </a>
          </nav>
        </div>
      </header>

      {/* Hero секция */}
      <section className="pt-20 pb-12 border-b border-graphite-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-graphite-200 bg-white text-xs font-mono text-graphite-600 mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Static Developer Tooling</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-graphite-950 font-sans leading-[1.1]">
            {SITE_CONFIG.tagline}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-graphite-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {SITE_CONFIG.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#interactive-demo"
              className="px-5 py-2.5 rounded-md bg-graphite-950 text-white font-mono text-xs font-medium hover:bg-graphite-800 transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Попробовать демо</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-md bg-white border border-graphite-200 text-graphite-700 font-mono text-xs font-medium hover:border-graphite-300 hover:bg-graphite-50 transition-colors flex items-center gap-2"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>Посмотреть на GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Возможности */}
      <section id="features" className="py-16 border-b border-graphite-200/60 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-mono uppercase tracking-wider text-graphite-400 mb-2 font-semibold">
            Ключевые возможности
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-graphite-900 mb-10">
            Точный анализ кодовой базы без серверных запросов
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg border border-graphite-200 bg-canvas flex flex-col justify-between">
              <div>
                <Network className="w-5 h-5 text-brand-600 mb-3" />
                <h3 className="font-semibold text-sm text-graphite-900">Визуализация зависимостей</h3>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Понимайте, какие файлы импортируют другие и как устроена структура проекта с автоматической укладкой слоев через ELK.
                </p>
              </div>
              <div className="mt-4 p-2 bg-white rounded border border-graphite-100 font-mono text-[10px] text-graphite-500">
                A.ts ──импорт──&gt; B.ts
              </div>
            </div>

            <div className="p-4 rounded-lg border border-graphite-200 bg-canvas flex flex-col justify-between">
              <div>
                <GitFork className="w-5 h-5 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-sm text-graphite-900">Контекст одного файла</h3>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Выберите файл и изучите его прямые связи, входящие потребители, исходный код и экспортируемые сигнатуры.
                </p>
              </div>
              <div className="mt-4 p-2 bg-white rounded border border-graphite-100 font-mono text-[10px] text-graphite-500">
                target: drinkService.ts (2 deps)
              </div>
            </div>

            <div className="p-4 rounded-lg border border-graphite-200 bg-canvas flex flex-col justify-between">
              <div>
                <Sparkles className="w-5 h-5 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-sm text-graphite-900">Сборка контекста для LLM</h3>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Детерминированный обход дерева модулей с дедупликацией и оценкой числа токенов для вставки в нейросети.
                </p>
              </div>
              <div className="mt-4 p-2 bg-white rounded border border-graphite-100 font-mono text-[10px] text-graphite-500">
                10 файлов ~2,400 токенов
              </div>
            </div>

            <div className="p-4 rounded-lg border border-graphite-200 bg-canvas flex flex-col justify-between">
              <div>
                <SearchCode className="w-5 h-5 text-amber-600 mb-3" />
                <h3 className="font-semibold text-sm text-graphite-900">Поиск проблемных файлов</h3>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Находите крупные файлы и кандидатов на рефакторинг по динамически настраиваемому порогу строк.
                </p>
              </div>
              <div className="mt-4 p-2 bg-white rounded border border-graphite-100 font-mono text-[10px] text-graphite-500">
                threshold &gt; 500 lines
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Интерактивное демо */}
      <InteractiveDemo />

      {/* Секция быстрого старта */}
      <section id="quickstart" className="py-14 border-t border-graphite-200 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-graphite-400 mb-2 font-semibold">
            <Terminal className="w-4 h-4 text-graphite-600" />
            <span>Локальная разработка и сборка</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-graphite-900 mb-4">
            Как установить и запустить инструмент
          </h2>
          <p className="text-xs sm:text-sm text-graphite-600 mb-6">
            Проект представляет собой полностью статический React SPA без бэкенда, БД или внешних серверов.
          </p>

          <div className="bg-graphite-900 text-graphite-100 p-4 rounded-lg font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
            <p className="text-graphite-400"># 1. Клонирование репозитория</p>
            <p>git clone {SITE_CONFIG.githubUrl}.git</p>
            <p className="text-graphite-400"># 2. Установка зависимостей</p>
            <p>npm install</p>
            <p className="text-graphite-400"># 3. Запуск сервера разработки</p>
            <p>npm run dev</p>
            <p className="text-graphite-400"># 4. Прогон юнит-тестов (Vitest)</p>
            <p>npm run test</p>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="mt-auto border-t border-graphite-200 py-8 bg-white text-xs font-mono text-graphite-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-graphite-700" />
            <span className="font-semibold text-graphite-800">{SITE_CONFIG.appName}</span>
            <span>— Visual Codebase Dependency Analyzer</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-graphite-900 flex items-center gap-1.5"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
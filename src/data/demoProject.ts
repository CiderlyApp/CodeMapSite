import { ProjectFile, DependencyEdge } from '../types';

export const DEMO_PROJECT_FILES: ProjectFile[] = [
  {
    id: 'src/types.ts',
    name: 'types.ts',
    path: 'src/types.ts',
    category: 'types',
    lineCount: 22,
    description: 'Базовые доменные интерфейсы и контракты напитков.',
    imports: [],
    exports: ['DrinkCategory', 'DrinkItem', 'DrinkFilter', 'PaginatedResult'],
    content: `export type DrinkCategory = 'coffee' | 'tea' | 'cold_brew' | 'juice';

export interface DrinkItem {
  id: string;
  name: string;
  category: DrinkCategory;
  priceCents: number;
  volumeMl: number;
  isAvailable: boolean;
}

export interface DrinkFilter {
  category?: DrinkCategory;
  maxPriceCents?: number;
  onlyAvailable?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}`,
  },
  {
    id: 'src/config.ts',
    name: 'config.ts',
    path: 'src/config.ts',
    category: 'config',
    lineCount: 16,
    description: 'Глобальные константы конфигурации и пагинации каталога.',
    imports: [],
    exports: ['APP_CONFIG'],
    content: `export const APP_CONFIG = {
  env: 'production',
  port: 8080,
  defaultCurrency: 'USD',
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  features: {
    enableSeasonalMenu: true,
  },
} as const;`,
  },
  {
    id: 'src/utils/normalize.ts',
    name: 'normalize.ts',
    path: 'src/utils/normalize.ts',
    category: 'util',
    lineCount: 18,
    description: 'Вспомогательные утилиты очистки строк и форматирования цен.',
    imports: [],
    exports: ['sanitizeSearchQuery', 'formatPriceUSD'],
    content: `export function sanitizeSearchQuery(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9 _-]/g, '');
}

export function formatPriceUSD(cents: number): string {
  const dollars = (cents / 100).toFixed(2);
  return \`$\${dollars}\`;
}`,
  },
  {
    id: 'src/models/drink.ts',
    name: 'drink.ts',
    path: 'src/models/drink.ts',
    category: 'model',
    lineCount: 30,
    description: 'Сущность Drink с логикой валидации и нормализации данных.',
    imports: ['src/types.ts', 'src/utils/normalize.ts'],
    exports: ['Drink'],
    content: `import { DrinkItem, DrinkCategory } from '../types';
import { sanitizeSearchQuery } from '../utils/normalize';

export class Drink implements DrinkItem {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: DrinkCategory,
    public readonly priceCents: number,
    public readonly volumeMl: number,
    public readonly isAvailable: boolean = true
  ) {}

  public matchesQuery(query: string): boolean {
    const clean = sanitizeSearchQuery(query);
    return this.name.toLowerCase().includes(clean);
  }

  public static create(payload: Omit<DrinkItem, 'id'>, id: string): Drink {
    return new Drink(
      id,
      payload.name.trim(),
      payload.category,
      Math.max(0, payload.priceCents),
      payload.volumeMl,
      payload.isAvailable
    );
  }
}`,
  },
  {
    id: 'src/repositories/drinkRepository.ts',
    name: 'drinkRepository.ts',
    path: 'src/repositories/drinkRepository.ts',
    category: 'repository',
    lineCount: 38,
    description: 'Репозиторий доступа к локальному хранилищу напитков.',
    imports: ['src/models/drink.ts', 'src/types.ts'],
    exports: ['DrinkRepository'],
    content: `import { Drink } from '../models/drink';
import { DrinkFilter } from '../types';

export class DrinkRepository {
  private memoryStore: Map<string, Drink> = new Map();

  public async getById(id: string): Promise<Drink | null> {
    return this.memoryStore.get(id) ?? null;
  }

  public async list(filter?: DrinkFilter): Promise<Drink[]> {
    let list = Array.from(this.memoryStore.values());
    if (!filter) return list;

    if (filter.category) {
      list = list.filter((item) => item.category === filter.category);
    }
    if (filter.onlyAvailable) {
      list = list.filter((item) => item.isAvailable);
    }
    if (filter.maxPriceCents !== undefined) {
      list = list.filter((item) => item.priceCents <= filter.maxPriceCents!);
    }
    return list;
  }

  public async save(drink: Drink): Promise<void> {
    this.memoryStore.set(drink.id, drink);
  }
}`,
  },
  {
    id: 'src/services/drinkService.ts',
    name: 'drinkService.ts',
    path: 'src/services/drinkService.ts',
    category: 'service',
    lineCount: 42,
    description: 'Бизнес-логика фильтрации каталога и применения ограничений пагинации.',
    imports: [
      'src/repositories/drinkRepository.ts',
      'src/types.ts',
      'src/config.ts',
    ],
    exports: ['DrinkService'],
    content: `import { DrinkRepository } from '../repositories/drinkRepository';
import { DrinkFilter, PaginatedResult } from '../types';
import { APP_CONFIG } from '../config';
import { Drink } from '../models/drink';

export class DrinkService {
  constructor(private readonly repo: DrinkRepository) {}

  public async fetchCatalog(
    filter?: DrinkFilter,
    limit = APP_CONFIG.pagination.defaultLimit,
    offset = 0
  ): Promise<PaginatedResult<Drink>> {
    const safeLimit = Math.min(limit, APP_CONFIG.pagination.maxLimit);
    const all = await this.repo.list(filter);
    const sliced = all.slice(offset, offset + safeLimit);

    return {
      items: sliced,
      total: all.length,
      limit: safeLimit,
      offset,
    };
  }
}`,
  },
  {
    id: 'src/components/drinkCard.ts',
    name: 'drinkCard.ts',
    path: 'src/components/drinkCard.ts',
    category: 'component',
    lineCount: 28,
    description: 'Генератор HTML-представления карточки напитка с форматированием цен.',
    imports: ['src/models/drink.ts', 'src/utils/normalize.ts'],
    exports: ['renderDrinkCard'],
    content: `import { Drink } from '../models/drink';
import { formatPriceUSD } from '../utils/normalize';

export function renderDrinkCard(drink: Drink): string {
  const price = formatPriceUSD(drink.priceCents);
  const statusBadge = drink.isAvailable
    ? '<span class="status available">In Stock</span>'
    : '<span class="status out">Sold Out</span>';

  return \`
    <div class="drink-card" data-id="\${drink.id}">
      <h3>\${drink.name}</h3>
      <p class="category">\${drink.category}</p>
      <div class="meta">
        <span class="price">\${price}</span>
        <span class="volume">\${drink.volumeMl} ml</span>
        \${statusBadge}
      </div>
    </div>
  \`;
}`,
  },
  {
    id: 'src/routes/drinks.ts',
    name: 'drinks.ts',
    path: 'src/routes/drinks.ts',
    category: 'router',
    lineCount: 36,
    description: 'Обработчики маршрутов API /api/drinks.',
    imports: ['src/services/drinkService.ts', 'src/types.ts'],
    exports: ['createDrinksRouter'],
    content: `import { DrinkService } from '../services/drinkService';
import { DrinkCategory } from '../types';

export function createDrinksRouter(service: DrinkService) {
  return {
    async handleList(query: Record<string, string | undefined>) {
      const category = query.category as DrinkCategory | undefined;
      const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
      const result = await service.fetchCatalog({
        category,
        maxPriceCents: maxPrice,
      });
      return { status: 200, body: result };
    },
  };
}`,
  },
  {
    id: 'src/app.ts',
    name: 'app.ts',
    path: 'src/app.ts',
    category: 'entry',
    lineCount: 32,
    description: 'Сборка зависимостей приложения и инициализация роутеров.',
    imports: [
      'src/repositories/drinkRepository.ts',
      'src/services/drinkService.ts',
      'src/routes/drinks.ts',
    ],
    exports: ['createApp'],
    content: `import { DrinkRepository } from './repositories/drinkRepository';
import { DrinkService } from './services/drinkService';
import { createDrinksRouter } from './routes/drinks';

export function createApp() {
  const repository = new DrinkRepository();
  const service = new DrinkService(repository);
  const router = createDrinksRouter(service);

  return {
    repository,
    service,
    router,
  };
}`,
  },
  {
    id: 'src/main.ts',
    name: 'main.ts',
    path: 'src/main.ts',
    category: 'entry',
    lineCount: 20,
    description: 'Входная точка: запуск приложения с конфигурационными параметрами.',
    imports: ['src/app.ts', 'src/config.ts'],
    exports: ['bootstrap'],
    content: `import { createApp } from './app';
import { APP_CONFIG } from './config';

export function bootstrap() {
  const app = createApp();
  console.info(\`Drink catalog running on port \${APP_CONFIG.port}\`);
  return app;
}

bootstrap();`,
  },
];

export const DEMO_PROJECT_EDGES: DependencyEdge[] = [
  { id: 'e-main-app', source: 'src/main.ts', target: 'src/app.ts' },
  { id: 'e-main-config', source: 'src/main.ts', target: 'src/config.ts' },
  { id: 'e-app-repo', source: 'src/app.ts', target: 'src/repositories/drinkRepository.ts' },
  { id: 'e-app-service', source: 'src/app.ts', target: 'src/services/drinkService.ts' },
  { id: 'e-app-router', source: 'src/app.ts', target: 'src/routes/drinks.ts' },
  { id: 'e-router-service', source: 'src/routes/drinks.ts', target: 'src/services/drinkService.ts' },
  { id: 'e-router-types', source: 'src/routes/drinks.ts', target: 'src/types.ts' },
  { id: 'e-service-repo', source: 'src/services/drinkService.ts', target: 'src/repositories/drinkRepository.ts' },
  { id: 'e-service-types', source: 'src/services/drinkService.ts', target: 'src/types.ts' },
  { id: 'e-service-config', source: 'src/services/drinkService.ts', target: 'src/config.ts' },
  { id: 'e-repo-model', source: 'src/repositories/drinkRepository.ts', target: 'src/models/drink.ts' },
  { id: 'e-repo-types', source: 'src/repositories/drinkRepository.ts', target: 'src/types.ts' },
  { id: 'e-card-model', source: 'src/components/drinkCard.ts', target: 'src/models/drink.ts' },
  { id: 'e-card-util', source: 'src/components/drinkCard.ts', target: 'src/utils/normalize.ts' },
  { id: 'e-model-types', source: 'src/models/drink.ts', target: 'src/types.ts' },
  { id: 'e-model-util', source: 'src/models/drink.ts', target: 'src/utils/normalize.ts' },
];
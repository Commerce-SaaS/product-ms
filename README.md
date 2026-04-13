# 🧩 Product Microservice

A robust, scalable microservice built with **NestJS** and **TypeORM** that manages products, categories, ingredients, extras, and tags within a multi-tenant SaaS e-commerce platform. This service operates as a **message-driven microservice** using **RabbitMQ** for inter-service communication and **Redis** for caching and session management.

---

## 🏗️ Architecture

The Product Microservice follows a **layered architecture** with clear separation of concerns:

### Service Structure

```
Controller Layer
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (TypeORM)
    ↓
Database (PostgreSQL)
```

### Key Architectural Patterns

- **Message-Driven Architecture**: Uses NestJS Microservices with RabbitMQ transport for asynchronous, decoupled communication
- **Multi-Tenant Design**: All entities include `organizationId` to support multiple independent tenants
- **Soft Deletes**: Entities support soft deletion with `deletedAt` field for data recovery
- **Base Service Pattern**: Common CRUD operations abstracted in `BaseService` for code reusability
- **DTO Validation**: Global validation pipes with custom RPC exception handling
- **Module-Based Organization**: Feature modules (Products, Categories, Tags, etc.) for maintainability

### Communication Flow

```
External Service (API Gateway / Another Microservice)
    ↓
RabbitMQ Queue
    ↓
Message Listener (MessagePattern Decorators)
    ↓
Controller (Deserialization & Routing)
    ↓
Service (Business Logic)
    ↓
Repository (Data Persistence)
```

---

## ⚙️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **NestJS** | ^11.0.1 | Framework for microservices |
| **TypeORM** | ^0.3.25 | ORM for database operations |
| **PostgreSQL** | 8.16.3 | Primary database |
| **RabbitMQ** | N/A | Message broker |
| **Redis** | 5.8.0 | Caching & session management |
| **class-validator** | ^0.14.2 | DTO validation |
| **class-transformer** | ^0.5.1 | DTO transformation |
| **Zod** | ^3.25.76 | Environment variables validation |
| **TypeScript** | ^5.7.3 | Language |
| **Jest** | ^29.7.0 | Testing framework |
| **ESLint** | ^9.18.0 | Code linting |
| **Prettier** | ^3.4.2 | Code formatting |

---

## 📁 Project Structure

```
src/
├── app.module.ts                 # Root application module
├── main.ts                        # Entry point with RabbitMQ bootstrap
├── config/                        # Configuration management
│   ├── envs.ts                   # Environment variables (Zod validation)
│   ├── index.ts                  # Config exports
│   └── services.ts               # Service configuration
├── common/                        # Shared resources
│   ├── dto/                      # Common DTOs
│   │   ├── pagination.dto.ts     # Pagination parameters
│   │   └── find-one-by-org.dto.ts # Find by ID & org
│   ├── enums/                    # Global enums
│   │   ├── product-availability.enum.ts
│   │   └── order-status.enum.ts
│   ├── helpers/                  # Utility helpers
│   │   └── rpc-exception.helper.ts
│   ├── services/                 # Base/shared services
│   │   ├── base.service.ts       # Abstract CRUD operations
│   │   └── base.relations.service.ts
│   └── index.ts                  # Barrel exports
├── categories/                    # Categories module
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── categories.module.ts
│   ├── dto/
│   ├── entities/
│   └── patterns/
├── products/                      # Products module (core)
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   ├── paginationProduct.dto.ts
│   │   └── product-response.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── patterns/
│   │   └── product_patterns.ts
├── ingredients/                   # Ingredients module
│   ├── ingredients.controller.ts
│   ├── ingredients.service.ts
│   ├── ingredients.module.ts
│   ├── dto/
│   ├── entities/
│   └── patterns/
├── extras/                        # Extras/add-ons module
│   ├── extras.controller.ts
│   ├── extras.service.ts
│   ├── extras.module.ts
│   ├── dto/
│   ├── entities/
│   └── patterns/
├── tags/                          # Tags module
│   ├── tags.controller.ts
│   ├── tags.service.ts
│   ├── tags.module.ts
│   ├── dto/
│   ├── entities/
│   └── patterns/
├── product-ingredients/           # Product-Ingredient junction
│   ├── product-ingredients.controller.ts
│   ├── product-ingredients.service.ts
│   ├── product-ingredients.module.ts
│   ├── dto/
│   ├── entities/
│   └── patterns/
├── product-extras/                # Product-Extra junction
│   ├── product-extras.controller.ts
│   ├── product-extras.service.ts
│   ├── product-extras.module.ts
│   ├── dto/
│   ├── entities/
│   └── patterns/
├── product-tags/                  # Product-Tag junction
│   ├── product-tags.controller.ts
│   ├── product-tags.service.ts
│   ├── product-tags.module.ts
│   ├── dto/
│   ├── entities/
│   └── patterns/
├── redis/                         # Redis module
│   ├── redis.module.ts
│   └── providers/
│       └── redis.provider.ts
└── transports/                    # Transport configuration
    └── rabbitmq.module.ts         # RabbitMQ client setup
```

### Module Responsibilities

| Module | Responsibility |
|--------|-----------------|
| **Products** | Core product management (CRUD, availability status) |
| **Categories** | Product categorization |
| **Tags** | Product tagging system (e.g., "Spicy", "Vegan") |
| **Ingredients** | Base ingredient definitions |
| **Extras** | Add-on items (e.g., extra cheese, sauce) |
| **ProductIngredients** | Many-to-many relationship: Product → Ingredients |
| **ProductExtras** | Many-to-many relationship: Product → Extras |
| **ProductTags** | Many-to-many relationship: Product → Tags |
| **Redis** | Caching and session storage |
| **RabbitMQ** | Message transport and inter-service communication |

---

## 🔌 Environment Variables

All environment variables are validated using **Zod** schema in [src/config/envs.ts](src/config/envs.ts). Missing or invalid variables will cause startup failure with detailed error messages.

### Required Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| **NODE_ENV** | enum | N/A | Environment: `development`, `production`, or `test` |
| **PORT** | number | 3000 | Port for the microservice (informational, RabbitMQ handles transport) |
| **DB_HOST** | string | N/A | PostgreSQL host |
| **DB_PORT** | number | 5432 | PostgreSQL port |
| **POSTGRES_USER** | string | N/A | PostgreSQL username |
| **POSTGRES_PASSWORD** | string | N/A | PostgreSQL password |
| **POSTGRES_DB** | string | N/A | PostgreSQL database name |
| **RABBITMQ_URL** | string (URL) | N/A | RabbitMQ connection URL (must start with `amqp://`) |
| **RABBITMQ_QUEUE** | string | N/A | RabbitMQ queue name for this microservice |
| **REDIS_HOST** | string | N/A | Redis server host |
| **REDIS_PORT** | number | 6379 | Redis server port |

### Example `.env` File

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=product_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_QUEUE=product-queue
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Development Notes

- In **development** mode, TypeORM `synchronize: true` automatically creates/updates database schema
- In **production** mode, use database migrations for schema changes
- RabbitMQ URL must be a valid `amqp://` or `amqps://` URL
- All environment variables are **required** — no optional variables

---

## 🚀 Installation & Running

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **RabbitMQ** (latest)
- **Redis** (latest)

### Installation Steps

1. **Clone and Navigate**
   ```bash
   cd product-ms
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Copy example and configure
   cp .env.example .env
   # Edit .env with your database and RabbitMQ credentials
   ```

4. **Database Setup**
   ```bash
   # TypeORM will auto-sync schema in development mode
   # For production, run migrations (if available)
   ```

### Running the Service

#### Development Mode
```bash
npm run start:dev
```
Watches for file changes and auto-reloads the service.

#### Debug Mode
```bash
npm run start:debug
```
Starts the service with Node debugger enabled (port 9229).

#### Production Mode
```bash
npm run build
npm run start:prod
```

### Expected Startup Output
```
[Nest] 12345  - 04/13/2026, 10:30:45 AM     LOG [ProductMS-Main] Product Microservice is running on port 3000
```

---

## 📡 RPC Message Patterns

The microservice **does not expose HTTP endpoints**. Instead, it listens on RabbitMQ for specific message patterns. External services communicate via RabbitMQ client.

### Message Pattern Usage

To call a message pattern from another microservice:

```typescript
// From another NestJS microservice
this.client.send('pattern.name', payload).toPromise();
```

### Available Message Patterns

#### Products (Module: `products`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `product.create` | CREATE | `CreateProductDto` | Create a new product |
| `product.find_all` | READ | `PaginationProductDto` | List products with pagination |
| `product.find_one` | READ | `FindOneByOrgDto` | Get a single product |
| `product.update` | UPDATE | `UpdateProductDto` | Update product details |
| `product.delete` | DELETE | `FindOneByOrgDto` | Soft delete a product |
| `product.restore` | RESTORE | `FindOneByOrgDto` | Restore soft-deleted product |

#### Categories (Module: `categories`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `categories.create` | CREATE | `CreateCategoryDto` | Create a new category |
| `categories.findAll` | READ | `PaginationDto` | List categories |
| `categories.findOne` | READ | `FindOneByOrgDto` | Get a single category |
| `categories.update` | UPDATE | `UpdateCategoryDto` | Update category |
| `categories.delete` | DELETE | `FindOneByOrgDto` | Soft delete category |
| `categories.restore` | RESTORE | `FindOneByOrgDto` | Restore category |

#### Tags (Module: `tag`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `tag.create` | CREATE | `CreateTagDto` | Create a tag |
| `tag.find_all` | READ | `PaginationDto` | List tags |
| `tag.find_one` | READ | `FindOneByOrgDto` | Get a tag |
| `tag.update` | UPDATE | `UpdateTagDto` | Update tag |
| `tag.delete` | DELETE | `FindOneByOrgDto` | Soft delete tag |
| `tag.restore` | RESTORE | `FindOneByOrgDto` | Restore tag |

#### Ingredients (Module: `ingredient`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `ingredient.create` | CREATE | `CreateIngredientDto` | Create an ingredient |
| `ingredient.find_all` | READ | `PaginationDto` | List ingredients |
| `ingredient.find_one` | READ | `FindOneByOrgDto` | Get an ingredient |
| `ingredient.update` | UPDATE | `UpdateIngredientDto` | Update ingredient |
| `ingredient.delete` | DELETE | `FindOneByOrgDto` | Soft delete ingredient |
| `ingredient.restore` | RESTORE | `FindOneByOrgDto` | Restore ingredient |

#### Extras (Module: `extra`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `extra.create` | CREATE | `CreateExtraDto` | Create an extra/add-on |
| `extra.find_all` | READ | `PaginationDto` | List extras |
| `extra.find_one` | READ | `FindOneByOrgDto` | Get an extra |
| `extra.update` | UPDATE | `UpdateExtraDto` | Update extra |
| `extra.delete` | DELETE | `FindOneByOrgDto` | Soft delete extra |
| `extra.restore` | RESTORE | `FindOneByOrgDto` | Restore extra |

#### ProductTags (Module: `productTags`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `productTags.create` | CREATE | `CreateProductTagDto` | Link a tag to a product |
| `productTags.delete` | DELETE | `FindOneByOrgDto` | Remove tag from product |

#### ProductExtras (Module: `productExtras`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `productExtras.create` | CREATE | `CreateProductExtraDto` | Link an extra to a product |
| `productExtras.delete` | DELETE | `FindOneByOrgDto` | Remove extra from product |

#### ProductIngredients (Module: `productIngredients`)

| Pattern | Method | Payload | Description |
|---------|--------|---------|-------------|
| `productIngredients.create` | CREATE | `CreateProductIngredientDto` | Link an ingredient to a product |
| `productIngredients.delete` | DELETE | `FindOneByOrgDto` | Remove ingredient from product |

### Common Payload Examples

#### FindOneByOrgDto
```typescript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  withDeleted?: false
}
```

#### PaginationDto
```typescript
{
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  offset?: 0,
  limit?: 10,
  search?: "pasta",
  withDeleted?: false
}
```

#### CreateProductDto
```typescript
{
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  name: "Margherita Pizza",
  price: 12.50,
  stock: 100,
  availability: "AVAILABLE",
  description: "Classic pizza with tomato, mozzarella, and basil",
  imageUrl?: "https://...",
  imageKey?: "products/pizza-1",
  category?: "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 🔐 Security

### Multi-Tenancy

Every entity is scoped to an `organizationId` to ensure data isolation:

- **Database Level**: Unique composite indexes enforce tenant separation
- **Query Level**: All queries include `organizationId` filter
- **Validation**: `FindOneByOrgDto` ensures caller specifies organization

### Input Validation

#### Global Validation Pipe
- **Auto-whitelist**: Unknown properties rejected
- **Type coercion**: Automatic type conversion for numbers/booleans
- **Custom exceptions**: Validation errors formatted as RPC exceptions

#### DTO Validators
- `class-validator` decorators on all DTOs
- UUID validation for all IDs
- String length constraints
- Enum constraints for status fields
- Numeric range validation

### Error Handling

Custom `RpcExceptionHelper` provides:
- **Duplicate Detection**: Catches PostgreSQL `23505` errors (unique constraint violations)
- **Not Found**: Dedicated error for missing entities
- **Unauthorized**: Authentication guard errors
- **Validation**: Formatted validation error messages

### Soft Deletes

- Deleted entities remain in the database with `deletedAt` timestamp
- Queries exclude soft-deleted entities by default
- `withDeleted: true` in request allows including deleted records
- Restore operation clears `deletedAt` and sets `isActive: true`

---

## 🧠 Core Logic

### Product Management Flow

```mermaid
graph TD
    A["Create Product Request"] --> B["Validate Input<br/>(DTO Validation)"]
    B --> C["Check Duplicate<br/>(name + org)"]
    C -->|Found & Deleted| D["Restore Soft-Deleted"]
    C -->|Found & Active| E["Return Duplicate Error"]
    C -->|Not Found| F["Create New Product"]
    D --> G["Return Product"]
    F --> H["Save to Database"]
    H --> G
    E --> I["Return Error"]
```

### CRUD Operations Pattern

All entity services inherit from `BaseService` which implements:

1. **Create**: 
   - Validates inputs with DTOs
   - Checks for duplicates by name + organizationId
   - Restores soft-deleted records if found
   - Returns entity without internal fields (deletedAt, createdAt, updatedAt, organizationId)

2. **FindAll**:
   - Paginated results (offset, limit)
   - Optional full-text search on `name`
   - Organization-scoped queries
   - Toggle soft-deleted records inclusion

3. **FindOne**:
   - Retrieves by ID and organizationId
   - Validates entity exists
   - Returns complete entity

4. **Update**:
   - Partial updates via `UpdateDto`
   - Validates name uniqueness if changed
   - Timestamp auto-updated

5. **Delete** (Soft):
   - Sets `deletedAt` timestamp
   - Sets `isActive = false`
   - Entity remains queryable with `withDeleted: true`

6. **Restore**:
   - Clears `deletedAt`
   - Sets `isActive = true`

### Data Normalization

Response objects exclude sensitive/internal fields:
- ❌ `deletedAt`
- ❌ `createdAt`
- ❌ `updatedAt`
- ❌ `organizationId`

This is handled in `BaseService` before returning results.

---

## 🔄 Integrations

### RabbitMQ Integration

- **Transport**: Uses NestJS Microservices `Transport.RMQ`
- **Queue Settings**: Durable queues ensure message persistence
- **Connection**: Configured in [src/transports/rabbitmq.module.ts](src/transports/rabbitmq.module.ts)
- **Scalability**: Supports multiple service instances with Load balancing

### Redis Integration

- **Module**: Global Redis module in [src/redis/redis.module.ts](src/redis/redis.module.ts)
- **Provider**: IoRedis client for caching
- **Use Cases**: Session management, cache stores, rate limiting (future)
- **Configuration**: Credentials from environment variables

### PostgreSQL Integration

- **ORM**: TypeORM with automatic entity loading
- **Connection**: Pooling configured by TypeORM
- **Schema Sync**: Automatic in development, manual migrations in production
- **Soft Deletes**: Via `@DeleteDateColumn()` decorator

### Data Relationships

```
Product (1) ──→ (N) Category
Product (1) ──→ (N) ProductTag ──→ (N) Tag
Product (1) ──→ (N) ProductIngredient ──→ (N) Ingredient
Product (1) ──→ (N) ProductExtra ──→ (N) Extra
```

**Cascade Rules**:
- Deleting Product → Deletes related ProductTags, ProductIngredients, ProductExtras
- Deleting Tag/Ingredient/Extra → Soft-deleted (not cascaded)

---

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Test watch mode (re-run on changes)
npm run test:watch

# Test coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e

# Debug tests
npm run test:debug
```

### Test Configuration

- **Framework**: Jest
- **Root Directory**: `src/`
- **Test Pattern**: `**/*.spec.ts`
- **Coverage Directory**: `coverage/`
- **Environment**: Node.js

### Additional Notes

Currently, **no test files are included** in the repository. Developers should implement:
- Unit tests for services (business logic)
- Controller tests (message pattern handling)
- Integration tests (database operations)
- E2E tests (full workflow scenarios)

---

## 📌 Additional Notes

### Code Quality

- **Linting**: ESLint with TypeScript support
  ```bash
  npm run lint
  ```

- **Formatting**: Prettier for consistent code style
  ```bash
  npm run format
  ```

### Build & Deployment

- **Build**: TypeScript compilation to `/dist`
  ```bash
  npm run build
  ```

- **Production**: Run compiled JavaScript
  ```bash
  npm run start:prod
  ```

### Database Initialization

1. Ensure PostgreSQL is running
2. Create database:
   ```sql
   CREATE DATABASE product_db;
   ```

3. Start the service (TypeORM syncs schema in dev mode)

### Logging

- **Logger**: NestJS built-in logger
- **Levels**: Log, warn, error
- **Context**: Module/service name included in logs
- **Example**: `[ProductMS-Main] Product Microservice is running on port 3000`

### Performance Considerations

- **Pagination**: Implemented for large datasets (default: 10 items per page)
- **Eager Loading**: Related entities loaded with `eager: true`
- **Search**: Case-insensitive ILIKE query for product/category names
- **Indexes**: Composite indexes on (organizationId, name) for fast lookups

### Future Enhancements

Potential improvements for production:
- [ ] Redis caching layer for frequently accessed data
- [ ] Message queue dead-letter handling for failed messages
- [ ] Rate limiting via guards
- [ ] Comprehensive test coverage
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database migration system
- [ ] Audit logging for changes
- [ ] Performance monitoring integration

### Common Issues & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Service won't start | Invalid env vars | Check Zod validation output |
| Database connection fails | PostgreSQL not running | Start PostgreSQL, check credentials |
| RabbitMQ connection fails | Not running or wrong URL | Verify RabbitMQ is running, check RABBITMQ_URL |
| Duplicate entry error | Record exists | Use different name or restore soft-deleted |
| Message timeouts | Service overloaded | Scale instances, optimize queries |

---

## 📚 Related Documentation

- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [TypeORM Documentation](https://typeorm.io/)
- [RabbitMQ Official Guide](https://www.rabbitmq.com/documentation.html)
- [Redis Documentation](https://redis.io/documentation)

---

**Last Updated**: April 2026   
**License**: UNLICENSED

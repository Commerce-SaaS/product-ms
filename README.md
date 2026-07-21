# 📦 Product Microservice (`product-ms`)

A NestJS microservice responsible for managing the product catalog of the platform, including products, categories, tags, ingredients, extras, and their relationships.

The service communicates exclusively through RabbitMQ and serves as the central catalog management system for all organizations.

---

# 📋 Table of Contents

* Overview
* Architecture
* Features
* Tech Stack
* Getting Started
* Environment Variables
* RabbitMQ Patterns
* Product Catalog Structure
* Database Entities
* Caching
* Metrics & Observability
* Dependencies
* Development Notes

---

# 🚀 Overview

`product-ms` manages:

* Products
* Categories
* Tags
* Ingredients
* Extras
* Product relationships
* Catalog caching
* Catalog metrics

The service is fully organization-scoped and designed for multi-tenant restaurant and commerce platforms.

---

# 🏗️ Architecture

```text
                   ┌──────────────────┐
                   │   Client Gateway │
                   └────────┬─────────┘
                            │ RabbitMQ
                            ▼

┌─────────────────────────────────────────────┐
│                 product-ms                  │
├─────────────────────────────────────────────┤
│ Products                                    │
│ Categories                                  │
│ Tags                                        │
│ Ingredients                                 │
│ Extras                                      │
│ Catalog Relationships                       │
│ Cache Layer                                 │
│ Metrics                                     │
└──────┬───────────────┬───────────────┬──────┘
       │               │               │
       ▼               ▼               ▼
 PostgreSQL         Redis        Prometheus
```

---

# ✨ Features

* Product management
* Category management
* Tag management
* Ingredient management
* Extra management
* Product-to-tag relationships
* Product-to-ingredient relationships
* Product-to-extra relationships
* Redis caching
* Prometheus metrics
* Soft deletes
* Multi-tenant architecture

---

# 🛠 Tech Stack

| Category               | Technology      |
| ---------------------- | --------------- |
| Framework              | NestJS 11       |
| Language               | TypeScript 5    |
| Database               | PostgreSQL      |
| ORM                    | TypeORM         |
| Messaging              | RabbitMQ        |
| Cache                  | Redis           |
| Metrics                | Prometheus      |
| Validation             | class-validator |
| Environment Validation | Zod             |
| Testing                | Jest            |

---

# ⚙️ Getting Started

## Prerequisites

* Node.js 20+
* PostgreSQL
* RabbitMQ
* Redis

---

## Installation

```bash
npm install

cp .env.example .env

npm run start:dev
```

---

## Available Scripts

```bash
npm run build

npm run start:dev
npm run start:debug
npm run start:prod

npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

---

# 🌍 Environment Variables

| Variable          | Required | Description                                      |
| ----------------- | -------- | ------------------------------------------------ |
| NODE_ENV          | ✅        | Environment                                      |
| PORT              | ❌        | Logged only (not used for service communication) |
| DB_HOST           | ✅        | PostgreSQL host                                  |
| DB_PORT           | ❌        | PostgreSQL port                                  |
| POSTGRES_USER     | ✅        | Database user                                    |
| POSTGRES_PASSWORD | ✅        | Database password                                |
| POSTGRES_DB       | ✅        | Database name                                    |
| RABBITMQ_URL      | ✅        | RabbitMQ connection                              |
| RABBITMQ_QUEUE    | ✅        | Main queue                                       |
| REDIS_HOST        | ✅        | Redis host                                       |
| REDIS_PORT        | ❌        | Redis port                                       |
| REDIS_PASS        | ✅        | Redis password                                   |
| METRICS_PORT      | ❌        | Prometheus metrics server                        |

---

# 📨 RabbitMQ Patterns

## Products

| Pattern          |
| ---------------- |
| product.create   |
| product.find_all |
| product.find_one |
| product.update   |
| product.delete   |
| product.restore  |

---

## Categories

| Pattern            |
| ------------------ |
| categories.create  |
| categories.findAll |
| categories.findOne |
| categories.update  |
| categories.delete  |
| categories.restore |

---

## Tags

| Pattern      |
| ------------ |
| tag.create   |
| tag.find_all |
| tag.find_one |
| tag.update   |
| tag.delete   |
| tag.restore  |

---

## Ingredients

| Pattern             |
| ------------------- |
| ingredient.create   |
| ingredient.find_all |
| ingredient.find_one |
| ingredient.update   |
| ingredient.delete   |
| ingredient.restore  |

---

## Extras

| Pattern        |
| -------------- |
| extra.create   |
| extra.find_all |
| extra.find_one |
| extra.update   |
| extra.delete   |
| extra.restore  |

---

## Product Tags

| Pattern            |
| ------------------ |
| productTags.create |
| productTags.delete |

---

## Product Ingredients

| Pattern                   |
| ------------------------- |
| productIngredients.create |
| productIngredients.delete |

---

## Product Extras

| Pattern              |
| -------------------- |
| productExtras.create |
| productExtras.delete |

---

# 🍔 Product Catalog Structure

The catalog is built around products and their related entities.

```text
Category
   │
   ▼
Product
 ├── Tags
 ├── Ingredients
 └── Extras
```

Example:

```text
Pizza Margherita
│
├── Category: Pizza
├── Tags:
│     ├── Vegetarian
│     └── Bestseller
│
├── Ingredients:
│     ├── Mozzarella
│     ├── Tomato Sauce
│     └── Basil
│
└── Extras:
      ├── Extra Cheese
      └── Burrata
```

---

# 🗄 Database Entities

## Product

Represents a catalog item.

Main fields:

* organizationId
* categoryId
* name
* description
* price
* stock
* imageUrl
* availability
* isActive

---

## Category

Represents a group of products.

Examples:

```text
Pizzas
Burgers
Desserts
Drinks
```

Main fields:

* organizationId
* name

---

## Tag

Represents catalog labels.

Examples:

```text
Vegetarian
Vegan
Spicy
Bestseller
```

Main fields:

* organizationId
* categoryId
* name

---

## Ingredient

Represents product ingredients.

Examples:

```text
Tomato
Mozzarella
Chicken
Basil
```

Main fields:

* organizationId
* name

---

## Extra

Represents optional add-ons.

Examples:

```text
Extra Cheese
Burrata
Bacon
Double Meat
```

Main fields:

* organizationId
* name
* price

---

## ProductTag

Relationship:

```text
Product
   ↔
Tag
```

---

## ProductIngredient

Relationship:

```text
Product
   ↔
Ingredient
```

Additional field:

```text
quantity
```

---

## ProductExtra

Relationship:

```text
Product
   ↔
Extra
```

---

# 🧠 Caching

The service implements Redis-based catalog caching.

Cache format:

```text
cache:<entity>:<organizationId>:<id>
```

Examples:

```text
cache:product:org-1:123

cache:category:org-1:456

cache:product:org-1:list
```

Supported operations:

* Cache reads
* Cache writes
* Cache invalidation
* Versioning

Benefits:

* Faster catalog queries
* Reduced database load
* Better scalability

---

# 📊 Metrics & Observability

The service exposes Prometheus-compatible metrics.

Metrics endpoint:

```text
GET /metrics
```

Default port:

```text
9100
```

---

## Available Metrics

### Cache Metrics

```text
products_ms_cache_hits_total

products_ms_cache_misses_total
```

Tracks:

* Cache hit ratio
* Cache efficiency

---

### Database Metrics

```text
products_ms_db_query_duration_seconds
```

Tracks:

* Query duration
* Database performance
* Slow queries

---

### Node.js Metrics

Provided automatically through:

```text
collectDefaultMetrics()
```

Including:

* CPU usage
* Memory usage
* Event loop lag
* Garbage collection
* Process statistics

---

# 🔗 External Dependencies

## PostgreSQL

Stores:

* Products
* Categories
* Tags
* Ingredients
* Extras
* Relationship tables

---

## RabbitMQ

Handles:

* Product CRUD operations
* Catalog communication
* Service integration

The service consumes messages through the configured RabbitMQ queue.

---

## Redis

Used for:

* Catalog caching
* Cache invalidation
* Cache versioning

---

## Prometheus

Used for:

* Monitoring
* Metrics collection
* Performance analysis

---

# 🔄 Catalog Flow

```text
Create Product
       │
       ▼
Save to PostgreSQL
       │
       ▼
Invalidate Cache
       │
       ▼
Next Read Request
       │
       ▼
Cache Rebuild
       │
       ▼
Redis Storage
```

---

# 🏢 Multi-Tenant Architecture

All catalog entities are organization-scoped.

```text
Organization A
    ├── Products
    ├── Categories
    ├── Tags
    ├── Ingredients
    └── Extras

Organization B
    ├── Products
    ├── Categories
    ├── Tags
    ├── Ingredients
    └── Extras
```

This guarantees complete data isolation between tenants.

---

# ⚠️ Development Notes

## Current Limitations

### Unimplemented Relationship Patterns

The following constants exist but currently have no handlers:

```text
productTags.find_all
productTags.find_one
productTags.update

productExtras.find_all
productExtras.find_one
productExtras.update

productIngredients.find_all
productIngredients.find_one
productIngredients.update
```

---

### Environment Example

`.env.example` does not contain:

```text
REDIS_PASS
```

but the application requires it during startup validation.

---

### NATS Dependency

The repository includes:

```text
nats
```

as a dependency, but no active usage was found in the codebase.

---

### Docker Configuration

The Dockerfile exposes:

```text
4001
```

but the service itself communicates exclusively through RabbitMQ.

The only real HTTP listener is the Prometheus metrics server.

---

### Testing

Jest is configured, but no active test files are currently present in the repository.

---

# 📈 Service Scope

`product-ms` is the central catalog service of the platform.

Responsibilities include:

* Product catalog management
* Category management
* Ingredient management
* Extra management
* Product relationships
* Catalog caching
* Catalog observability

Every order, POS, menu, and storefront feature ultimately depends on data managed by `product-ms`.

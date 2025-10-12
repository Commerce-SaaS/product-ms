import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ExtrasModule } from './extras/extras.module';
import { ProductIngredientsModule } from './product-ingredients/product-ingredients.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,                                    
      port: envs.dbPort ?? 5432,
      username: envs.postgresUser,
      password: envs.postgresPassword,
      database: envs.postgresDb,
      autoLoadEntities: true, 
      synchronize: envs.nodeEnv === 'development',
    }),
    ProductsModule,
    CategoriesModule,
    TagsModule,
    IngredientsModule,
    ExtrasModule,
    ProductIngredientsModule,
    RedisModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

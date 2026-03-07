import { Test, TestingModule } from '@nestjs/testing';
import { ProductIngredientsService } from './product-ingredients.service';

describe('ProductIngredientsService', () => {
  let service: ProductIngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductIngredientsService],
    }).compile();

    service = module.get<ProductIngredientsService>(ProductIngredientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductIngredientsController } from './product-ingredients.controller';
import { ProductIngredientsService } from './product-ingredients.service';

describe('ProductIngredientsController', () => {
  let controller: ProductIngredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductIngredientsController],
      providers: [ProductIngredientsService],
    }).compile();

    controller = module.get<ProductIngredientsController>(ProductIngredientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

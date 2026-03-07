import { Test, TestingModule } from '@nestjs/testing';
import { ProductExtrasController } from './product-extras.controller';
import { ProductExtrasService } from './product-extras.service';

describe('ProductExtrasController', () => {
  let controller: ProductExtrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductExtrasController],
      providers: [ProductExtrasService],
    }).compile();

    controller = module.get<ProductExtrasController>(ProductExtrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

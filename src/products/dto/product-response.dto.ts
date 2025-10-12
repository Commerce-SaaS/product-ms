export class ProductIngredientResponseDto {
  id: string;
  name: string;
  quantity: number;
}

export class CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
}

export class TagResponseDto {
  id: string;
  name: string;
}

export class ProductResponseDto {
  id: string;
  name: string;
  price: number;
  availability: string;
  stock?: number | null;
  category: CategoryResponseDto | null;
  ingredients: ProductIngredientResponseDto[];
  tags: TagResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

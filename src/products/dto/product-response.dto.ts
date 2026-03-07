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

export class ProductExtraResponseDto {
  id: string;
  name: string;
  price: number;
}

export class ProductResponseDto {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  image: { url: string | null; key: string | null };
  availability: string;
  stock?: number | null;
  description?: string | null;
  category: CategoryResponseDto | null;
  ingredients: ProductIngredientResponseDto[];
  tags: TagResponseDto[];
  extras: ProductExtraResponseDto[];
}

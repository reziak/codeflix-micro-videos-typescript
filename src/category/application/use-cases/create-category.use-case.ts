import { Category } from "../../domain/entities/category";
import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutputDTO, CategoryOutputMapper } from "../dto/category-output";
import UseCase from "../../../@seedwork/application/use-case";

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
}

export type Output = CategoryOutputDTO;

export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}
  
  async execute(input: Input): Promise<Output> {
    const entity = new Category(input);
    await this.categoryRepo.insert(entity);
    return CategoryOutputMapper.toOutput(entity)
  }
}


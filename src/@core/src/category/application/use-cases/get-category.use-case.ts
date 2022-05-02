import { CategoryRepository } from "#category/domain/repository/category.repository";
import { CategoryOutputDTO, CategoryOutputMapper } from "../dto/category-output";
import { UseCase as DefaultUseCase } from "#seedwork/application/use-case";

export namespace GetCategoryUseCase {
  export type Input = {
    id: string;
  }
  
  export type Output = CategoryOutputDTO;
  
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}
    
    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepo.findById(input.id);
      return CategoryOutputMapper.toOutput(entity)
    }
  }
}

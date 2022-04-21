import { CategoryRepository } from "../../domain/repository/category.repository";
import { CategoryOutputDTO, CategoryOutputMapper } from "../dto/category-output";
import UseCase from "../../../@seedwork/application/use-case";

export type Input = {
  id: string;
}

export type Output = CategoryOutputDTO;

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}
  
  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id);
    return CategoryOutputMapper.toOutput(entity)
  }
}


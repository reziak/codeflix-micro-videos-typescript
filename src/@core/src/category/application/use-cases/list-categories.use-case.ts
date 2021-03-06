import { CategoryRepository } from "#category/domain/repository/category.repository";
import { 
  CategoryOutputDTO, 
  CategoryOutputMapper 
} from "../dto/category-output";
import { UseCase as DefaultUseCase } from "#seedwork/application/use-case";
import { SearchInputDTO } from "#seedwork/application/dto/search-input";
import { 
  PaginationOutputDTO, 
  PaginationOutputMapper 
} from "#seedwork/application/dto/pagination-output";

export namespace ListCategoriesUseCase {
  export type Input = SearchInputDTO;
  
  export type Output = PaginationOutputDTO<CategoryOutputDTO>
  
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}
    
    async execute(input: Input): Promise<Output> {
      const params = new CategoryRepository.SearchParams(input)
      const searchResult = await this.categoryRepo.search(params);
      return this.toOutput(searchResult);
    }
  
    private toOutput(searchResult: CategoryRepository.SearchResult): Output {
      return {
        items: searchResult.items.map(i => CategoryOutputMapper.toOutput(i)),
        ...PaginationOutputMapper.toOutput(searchResult)
      }
    }
  }
}


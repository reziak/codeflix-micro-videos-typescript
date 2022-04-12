import { SearchableRepository } from "../../../@seedwork/domain/repository/repository-contracts";
import { Category } from "../entities/category";

export default interface CategoryRepository 
  extends SearchableRepository<Category, any, any> {}
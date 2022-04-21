import { CreateCategoryUseCase } from "../create-category.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it("should create a category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");

    let output = await useCase.execute({ name: "valid" });
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "valid",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    
    output = await useCase.execute({ 
      name: "valid", 
      description: "valid description",
      is_active: false,
    });
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: "valid",
      description: "valid description",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
  });
});
import { GetCategoryUseCase } from "../get-category.use-case";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { Category } from "#category/domain/entities/category";

describe("GetCategoryUseCase Unit Tests", () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it("should thrown an error when category not found", async () => {
    expect(() => useCase.execute({ id: 'fake_id' }))
      .rejects.toThrow(new NotFoundError(`Entity not found using ID fake_id.`))
  });

  it("should return a category", async () => {
    const items = [
      new Category({ name: "valid" })
    ];

    repository.items = items;
    const spyFindByID = jest.spyOn(repository, "findById");
    const output = await useCase.execute({ id: repository.items[0].id });
    expect(spyFindByID).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: repository.items[0].name,
      description: repository.items[0].description,
      is_active: repository.items[0].is_active,
      created_at: repository.items[0].created_at,
    });
  });
});
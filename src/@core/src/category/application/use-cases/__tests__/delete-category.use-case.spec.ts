import { DeleteCategoryUseCase } from "../delete-category.use-case";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { Category } from "#category/domain/entities/category";

describe("DeleteCategoryUseCase Unit Tests", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should thrown an error when category not found", async () => {
    expect(() => useCase.execute({ id: 'fake_id' }))
      .rejects.toThrow(new NotFoundError(`Entity not found using ID fake_id.`))
  });

  it("should delete a category", async () => {
    const items = [
      new Category({ name: "valid" })
    ];

    repository.items = items;
    await useCase.execute({ id: repository.items[0].id });
    expect(repository.items).toStrictEqual([]);
  });
});
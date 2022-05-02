import { UpdateCategoryUseCase } from "../update-category.use-case";
import CategoryInMemoryRepository from "#category/infra/repository/category-in-memory.repository";
import { Category } from "#category/domain/entities/category";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it("should thrown an error when category not found", async () => {
    const item = { id: "fake_id", name: "fake name" };
    expect(() => useCase.execute(item))
      .rejects.toThrow(new NotFoundError(`Entity not found using ID fake_id.`))
  });
  
  it("should update a category", async () => {
    const item = new Category({ name: "valid before", description: "description before"});
    repository.items = [item];

    const spyUpdate = jest.spyOn(repository, "update");

    type Arrange = {
      input: { 
        id: string, 
        name: string, 
        description?: string | null, 
        is_active?: boolean | null 
      },
      output: { 
        id: string, 
        name: string, 
        description: string | null, 
        is_active: boolean | null, 
        created_at: Date 
      }
    }

    const arrange: Arrange[] = [
      { 
        input: {
          id: repository.items[0].id,
          name: "valid after", 
          description: "description after", 
        },
        output: {
          id: repository.items[0].id,
          name: "valid after",
          description: "description after",
          is_active: true,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: repository.items[0].id,
          name: "valid after after",
          description: "description after after",
          is_active: false,
        },
        output: {
          id: repository.items[0].id,
          name: "valid after after",
          description: "description after after",
          is_active: false,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: repository.items[0].id,
          name: "valid before after",
          is_active: true,
        },
        output: {
          id: repository.items[0].id,
          name: "valid before after",
          description: null,
          is_active: true,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: repository.items[0].id,
          name: "valid last",
          description: "new description",
          is_active: true,
        },
        output: {
          id: repository.items[0].id,
          name: "valid last",
          description: "new description",
          is_active: true,
          created_at: repository.items[0].created_at,
        }
      },
    ];

    for (const i of arrange) {
      const output = await useCase.execute({
        id: repository.items[0].id,
        name: i.input.name,
        description: i.input.description,
        is_active: i.input.is_active,
      });
      expect(output).toStrictEqual({
        id: i.output.id,
        name: i.output.name,
        description: i.output.description,
        is_active: i.output.is_active,
        created_at: i.output.created_at,
      });
    }
    expect(spyUpdate).toHaveBeenCalledTimes(arrange.length);
  });
});
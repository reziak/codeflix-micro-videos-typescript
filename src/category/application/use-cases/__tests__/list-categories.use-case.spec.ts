import { ListCategoriesUseCase } from "../list-categories.use-case";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import { Category } from "../../../domain/entities/category";
import { CategoryRepository } from "../../../domain/repository/category.repository";

describe("ListCategoriesUseCase Unit Tests", () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase(repository);
  });

  test("toOutput method", () => {
    let searchResult = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null
    });
    let output = useCase["toOutput"](searchResult);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2
    });
    
    const category = new Category({ name: "valid" });
    searchResult = new CategoryRepository.SearchResult({
      items: [category],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null
    });
    output = useCase["toOutput"](searchResult);
    expect(output).toStrictEqual({
      items: [category.toJSON()],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2
    });
  });

  it("should return categories sorted by created_at (default)", async () => {
    const created_at = new Date();
    const categories = [
      new Category({ name: "Valid 1", created_at }),
      new Category({ name: "Valid 2", created_at: new Date(created_at.getTime() * 100) }),
      new Category({ name: "Valid 3", created_at: new Date(created_at.getTime() * 200) }),
    ];
    repository.items = categories;
    
    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...categories].reverse().map(i => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should return category using pagination, sort and filter", async () =>{
    const categories = [
      new Category({ name: "Valid A" }),
      new Category({ name: "VALID" }),
      new Category({ name: "Invalid" }),
      new Category({ name: "Fake" }),
      new Category({ name: "FAKE" }),
      new Category({ name: "cake" }),
      new Category({ name: "PewPew" }),
    ];
    repository.items = categories;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "val",
    });
    expect(output).toStrictEqual({
      items: [categories[2].toJSON(), categories[1].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
    
    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "val",
    });
    expect(output).toStrictEqual({
      items: [categories[2].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
    
    output = await useCase.execute({
      page: 1,
      sort: "name",
      filter: "e",
    });
    expect(output).toStrictEqual({
      items: [
        categories[4].toJSON(), 
        categories[3].toJSON(), 
        categories[6].toJSON(), 
        categories[5].toJSON()
      ],
      total: 4,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });
});
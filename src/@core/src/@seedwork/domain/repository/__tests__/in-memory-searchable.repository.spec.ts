import Entity from "#seedwork/domain/entity/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";
import { SearchParams, SearchResult } from "../repository-contracts";

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository 
  extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(
    items: StubEntity[], 
    filter: string | null
  ): Promise<StubEntity[]> {
      if(!filter) {
        return items;
      }

      return items.filter(i => {
        return(i.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.props.price.toString() === filter);
      });
  }
}

describe("InMemorySearchableRepository Unit Tests", () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe("applyFilter method", () => {
    it("should return original items when there is no filter", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10}),
        new StubEntity({ name: "item 2", price: 15}),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      const filteredItems= await repository['applyFilter'](items, null);
      expect(filteredItems).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      const items = [
        new StubEntity({ name: "valid", price: 10}),
        new StubEntity({ name: "VALID", price: 15}),
        new StubEntity({ name: "another", price: 15}),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter" as any);
      let filteredItems= await repository['applyFilter'](items, "VALID");
      expect(filteredItems).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      
      filteredItems= await repository['applyFilter'](items, "15");
      expect(filteredItems).toStrictEqual([items[1], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
      
      filteredItems= await repository['applyFilter'](items, "this one");
      expect(filteredItems).toStrictEqual([]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });
  
  describe("applySort method", () => {
    it("should not sort if there is no sort or unsortable field", async () => {
      const items = [
        new StubEntity({ name: "item c", price: 15}),
        new StubEntity({ name: "item a", price: 10}),
        new StubEntity({ name: "item b", price: 20}),
      ];
      let sortedItems= await repository['applySort'](items, null, null);
      expect(sortedItems).toStrictEqual(items);
      
      sortedItems= await repository['applySort'](items, "price", null);
      expect(sortedItems).toStrictEqual(items);
    });

    it("should sort the items", async () => {
      const items = [
        new StubEntity({ name: "item c", price: 15}),
        new StubEntity({ name: "item a", price: 10}),
        new StubEntity({ name: "item b", price: 20}),
      ];
      
      let sortedItems= await repository['applySort'](items, "name", "asc");
      expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

      sortedItems= await repository['applySort'](items, "name", "desc");
      expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);
    });
  });
  
  describe("applyPaginate method", () => {
    it("should paginate items", async () => {
      const items = [
        new StubEntity({ name: "item a", price: 15}),
        new StubEntity({ name: "item b", price: 10}),
        new StubEntity({ name: "item c", price: 20}),
        new StubEntity({ name: "item d", price: 69}),
        new StubEntity({ name: "item e", price: 42}),
        new StubEntity({ name: "item f", price: 75}),
        new StubEntity({ name: "item g", price: 21}),
        new StubEntity({ name: "item h", price: 25}),
      ];
      
      let paginatedItems= await repository['applyPaginate'](items, 1, 2);
      expect(paginatedItems).toStrictEqual([items[0], items[1]]);
      
      paginatedItems= await repository['applyPaginate'](items, 2, 3);
      expect(paginatedItems).toStrictEqual([items[3], items[4], items[5]]);
      
      paginatedItems= await repository['applyPaginate'](items, 2, 3);
      expect(paginatedItems).toStrictEqual([items[3], items[4], items[5]]);
      
      paginatedItems= await repository['applyPaginate'](items, 4, 3);
      expect(paginatedItems).toStrictEqual([]);
      
      paginatedItems= await repository['applyPaginate'](items, 1, 15);
      expect(paginatedItems).toStrictEqual(items);
    });
  });
  
  describe("search method", () => {
    it("should apply only paginate if other params are null", async () => {
      const entity = new StubEntity({ name: "item f", price: 25});
      const items = Array(16).fill(entity);
      repository.items = items;
      
      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null,
        })
      );
    });
    
    it("should apply paginate and filter", async () => {
      const items = [
        new StubEntity({ name: "test j", price: 15}),
        new StubEntity({ name: "TEST e", price: 10}),
        new StubEntity({ name: "ITEM h", price: 20}),
        new StubEntity({ name: "item b", price: 69}),
        new StubEntity({ name: "ITEM i", price: 42}),
        new StubEntity({ name: "item a", price: 75}),
        new StubEntity({ name: "tEST c", price: 21}),
        new StubEntity({ name: "item f", price: 25}),
        new StubEntity({ name: "item d", price: 12}),
        new StubEntity({ name: "Item Test g", price: 15}),
      ];
      repository.items = items;
      
      let result = await repository.search(
        new SearchParams({
          page: 2,
          per_page: 3,
          filter: "item",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[5], items[7], items[8]],
          total: 7,
          current_page: 2,
          per_page: 3,
          sort: null,
          sort_dir: null,
          filter: "item",
        })
      );
      
      result = await repository.search(
        new SearchParams({
          page: 3,
          per_page: 3,
          filter: "item",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[9]],
          total: 7,
          current_page: 3,
          per_page: 3,
          sort: null,
          sort_dir: null,
          filter: "item",
        })
      );
    });
    
    it("should apply paginate and sort", async () => {
      const items = [
        new StubEntity({ name: "test j", price: 15}),
        new StubEntity({ name: "TEST e", price: 10}),
        new StubEntity({ name: "ITEM h", price: 20}),
        new StubEntity({ name: "item b", price: 69}),
        new StubEntity({ name: "ITEM i", price: 42}),
        new StubEntity({ name: "item a", price: 75}),
        new StubEntity({ name: "tEST c", price: 21}),
        new StubEntity({ name: "item f", price: 25}),
        new StubEntity({ name: "item d", price: 12}),
        new StubEntity({ name: "Item Test g", price: 15}),
      ];
      repository.items = items;
      
      let result = await repository.search(
        new SearchParams({
          page: 1,
          per_page: 3,
          sort: "name",
          sort_dir: "asc",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[2], items[4], items[9]],
          total: 10,
          current_page: 1,
          per_page: 3,
          sort: "name",
          sort_dir: "asc",
          filter: null,
        })
      );
      
      result = await repository.search(
        new SearchParams({
          page: 4,
          per_page: 3,
          sort: "name",
          sort_dir: "desc",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[2]],
          total: 10,
          current_page: 4,
          per_page: 3,
          sort: "name",
          sort_dir: "desc",
          filter: null,
        })
      );
    });
    
    it("should apply filter, sort and paginate", async () => {
      const items = [
        new StubEntity({ name: "test j", price: 15}),
        new StubEntity({ name: "TEST e", price: 10}),
        new StubEntity({ name: "ITEM h", price: 20}),
        new StubEntity({ name: "item b", price: 69}),
        new StubEntity({ name: "ITEM i", price: 42}),
        new StubEntity({ name: "item a", price: 75}),
        new StubEntity({ name: "tEST c", price: 21}),
        new StubEntity({ name: "item f", price: 25}),
        new StubEntity({ name: "item d", price: 12}),
        new StubEntity({ name: "Item Test g", price: 15}),
      ];
      repository.items = items;
      
      let result = await repository.search(
        new SearchParams({
          page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: "item",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[2], items[4]],
          total: 7,
          current_page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: "item",
        })
      );
      
      result = await repository.search(
        new SearchParams({
          page: 3,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: "item",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3], items[8]],
          total: 7,
          current_page: 3,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: "item",
        })
      );
      
      result = await repository.search(
        new SearchParams({
          page: 4,
          per_page: 2,
          sort: "name",
          sort_dir: "desc",
          filter: "item",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[2]],
          total: 7,
          current_page: 4,
          per_page: 2,
          sort: "name",
          sort_dir: "desc",
          filter: "item",
        })
      );

    });
  });
});
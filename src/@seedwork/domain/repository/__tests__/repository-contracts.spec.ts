import { SearchParams, SearchResult } from '../repository-contracts';

describe("SearchParams Unit Tests", () => {
  test("page prop", () => {
    const params = new SearchParams();
    expect(params.page).toBe(1);

    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: "", expected: 1 },
      { page: "fake", expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: {}, expected: 1 },

      { page: 1, expected: 1 },
      { page: 5, expected: 5 },
    ];

    arrange.forEach(i => {
      expect(new SearchParams({ page: i.page as any }).page).toBe(i.expected)
    });
  });
  
  test("per page prop", () => {
    const params = new SearchParams();
    expect(params.per_page).toBe(15);

    const arrange = [
      { per_page: null, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: "", expected: 15 },
      { per_page: "fake", expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: 5.5, expected: 15 },
      { per_page: {}, expected: 15 },

      { per_page: 1, expected: 1 },
      { per_page: 5, expected: 5 },
    ];

    arrange.forEach(i => {
      expect(new SearchParams({ per_page: i.per_page as any }).per_page).toBe(i.expected)
    });
  });
  
  test("sort prop", () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: "", expected: null },

      { sort: "field", expected: "field" },
      { sort: 0, expected: "0" },
      { sort: -1, expected: "-1" },
      { sort: 5.5, expected: "5.5" },
      { sort: true, expected: "true" },
      { sort: false, expected: "false" },
      { sort: {}, expected: "[object Object]" },
    ];

    arrange.forEach(i => {
      expect(new SearchParams({ sort: i.sort as any }).sort).toBe(i.expected)
    });
  });
  
  test("sort_dir prop", () => {
    const params = new SearchParams();
    expect(params.sort_dir).toBeNull();

    const arrange = [
      { sort: null, sort_dir: null, expected: null },
      { sort: null, sort_dir: undefined, expected: null },
      { sort: null, sort_dir: "", expected: null },
      
      { sort: "field", sort_dir: "", expected: 'asc' },
      { sort: "field", sort_dir: "field", expected: "asc" },
      { sort: "field", sort_dir: 0, expected: "asc" },
      { sort: "field", sort_dir: "fake", expected: "asc" },
      { sort: "field", sort_dir: true, expected: "asc" },
      { sort: "field", sort_dir: false, expected: "asc" },
      { sort: "field", sort_dir: "ASC", expected: "asc" },
      { sort: "field", sort_dir: "asc", expected: "asc" },
      { sort: "field", sort_dir: "DESC", expected: "desc" },
      { sort: "field", sort_dir: "desc", expected: "desc" },
    ];

    arrange.forEach(i => {
      console.log(i);
      expect(new SearchParams({sort: i.sort, sort_dir: i.sort_dir as any }).sort_dir).toBe(i.expected)
    });
  });

  test("filter prop", () => {
    const params = new SearchParams();
    expect(params.filter).toBeNull();

    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: "", expected: null },
      { filter: "filter", expected: "filter" },
      { filter: 0, expected: "0" },
      { filter: "-1", expected: "-1" },
      { filter: true, expected: "true" },
      { filter: false, expected: "false" },
      { filter: 5.5, expected: "5.5" },
      { filter: {}, expected: "[object Object]" },
    ];

    arrange.forEach(i => {
      expect(new SearchParams({ filter: i.filter as any }).filter).toBe(i.expected)
    });
  });
});

describe("SearchResult unit tests", () => {
  test("constructor props", () => {
    const arrange = [
      {
        obj: {
          items: ["entity1", "entity2"] as any,
          total: 4,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: null,
        },
        last_page: 2
      },
      {
        obj: {
          items: ["entity1", "entity2"] as any,
          total: 8,
          current_page: 2,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: "test",
        },
        last_page: 4
      },
      {
        obj: {
          items: ["entity1", "entity2"] as any,
          total: 5,
          current_page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: null,
        },
        last_page: 3
      },
      {
        obj: {
          items: ["entity1", "entity2", "entity3", "entity4"] as any,
          total: 4,
          current_page: 1,
          per_page: 8,
          sort: "name",
          sort_dir: "asc",
          filter: null,
        },
        last_page: 1
      },
    ]
    arrange.forEach(i => {
      const result = new SearchResult(i.obj);
      expect(result.toJSON()).toStrictEqual({...i.obj, last_page: i.last_page});
    });

  });
})
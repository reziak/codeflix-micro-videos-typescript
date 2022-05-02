import { PaginationOutputMapper } from "./pagination-output";
import { SearchResult } from "#seedwork/domain/repository/repository-contracts";

describe("PaginationOutputMapper Unit test", () => {
  it("should convert a SearchResult into output", () => {
    const searchResult = new SearchResult({
      items: ['invalid'] as any,
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'fake',
    });
    const output = PaginationOutputMapper.toOutput(searchResult);
    expect(output).toStrictEqual({
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });
});
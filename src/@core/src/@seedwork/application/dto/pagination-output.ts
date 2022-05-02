import { SearchResult } from "#seedwork/domain/repository/repository-contracts"

export type PaginationOutputDTO<Items = any> = {
  items: Items[],
  total: number,
  current_page: number,
  last_page: number,
  per_page: number
}

export class PaginationOutputMapper {
  static toOutput(result: SearchResult): Omit<PaginationOutputDTO, "items"> {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page
    }
  }
}
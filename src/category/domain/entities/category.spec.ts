import { Category } from './category';

describe("Category tests", () =>{
  test('constructor', () => {
    const category = new Category('Movie');
    expect(category.name).toBe('Movie');
  })
});
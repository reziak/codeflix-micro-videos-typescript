import { CategoryOutputMapper } from "./category-output";
import { Category } from "../../domain/entities/category";

describe("CategoryOutputMapper Unit test", () => {
  it("should convert a category into output", () => {
    const created_at = new Date()
    const entity = new Category({ 
      name: "valid",
      description: "valid description",
      is_active: true,
      created_at,
    });
    const spyToJson = jest.spyOn(entity, "toJSON");
    const output = CategoryOutputMapper.toOutput(entity);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at,
    });
    expect(spyToJson).toHaveBeenCalledTimes(1);
  });
});
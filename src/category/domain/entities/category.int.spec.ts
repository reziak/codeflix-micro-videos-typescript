import { Category } from "./category";
describe("Category integration tests", () => {
  describe("create method", () =>{
    it("should be invalid when creating a category using name", () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => new Category({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () => new Category({ name: "t".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
    
    it("should be invalid when creating a category with wrong description", () => {
      expect(() => new Category({ description: 5 } as any)).containsErrorMessages({
        description: ["description must be a string"]
      });
    });
    
    it("should be invalid when creating a category with wrong is_active", () => {
      expect(() => new Category({ is_active: 1 } as any)).containsErrorMessages({
        is_active: ["is_active must be a boolean value"]
      });
    });

    it("should create a valid category", () => {
      expect.assertions(0);
      new Category({ name: "valid" }); //NOSONAR
      new Category({ name: "valid", description: "valid description" }); //NOSONAR
      new Category({ name: "valid", description: null }); //NOSONAR
      new Category({ name: "valid", description: "valid description", is_active: false }); // NOSONAR
      new Category({ name: "valid", description: null, is_active: true }); // NOSONAR
    });
  });

  describe("update method", () => {
    it("should be invalid when updating a category using name", () => {
      const category = new Category({ name: "valid" });
      expect(() => category.update(null, null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => category.update("", null)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => category.update(5 as any, null)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        category.update("t".repeat(256), null)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
    
    it("should be invalid when updating a category with wrong description", () => {
      const category = new Category({ name: "valid" });
      expect(() => category.update(null, 5 as any)).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should update a valid category", () => {
      expect.assertions(0);
      const category = new Category({ name: "valid" }); 
      category.update("valid", "valid description"); 
      category.update("valid", null);
    });
  });
});
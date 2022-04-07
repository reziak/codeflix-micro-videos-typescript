import CategoryValidatorFactory, { 
  CategoryRules, 
  CategoryValidator 
} from './category.validator';

describe("CategoryValidator Tests", () => {
  let validator: CategoryValidator;

  beforeEach(() => (validator = CategoryValidatorFactory.create()));

  test("invalid cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters"
      ]
    });
    
    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters"
      ]
    });
    
    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: [
        "name should not be empty"
      ]
    });
    
    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters"
      ]
    });
    
    expect({ validator, data: { name: "t".repeat(256) } }).containsErrorMessages({
      name: [
        "name must be shorter than or equal to 255 characters"
      ]
    });
  });

  test("invalid case for description", () => {
    expect({ validator, data: { name: "valid", description: 5 }}).containsErrorMessages({
      description: [
        "description must be a string"
      ]
    });
  });
  
  test("invalid case for is_active", () => {
    expect({ validator, data: { name: "valid", is_active: "true" }}).containsErrorMessages({
      is_active: [
        "is_active must be a boolean value"
      ]
    });
    
    expect({ validator, data: { name: "valid", is_active: 0 }}).containsErrorMessages({
      is_active: [
        "is_active must be a boolean value"
      ]
    });
    
    expect({ validator, data: { name: "valid", is_active: 1 }}).containsErrorMessages({
      is_active: [
        "is_active must be a boolean value"
      ]
    });
  });

  test("valid cases for fields", () => {
    const arrange = [
      { name: "valid" },
      { name: "valid", description: undefined as any },
      { name: "valid", description: null as any },
      { name: "valid", is_active: true },
      { name: "valid", is_active: false },
      { name: "valid", description: "valid description", is_active: false },
    ];

    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
    });
  });
});
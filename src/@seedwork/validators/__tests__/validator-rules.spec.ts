import ValidatorRules from "../validator-rules";

type ValidationFields = {
  value: any;
  property: string;
  errMsg: string;
}[]

describe("ValidatorRules unit test", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation rule", () => {
    let arrange: ValidationFields = [
      { value: null, property: 'field', errMsg: 'The field is required' },
      { value: undefined, property: 'field', errMsg: 'The field is required' },
      { value: "", property: 'field', errMsg: 'The field is required' },
    ];

    arrange.forEach(t => {
      expect(() => {
        ValidatorRules.values(t.value, t.property).required();
      }).toThrow(t.errMsg);
    });

    arrange = [
      { value: 'value', property: 'field', errMsg: 'The field is required' },
      { value: 5, property: 'field', errMsg: 'The field is required' },
      { value: 0, property: 'field', errMsg: 'The field is required' },
      { value: true, property: 'field', errMsg: 'The field is required' },
    ];

    arrange.forEach(t => {
      expect(() => {
        ValidatorRules.values(t.value, t.property).required();
      }).not.toThrow(t.errMsg)
    });
  });
});
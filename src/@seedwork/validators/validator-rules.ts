import ValidationError from "../errors/validation-error";

export default class ValidatorRules {
  private constructor(private value: any, private property: string) {}

  static values(value: any, property: string) {
    return new ValidatorRules(value, property);
  }

  required(): this {
    if(this.value === null || this.value === undefined || this.value === "") {
      throw new ValidationError(`The ${this.property} is required.`);
    }
    return this;
  }

  string(): this {
    if(typeof this.value !== "string") {
      throw new ValidationError(`${this.property} must be a string.`);
    }
    return this;
  }

  maxLenght(_max: number): this {
    if(this.value.length > _max) {
      throw new ValidationError(`${this.property} exceeds the maximum lenght of ${_max}.`);
    }
    return this;
  }
}
import { validate as uuidvalidate } from 'uuid';
import InvalidUuidError from '../../errors/invalid-uuid.error';
import UniqueEntityId from '../unique-entity-id.vo';

describe("UniqueEntityId unit tests", () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');
  // This would be used if the jestConfig option clearMock was false
  // beforeEach(() => validateSpy.mockClear())

  it('should throw error when uuid is invalid', () => {
    expect(() => new UniqueEntityId('fake-id')).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a uuid passed in constructor', () => {
    const uuid = "98e55e25-bf1d-43d4-8ec2-e24ebef3b9cb";
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });
  
  it('should create a uuid without a uuiid passed to the constructor', () => {
    const vo = new UniqueEntityId();
    expect(uuidvalidate(vo.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
import Entity from '../entity/entity';
import NotFoundError from '../errors/not-found.error';
import UniqueEntityId from '../value-object/unique-entity-id.vo';
import InMemoryRepository from './in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("in memory repository unit tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository()
  });

  it("should insert new entity", async () => {
    const item = new StubEntity({ name: "valid", price: 10 });
    await repository.insert(item);

    expect(item.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throw error for item not found", () => {
    expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake id.")
    );

    expect(repository.findById(new UniqueEntityId("98e55e25-bf1d-43d4-8ec2-e24ebef3b9cb")))
      .rejects.toThrow(
        new NotFoundError("Entity not found using ID 98e55e25-bf1d-43d4-8ec2-e24ebef3b9cb."
      )
    );
  });

  it("should find an item by id", async () => {
    const item = new StubEntity({ name: "valid", price: 10 });
    await repository.insert(item);

    let itemFound = await repository.findById(item.id);
    expect(item.toJSON()).toStrictEqual(itemFound.toJSON());
    
    itemFound = await repository.findById(item.uniqueEntityId);
    expect(item.toJSON()).toStrictEqual(itemFound.toJSON());
  });
  
  it("should find all items", async () => {
    const item = new StubEntity({ name: "valid", price: 10 });
    await repository.insert(item);

    const itemsFound = await repository.findAll();
    expect(itemsFound).toStrictEqual([item]);
  });
  
  it("should throw an error on update when not found", async () => {
    const item = new StubEntity({ name: "valid", price: 10 });
    expect(repository.update(item)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${ item.id }.`)
    );
  });

  it("should update an item", async () => {
    const item = new StubEntity({ name: "valid", price: 10 });
    await repository.insert(item);

    const updated = new StubEntity(
      { name: "after", price: 69 }, 
      item.uniqueEntityId
    );
    await repository.update(updated);

    expect(repository.items[0].toJSON()).toStrictEqual(updated.toJSON());
  });

  it("should throw an error on delete when not found", async () => {
    expect(repository.delete('fake id')).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake id.")
    );

    expect(repository.delete(new UniqueEntityId("98e55e25-bf1d-43d4-8ec2-e24ebef3b9cb")))
      .rejects.toThrow(
        new NotFoundError("Entity not found using ID 98e55e25-bf1d-43d4-8ec2-e24ebef3b9cb."
      )
    );
  });
  
  it("should delete a item", async () => {
    let item = new StubEntity({ name: "valid", price: 10 });
    await repository.insert(item);
    await repository.delete(item.id);
    expect(repository.items).toHaveLength(0);
    
    await repository.insert(item);
    await repository.delete(item.uniqueEntityId);
    expect(repository.items).toHaveLength(0);
  });
});
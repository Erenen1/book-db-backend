import { Model, ModelCtor, WhereOptions } from 'sequelize';

export class BaseRepository<T extends Model> {
  private model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data as any);
  }

  async findById(id: number, options = {}): Promise<T | null> {
    return await this.model.findByPk(id, options);
  }

  async findAll(options = {}): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async update(id: number, data: Partial<T>): Promise<[number, T[]]> {
    return await this.model.update(data as any, {
      where: { id } as unknown as WhereOptions<T>,
      returning: true
    });
  }

  async delete(id: number): Promise<number> {
    return await this.model.destroy({
      where: { id } as unknown as WhereOptions<T>
    });
  }
} 
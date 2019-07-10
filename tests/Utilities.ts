import Sequelize from 'sequelize';

/** Truncate relevant tables for a test. Usually used in beforeAll() */
export function truncateTables(models: Sequelize.Model<any, any>[]) {
  return Promise.all(
    models.map(model => model.destroy({ truncate: { cascade: true } as any })),
  );
}

export default { truncateTables };

import Sequelize from 'sequelize';
import db from '../libs/db';

export interface PasswordResetAttributes {
  id?: number;
  userId: number;
  token: string;
  createdAt?: Date | null;
}

export type PasswordResetInstance = Sequelize.Instance<
  PasswordResetAttributes
> &
  PasswordResetAttributes;

const PasswordResetToken = db.define<
  PasswordResetInstance,
  PasswordResetAttributes
>('PasswordResetToken', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING(32),
    allowNull: false,
    unique: true,
  },
});

export default PasswordResetToken;

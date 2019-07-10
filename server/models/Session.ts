import Sequelize from 'sequelize';
import db from '../libs/db';

export interface SessionAttributes {
  id?: number;
  expires: number;
  data: string;
}

export type SessionInstance = Sequelize.Instance<SessionAttributes> &
  SessionAttributes;

const Session = db.define<SessionInstance, SessionAttributes>(
  'Session',
  {
    id: {
      type: Sequelize.STRING(255),
      primaryKey: true,
    },
    expires: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    },
    data: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    charset: 'ascii',
    collate: 'ascii_bin',
    timestamps: false,
  },
);

export default Session;

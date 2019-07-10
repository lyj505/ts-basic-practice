import requireDir from 'require-dir';
import db from '../libs/db';
import { closeHandles } from '../libs/utilities';

requireDir('../models');
db.sync({ logging: console.log }).then(() => closeHandles());

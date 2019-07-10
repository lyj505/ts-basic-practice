import PasswordResetToken from './PasswordResetToken';
import User from './User';

User.hasMany(PasswordResetToken, { foreignKey: 'userId' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Book from './Book';

class Comment extends Model {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public content!: string;
  public isSpoiler!: boolean;
}

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isSpoiler: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'comments',
  timestamps: true,
  underscored: true
});

// Associations
Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Book, { foreignKey: 'bookId' });

export default Comment; 
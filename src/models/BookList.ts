import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class BookList extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description?: string;
  public isPublic!: boolean;
}

BookList.init({
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'BookList',
  tableName: 'book_lists',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'name']
    }
  ]
});

// Associations
BookList.belongsTo(User, { foreignKey: 'userId' });

export default BookList; 
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Comment from './Comment';

class CommentLike extends Model {
  public id!: number;
  public commentId!: number;
  public userId!: number;
}

CommentLike.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Comment,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'CommentLike',
  tableName: 'comment_likes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['comment_id', 'user_id']
    }
  ]
});

// Associations
CommentLike.belongsTo(Comment, { foreignKey: 'commentId' });
CommentLike.belongsTo(User, { foreignKey: 'userId' });

export default CommentLike; 